const User = require("../models/User");
const Role = require("../models/Role");

module.exports = function (roleName) {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Role, as: "role" }],
      });

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: "用户不存在",
        });
      }

      if (user.role.name !== roleName) {
        return res.status(403).json({
          code: 403,
          message: "没有权限",
        });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: "服务器错误",
      });
    }
  };
};
