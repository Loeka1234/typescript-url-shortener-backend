import mongoose, { Document } from "mongoose";

export interface IUserSchema extends Document {
    email: string;
    name: string;
    password: string;
}

export const userSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
        type: String,
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
})