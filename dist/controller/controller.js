"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.addItem = addItem;
exports.getItems = getItems;
exports.deleteItem = deleteItem;
exports.getSingleItem = getSingleItem;
exports.updateItem = updateItem;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
