import express from "express";

import { addUrl, getUrls, redirect } from "./routes/urls";

const app = express();

app.use(express.json());

app.use("/dashboard", express.static("web"));
app.get("/dashboard/*", (_, res) => res.redirect("/dashboard"));
app.get("/", (_, res) => res.redirect("/dashboard"));

app.post("/new", addUrl); // New Redirect
app.get("/urls", getUrls); // Get 10 latest Redirects
app.get("/:custom", redirect); // Redirect url

app.listen(3000, () => console.log("Listening on localhost:3000"));
