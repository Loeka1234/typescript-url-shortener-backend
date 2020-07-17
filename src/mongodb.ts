import mongoose, { Document } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_DB!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to the mongodb database"));


export interface IRedirect extends Document {
    slug: string,
    url: string,
    createdAt: string,
    publicUrl: boolean,
    clicks: number
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
        default: true,
    },
    clicks: {
        type: Number,
        default: 0,
        required: true
    }
});

export default mongoose.model<IRedirect>("Redirect", redirectSchema);