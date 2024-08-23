"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
exports.signup = signup;
exports.googleLogin = googleLogin;
exports.addItem = addItem;
exports.getItems = getItems;
exports.deleteItem = deleteItem;
exports.getSingleItem = getSingleItem;
exports.updateItem = updateItem;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("passport"));
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function signup(req, res) {
    const { name, email, password } = req.body;
    try {
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_1.default.hashSync(password, salt);
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        else {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            return res.status(201).json({ message: "User created successfully" });
        }
    }
    catch (err) {
        res.status(500).send({ message: "Internal server error" });
    }
}
const login = (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(400).json({ message: info.message });
        const payload = { id: user.id, email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h", // Token expires in 1 hour
        });
        return res.json({ message: "Login successful", token });
    })(req, res, next);
};
exports.login = login;
async function googleLogin(req, res) {
    try {
        const user = req.user;
        let existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });
        if (!existingUser) {
            existingUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    googleId: user.id,
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        res.redirect("/");
    }
    catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function addItem(req, res) {
    const { name, price } = req.body;
    try {
        await prisma.item.create({
            data: {
                name,
                price: parseFloat(price),
            },
        });
        return res.status(201).json({ message: "Item added successfully" });
    }
    catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ message: "Failed to add item" });
    }
}
async function getItems(req, res) {
    try {
        const products = await prisma.item.findMany();
        return res.status(200).json(products);
    }
    catch (err) {
        console.error("Error fetching items:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function deleteItem(req, res) {
    const { id } = req.params;
    try {
        await prisma.item.delete({ where: { id: parseInt(id) } });
        return res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function getSingleItem(req, res) {
    const { id } = req.params;
    try {
        const product = await prisma.item.findUnique({
            where: { id: parseInt(id) },
        });
        return res.status(200).json(product);
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function updateItem(req, res) {
    const { id } = req.params;
    const { name, price, updatedAt } = req.body;
    try {
        await prisma.item.update({
            where: { id: parseInt(id) },
            data: {
                name,
                price: parseFloat(price),
                updatedAt: updatedAt.toString(),
            },
        });
        return res.status(200).json({ message: "Item updated successfully" });
    }
    catch (err) {
        console.error("Error updating item:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
