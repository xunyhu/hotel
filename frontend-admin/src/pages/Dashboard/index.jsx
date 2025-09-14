import { Card, Row, Col, Statistic } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    dishes: 0,
    orders: 0,
    reviews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("获取统计信息失败", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="管理员数量" value={stats.users} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="菜品数量" value={stats.dishes} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="订单数量" value={stats.orders} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="评价数量" value={stats.reviews} />
        </Card>
      </Col>
    </Row>
  );
}
