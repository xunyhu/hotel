import { useEffect, useState } from "react";
import { Table, Button, Select, message, Tag, Modal, Descriptions } from "antd";
import { getOrders, updateOrderStatus } from "../../api";

const { Option } = Select;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [payStatusFilter, setPayStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders({ page, pageSize, status: statusFilter, payStatus: payStatusFilter });
      setOrders(res.data.list);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      message.error("获取订单失败");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, payStatusFilter]);

  const handleChangeStatus = async (order, newStatus) => {
    await updateOrderStatus(order.id, { status: newStatus });
    message.success("订单状态更新成功");
    fetchOrders();
  };

  const showDetail = (order) => {
    setCurrentOrder(order);
    setDetailVisible(true);
  };

  const columns = [
    { title: "订单ID", dataIndex: "id" },
    { title: "用户ID", dataIndex: "user_id" },
    { title: "总金额", dataIndex: "total_amount", render: (amt) => `￥${amt}` },
    { 
      title: "支付状态", 
      dataIndex: "pay_status", 
      render: (status) => status === 1 ? <Tag color="green">已支付</Tag> : <Tag color="red">未支付</Tag> 
    },
    { 
      title: "订单状态", 
      dataIndex: "status", 
      render: (status) => {
        switch(status) {
          case 0: return <Tag>待付款</Tag>;
          case 1: return <Tag color="blue">已下单</Tag>;
          case 2: return <Tag color="orange">制作中</Tag>;
          case 3: return <Tag color="green">已完成</Tag>;
          case 4: return <Tag color="red">已取消</Tag>;
          default: return <Tag>未知</Tag>;
        }
      }
    },
    {
      title: "操作",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showDetail(record)}>查看</Button>
          {record.status < 3 && (
            <Select
              defaultValue={record.status}
              style={{ width: 120 }}
              onChange={(val) => handleChangeStatus(record, val)}
            >
              <Option value={0}>待付款</Option>
              <Option value={1}>已下单</Option>
              <Option value={2}>制作中</Option>
              <Option value={3}>已完成</Option>
              <Option value={4}>已取消</Option>
            </Select>
          )}
        </>
      )
    },
  ];

  return (
    <div>
      {/* 筛选 */}
      <div style={{ marginBottom: 10 }}>
        <Select
          placeholder="支付状态"
          style={{ width: 120, marginRight: 10 }}
          allowClear
          onChange={setPayStatusFilter}
        >
          <Option value={0}>未支付</Option>
          <Option value={1}>已支付</Option>
        </Select>
        <Select
          placeholder="订单状态"
          style={{ width: 120 }}
          allowClear
          onChange={setStatusFilter}
        >
          <Option value={0}>待付款</Option>
          <Option value={1}>已下单</Option>
          <Option value={2}>制作中</Option>
          <Option value={3}>已完成</Option>
          <Option value={4}>已取消</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p) => setPage(p),
        }}
      />

      <Modal
        visible={detailVisible}
        title={`订单详情 - ${currentOrder?.id}`}
        footer={null}
        onCancel={() => setDetailVisible(false)}
        width={600}
      >
        {currentOrder && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="用户ID">{currentOrder.user_id}</Descriptions.Item>
            <Descriptions.Item label="总金额">￥{currentOrder.total_amount}</Descriptions.Item>
            <Descriptions.Item label="支付状态">
              {currentOrder.pay_status === 1 ? "已支付" : "未支付"}
            </Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {{
                0: "待付款",
                1: "已下单",
                2: "制作中",
                3: "已完成",
                4: "已取消"
              }[currentOrder.status]}
            </Descriptions.Item>
            <Descriptions.Item label="菜品列表">
              <ul>
                {currentOrder.items?.map(item => (
                  <li key={item.id}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
