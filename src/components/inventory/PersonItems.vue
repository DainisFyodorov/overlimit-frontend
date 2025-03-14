<template>
  <div
    class="person__item"
    :class="{ 'person__item_active': active }"
    @mousemove="mouseMove(index)"
    @mouseout="mouseOut"
    @mousedown="mouseDown(index)"
  >
    <img :src="`/img/inventory/items/${id}.png`" class="person__itemImg" alt="Item" />
    <img
      v-if="active"
      :src="`/img/inventory/items/${id}.png`"
      class="person__itemImg person__itemImg_active"
      alt="Active Item"
    />
  </div>
</template>

<script>
export default {
  name: 'PersonItems',
  props: {
    id: Number,
    active: Boolean,
    clothStyle: [Number, String, null],
    index: Number,
  },
  methods: {
    mouseDown(index) {
      if (!this.active || event.button === 2) return;
      this.$emit('start-drag', { from: 'person', index, id: this.id });
    },
    mouseMove(index) {
      this.$emit('update-current-pers', index);
    },
    mouseOut() {
      this.$emit('update-current-pers', null);
    },
  },
};
</script>

<style scoped>
  @import '/css/inventory/style.css';
</style>