import express from "express";

import products from "./products.js";
import books from "./books.js";
import students from "./students.js";
import enrollments from "./enrollments.js";
import customers from "./customers.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "PRIVATE - API v1.0.0",
  });
});

// router.use("/emojis", emojis);
router.use("/products", products);
router.use("/books", books);
router.use("/students", students);
router.use("/enrollments", enrollments);
router.use("/customers", customers);

export default router;
