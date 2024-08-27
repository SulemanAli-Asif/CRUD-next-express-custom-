import {
  addItem,
  deleteItem,
  getItems,
  getSingleItem,
  googleLogin,
  getSession,
  login,
  logOut,
  signup,
  updateItem,
} from "../controller/controller";
import Router from "express";
import { authenticate } from "../middleware/authenticated";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Checking");
});

router.get("/items", authenticate, getItems);
router.post("/add", addItem);
router.get("/items/:id", authenticate, getSingleItem);
router.put("/update/:id", updateItem);
router.delete("/delete/:id", deleteItem);
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logOut);
router.get("/session", authenticate, getSession);

export default router;
