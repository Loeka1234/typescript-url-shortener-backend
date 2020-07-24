import { Request, Response } from "express";
import { validateRegister } from "../validation";
import { User } from "../mongodb";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
    const errors = validateRegister(req.body);
    if (errors) return res.status(400).json(errors);

    const { email, name, password }: RegisterBody = req.body;

    const exists = await User.exists({ email });
    if (exists) return res.status(400).json({ error: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = new User({
        email,
        name,
        password: hashedPassword,
    });
    user.save(err => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.status(201).json({ message: "Successfully registred." });
    });
};
