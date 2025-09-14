<template>
  <div>
    <h1>评价订单 {{ orderId }}</h1>
    <textarea v-model="comment" placeholder="请输入评价"></textarea>
    <input type="number" v-model.number="rating" placeholder="评分 1-5" min="1" max="5" />
    <button @click="submitReview">提交评价</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { createReview } from '../api';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const orderId = route.params.orderId;
    const comment = ref('');
    const rating = ref(5);

    const submitReview = async () => {
      await createReview({ dishId: 1, rating: rating.value, comment: comment.value }); // 简化示例
      alert('评价提交成功');
    };

    return { orderId, comment, rating, submitReview };
  },
};
</script>
