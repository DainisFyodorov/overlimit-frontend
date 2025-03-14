<template>
  <div class="trade__slot">
    <div v-if="item.id" class="trade__item">
      <img class="trade__img" :src="`/img/inventory/items/${item.id}.png`" alt="Item" />
      <p v-if="item.amount > 1" class="trade__count">{{ item.amount }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecondPlayerTrade',
  props: {
    index: Number,
    item: Object,
  },
};
</script>

<style scoped>
  @import '/css/inventory/style.css';
</style>