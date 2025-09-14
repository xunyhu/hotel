// src/routes/dishesRoutes.js
const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const Dish = require("../models/Dish");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// 参数校验中间件
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ code: 400, message: "参数校验失败", errors: errors.array() });
  }
  next();
};

// 获取菜品列表（所有用户可访问）
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.findAll();
    res.json({
      code: 200,
      message: "获取菜品列表成功",
      data: dishes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "获取菜品列表失败",
    });
  }
});

// 获取单个菜品
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("id 必须是整数")]),
  async (req, res) => {
    try {
      const dish = await Dish.findByPk(req.params.id);
      if (!dish) {
        return res.status(404).json({
          code: 404,
          message: "菜品不存在",
        });
      }
      res.json({
        code: 200,
        message: "获取菜品成功",
        data: dish,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: "获取菜品失败",
      });
    }
  }
);

// 新增菜品（需要管理员权限）
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate([
    body("name").isString().notEmpty().withMessage("name 必填"),
    body("price").isFloat({ gt: 0 }).withMessage("price 必须大于0"),
    body("category").optional().isString(),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("stock 必须大于等于0"),
    body("image_url")
      .optional()
      .isString()
      .withMessage("image_url 必须是字符串"),
    body("status").optional().isIn([0, 1]).withMessage("status 必须是0或1"),
  ]),
  async (req, res) => {
    try {
      const { name, price, category, description } = req.body;
      const dish = await Dish.create({ name, price, category, description });
      res.json({
        code: 200,
        message: "新增菜品成功",
        data: dish,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: "新增菜品失败",
      });
    }
  }
);

// 更新菜品（需要管理员权限）
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, category, stock, image_url, status } = req.body;

      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({
          code: 404,
          message: "菜品不存在",
        });
      }

      await dish.update({ name, price, category, stock, image_url, status });
      res.json({
        code: 200,
        message: "更新菜品成功",
        data: dish,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: "更新菜品失败",
      });
    }
  }
);

// 删除菜品（需要管理员权限）
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({
          code: 404,
          message: "菜品不存在",
        });
      }

      await dish.destroy();
      res.json({
        code: 200,
        message: "删除菜品成功",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: "删除菜品失败",
      });
    }
  }
);

module.exports = router;
