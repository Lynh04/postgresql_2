// src/config/prisma/client.js
import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { PrismaClient } = pkg;
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

// Cấu hình Pool (quan trọng cho hiệu suất)
// Thêm cấu hình SSL cho các dịch vụ Database Cloud (như Render, Heroku)
const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : {
        rejectUnauthorized: false // Thường dùng cho các dịch vụ cloud
    }
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });