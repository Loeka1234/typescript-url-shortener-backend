import { IRedirect } from "../mongodb/redirectSchema";

interface IOutput {
    createdAt: string;
    url: string;
    redirectsTo: string;
    slug: string;
    clicks: number;
    publicUrl: boolean;
}

export type OutputRedirects = Array<IOutput>;

export const formatRedirects = (redirects: IRedirect[]) => {
    let arr: OutputRedirects = [];
    redirects.forEach(redirect => arr.push(formatRedirect(redirect)));
    return arr;
};

export const formatRedirect = (redirect: IRedirect) => {
    const { createdAt, slug, url, clicks, publicUrl } = redirect;
    return {
        createdAt,
        url: `http://${process.env.DOMAIN}/${slug}`,
        redirectsTo: url,
        slug,
        clicks,
        publicUrl,
    };
};
