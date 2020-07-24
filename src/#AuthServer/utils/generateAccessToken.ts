import { Ijwt } from "../../globaltypes";
import jwt from "jsonwebtoken";

export function generateAccessToken(user: Ijwt) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15s",
    });
}