import Task from "../models/Task.js";

async function createTask(taskData) {
    return new Promise(async (resolve, reject) => {
        try {
            const task = new Task(taskData);
            await task.save();
            resolve(task);
        } catch (error) {
            reject(error);
        }
    });
}

async function getTasksByUser(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const tasks = await Task.find({ user: userId });
            resolve(tasks);
        } catch (error) {
            reject(error);
        }
    });
}

async function updateTask(taskId, userId, updateData) {
    return new Promise(async (resolve, reject) => {
        try {
            const task = await Task.findOneAndUpdate({ _id: taskId, user: userId }, updateData, { new: true });
            if (!task) {
                return reject(new Error('Task not found or not authorized'));
            }
            resolve(task);
        } catch (error) {
            reject(error);
        }
    });
}

async function deleteTask(taskId, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
            if (!task) {
                return reject(new Error('Task not found or not authorized'));
            }
            resolve(task);
        } catch (error) {
            reject(error);
        }
    });
}

async function toggleTask(taskId, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const task = await Task.findOne({ _id: taskId, user: userId });
            if (!task) {
                return reject(new Error('Task not found or not authorized'));
            }
            task.completed = !task.completed;
            await task.save();
            resolve(task);
        } catch (error) {
            reject(error);
        }
    });
}

export { createTask, getTasksByUser, updateTask, deleteTask, toggleTask };