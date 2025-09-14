const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

// 获取用户列表
router.get("/", async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });
  res.json(users);
});

// 注册用户
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });
  res.json(user);
});

// 登录
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: { username },
    include: [{ model: Role, as: "role" }],
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });
  const token = generateToken({ id: user.id, username: user.username });
  res.json({ token });
});

module.exports = router;
