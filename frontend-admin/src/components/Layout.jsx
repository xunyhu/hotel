import { useState } from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, color: "white", textAlign: "center" }}>
          酒店后台
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">仪表盘</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link to="/users">管理员管理</Link>
          </Menu.Item>
          <Menu.Item key="/roles" icon={<TeamOutlined />}>
            <Link to="/roles">角色管理</Link>
          </Menu.Item>
          <Menu.Item key="/dishes" icon={<AppstoreOutlined />}>
            <Link to="/dishes">菜品管理</Link>
          </Menu.Item>
          <Menu.Item key="/orders" icon={<OrderedListOutlined />}>
            <Link to="/orders">订单管理</Link>
          </Menu.Item>
          <Menu.Item key="/reviews" icon={<MessageOutlined />}>
            <Link to="/reviews">评价管理</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          欢迎使用酒店管理后台
        </Header>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
