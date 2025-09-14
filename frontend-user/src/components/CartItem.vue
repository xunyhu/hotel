<template>
  <div>
    <span>{{ item.name }} × {{ item.quantity }}</span>
    <button @click="item.quantity++; update()">+</button>
    <button @click="item.quantity--; update()">-</button>
    <button @click="remove()">删除</button>
  </div>
</template>

<script>
export default {
  props: ['item'],
  emits: ['update'],
  setup(props, { emit }) {
    const update = () => emit('update');
    const remove = () => {
      props.item.quantity = 0;
      update();
    };
    return { update, remove };
  },
};
</script>
