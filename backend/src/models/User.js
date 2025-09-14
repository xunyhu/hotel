const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    openid: { type: DataTypes.STRING, allowNull: false },
    unionid: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING }, // 管理员可能需要
    roleId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["unionid"],
      },
    ],
  }
);

module.exports = User;
