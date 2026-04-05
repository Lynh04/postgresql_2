// src/routes/user.route.js
import express from "express";
import { body, validationResult } from "express-validator";
import {
    createUserController,
    getAllUsersController,
} from "../controllers/user.controller.js";

const router = express.Router();

// Middleware Validation chung
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};

router.post(
    "/",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Email is invalid"),
    ],
    validate,
    createUserController
);

router.get("/", getAllUsersController);

export default router;