// src/server.js
import express from "express";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRouter);

// Khởi động Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});