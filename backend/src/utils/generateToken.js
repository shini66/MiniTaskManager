import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(user) {
    try {
        const token = jwt.sign(
            { id: user._id, user: user.user },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN }
        );
        return token;
    } catch (error) {
        throw new Error("Error generating token", { cause: error });
    }
}