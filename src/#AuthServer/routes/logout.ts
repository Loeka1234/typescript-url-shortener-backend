import { Request, Response } from "express";
import { RefreshToken } from "../mongodb";

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