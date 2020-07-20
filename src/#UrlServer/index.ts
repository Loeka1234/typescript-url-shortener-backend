import express from "express";

// Routes
import {
    addUrl,
    getUrls,
    redirect,
    getUrlInfo,
    getPrivateUrls,
} from "./routes/urls";

// Middlewares
import { authenticateToken, isAuthorized } from "../middlewares";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { connect } from "../mongodb_connect";
connect();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get("/", (_, res) => res.redirect("http://web.shortto.me"));
app.get("/:custom", redirect); // Redirect url

const router = express.Router();

router.post("/new", isAuthorized, addUrl); // New Redirect
router.get("/urls", getUrls); // Get 10 latest Redirects
router.get("/privateurls", authenticateToken, getPrivateUrls); // Get users private urls
router.get("/info/:slug", isAuthorized, getUrlInfo); // Get url info about specific url

app.use("/api", router);

const PORT = process.env.URL_SERVER_PORT || 3000;

app.listen(PORT, () => console.log(`Url server listening on localhost:${PORT}`));