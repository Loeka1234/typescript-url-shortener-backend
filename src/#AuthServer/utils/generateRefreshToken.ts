import { Ijwt } from "../../globaltypes";
import jwt from "jsonwebtoken";


export function generateRefreshToken(user: Ijwt) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "7d"
    })
}