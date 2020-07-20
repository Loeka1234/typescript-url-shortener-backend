import mongoose, { Document } from "mongoose";

export interface IrefreshTokenSchema extends Document {
    refreshToken: string;
}

export const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        required: true,
        type: String
    }
})