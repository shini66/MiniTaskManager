import { registerUser, loginUser } from '../services/auth.service.js';

async function register(req, res) {
    try {
        const { user, email, password } = req.body;
        const result = await registerUser({ user, email, password });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const { user, password } = req.body;
        const result = await loginUser({ user, password });
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

async function getMe(req, res) {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function logout(req, res) {
    res.status(200).json({ message: "Logged out successfully" });
}

export { register, login, getMe, logout };