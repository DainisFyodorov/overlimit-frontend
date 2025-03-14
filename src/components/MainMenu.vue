<!-- src/components/MainMenu.vue -->
<template>
    <div v-if="mainMenuActive" class="main-menu_wrapper">
      <div class="main-menu_left">
        <h2 class="main-menu_title">Меню персонажа</h2>
        <div class="main-menu_categories">
          <div class="main-menu_category" @click="changeCategory(0)">Статистика персонажа</div>
          <div class="main-menu_category" @click="changeCategory(1)">Навыки персонажа</div>
          <div class="main-menu_category" @click="changeCategory(2)">Связь с администрацией</div>
          <div class="main-menu_category" @click="changeCategory(3)">Магазин</div>
          <div class="main-menu_category" @click="changeCategory(4)">Помощь по игре</div>
        </div>
      </div>
      <div class="main-menu_right">
        <div class="main-menu_closebtn" @click="close">X</div>
        <div class="main-menu_stats" v-if="category === 0">
          <div class="main-menu_params">
            <h2>Статистика</h2>
            <span class="main-menu_param">Логин: <span class="main-menu_param_info">{{ playerInfo.login }}</span></span>
            <span class="main-menu_param">Уровень: <span class="main-menu_param_info">{{ playerInfo.level }}</span></span>
            <span class="main-menu_param">Игровой опыт: <span class="main-menu_param_info">{{ playerInfo.exp }} / {{ playerInfo.maxExp }}</span></span>
            <span class="main-menu_param">VIP статус: <span class="main-menu_param_info">{{ playerInfo.vipLevel }}</span></span>
            <span class="main-menu_param">Уровень администратора: <span class="main-menu_param_info">{{ playerInfo.adminLevel }}</span></span>
            <span class="main-menu_param">Работа: <span class="main-menu_param_info">{{ playerInfo.job || 'Нет' }}</span></span>
          </div>
        </div>
        <div class="main-menu_stats" v-else-if="category === 1">
          <div class="main-menu_params">
            <h2>Навыки</h2>
            <span class="main-menu_param">Фермер: <span class="main-menu_param_info">{{ playerSkills.farmer }}</span></span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useUiStore } from '@/stores/ui';
  
  export default {
    name: 'MainMenu',
    setup() {
      const uiStore = useUiStore();
      return { uiStore };
    },
    computed: {
      mainMenuActive() {
        return this.uiStore.mainMenuActive;
      },
    },
    data() {
      return {
        category: 0,
        playerInfo: {
          login: 'Moguchiy',
          level: 10,
          exp: 10,
          maxExp: 100,
          vipLevel: 10,
          adminLevel: 10,
          job: null, // Added as optional from original
        },
        playerSkills: {
          farmer: '10 из 100', // Adjusted to match display
        },
      };
    },
    mounted() {
      mp.events.add('mainMenu::setStats', (values) => {
        this.setStats(values);
      });
      mp.events.add('mainMenu::setSkills', (values) => {
        this.setSkills(values);
      });
      mp.events.add('mainMenu::show', () => {
        this.uiStore.showMainMenu();
        this.changeCategory(0); // Default to stats
      });
    },
    methods: {
      setStats(values) {
        this.playerInfo = JSON.parse(values);
      },
      setSkills(values) {
        this.playerSkills = JSON.parse(values);
      },
      updateParam(paramName, paramValue) {
        this.playerInfo[paramName] = paramValue;
      },
      changeCategory(id) {
        if (this.category === id) return;
        if (id === 0) {
          mp.trigger('mainMenu::getUpdateStats');
        } else if (id === 1) {
          mp.trigger('mainMenu::getUpdateSkills');
        }
        this.category = id;
      },
      close() {
        this.uiStore.hideMainMenu();
        mp.trigger('mainMenu::closeMenu');
      },
    },
  };
  </script>
  
  <style scoped>
  @import '/css/main_menu.css';
  </style>