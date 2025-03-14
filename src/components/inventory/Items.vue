<template>
  <div
    class="outer-inventory__slot"
    :class="{ 'outer-inventory__item_player': from === 'player', 'outer-inventory__item_outer': from === 'outer' }"
    @mousedown="mouseDown(index)"
    @mousemove="mouseMove(index)"
    @mouseout="mouseOut"
  >
    <div
      v-if="id"
      class="outer-inventory__item"
      :class="{ 'outer-inventory__item_active': active }"
      @click.right="callMenu($event, from, index)"
    >
      <img :src="`/img/inventory/items/${id}.png`" class="outer-inventory__img" alt="Item" />
      <p v-if="amount > 1" class="outer-inventory__count">{{ amount }}</p>
      <p v-else-if="clothStyle !== '0'" style="font-size: 14px" class="outer-inventory__count">{{ clothStyle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Items',
  props: {
    id: [Number, null],
    amount: Number,
    active: Boolean,
    clothStyle: [Number, String, null],
    index: Number,
    from: String,
  },
  methods: {
    callMenu(e, from, index) {
      this.$emit('show-context', { x: e.clientX, y: e.clientY, from, index });
    },
    mouseDown(index) {
      if (!this.id || event.button === 2) return;
      this.$emit('start-drag', { from: this.from, index, id: this.id });
    },
    mouseMove(index) {
      this.$emit('update-current', { index, from: this.from });
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