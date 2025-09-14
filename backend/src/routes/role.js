const express = require("express");
const router = express.Router();
const pool = require("../db");

// 获取所有角色
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM roles");
  res.json(rows);
});

// 新建角色
router.post("/", async (req, res) => {
  const { role_name, permissions } = req.body;
  await pool.query("INSERT INTO roles (role_name, permissions) VALUES (?, ?)", [
    role_name,
    JSON.stringify(permissions),
  ]);
  res.json({ message: "角色添加成功" });
});

module.exports = router;
