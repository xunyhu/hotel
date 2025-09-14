import { Table, Button, Modal, Form, Input, InputNumber, message, Upload, Image, Tag } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { getDishes, updateDishes, deleteDishes, addDishes } from "../../api";

export default function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await getDishes();
      setDishes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleAdd = () => {
    setEditingDish(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDish(record);
    form.setFieldsValue(record);
    // 如果有图片，带到 Upload 组件
    if (record.image_url) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: record.image_url,
        },
      ]);
    } else {
      setFileList([]);
    }
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // 如果是上传图片，取上传后的 url
      if (fileList.length > 0 && fileList[0].url) {
        values.image_url = fileList[0].url;
      }

      if (editingDish) {
        const res = await updateDishes(editingDish.id, values);
        if (res.data) {
          message.success("修改成功");
        }
      } else {
        const res = await addDishes(values);
        if (res.data) {
          message.success("新增成功");
        }
      }
      setModalVisible(false);
      fetchDishes();
    } catch (err) {
      if (err.message) {
        message.error(err.message);
      } else {
        message.error("操作失败");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDishes(id);
      message.success("删除成功");
      fetchDishes();
    } catch (err) {
      message.error("删除失败");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "菜品名称", dataIndex: "name", key: "name" },
    { title: "分类", dataIndex: "category", key: "category" },
    { title: "价格", dataIndex: "price", key: "price" },
    { title: "库存", dataIndex: "stock", key: "stock" },
    {
      title: "图片",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) =>
        text ? <Image src={text} width={60} height={60} style={{ objectFit: "cover" }} /> : "无",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 1 ? <Tag color="green">已上架</Tag> : <Tag color="red">已下架</Tag>,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        新增菜品
      </Button>
      <Table columns={columns} dataSource={dishes} rowKey="id" loading={loading} />

      <Modal
        title={editingDish ? "编辑菜品" : "新增菜品"}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="菜品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* 图片上传 & URL 输入 */}
          <Form.Item label="图片上传">
            <Upload
              action="/api/admin/upload"
              listType="picture"
              fileList={fileList}
              maxCount={1}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={() => setFileList([])}
            >
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="image_url" label="图片URL">
            <Input placeholder="也可以直接输入图片地址" />
          </Form.Item>

          {/* 状态选择 */}
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <InputNumber min={0} max={1} style={{ width: "100%" }} placeholder="1=上架，0=下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
