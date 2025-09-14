import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import { getAdmins, addAdmin, updateAdmin, deleteAdmin, getRoles } from "../../api";

const { Option } = Select;

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const [form] = Form.useForm();

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAdmins();
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
      message.error("获取管理员列表失败");
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      message.error("获取角色列表失败");
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchRoles();
  }, []);

  const openModal = (admin = null) => {
    setCurrentAdmin(admin);
    if (admin) {
      form.setFieldsValue({
        username: admin.username,
        role_id: admin.role_id,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentAdmin) {
        await updateAdmin(currentAdmin.id, values);
        message.success("管理员更新成功");
      } else {
        await addAdmin(values);
        message.success("管理员添加成功");
      }
      fetchAdmins();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (admin) => {
    try {
      await deleteAdmin(admin.id);
      message.success("管理员删除成功");
      fetchAdmins();
    } catch (err) {
      console.error(err);
      message.error("删除失败");
    }
  };

  const columns = [
    { title: "管理员ID", dataIndex: "id" },
    { title: "用户名", dataIndex: "username" },
    { 
      title: "角色", 
      dataIndex: "role_name",
      render: (_, record) => record.role?.name || "-"
    },
    {
      title: "操作",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm
            title="确定删除该管理员吗？"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      )
    },
  ];

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 10 }} onClick={() => openModal()}>
        添加管理员
      </Button>

      <Table
        columns={columns}
        dataSource={admins}
        rowKey="id"
        loading={loading}
      />

      <Modal
        visible={modalVisible}
        title={currentAdmin ? "编辑管理员" : "添加管理员"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role_id"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select placeholder="选择角色">
              {roles.map(r => (
                <Option key={r.id} value={r.id}>{r.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {!currentAdmin && (
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
