<template>
  <div
    class="trade__slot trade_player"
    @mousedown="mouseDown(index)"
    @mousemove="mouseMove"
    @mouseout="mouseOut"
    @mouseup="mouseUp(index)"
  >
    <div v-if="item.id" class="trade__item" @click.right="callMenu($event, index)">
      <img class="trade__img" :src="`/img/inventory/items/${item.id}.png`" alt="Item" />
      <p v-if="item.amount > 1" class="trade__count">{{ item.amount }}</p>
      <p v-else-if="item.id < 0" class="trade__count" style="font-size: 12px">{{ item.cloth_style }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FirstPlayerTrade',
  props: {
    index: Number,
    item: Object,
  },
  methods: {
    callMenu(e, index) {
      this.$emit('show-context', { x: e.clientX, y: e.clientY, from: 'trade_offer', index });
    },
    mouseDown(index) {
      if (!this.item.id || event.button === 2) return;
      this.$emit('start-drag', { from: 'trade_offer', index, id: this.item.id });
    },
    mouseUp(index) {
      this.$emit('end-drag', index);
    },
    mouseMove() {
      this.$emit('update-current', 'trade_offer');
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