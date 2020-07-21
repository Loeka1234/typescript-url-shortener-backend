import { checkTypes, ISchema } from "../../utils/checkTypes";

export const validateLogin = (data: LoginBody): IError | undefined => {
    const schema: ISchema = {
        email: "string",
        password: "string",
    };
    const error = checkTypes(data, schema);
    if (error) return error;

    const { email, password } = data;

    if (!email.trim())
        return {
            field: "email",
            message: "Please provide an email.",
        };
    if (!password.trim())
        return {
            field: "password",
            message: "Please provide a password.",
        };
};
