import {
  addItem,
  deleteItem,
  getItems,
  getSingleItem,
  updateItem,
} from "../controller/controller";
import Router from "express";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Checking");
});

router.get("/items", getItems);
router.post("/add", addItem);
router.get("/items/:id", getSingleItem);
router.put("/update/:id", updateItem);
router.delete("/delete/:id", deleteItem);
export default router;
