import { Request, Response } from "express";
import { validateLogin } from "../validation";
import { User, RefreshToken } from "../mongodb";
import bcrypt from "bcrypt";
import {
    generateAccessToken,
    generateRefreshToken,
    sendRefreshToken,
} from "../utils";

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
