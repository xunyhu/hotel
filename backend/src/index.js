const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, sequelize } = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const dishesRoutes = require("./routes/dishesRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const payRoutes = require("./routes/pay");

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use("/api/users", userRoutes);
app.use("/api/dishes", dishesRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pay", payRoutes);

app.get("/", (req, res) => res.send("Backend is running ✅"));

// 启动
const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: true }); // 安全同步，不删除表
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};

start();
