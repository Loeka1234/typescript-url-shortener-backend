import { Request, Response } from "express";
import Redirect from "../mongodb";
import shortid from "shortid";
import dotenv from "dotenv";

dotenv.config();

// Adds a new url
export const addUrl = async (req: Request, res: Response) => {
    let { slug, url, customSlug, publicUrl } = req.body;
    if (
        typeof url !== "string" ||
        !url.trim() ||
        typeof customSlug !== "boolean" ||
        (customSlug == true && (typeof slug !== "string" || !slug.trim()))
    )
        return res
            .status(400)
            .json({ error: "Please provide valid information." });
    if (!url.toLowerCase().startsWith("http://")) url = "http://" + url;

    if (!customSlug) slug = shortid.generate();
    if (customSlug && slug == "urls")
        return res.status(400).json({ error: "Redirect already exists." });

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
            slug
        });
    });
};

// Redirect custom urls
export const redirect = async (req: Request, res: Response) => {
    const doc = await Redirect.findOne({ slug: req.params.custom });
    if (!doc) return res.redirect("/");
    res.redirect(doc.url);
};

export const getUrls = (req: Request, res: Response) => {
    Redirect.find({ public: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec((err, redirects) => {
            if (err)
                return res.status(200).json({ error: "Internal server error" });

            // console.log(redirects);

            let redirectList: {
                createdAt: string;
                url: string;
                redirectTo: string;
            }[] = [];
            redirects.forEach(redirect => {
                const { createdAt, slug, url } = redirect;
                redirectList.push({
                    createdAt,
                    url: `${process.env.DOMAIN}/${slug}`,
                    redirectTo: url,
                });
            });
            res.status(200).json(redirectList);
        });
};
