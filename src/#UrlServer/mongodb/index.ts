import mongoose from "mongoose";
import { redirectSchema, IRedirect } from "./redirectSchema";

export const Redirect = mongoose.model<IRedirect>("Redirect", redirectSchema);