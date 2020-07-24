import { Request, Response } from "express";
import { RefreshToken } from "../mongodb";
import jwt from "jsonwebtoken";
import { generateAccessToken, sendRefreshToken } from "../utils";

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
