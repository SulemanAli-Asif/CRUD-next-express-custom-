"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const passport_1 = __importDefault(require("passport"));
const authenticate = (res, req) => passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
        console.warn("Authentication failed:", info);
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
});
exports.authenticate = authenticate;
