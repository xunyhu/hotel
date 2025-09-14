const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

class Role extends Model {}

Role.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // 角色名，如 admin/customer
    permissions: { type: DataTypes.STRING, allowNull: true }, // 可存 JSON 字符串
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Role;
