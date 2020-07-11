import express from "express";

const app = express();

app.use(express.json());

app.use("/dashboard", express.static("web"));
app.get("/dashboard/*", (_, res) => res.redirect("/dashboard"))
app.get("/", (_, res) => res.redirect("/dashboard"))


app.listen(3000, () => console.log("Listening on localhost:3000"));