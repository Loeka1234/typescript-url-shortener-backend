import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connect = () => {
    mongoose.connect(process.env.MONGO_DB!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to the mongodb database"));
}
