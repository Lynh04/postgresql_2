// src/controllers/user.controller.js
import { createUser, getAllUsers } from "../services/user.service.js";

export const createUserController = async (req, res) => {
    try {
        const user = req.body;
        // Tạm thời bỏ qua validation middleware ở đây, giả định đã qua.
        const newUser = await createUser(user);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        // Trả về lỗi 400 nếu là lỗi từ Database (ví dụ: email đã tồn tại)
        const statusCode = error.code === 'P2002' ? 409 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};