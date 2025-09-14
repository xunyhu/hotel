const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

class Dish extends Model {}

Dish.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category: { type: DataTypes.STRING, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "图片路径",
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: "状态(1上架,0下架)",
    },
  },
  {
    sequelize,
    modelName: "Dish",
    tableName: "dishes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Dish;
