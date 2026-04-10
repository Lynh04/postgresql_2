// src/server.js
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import schoolRouter from "./routes/school.route.js";
import statsRouter from "./routes/stats.route.js";
import dotenv from "dotenv";

dotenv.config();

// CORS Configuration
const corsOptions = {
    origin: [
        "http://localhost:3000",

        "https://postgre-jngj5m1fc-lynh04s-projects.vercel.app"
    ],
    credentials: true
};

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/stats", statsRouter);
app.use("/api", schoolRouter);

// Khởi động Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;