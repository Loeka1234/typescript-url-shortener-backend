import { Request } from "express";
import { Ijwt } from "./globaltypes";

declare global {
    namespace Express {
        interface Request {
            user: Ijwt;
            authenticated: boolean;
        }
    }
}
