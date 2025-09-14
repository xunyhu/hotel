<template>
  <div>
    <h1>我的订单</h1>
    <div v-for="order in orders" :key="order.id">
      <p>订单号: {{ order.id }} | 总价: {{ order.totalPrice }} | 状态: {{ order.status }}</p>
      <router-link :to="`/review/${order.id}`">去评价</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getOrders } from '../api';

export default {
  setup() {
    const orders = ref([]);
    onMounted(async () => {
      const res = await getOrders();
      orders.value = res.data;
    });
    return { orders };
  },
};
</script>
