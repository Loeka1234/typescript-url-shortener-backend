import express from "express";

// Routes
import { register, login, getNewToken, logout } from "./routes/user";

// Middlewares
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { connect } from "../mongodb_connect";
connect();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3002", credentials: true }));

app.get("/", (_, res) => res.send("Authentication server working."));

app.post("/register", register); // Register new user
app.post("/login", login); // Login user
app.post("/token", getNewToken); // Get new access token with refresh token
app.delete("/logout", logout);

const PORT = process.env.AUTH_SERVER_PORT || 3001;

app.listen(PORT, () =>
    console.log(`Auth server listening on localhost:${PORT}`)
);
