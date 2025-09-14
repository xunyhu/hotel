import api from "./axios";

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error(err);
    return Promise.reject(err);
  }
);

export const login = (username, password) =>
  api.post("/auth/login", { username, password });

export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// 菜品、订单、角色、评论接口同理
export const getDishes = () => api.get("/dishes");
export const addDishes = (data) => api.post("/dishes", data);
export const updateDishes = (id, data) => api.put(`/dishes/${id}`, data);
export const deleteDishes = (id) => api.delete(`/dishes/${id}`);

export const getOrders = (params) => api.get("/api/orders", { params });
export const updateOrderStatus = (id, data) =>
  api.patch(`/api/orders/${id}/status`, data);

// 管理员相关接口
export const getAdmins = () => api.get("/api/admins");
export const addAdmin = (data) => api.post("/api/admins", data);
export const updateAdmin = (id, data) => api.patch(`/api/admins/${id}`, data);
export const deleteAdmin = (id) => api.delete(`/api/admins/${id}`);

// 角色接口
export const getRoles = () => api.get("/api/roles");
export const addRole = (data) => api.post("/api/roles", data);
export const updateRole = (id, data) => api.patch(`/api/roles/${id}`, data);
export const deleteRole = (id) => api.delete(`/api/roles/${id}`);

// 权限管理
export const getPermissions = () => api.get("/api/permissions");
export const updateRolePermissions = (roleId, permissionIds) =>
  api.post(`/api/roles/${roleId}/permissions`, { permissionIds });
