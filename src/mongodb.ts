import mongoose, { Document, Mongoose } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_DB!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to the mongodb database"));


export interface IRedirect extends Document {
    slug: string;
    url: string;
    createdAt: string;
    publicUrl: boolean;
    clicks: number;
    user: string | null;
}

const redirectSchema = new mongoose.Schema({
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
        required: true
    },
    user: {
        type: String,
        default: null,
        required: false
    }
});

export const Redirect = mongoose.model<IRedirect>("Redirect", redirectSchema);

export interface IUser extends Document {
    email: string;
    name: string;
    password: string;
}

const userSchema = new mongoose.Schema({
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

export const User = mongoose.model<IUser>("User", userSchema);

export interface IrefreshTokenSchema extends Document {
    refreshToken: string;
}

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        required: true,
        type: String
    }
})

export const RefreshToken = mongoose.model<IrefreshTokenSchema>("RefreshToken", refreshTokenSchema);