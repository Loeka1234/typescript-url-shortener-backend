import { Request, Response, NextFunction } from "express";
import { Ijwt } from "./globaltypes";
import jwt from "jsonwebtoken";

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Import Request and Response from express
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user as Ijwt;
        next();
    });
}

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        req.authenticated = false;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) {
            req.authenticated = false;
            return next();
        }
        req.authenticated = true;
        req.user = user as Ijwt;
        return next();
    });
}
