<template>
  <div class="cart-page">
    <h2>购物车</h2>

    <div v-if="cart.length" class="cart-list">
      <div class="cart-item" v-for="item in cart" :key="item.id">
        <input type="checkbox" v-model="item.selected" />
        <img :src="item.image_url" alt="" class="cart-item-img" />
        <div class="cart-item-info">
          <h3>{{ item.name }}</h3>
          <p class="price">¥{{ item.price }}</p>
          <p class="stock" :class="{ 'out-of-stock': item.stock <= 0 }">
            {{ item.stock > 0 ? `库存 ${item.stock}` : '已售罄' }}
          </p>
          <div class="quantity-control">
            <button @click="decrease(item)" :disabled="item.stock <= 0">-</button>
            <input type="number" v-model.number="item.quantity" @change="updateCart" :min="1" :max="item.stock" />
            <button @click="increase(item)" :disabled="item.stock <= 0">+</button>
          </div>
        </div>
        <button class="remove-btn" @click="removeItem(item)">删除</button>
      </div>
    </div>

    <p v-else class="empty">购物车为空</p>

    <div class="cart-footer">
     <div class="footer-left"><input type="checkbox" v-model="allSelected" @change="toggleSelectAll" /> 全选</div>
     <div class="footer-right">
        <p class="total">总价：¥{{ selectedTotalPrice }}</p>
        <button class="checkout-btn" :disabled="!hasSelectedItems" @click="goCheckout">
          去结算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref(JSON.parse(localStorage.getItem('cart') || '[]'));

// 初始化每个商品选中状态
cart.value.forEach(item => {
  if (item.selected === undefined) item.selected = true;
});

const updateCart = () => {
  cart.value = cart.value.filter(i => i.quantity > 0);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

// 数量操作
const increase = (item) => {
  if(item.quantity < item.stock) {
    item.quantity++;
    updateCart();
  }
};

const decrease = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart.value = cart.value.filter(i => i.id !== item.id);
  }
  updateCart();
};

// 删除单个
const removeItem = (item) => {
  cart.value = cart.value.filter(i => i.id !== item.id);
  updateCart();
};

// 清空购物车
const clearCart = () => {
  cart.value = [];
  localStorage.removeItem('cart');
};

// 全选/取消全选
const allSelected = ref(cart.value.every(item => item.selected));
watch(cart, () => {
  allSelected.value = cart.value.length && cart.value.every(item => item.selected);
}, { deep: true });

const toggleSelectAll = () => {
  cart.value.forEach(item => {
    item.selected = allSelected.value;
  });
};

// 选中商品总价
const selectedTotalPrice = computed(() =>
  cart.value.reduce((sum, item) => item.selected ? sum + item.price * item.quantity : sum, 0)
);

const hasSelectedItems = computed(() =>
  cart.value.some(item => item.selected)
);

// 去结算页面
const goCheckout = () => {
  const selectedItems = cart.value.filter(item => item.selected);
  if(!selectedItems.length) return;
  localStorage.setItem('cart', JSON.stringify(selectedItems));
  router.push('/checkout'); // 假设确认订单页面路由
};
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  padding-bottom: 100px; /* 底部留空避免覆盖 */
}
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.cart-item input[type="checkbox"] {
  margin-right: 8px;
}
.cart-item-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}
.cart-item-info {
  flex: 1;
}
.cart-item-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}
.price {
  color: #ff4d4f;
  margin-bottom: 4px;
}
.stock {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.stock.out-of-stock {
  color: red;
}
.quantity-control {
  display: flex;
  align-items: center;
  gap: 4px;
}
.quantity-control input {
  width: 50px;
  text-align: center;
}
.remove-btn {
  background: transparent;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
}

/* 底部固定 */
.cart-footer {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
  justify-content: space-between;
  box-sizing: border-box;
}
.cart-footer input[type="checkbox"] {
  margin-right: 4px;
}
.footer-left input {
  width: 18px;
}
.footer-right {
  display: flex;
  align-items: center;
}
.footer-right p {
  margin: 0;
  padding-right: 10px;
}
.total {
  font-weight: bold;
  margin-left: auto;
}
.checkout-btn {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.clear-btn {
  background: #f5f5f5;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 50px;
}
</style>
