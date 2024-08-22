import { getItems } from "../controller/controller";
import Router from "express";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Checking");
});

router.get("/items", getItems);

export default router;
