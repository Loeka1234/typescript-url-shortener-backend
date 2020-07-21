import { checkTypes, ISchema } from "../../utils/checkTypes";
import validator from "validator";

export const validateAddUrl = (data: AddUrlBody): IError | undefined => {
    const schema: ISchema = {
        customSlug: "boolean",
        publicUrl: "boolean",
        url: "string"
    }
    const error = checkTypes(data, schema);
    if (error) return error;

    const { customSlug, slug, url } = data;
    if(!url.trim() || !validator.isURL(url)) return {
        field: "url",
        message: "Please provide a valid url.",
    }
    if (customSlug) {
        if(typeof slug !== "string" || !slug.trim()) return {
            field: "slug",
            message: "Please provide a slug.",
        }
        if(slug.includes("/") || slug.includes("\\")) return {
            field: "slug",
            message: "You can't use backslashes or forward slashes in your url.",
        }
        if(slug === "api") return {
            field: "slug",
            message: "Redirect already exists",
        }
    }
};
