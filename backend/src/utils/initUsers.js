const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");
const Role = require("../models/Role");
const User = require("../models/User");

const initUsers = async () => {
  try {
    await sequelize.sync({ alter: true }); // 确保表已同步

    // 创建角色
    const [adminRole] = await Role.findOrCreate({ where: { name: "admin" } });
    const [userRole] = await Role.findOrCreate({ where: { name: "user" } });

    // 创建管理员账号
    const adminExists = await User.findOne({ where: { username: "admin" } });
    if (!adminExists) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        password: hashed,
        roleId: adminRole.id,
      });
      console.log("✅ Admin user created: username=admin, password=admin123");
    }

    // 创建普通用户
    const userExists = await User.findOne({ where: { username: "user" } });
    if (!userExists) {
      const hashed = await bcrypt.hash("user123", 10);
      await User.create({
        username: "user",
        password: hashed,
        roleId: userRole.id,
      });
      console.log("✅ Normal user created: username=user, password=user123");
    }

    console.log("🎉 Initialization complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Initialization failed:", err);
    process.exit(1);
  }
};

initUsers();
