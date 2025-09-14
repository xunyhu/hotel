// src/routes/authRoutes.js
const express = require("express");
const { User, Role } = require("../models");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 登录接口
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { name: username },
      include: [{ model: Role, as: "role" }],
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        code: 401,
        message: "用户名或密码错误",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role?.name || "user" },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({
      code: 200,
      message: "登录成功",
      data: {
        token,
        user: {
          id: user.id,
          username: user.name,
          role: user.role?.name || "user",
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误",
    });
  }
});

module.exports = router;
