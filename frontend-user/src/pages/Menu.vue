<template>
  <div class="menu-container-wrapper">
    <!-- 顶部Banner -->
    <div class="banner">
      <img src="../assets/img-1.jpg" alt="餐厅Banner" />
      <div class="banner-text">餐厅名称</div>
    </div>

    <!-- 主体布局 -->
    <div class="menu-container">
      <!-- 左侧分类 -->
      <div class="category-list">
        <ul>
          <li :class="{ active: categoryFilter === '' }" @click="categoryFilter = ''">全部</li>
          <li
            v-for="cat in categories"
            :key="cat"
            :class="{ active: categoryFilter === cat }"
            @click="categoryFilter = cat"
          >
            {{ cat }}
          </li>
        </ul>
      </div>

      <!-- 右侧菜品 -->
      <div class="dishes-section">
        <!-- 搜索框 -->
        <div class="search-box">
          <input v-model="searchKey" placeholder="搜索菜品" />
        </div>

        <div class="menu-list">
          <DishCard
            v-for="dish in filteredMenu"
            :key="dish.id"
            :dish="dish"
            @add-to-cart="addToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getMenu } from '../api';
import DishCard from '../components/DishCard.vue';

export default {
  components: { DishCard },
  setup() {
    const menu = ref([]);
    const searchKey = ref('');
    const categoryFilter = ref('');
    const categories = ref([]);

    const fetchMenu = async () => {
      try {
        const res = await getMenu();
        console.log('获取菜单成功', res);
        menu.value = res.data;
        categories.value = [...new Set(menu.value.map(d => d.category))];
      } catch (err) {
        console.error('获取菜单失败', err);
      }
    };

    onMounted(() => {
      fetchMenu();
    });

    const filteredMenu = computed(() => {
      return menu.value.filter(d =>
        d.name.includes(searchKey.value) &&
        (categoryFilter.value ? d.category === categoryFilter.value : true)
      );
    });

    const addToCart = (dish) => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const exist = cart.find((item) => item.id === dish.id);
      if (exist) exist.quantity++;
      else cart.push({ ...dish, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${dish.name} 已加入购物车`);
    };

    return { menu, filteredMenu, searchKey, categoryFilter, categories, addToCart };
  },
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden; /* 禁止页面整体滚动 */
}

.menu-container-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100vh; /* 占满整个屏幕高度 */
}

/* Banner */
.banner {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 180px;
  overflow: hidden;
}
.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.banner-text {
  position: absolute;
  bottom: 10px;
  left: 20px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.7);
}

/* 主体布局 */
.menu-container {
  display: flex;
  padding: 10px;
  gap: 20px;
  height: calc(100% - 180px); /* 占满剩余高度 */
}

/* 左侧分类固定 */
.category-list {
  width: 30%;
  border-right: 1px solid #eee;
  padding-right: 10px;
  flex-shrink: 0;
  position: sticky;
  top: 180px; /* 紧贴Banner下方 */
  height: calc(100% - 180px);
  overflow-y: auto; /* 左侧分类独立滚动 */
}
.category-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.category-list li {
  padding: 5px 0;
  cursor: pointer;
  transition: color 0.2s;
}
.category-list li.active {
  color: #42b983;
  font-weight: bold;
}

/* 右侧菜品可滚动 */
.dishes-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 右侧菜品独立滚动 */
}
.search-box {
  margin-bottom: 10px;
  padding-right: 10px;
}
.search-box input {
  width: 100%;
  max-width: 100%; /* 防止横向滚动 */
  box-sizing: border-box;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
