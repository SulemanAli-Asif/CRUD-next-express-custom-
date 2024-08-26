"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.NEXTAUTH_SECRET;
const protectRoute = async (req, res, next) => {
    try {
        // Extract the token from the 'Authorization' header
        const authHeader = req.headers["authorization"];
        const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const actualToken = token.split(" ")[1]; // Extract token from "Bearer <token>"
        let decodedToken;
        try {
            decodedToken = jsonwebtoken_1.default.verify(actualToken, secret);
            console.log(decodedToken);
        }
        catch (err) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        if (typeof decodedToken === "object" && decodedToken !== null) {
            req.user = decodedToken;
        }
        next();
    }
    catch (error) {
        console.error("Error in protectRoute:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.default = protectRoute;
