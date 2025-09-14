import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Tree, message, Popconfirm } from "antd";
import { getRoles, addRole, updateRole, deleteRole, getPermissions, updateRolePermissions } from "../../api";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [form] = Form.useForm();

  // 获取角色列表
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      message.error("获取角色列表失败");
    }
    setLoading(false);
  };

  // 获取权限树
  const fetchPermissions = async () => {
    try {
      const res = await getPermissions();
      setPermissions(res.data);
    } catch (err) {
      console.error(err);
      message.error("获取权限列表失败");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const openModal = (role = null) => {
    setCurrentRole(role);
    if (role) {
      form.setFieldsValue({ name: role.name });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentRole) {
        await updateRole(currentRole.id, values);
        message.success("角色更新成功");
      } else {
        await addRole(values);
        message.success("角色添加成功");
      }
      fetchRoles();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (role) => {
    try {
      await deleteRole(role.id);
      message.success("角色删除成功");
      fetchRoles();
    } catch (err) {
      console.error(err);
      message.error("删除失败");
    }
  };

  const openPermissionModal = (role) => {
    setCurrentRole(role);
    setSelectedKeys(role.permissions?.map(p => p.id) || []);
    setPermissionModalVisible(true);
  };

  const handlePermissionSave = async () => {
    try {
      await updateRolePermissions(currentRole.id, selectedKeys);
      message.success("权限更新成功");
      setPermissionModalVisible(false);
      fetchRoles();
    } catch (err) {
      console.error(err);
      message.error("权限保存失败");
    }
  };

  const columns = [
    { title: "角色ID", dataIndex: "id" },
    { title: "角色名称", dataIndex: "name" },
    {
      title: "操作",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>编辑</Button>
          <Button type="link" onClick={() => openPermissionModal(record)}>分配权限</Button>
          <Popconfirm
            title="确定删除该角色吗？"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 10 }} onClick={() => openModal()}>
        添加角色
      </Button>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
      />

      {/* 添加/编辑角色 */}
      <Modal
        visible={modalVisible}
        title={currentRole ? "编辑角色" : "添加角色"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: "请输入角色名称" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 分配权限 */}
      <Modal
        visible={permissionModalVisible}
        title={`分配权限 - ${currentRole?.name}`}
        onCancel={() => setPermissionModalVisible(false)}
        onOk={handlePermissionSave}
        width={600}
      >
        <Tree
          checkable
          treeData={permissions}
          checkedKeys={selectedKeys}
          onCheck={(checked) => setSelectedKeys(checked)}
          fieldNames={{ title: 'name', key: 'id', children: 'children' }}
          defaultExpandAll
        />
      </Modal>
    </div>
  );
}
