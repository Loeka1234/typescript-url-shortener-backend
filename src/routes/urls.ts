import { Request, Response } from "express";
import Redirect from "../mongodb";
import shortid from "shortid";
import dotenv from "dotenv";

dotenv.config();

interface Body {
    slug: string;
    url: string;
    customSlug: boolean;
    publicUrl: boolean;
}

// Adds a new url
export const addUrl = async (req: Request, res: Response) => {
    let { slug, url, customSlug, publicUrl }: Body = req.body;
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
        case "urls":
        case "info":
            return res.status(400).json({ error: "Redirect already exists." });
        default:
            break;
    }

    const exists = await Redirect.findOne({ slug });
    if (exists)
        return res.status(400).json({ error: "Redirect already exists." });

    if (typeof publicUrl !== "boolean") publicUrl = true;

    const redirect = new Redirect({
        slug,
        url,
        publicUrl,
        createdAt: new Date().toISOString(),
    });
    redirect.save((err, red) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Couldn't save url." });
        }
        console.log("Redirect created: " + red);
        res.status(200).json({
            message: "Successfully added new redirect. ",
            url: `${process.env.DOMAIN}/${slug}`,
            redirectTo: url,
            slug,
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

export const getUrls = (req: Request, res: Response) => {
    Redirect.find({ publicUrl: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec((err, redirects) => {
            if (err)
                return res.status(200).json({ error: "Internal server error" });

            let redirectList: {
                createdAt: string;
                url: string;
                redirectTo: string;
                slug: string;
            }[] = [];
            redirects.forEach(redirect => {
                const { createdAt, slug, url } = redirect;
                redirectList.push({
                    createdAt,
                    url: `http://${process.env.DOMAIN}/${slug}`,
                    redirectTo: url,
                    slug
                });
            });

            res.status(200).json(redirectList);
        });
};

// TODO: Add how many clicks a url haves and auth for watching private urls
export const getUrlInfo = (req: Request, res: Response) => {
    const { slug } = req.params;
    Redirect.findOne({ slug, publicUrl: true }).exec((err, red) => {
        if (err) res.status(500).json({ error: "An error occured." });
        else if (red === null)
            res.status(400).json({ error: "Couldn't find url. " });
        else
            res.status(200).json({
                url: `http://${process.env.DOMAIN}/${red.slug}`,
                redirectsTo: red.url,
                clicks: red.clicks,
            });
    });
};
