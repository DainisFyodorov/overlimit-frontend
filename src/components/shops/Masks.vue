<!-- src/components/Masks.vue -->
<template>
    <div v-if="masksActive" class="masks-container" id="masks">
      <h1 class="masks-container__title">Магазин масок</h1>
      <div class="colors-container">
        <p class="colors-container__title">Выбрать цвет:</p>
        <div class="toggle-colors-container">
          <i @click="left(1)" class="fas fa-chevron-left"></i>
          <div class="toggle-colors-container__color">{{ colors[indexC] }}</div>
          <i @click="right(1)" class="fas fa-chevron-right"></i>
        </div>
      </div>
      <div class="items-container">
        <div
          v-for="(style, index) in styles"
          :key="index"
          :class="{ 'items-container__item_selected': selectedStyle === index }"
          class="items-container__item"
          :price="prices[index]"
          :name="style"
          :index="index"
          @click="selectStyle(index)"
        >
          <p class="items-container__name">Стиль {{ style }}</p>
          <p class="items-container__price">{{ prices[index] }}$</p>
        </div>
      </div>
      <div class="total-container">
        <p class="total-container__title">Сумма:</p>
        <p class="total-container__summ">{{ totalPrice }}$</p>
      </div>
      <div class="buttons-container">
        <p class="buttons-container__btn" @click="exit">Отмена</p>
        <p class="buttons-container__btn buttons-container__btn_active" @click="buy">Купить</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useUiStore } from '@/stores/ui';
  import gsap from 'gsap';
  
  export default {
    name: 'Masks',
    setup() {
      const uiStore = useUiStore();
      return { uiStore };
    },
    computed: {
      masksActive() {
        return this.uiStore.masksActive;
      },
      totalPrice() {
        return this.selectedStyle !== null ? this.prices[this.selectedStyle] : 0;
      },
    },
    data() {
      return {
        index: 0, // Unused in original HTML, kept for compatibility
        indexS: 0, // Style index
        indexC: 0, // Color index
        styles: ['Style-1', 'Style-2'], // Example data, should be populated via event
        colors: ['Colors-1', 'Colors-2'], // Example data, should be populated via event
        prices: [9, 99], // Example data, should be populated via event
        btns: [true, false, false, false], // Unused here, kept for compatibility
        selectedStyle: null, // Tracks selected item
      };
    },
    mounted() {
      // Register RAGE:MP events
      mp.events.add('masks::show', () => {
        this.uiStore.showMasks();
        this.startAnimation();
      });
      mp.events.add('masks::setData', (data) => {
        const { styles, colors, prices } = JSON.parse(data);
        this.styles = styles;
        this.colors = colors;
        this.prices = prices;
        this.indexS = 0;
        this.indexC = 0;
        this.selectedStyle = null; // Reset selection
      });
    },
    methods: {
      left(type) {
        if (type === 0) { // Style (unused in this HTML, kept for compatibility)
          this.indexS--;
          if (this.indexS < 0) this.indexS = this.styles.length - 1;
          mp.trigger('masks', 'style', this.indexS);
        } else { // Color
          this.indexC--;
          if (this.indexC < 0) this.indexC = this.colors.length - 1;
          mp.trigger('masks', 'color', this.indexC);
        }
      },
      right(type) {
        if (type === 0) { // Style (unused in this HTML)
          this.indexS++;
          if (this.indexS >= this.styles.length) this.indexS = 0;
          mp.trigger('masks', 'style', this.indexS);
        } else { // Color
          this.indexC++;
          if (this.indexC >= this.colors.length) this.indexC = 0;
          mp.trigger('masks', 'color', this.indexC);
        }
      },
      selectStyle(index) {
        this.selectedStyle = index;
        mp.trigger('masks', 'style', index);
      },
      buy() {
        if (this.selectedStyle !== null) {
          mp.trigger('buyMasks');
        }
      },
      exit() {
        this.reset();
        this.uiStore.hideMasks();
        mp.trigger('closeMasks');
      },
      reset() {
        this.selectedStyle = null;
        this.indexS = 0;
        this.indexC = 0;
        this.styles = [];
        this.colors = [];
        this.prices = [];
      },
      startAnimation() {
        const tl_masks = gsap.timeline();
        tl_masks
          .from('.masks-container', {
            opacity: 0,
            ease: 'power3.out',
            x: -this.$el.offsetWidth * 1.1,
            duration: 0.7,
            delay: 0.3,
          })
          .staggerFrom(
            [
              '.masks-container__title',
              '.colors-container',
              '.items-container',
              '.total-container',
              '.buttons-container',
            ],
            0.5,
            { opacity: 0, ease: 'power3.out', x: -40, delay: -0.5 },
            0.06
          );
      },
    },
  };
  </script>
  
  <style scoped>
@import '/customCSS/masks__custom.css';
  </style>