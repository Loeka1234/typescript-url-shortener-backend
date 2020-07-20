import { Request, Response } from "express";
import { Redirect } from "../mongodb";
import shortid from "shortid";
import dotenv from "dotenv";
import { formatRedirects, formatRedirect } from "../format";

dotenv.config();

// Adds a new url
export const addUrl = async (req: Request, res: Response) => {
    let { slug, url, customSlug, publicUrl }: AddUrlBody = req.body;
    if (
        typeof url !== "string" ||
        !url.trim() ||
        typeof customSlug !== "boolean" ||
        (customSlug == true && (typeof slug !== "string" || !slug.trim()))
    )
        return res
            .status(400)
            .json({ error: "Please provide valid information." });
    if (customSlug && (slug.includes("/") || slug.includes("\\")))
        return res.status(400).json({
            error: "You can't use backslashes or forward slashes in your url.",
        });
    if (!url.toLowerCase().startsWith("http://")) url = "http://" + url;

    if (!customSlug) slug = shortid.generate();

    // Reserved slugs
    switch (slug) {
        case "api":
            return res.status(400).json({ error: "Redirect already exists." });
        default:
            break;
    }

    const exists = await Redirect.findOne({ slug });
    if (exists)
        return res.status(400).json({ error: "Redirect already exists." });

    if (typeof publicUrl !== "boolean")
        return res.status(400).json({ error: "publicUrl should be a boolean" });


    const redirect = new Redirect({
        slug,
        url,
        publicUrl,
        createdAt: new Date().toISOString(),
        user: req.authenticated ? req.user.email : null,
    });
    redirect.save((err, red) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Couldn't save url." });
        }
        console.log("Redirect created: " + red);
        res.status(200).json({
            message: "Successfully added new redirect. ",
            ...formatRedirect(red),
            user: req.authenticated ? req.user.email : null,
            error: !req.authenticated ? "You are not logged in." : undefined,
        });
    });
};

// Redirect custom urls
export const redirect = async (req: Request, res: Response) => {
    const doc = await Redirect.findOne({ slug: req.params.custom });
    if (!doc) return res.redirect("/");
    res.redirect(doc.url);
    await Redirect.updateOne(
        { slug: req.params.custom },
        { clicks: doc.clicks + 1 }
    );
};

// Get public urls
export const getUrls = (req: Request, res: Response) => {
    Redirect.find({ publicUrl: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec((err, redirects) => {
            if (err)
                return res.status(500).json({ error: "Internal server error" });
            else res.status(200).json(formatRedirects(redirects));
        });
};

// Get users urls
export const getPrivateUrls = (req: Request, res: Response) => {
    Redirect.find({ user: req.user.email })
        .sort({ createdAt: -1 })
        .exec((err, redirects) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Internal server error." });
            return res.status(200).json(formatRedirects(redirects));
        });
};

// Get info about public url // Get info about private url if authenticated
export const getUrlInfo = (req: Request, res: Response) => {
    const { slug } = req.params;
    Redirect.findOne({ slug }).exec((err, redirect) => {
        if (err) res.status(500).json({ error: "An error occured." });
        else if (redirect === null)
            res.status(400).json({ error: "Couldn't find url. " });
        else if (
            redirect.publicUrl === false &&
            (!req.user || redirect.user !== req.user.email)
        )
            res.status(400).json({ error: "This is a private url." });
        else res.status(200).json(formatRedirect(redirect));
    });
};
