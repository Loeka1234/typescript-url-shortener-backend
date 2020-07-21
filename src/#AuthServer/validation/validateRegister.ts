import validator from "validator";

export const validateRegister = (data: RegisterBody): IError | null => {
    const { email, name, password } = data;
    if (
        !name ||
        !(name.length >= 3 && name.length < 12 && validator.isAlpha(name))
    )
        return {
            field: "name",
            message: "Please provide a valid name.",
        };
    if (!email || !validator.isEmail(email))
        return {
            field: "email",
            message: "Please provide a valid email.",
        };
    if (
        !password ||
        !password.trim().match(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})/)
    )
        return {
            field: "password",
            message: "please provide a valid password.",
        };
    return null;
};
