import Router from "express";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Checking");
});

export default router;
