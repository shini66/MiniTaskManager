import express from 'express';
import { createTaskController, getTasksController, updateTaskController, deleteTaskController, toggleTaskController } from '../controllers/task.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createTaskController);
router.put("/update/:id", authMiddleware, updateTaskController);
router.delete("/delete/:id", authMiddleware, deleteTaskController);
router.patch("/toggle/:id", authMiddleware, toggleTaskController);
router.get("/me", authMiddleware, getTasksController);

export default router;