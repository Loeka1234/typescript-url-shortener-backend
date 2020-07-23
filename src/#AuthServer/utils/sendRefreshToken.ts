import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
    return res.cookie("jid", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
};
