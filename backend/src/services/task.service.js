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

async function getTasksByUser(userId, filter = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const { search, status, page = 1, limit = 10 } = filter;

            const query = { user: userId };

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            if (status) {
                switch (status) {
                    case 'completed':
                        query.completed = true;
                        break;
                    case 'pending':
                        query.completed = false;
                        break;
                    default:
                        return reject(new Error('Invalid status filter'));
                }
            }

            const tasks = await Task.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: 1 });

            const total = await Task.countDocuments(query);

            resolve({
                tasks,
                page: page,
                totalPages: Math.ceil(total / limit),
                totalTasks: total
            });
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