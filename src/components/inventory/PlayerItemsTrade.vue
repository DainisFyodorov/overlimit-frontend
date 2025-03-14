<template>
  <div
    class="trade__slot trade_inventory"
    @mouseup="mouseUp(index)"
    @mouseout="mouseOut"
    @mousemove="mouseMove"
    @mousedown="mouseDown(index)"
  >
    <div v-if="item.id" class="trade__item" :class="{ 'trade__item_active': item.active }" @click.right="callMenu($event, index)">
      <img
        class="trade__img"
        :class="{ 'trade__img_active': item.active }"
        :src="`/img/inventory/items/${item.id}.png`"
        alt="Item"
      />
      <p v-if="item.amount > 1" class="trade__count">{{ item.amount }}</p>
      <p v-else-if="item.id < 0" class="trade__count" style="font-size: 12px">{{ item.cloth_style }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerItemsTrade',
  props: {
    index: Number,
    item: Object,
  },
  methods: {
    callMenu(e, index) {
      this.$emit('show-context', { x: e.clientX, y: e.clientY, from: 'trade_inv', index });
    },
    mouseDown(index) {
      if (!this.item.id || event.button === 2) return;
      this.$emit('start-drag', { from: 'trade_inv', index, id: this.item.id });
    },
    mouseUp(index) {
      this.$emit('end-drag', index);
    },
    mouseMove() {
      this.$emit('update-current', 'trade_inv');
    },
    mouseOut() {
      this.$emit('update-current', null);
    },
  },
};
</script>

<style scoped>
  @import '/css/inventory/style.css';
</style>