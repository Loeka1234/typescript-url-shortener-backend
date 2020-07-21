export const validateLogin = (data: LoginBody): IError | null => {
    const { email, password } = data;

    if(!email && !email.trim()) return {
        field: "email",
        message: "Please provide an email."
    }
    if(!password && !password.trim()) return {
        field: "password",
        message: "Please provide a password."
    }
    return null;
}