import validator from "validator";
import { checkTypes, ISchema } from "../../utils/checkTypes";

export const validateRegister = (data: RegisterBody): IError | undefined => {
    const schema: ISchema = {
        email: "string",
        name: "string",
        password: "string",
    };

    const error = checkTypes(data, schema);
    if (error) return error;

    const { email, name, password } = data;
    if (name.length < 3 || name.length > 12 || !validator.isAlpha(name))
        return {
            field: "name",
            message: "Please provide a valid name.",
        };
    if (!validator.isEmail(email))
        return {
            field: "email",
            message: "Please provide a valid email.",
        };
    if (!password.trim().match(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})/))
        return {
            field: "password",
            message: "Please provide a valid password. The password should contain at least 1 uppercase letter and 1 lowercase letter.",
        };
};
