const express = require("express");
const router = express.Router();
const { Order, OrderItem, User, Dish } = require("../models");

// 获取订单列表
router.get("/", async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: OrderItem, as: "items", include: [{ model: Dish, as: "dish" }] },
      { model: User, as: "user" },
      { model: Review, as: "review" },
    ],
  });
  res.json(orders);
});

// 创建订单
router.post("/", async (req, res) => {
  const { userId, items } = req.body; // items = [{dishId, quantity}]
  const totalPrice = await items.reduce(async (accP, item) => {
    const dish = await Dish.findByPk(item.dishId);
    const acc = await accP;
    return acc + dish.price * item.quantity;
  }, Promise.resolve(0));

  const order = await Order.create({ userId, totalPrice });

  for (const item of items) {
    await OrderItem.create({
      orderId: order.id,
      dishId: item.dishId,
      quantity: item.quantity,
    });
  }

  const result = await Order.findByPk(order.id, {
    include: [{ model: OrderItem, include: [Dish] }],
  });
  res.json(result);
});

// 删除订单
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  await OrderItem.destroy({ where: { orderId: id } });
  await order.destroy();
  res.json({ message: "Order deleted" });
});

module.exports = router;
