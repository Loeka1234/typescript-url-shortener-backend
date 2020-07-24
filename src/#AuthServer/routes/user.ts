import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, RefreshToken } from "../mongodb";
import { validateRegister, validateLogin } from "../validation";
import {
    generateAccessToken,
    generateRefreshToken,
    sendRefreshToken,
} from "../utils";

export const register = async (req: Request, res: Response) => {
    const errors = validateRegister(req.body);
    if (errors) return res.status(400).json(errors);

    const { email, name, password }: RegisterBody = req.body;

    const exists = await User.exists({ email });
    if (exists) return res.status(400).json({ error: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = new User({
        email,
        name,
        password: hashedPassword,
    });
    user.save(err => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.status(201).json({ message: "Successfully registred." });
    });
};

export const login = async (req: Request, res: Response) => {
    const error = validateLogin(req.body);
    if (error) return res.status(400).json(error);

    const { email, password }: LoginBody = req.body;

    let name = "";
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(400).json({ error: "Can't find user. " });
        name = user.name;
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Wrong password." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error." });
    }

    const user = { email, name };
    const accessToken = generateAccessToken(user);
    const refreshToken = new RefreshToken({
        refreshToken: generateRefreshToken(user),
    });
    refreshToken.save((err, token) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error." });
        }
        sendRefreshToken(res, token.refreshToken);
        res.status(200).json({ accessToken });
    });
};

export const getNewToken = (req: Request, res: Response) => {
    try {
        const token = req.cookies.jid;
        if (!token) return res.status(401).json({ ok: false, accessToken: "" });

        const refreshToken = RefreshToken.findOne({ refreshToken: token });
        if (!refreshToken)
            return res.status(401).json({ ok: false, accessToken: "" });

        const user: any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        const accessToken = generateAccessToken({
            email: user.email,
            name: user.name,
        });
        sendRefreshToken(res, token);
        res.status(200).json({ ok: true, accessToken });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ ok: false, accessToken: "" });
    }

    // const refreshToken = req.body.token;
    // if (!refreshToken) res.sendStatus(401);
    // RefreshToken.findOne({ refreshToken }).exec((err, token) => {
    //     if (err) res.status(500).json({ error: "Internal server error." });
    //     else if (!token) res.sendStatus(403);
    //     else
    //         jwt.verify(
    //             refreshToken,
    //             process.env.REFRESH_TOKEN_SECRET!,
    //             (err: any, user: any) => {
    //                 if (err) return res.sendStatus(403);
    //                 const accessToken = generateAccessToken({
    //                     email: user.email,
    //                     name: user.name,
    //                 });
    //                 res.status(200).json({ accessToken });
    //             }
    //         );
    // });
};

export const logout = (req: Request, res: Response) => {
    RefreshToken.findOneAndDelete({ refreshToken: req.cookies.jid }).exec(
        (err, response) => {
            if (err) res.status(500).json({ error: "Internal server error." });
            else if (!response)
                res.status(400).json({
                    error: "Please provide a refresh token.",
                });
            else {
                res.clearCookie("jid", { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ message: "Successfully logged out." });
            }
        }
    );
};
