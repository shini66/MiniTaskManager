import express from 'express';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ message: "API is working!" });
});

router.use("/auth", authRoutes);
export default router;