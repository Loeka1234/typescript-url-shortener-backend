import mongoose from "mongoose";
import { userSchema, IUserSchema } from "./userSchema";
import { refreshTokenSchema, IrefreshTokenSchema } from "./refreshTokenSchema";

export const User = mongoose.model<IUserSchema>("User", userSchema);
export const RefreshToken = mongoose.model<IrefreshTokenSchema>(
    "RefreshToken",
    refreshTokenSchema
);
