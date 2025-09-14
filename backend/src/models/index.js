const { sequelize } = require("../config/db");
const User = require("./User");
const Role = require("./Role");
const Dish = require("./Dish");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");

// 关联关系
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Dish.hasMany(OrderItem, { foreignKey: "dish_id" });
OrderItem.belongsTo(Dish, { foreignKey: "dish_id" });

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

Dish.hasMany(Review, { foreignKey: "dish_id" });
Review.belongsTo(Dish, { foreignKey: "dish_id" });

Role.hasMany(User, { foreignKey: "role_id", as: "users" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

module.exports = { sequelize, User, Role, Dish, Order, OrderItem, Review };
