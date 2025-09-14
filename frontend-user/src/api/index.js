import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // 后端地址
  timeout: 5000,
});

export const getMenu = async () => {
  const res = await api.get("/dishes");
  return res.data;
};
export const createOrder = (order) => api.post("/orders", order);
export const getOrders = () => api.get("/orders");
export const createReview = (review) => api.post("/reviews", review);

// 微信支付 mock 调用
export const payOrder = (orderId) => {
  // 实际项目调用微信 JSAPI 支付接口
  console.log("payOrder", orderId);
  return Promise.resolve({ success: true });
};
