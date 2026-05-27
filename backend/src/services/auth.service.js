import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

async function registerUser(userData) {
    return new Promise(async (resolve, reject) => {
        try {
            const existingUser = await User.findOne({ $or: [{ user: userData.user }, { email: userData.email }] });
            if (existingUser) {
                return reject(new Error('User or email already exists'));
            }
            const user = new User(userData);
            await user.save();
            const token = generateToken(user);
            resolve({ user: { id: user._id, user: user.user, email: user.email }, token });
        } catch (error) {
            reject(error);
        }
    });
}

async function loginUser({ user, password }) {
    return new Promise(async (resolve, reject) => {
        try {
            const existingUser = await User.findOne({ user });
            if (!existingUser) {
                return reject(new Error('Invalid credentials'));
            }

            const isMatch = await existingUser.comparePassword(password);
            if (!isMatch) {
                return reject(new Error('Invalid credentials'));
            }

            resolve({ user: { id: existingUser._id, user: existingUser.user, email: existingUser.email }, token: generateToken(existingUser) });
        } catch (error) {
            reject(error);
        }
    });
}

export { registerUser, loginUser };