import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, RefreshToken } from "../mongodb";

export const register = async (req: Request, res: Response) => {
    const { email, name, password }: RegisterBody = req.body;

    if(!password || !password.trim()) return res.status(400).json({ error: "Please provide a valid password." });
    if(!email || !email.trim()) return res.status(400).json({ error: "Please provide an email." });
    if(!name || name.trim()) return res.status(400).json({ error: "Please provide a name." });

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
    const { email, password }: LoginBody = req.body;

    if(!email && !email.trim()) return res.status(400).json({ error: "Please provide an email." });
    if(!password && !password.trim()) return res.status(400).json({ error: "Please provide a password." });

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
        refreshToken: jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!),
    });
    refreshToken.save((err, token) => {
        if (err) res.status(500).json({ error: "Internal server error." });
        res.status(200).json({ accessToken, refreshToken: token.refreshToken });
    });
};

export const getNewToken = (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    if (!refreshToken) res.sendStatus(401);
    RefreshToken.findOne({ refreshToken }).exec((err, token) => {
        if (err) res.status(500).json({ error: "Internal server error." });
        else if (!token) res.sendStatus(403);
        else
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!,
                (err: any, user: any) => {
                    if (err) return res.sendStatus(403);
                    const accessToken = generateAccessToken({
                        email: user.email,
                        name: user.name,
                    });
                    res.status(200).json({ accessToken });
                }
            );
    });
};

export const logout = (req: Request, res: Response) => {
    RefreshToken.findOneAndDelete({ refreshToken: req.body.token }).exec(
        (err, response) => {
            if (err) res.status(500).json({ error: "Internal server error." });
            else if (!response)
                res.status(400).json({
                    error: "Please provide a refresh token.",
                });
            else res.status(200).json({ message: "Successfully logged out." });
        }
    );
};

function generateAccessToken(user: Ijwt) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
    });
}
