<template>
  <div class="checkout-page">
    <h2>确认订单</h2>

    <div v-if="cart.length" class="checkout-list">
      <div class="checkout-item" v-for="item in cart" :key="item.id">
        <img :src="item.image_url" alt="" class="checkout-item-img" />
        <div class="checkout-item-info">
          <h3>{{ item.name }}</h3>
          <p>单价：¥{{ item.price }}</p>
          <p>数量：{{ item.quantity }}</p>
          <p>小计：¥{{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>
      </div>

      <div class="checkout-room">
        <label>房间号：
          <input type="text" v-model="roomNumber" placeholder="请输入房间号" />
        </label>
      </div>

      <p class="total">总价：¥{{ totalPrice.toFixed(2) }}</p>

      <button class="submit-btn" :disabled="!roomNumber || !cart.length" @click="submitOrder">
        提交订单
      </button>
    </div>

    <p v-else class="empty">没有选中商品</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref([]);
const roomNumber = ref('');

// 初始化购物车
onMounted(() => {
  const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.value = storedCart.filter(item => item.selected); // 只保留选中的商品
});

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// 提交订单
const submitOrder = async () => {
  if (!roomNumber.value) return alert('请填写房间号');

  const orderData = {
    roomNumber: roomNumber.value,
    items: cart.value.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalPrice: totalPrice.value,
  };

  try {
    // 1️⃣ 提交订单到后台
    const orderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!orderRes.ok) throw new Error('订单提交失败');

    const orderResult = await orderRes.json();
    const orderId = orderResult.id; // 后端返回的订单ID
    const openid = orderResult.openid; // 用户openid，公众号/小程序必传

    // 2️⃣ 调用支付接口，生成 prepay_id
    const payRes = await fetch('/api/pay/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        openid,
        total_fee: Math.round(totalPrice.value * 100), // 微信单位是分
        out_trade_no: orderId, // 使用订单号作为商户订单号
        body: '酒店客房订单',
      }),
    });

    if (!payRes.ok) throw new Error('支付接口调用失败');

    const payData = await payRes.json();

    if (payData.code !== 0) {
      throw new Error(payData.message || '支付失败');
    }

    // 3️⃣ 调起微信支付
    const { timeStamp, nonceStr, package: pkg, signType, paySign } = payData.data;

    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: pkg,
      signType,
      paySign,
      success: () => {
        alert('支付成功！');
        localStorage.removeItem('cart'); // 清空购物车
        router.push('/order-success'); // 跳转支付成功页
      },
      fail: () => {
        alert('支付失败或已取消');
      }
    });
  } catch (err) {
    console.error(err);
    alert(err.message || '订单提交或支付失败');
  }
};

</script>

<style scoped>
.checkout-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}
.checkout-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.checkout-item {
  display: flex;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.checkout-item-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}
.checkout-item-info h3 {
  margin: 0 0 8px 0;
}
.checkout-room {
  margin: 16px 0;
}
.checkout-room input {
  width: 120px;
  padding: 4px 8px;
}
.total {
  font-weight: bold;
  margin-bottom: 16px;
}
.submit-btn {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 50px;
}
</style>
