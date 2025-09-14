import { Table, Button, Modal, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/reviews/${id}`);
      message.success("删除成功");
      fetchReviews();
    } catch (err) {
      message.error("删除失败");
      console.error(err);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "用户", dataIndex: "user_name", key: "user_name" },
    { title: "菜品", dataIndex: "dish_name", key: "dish_name" },
    { title: "评分", dataIndex: "rating", key: "rating" },
    { title: "内容", dataIndex: "content", key: "content" },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={reviews} rowKey="id" loading={loading} />
    </div>
  );
}
