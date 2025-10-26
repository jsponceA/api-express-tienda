import express from "express";

import products from "./products.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "PRIVATE - API v1.0.0",
  });
});

// router.use("/emojis", emojis);
router.use("/products", products);

export default router;
