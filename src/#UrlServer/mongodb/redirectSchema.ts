import mongoose, { Document } from "mongoose";

export interface IRedirect extends Document {
    slug: string;
    url: string;
    createdAt: string;
    publicUrl: boolean;
    clicks: number;
    clickDates: Array<string>;
    user: string | null;
}

export const redirectSchema = new mongoose.Schema({
    slug: {
        type: mongoose.SchemaTypes.String,
        required: true,
        minlength: 1,
    },
    url: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: {
        type: String,
        default: new Date().toISOString(),
    },
    publicUrl: {
        type: Boolean,
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
        required: true,
    },
    clickDates: {
        type: [Date],
        default: new Array(0)
    },
    user: {
        type: String,
        default: null,
        required: false,
    },
});
