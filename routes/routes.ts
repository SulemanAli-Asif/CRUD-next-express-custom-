import { authenticate } from "../middleware/authenticated";
import {
  addItem,
  deleteItem,
  getItems,
  getSingleItem,
  googleLogin,
  login,
  signup,
  updateItem,
} from "../controller/controller";
import Router from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Checking");
});

router.get("/items", authenticate, getItems);
router.post("/add", addItem);
router.get("/items/:id", getSingleItem);
router.put("/update/:id", updateItem);
router.delete("/delete/:id", deleteItem);
router.post("/login", login);
router.post("/signup", signup);

export default router;
