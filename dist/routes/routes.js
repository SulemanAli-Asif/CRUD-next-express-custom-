"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller/controller");
const express_1 = __importDefault(require("express"));
const authenticated_1 = require("../middleware/authenticated");
const router = (0, express_1.default)();
router.get("/check", (req, res) => {
    res.send("Checking");
});
router.get("/items", authenticated_1.authenticate, controller_1.getItems);
router.post("/add", controller_1.addItem);
router.get("/items/:id", authenticated_1.authenticate, controller_1.getSingleItem);
router.put("/update/:id", controller_1.updateItem);
router.delete("/delete/:id", controller_1.deleteItem);
router.post("/login", controller_1.login);
router.post("/signup", controller_1.signup);
router.post("/logout", controller_1.logOut);
router.get("/session", authenticated_1.authenticate, controller_1.getSession);
exports.default = router;
