<!-- src/App.vue -->
<template>
  <div id="app" class="app-container">
    <!-- 页面内容 -->
    <main class="content">
      <router-view />
    </main>

    <!-- 底部导航栏 -->
    <nav class="tabbar" v-if="showTabBar">
      <div
        class="tab-item"
        :class="{ active: $route.path === '/' }"
        @click="$router.push('/')"
      >
        <span class="icon">🍲</span>
        <span>菜单</span>
      </div>

      <div
        class="tab-item"
        :class="{ active: $route.path === '/cart' }"
        @click="$router.push('/cart')"
      >
        <span class="icon">🛒</span>
        <span>购物车</span>
      </div>

      <div
        class="tab-item"
        :class="{ active: $route.path === '/orders' }"
        @click="$router.push('/orders')"
      >
        <span class="icon">📦</span>
        <span>订单</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 不显示底部 tabbar 的页面路径
const noTabBarPages = ['/checkout', '/order-success'];

const showTabBar = computed(() => !noTabBarPages.includes(route.path));
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px; /* 给 tabbar 留空间 */
}

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.tab-item {
  flex: 1;
  text-align: center;
  color: #666;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-item .icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.tab-item.active {
  color: #42b983; /* Vue 绿色 */
  font-weight: bold;
}
</style>
