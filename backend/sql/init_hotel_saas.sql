-- 1. 权限管理表 (Roles)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    permissions JSON NULL COMMENT '权限范围(JSON存储)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 用户信息表 (Users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密存储)',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    role_id INT NOT NULL COMMENT '角色ID',
    openid VARCHAR(100) UNIQUE COMMENT '微信openid',
    unionid VARCHAR(100) UNIQUE COMMENT '微信unionid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 菜品信息表 (Dishes)
CREATE TABLE dishes (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '菜品ID',
    name VARCHAR(100) NOT NULL COMMENT '菜品名称',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    category VARCHAR(50) COMMENT '菜品类别',
    stock INT DEFAULT 0 COMMENT '库存数量',
    image_url VARCHAR(255) COMMENT '图片路径',
    status TINYINT DEFAULT 1 COMMENT '状态(1上架,0下架)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 订单信息表 (Orders)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
    user_id INT NOT NULL COMMENT '下单用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    status TINYINT DEFAULT 0 COMMENT '订单状态(0待支付,1已支付,2配送中,3已完成,4已取消)',
    payment_status TINYINT DEFAULT 0 COMMENT '支付状态(0未支付,1支付成功,2支付失败)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_status (user_id, status),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 订单详情表 (Order_Items)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单详情ID',
    order_id INT NOT NULL COMMENT '订单ID',
    dish_id INT NOT NULL COMMENT '菜品ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    price DECIMAL(10,2) NOT NULL COMMENT '下单时价格',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT fk_orderitems_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitems_dish FOREIGN KEY (dish_id) REFERENCES dishes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 评价表 (Reviews)
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '评价ID',
    order_id INT NOT NULL COMMENT '订单ID',
    user_id INT NOT NULL COMMENT '用户ID',
    rating_service TINYINT NOT NULL COMMENT '服务评分(1-5)',
    rating_food TINYINT NOT NULL COMMENT '菜品评分(1-5)',
    rating_delivery TINYINT NOT NULL COMMENT '配送评分(1-5)',
    comment TEXT COMMENT '评价内容',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入角色 (Roles)
INSERT INTO roles (role_name, permissions) VALUES
('超级管理员', '{"manage_users":true,"manage_orders":true,"manage_dishes":true,"view_reports":true}'),
('店长', '{"manage_orders":true,"manage_dishes":true,"view_reports":true}'),
('客服', '{"manage_orders":true,"view_reports":true}'),
('顾客', '{"place_order":true,"write_review":true}');

-- 插入用户 (Users)
INSERT INTO users (username, password, phone, email, role_id, openid, unionid)
VALUES
('admin', '123456', '13800000001', 'admin@test.com', 1, 'wx_openid_admin', 'wx_unionid_admin'),
('manager', '123456', '13800000002', 'manager@test.com', 2, 'wx_openid_manager', 'wx_unionid_manager'),
('customer1', '123456', '13800000003', 'cust1@test.com', 4, 'wx_openid_cust1', 'wx_unionid_cust1'),
('customer2', '123456', '13800000004', 'cust2@test.com', 4, 'wx_openid_cust2', 'wx_unionid_cust2');

-- 插入菜品 (Dishes)
INSERT INTO dishes (name, price, category, stock, image_url, status) VALUES
('宫保鸡丁', 28.00, '热菜', 100, '/images/gongbao.jpg', 1),
('鱼香肉丝', 26.00, '热菜', 80, '/images/yuxiang.jpg', 1),
('冰镇可乐', 5.00, '饮品', 200, '/images/cola.jpg', 1);

-- 插入订单 (Orders)  假设 customer1 下单
INSERT INTO orders (user_id, total_amount, status, payment_status)
VALUES
(3, 59.00, 1, 1); -- user_id = 3 (customer1)，已支付

-- 插入订单详情 (Order_Items)
-- 订单ID = 1, 包含 宫保鸡丁 1份 + 鱼香肉丝 1份 + 可乐 1份
INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES
(1, 1, 1, 28.00),  -- 宫保鸡丁
(1, 2, 1, 26.00),  -- 鱼香肉丝
(1, 3, 1, 5.00);   -- 可乐

-- 插入评价 (Reviews)  customer1 对订单1进行评价
INSERT INTO reviews (order_id, user_id, rating_service, rating_food, rating_delivery, comment)
VALUES
(1, 3, 5, 4, 5, '服务很好，菜品味道不错，配送也很快！');
