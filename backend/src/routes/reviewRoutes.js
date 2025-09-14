const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");
const Dish = require("../models/Dish");

// 获取评价列表
router.get("/", async (req, res) => {
  const reviews = await Review.findAll({
    include: [User, Dish],
  });
  res.json(reviews);
});

// 创建评价
router.post("/", async (req, res) => {
  const { userId, dishId, rating, comment } = req.body;
  const review = await Review.create({ userId, dishId, rating, comment });
  res.json(review);
});

// 删除评价
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByPk(id);
  if (!review) return res.status(404).json({ message: "Review not found" });
  await review.destroy();
  res.json({ message: "Review deleted" });
});

module.exports = router;
