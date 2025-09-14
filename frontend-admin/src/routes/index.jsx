import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminLayout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Roles from "../pages/Roles";
import Dishes from "../pages/Dishes";
import Orders from "../pages/Orders";
import Reviews from "../pages/Reviews";
import Login from "../pages/Login";

// 模拟登录状态
const isLogin = !!localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: isLogin ? <AdminLayout /> : <Navigate to="/login" />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "roles", element: <Roles /> },
      { path: "dishes", element: <Dishes /> },
      { path: "orders", element: <Orders /> },
      { path: "reviews", element: <Reviews /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
