//обработка запросов 

import bcrypt from "bcrypt";
import express from "express";
import { getDb } from "../db/config.js";
import jwt from "jsonwebtoken";


const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
    try {
        // 1. Получаем данные пользователя
        const { name, email, password } = req.body;

        // 2. Проверяем обязательные поля
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 3. Проверяем, существует ли пользователь с таким email
        const existingEmail = await getDb()
            .collection("users")
            .findOne({ email });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 4. Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Сохраняем пользователя в MongoDB
        await getDb().collection("users").insertOne({
            name,
            email,
            password: hashedPassword
        });

        // 6. Отправляем успешный ответ
        return res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});



// User login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверяем обязательные поля
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Ищем пользователя в MongoDB
        const user = await getDb()
            .collection("users")
            .findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Создаём JWT-токен
        const token = jwt.sign(
            {
                id: user._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Успешная авторизация
        return res.status(200).json({
            message: "Successful login",
            token
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default router;