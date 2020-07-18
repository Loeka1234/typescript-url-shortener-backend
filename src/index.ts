import express from "express";

// Routes
import { addUrl, getUrls, redirect, getUrlInfo, getPrivateUrls } from "./routes/urls";
import { register, login, getNewToken, logout } from "./routes/user";

// Middlewares
import { authenticateToken, isAuthorized } from "./middlewares";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
const router = express.Router();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get("/", (_, res) => res.redirect("http://web.shortto.me"));
app.get("/:custom", redirect); // Redirect url


router.post("/new", isAuthorized, addUrl); // New Redirect
router.get("/urls", getUrls); // Get 10 latest Redirects
router.get("/privateurls", authenticateToken, getPrivateUrls); // Get users private urls
router.get("/info/:slug", isAuthorized, getUrlInfo); // Get url info about specific url

router.post("/register", register); // Register new user
router.post("/login", login); // Login user
router.post("/token", getNewToken); // Get new access token with refresh token
router.delete("/logout", logout);

app.use("/api", router);

app.listen(3000, () => console.log("Listening on localhost:3000"));
