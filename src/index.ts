import express from "express";
import cors from "cors";

import { addUrl, getUrls, redirect, getUrlInfo } from "./routes/urls";

const app = express();

app.use(cors());
app.use(express.json());


app.post("/new", addUrl); // New Redirect
app.get("/urls", getUrls); // Get 10 latest Redirects
app.get("/:custom", redirect); // Redirect url
app.get("/info/:slug", getUrlInfo); // Get url info

app.listen(3000, () => console.log("Listening on localhost:3000"));
