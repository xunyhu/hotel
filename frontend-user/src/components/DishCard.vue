<template>
  <div class="dish-card">
    <img
      v-lazy="dish.image_url" 
      alt="dish" 
      style="width:100%; height:100px; object-fit:cover; border-radius:4px;"
    />
    <h3>{{ dish.name }}</h3>
    <p>价格: {{ dish.price }} 元</p>
    <p v-if="dish.stock === 0" style="color:red;">库存不足</p>
    <button :disabled="dish.stock === 0" @click="$emit('add-to-cart', dish)">
      {{ dish.stock === 0 ? '售罄' : '加入购物车' }}
    </button>
  </div>
</template>

<script>
export default {
  props: ['dish'],
};
</script>
