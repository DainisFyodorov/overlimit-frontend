<!-- src/components/Clothes.vue -->
<template>
    <div v-if="clothesActive" class="allclothes" style="position: relative; height: 100vh">
      <div class="clothes-container">
        <h1 class="clothes-container__title">Магазин одежды</h1>
        <div class="clothes-container-select">
          <p class="clothes-container-select__subtitle">Тип одежды:</p>
          <div class="clothes-container-select-box" @click="toggleDropdown">
            <i class="fas fa-chevron-down"></i>
            <span>{{ categories[index] }}</span>
            <ul :class="{ 'clothes-container-select-box-items_hidden': !dropdownOpen }" class="clothes-container-select-box-items">
              <li
                v-for="(cat, id) in categories"
                :key="id"
                @click.stop="btn(id)"
                :class="{ 'clothes-container-select-box-items__item_active': id === index }"
                class="clothes-container-select-box-items__item"
              >
                {{ cat }}
              </li>
            </ul>
          </div>
        </div>
        <div class="clothes-container-box-color">
          <p>Цвет одежды:</p>
          <div class="clothes-container-box-color-list">
            <i @click="left(1)" class="fas fa-chevron-left"></i>
            <div class="clothes-container-box-color-list__title">{{ colors[indexC] }}</div>
            <i @click="right(1)" class="fas fa-chevron-right"></i>
          </div>
        </div>
        <div class="clothes-container-box">
          <div
            v-for="(style, indexS) in styles"
            :key="indexS"
            :class="{ 'clothes-container-box__item_active': selectedStyle === indexS }"
            class="clothes-container-box__item"
            :index="indexS"
            :price="prices[indexS]"
            @click="selectStyle(indexS)"
          >
            <h1 class="clothes-container-box__item__name">Стиль {{ style }}</h1>
            <h1 class="clothes-container-box__item__price">{{ prices[indexS] }}$</h1>
          </div>
        </div>
        <div class="clothes-container-summ">
          <h1 class="clothes-container-summ__name">Сумма</h1>
          <h1 class="clothes-container-summ__totalCost">{{ totalPrice }}$</h1>
        </div>
        <div class="clothes-container-buttons">
          <button class="clothes-container-buttons__btn" @click="exit">Отмена</button>
          <button class="clothes-container-buttons__btn clothes-container-buttons__btn_active" @click="buy">Купить</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useUiStore } from '@/stores/ui';
  import gsap from 'gsap';
  
  export default {
    name: 'Clothes',
    setup() {
      const uiStore = useUiStore();
      return { uiStore };
    },
    computed: {
      clothesActive() {
        return this.uiStore.clothesActive;
      },
      totalPrice() {
        return this.selectedStyle !== null ? this.prices[this.selectedStyle] : 0;
      },
    },
    data() {
      return {
        index: 0, // Category index
        indexS: 0, // Style index
        indexC: 0, // Color index
        styles: ['Style-1', 'Style-2'], // Populated via event
        colors: ['1', '2'], // Populated via event
        prices: [9, 99], // Populated via event
        btns: [true, false, false, false, false, false, false, false, false], // Tracks active category
        categories: [
          'Головной убор',
          'Верхняя одежда',
          'Нижняя одежда',
          'Штаны',
          'Обувь',
          'Перчатки',
          'Часы',
          'Очки',
          'Украшения',
        ],
        dropdownOpen: false,
        selectedStyle: null,
        wasHudActive: false, // Tracks HUD state
      };
    },
    mounted() {
        if (window.mp && mp.events) {
            mp.events.add('clothes::show', () => {
                this.showClothes();
            });
            mp.events.add('clothes::setData', (data) => {
                const { styles, colors, prices } = JSON.parse(data);
                this.styles = styles;
                this.colors = colors;
                this.prices = prices;
                this.indexS = 0;
                this.indexC = 0;
                this.selectedStyle = null;
            });
        }
    },
    methods: {
      showClothes() {
        this.wasHudActive = this.uiStore.hudActive;
        this.uiStore.hideHud();
        this.uiStore.showClothesShop();
        this.startAnimation();
      },
      left(type) {
        if (type === 0) { // Style (unused in this HTML)
          this.indexS--;
          if (this.indexS < 0) this.indexS = this.styles.length - 1;

          if(window.mp)
            mp.trigger('clothes', 'style', this.indexS);
        } else { // Color
          this.indexC--;
          if (this.indexC < 0) this.indexC = this.colors.length - 1;

          if(window.mp)
            mp.trigger('clothes', 'color', this.indexC);
        }
      },
      right(type) {
        if (type === 0) { // Style (unused in this HTML)
          this.indexS++;
          if (this.indexS >= this.styles.length) this.indexS = 0;

          if(window.mp)
            mp.trigger('clothes', 'style', this.indexS);
        } else { // Color
          this.indexC++;
          if (this.indexC >= this.colors.length) this.indexC = 0;

          if(window.mp)
            mp.trigger('clothes', 'color', this.indexC);
        }
      },
      selectStyle(indexS) {
        this.selectedStyle = indexS;

        if(window.mp)
            mp.trigger('clothes', 'style', indexS);
      },
      buy() {
        if (this.selectedStyle !== null) {
            if(window.mp)
                mp.trigger('buyClothes');
        }
      },
      exit() {
        this.reset();
        this.uiStore.hideClothesShop();
        if (this.wasHudActive) {
          this.uiStore.showHud();
        }

        if(window.mp)
            mp.trigger('closeClothes');
      },
      reset() {
        this.selectedStyle = null;
        this.indexS = 0;
        this.indexC = 0;
        this.styles = [];
        this.colors = [];
        this.prices = [];
        this.dropdownOpen = false;
      },
      toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
      },
      btn(id) {
        const ind = this.btns.indexOf(true);
        if (ind > -1) this.btns[ind] = false;
        this.btns[id] = true;
        this.index = id;
        this.dropdownOpen = false;

        if(window.mp)
            mp.trigger('clothes', 'cat', id);
        // No need for setTimeout; Vue reactivity handles updates
      },
      startAnimation() {
        const tl_clothes = gsap.timeline();
        tl_clothes
          .from('.clothes-container', 0.5, {
            opacity: 0,
            x: -(this.$el.querySelector('.clothes-container').offsetWidth + 600),
            ease: 'power3.out',
          })
          .staggerFrom(
            [
              '.clothes-container__title',
              '.clothes-container-select',
              '.clothes-container-box-color',
              '.clothes-container-box',
              '.clothes-container-summ',
              '.clothes-container-buttons',
            ],
            0.4,
            { opacity: 0, x: -40, ease: 'power3.out', delay: -0.25 },
            0.065
          );
      },
    },
  };
  </script>
  
  <style scoped>
@import '/customCSS/clothes__custom.css';
  </style>