<template>
  <div
    class="items__slot"
    @mousemove="mouseMove(index, id)"
    @mouseout="mouseOut"
    @mousedown="mouseDown(index)"
    @mouseup="mouseUp(index)"
  >
    <div v-if="id" class="items__item" :class="{ 'items__item_active': active }" @click.right="callMenu($event, index)">
      <img :src="`/img/inventory/items/${id}.png`" class="items__img" :class="{ 'items__img_active': active }" alt="Item" />
      <p v-if="amount > 1" class="items__count">{{ amount }}</p>
      <p v-else-if="clothStyle !== '0'" style="font-size: 14px" class="items__count">{{ clothStyle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvItems',
  props: {
    id: [Number, null],
    amount: Number,
    active: Boolean,
    clothStyle: [Number, String, null],
    index: Number,
  },
  methods: {
    callMenu(e, index) {
      this.$emit('show-context', { x: e.clientX, y: e.clientY, index });
    },
    mouseDown(index) {
      if (!this.id || event.button === 2) return;
      this.$emit('start-drag', { from: 'slots', index, id: this.id });
    },
    mouseUp(index) {
      this.$emit('end-drag', index);
    },
    mouseMove(index, id) {
      if (id !== null) this.$emit('update-current', index);
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