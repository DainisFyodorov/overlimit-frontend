<template>
    <div>
      <!-- Context Menu -->
      <div v-show="contextActive" :style="contextStyle" class="context">
        <button v-if="type === 'player' && target === 'inventory'" @click="action(0)" class="context__btn">
          <i class="far fa-hand-paper"></i> Использовать
        </button>
        <button v-if="type === 'player' && target !== 'tradeItems' && target !== 'inventory'" @click="action(1)" class="context__btn">
          <i class="fas fa-exchange-alt"></i> Передать
        </button>
        <button v-if="type === 'player' && target === 'inventory'" @click="action(2)" class="context__btn">
          <i class="far fa-trash-alt"></i> Выбросить
        </button>
        <button v-if="type === 'outer' && target !== 'tradeInventory'" @click="action(3)" class="context__btn">
          <i class="far fa-hand-rock"></i> Взять
        </button>
      </div>
  
      <!-- Cursor Drag Info -->
      <div class="cursor-dragInfo">
        <div v-show="active.info" :style="dragStyle" class="item-info">{{ itemName }}</div>
        <div v-show="active.drag" :style="dragStyle" ref="dragging" class="item-drag">
          <img :src="`/img/inventory/items/${dragId}.png`" class="item-drag__img" alt="Dragged Item" />
        </div>
      </div>
  
      <!-- Main Inventory -->
      <div v-show="inventoryActive" @click="hideContext" @mousemove="dropItem" class="inv-bg">
        <div class="inventory">
          <img @click="close" class="close" src="/img/cancel.svg" alt="Close" />
          <h1 class="inventory__title">Инвентарь</h1>
          <div class="inventory__wrapper">
            <div class="person">
              <person-items
                v-for="(item, index) in personItems"
                :key="index"
                :id="item.id"
                :active="item.active"
                :cloth-style="item.cloth_style"
                :index="index"
                @start-drag="startDrag"
                @update-current-pers="updateCurrentPers"
              />
              <img src="/img/inventory/person.png" class="person__img" alt="Person" />
            </div>
            <div class="items">
              <inv-items
                v-for="(item, index) in invItems"
                :key="index"
                :id="item.id"
                :amount="item.amount"
                :active="item.active"
                :cloth-style="item.cloth_style"
                :index="index"
                @start-drag="startDrag"
                @update-current="updateCurrent"
                @end-drag="endDrag"
                @show-context="showContext"
              />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Outer Inventory -->
      <div v-show="outerInventoryActive" @click="hideContext" class="outer-inventory">
        <div class="player-side">
          <img @click="close" class="close" src="/img/cancel.svg" alt="Close" />
          <h1 class="outer-inventory__title">Мой инвентарь</h1>
          <div class="player-side__items">
            <items
              v-for="(item, index) in playerItems"
              :key="index"
              :index="index"
              :id="item.id"
              :amount="item.amount"
              :active="item.active"
              :cloth-style="item.cloth_style"
              from="player"
              @start-drag="startOuterDrag"
              @update-current="updateOuterCurrent"
              @show-context="showOuterContext"
            />
          </div>
        </div>
        <div class="outer-side">
          <h1 class="outer-inventory__title">Внешний инвентарь</h1>
          <div class="outer-side__items">
            <items
              v-for="(item, index) in outerItems"
              :key="index"
              :index="index"
              :id="item.id"
              :amount="item.amount"
              :active="item.active"
              :cloth-style="item.cloth_style"
              from="outer"
              @start-drag="startOuterDrag"
              @update-current="updateOuterCurrent"
              @show-context="showOuterContext"
            />
          </div>
        </div>
      </div>
  
      <!-- Trade Interface -->
      <div v-show="tradeActive" class="trade">
        <img @click="closeTrade" class="close" src="/img/cancel.svg" alt="Close" />
        <div class="trade__wrapper">
          <div class="player-inventory">
            <h1 class="trade__title">Обмен с игроком {{ players.second.name }}</h1>
            <div class="player-slots">
              <player-items-trade
                v-for="(item, index) in playerItems"
                :key="index"
                :index="index"
                :item="item"
                @start-drag="startTradeDrag"
                @update-current="updateTradeCurrent"
                @end-drag="endTradeDrag"
                @show-context="showTradeContext"
              />
            </div>
          </div>
          <div class="offers-slots">
            <div class="offers-slots__player">
              <h1 class="offers-slots__title">
                Мои предлагаемые предметы
                <span
                  :class="players.first.ready ? 'offers-slots__status_ready' : 'offers-slots__status_not-ready'"
                  class="offers-slots__status"
                >
                  {{ players.first.ready ? '(Готов)' : '(Не готов)' }}
                </span>
              </h1>
              <div class="change-slots">
                <first-player-trade
                  v-for="(item, index) in players.first.items"
                  :key="index"
                  :index="index"
                  :item="item"
                  @start-drag="startTradeDrag"
                  @update-current="updateTradeCurrent"
                  @end-drag="endTradeDrag"
                  @show-context="showTradeContext"
                />
              </div>
              <div class="money-transfer">
                <p class="money-transfer__title">Передать деньги:</p>
                <div class="money-transfer__indicate">
                  <input
                    type="text"
                    v-model="players.first.money"
                    @input="giveMoney"
                    :disabled="players.first.ready"
                    class="money-transfer__input"
                  />
                  <p class="money-transfer__currency">$</p>
                </div>
              </div>
            </div>
            <div class="offers-slots__second-player">
              <h1 class="offers-slots__title">
                Предметы игрока {{ players.second.name }}
                <span
                  :class="players.second.ready ? 'offers-slots__status_ready' : 'offers-slots__status_not-ready'"
                  class="offers-slots__status"
                >
                  {{ players.second.ready ? '(Готов)' : '(Не готов)' }}
                </span>
              </h1>
              <div class="change-slots">
                <second-player-trade
                  v-for="(item, index) in players.second.items"
                  :key="index"
                  :index="index"
                  :item="item"
                />
              </div>
              <p class="offers-slots__cash">Деньги: <span>{{ players.second.money }}$</span></p>
            </div>
          </div>
        </div>
        <button class="trade__ready" @click="getReady">
          {{ players.first.ready ? 'Отменить запрос' : 'Готов к обмену' }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { useUiStore } from '@/stores/ui';
  import { itemsData } from '@/data/itemsData';
  import PersonItems from './inventory/PersonItems.vue';
  import InvItems from './inventory/InvItems.vue';
  import Items from './inventory/Items.vue';
  import PlayerItemsTrade from './inventory/PlayerItemsTrade.vue';
  import FirstPlayerTrade from './inventory/FirstPlayerTrade.vue';
  import SecondPlayerTrade from './inventory/SecondPlayerTrade.vue';
  
  export default {
    name: 'Inventory',
    components: {
      PersonItems,
      InvItems,
      Items,
      PlayerItemsTrade,
      FirstPlayerTrade,
      SecondPlayerTrade,
    },
    setup() {
      const uiStore = useUiStore();
      return { uiStore };
    },
    computed: {
      inventoryActive() {
        return this.uiStore.inventoryActive && this.currentScreen === 'inventory';
      },
      outerInventoryActive() {
        return this.uiStore.inventoryActive && this.currentScreen === 'outer-inventory';
      },
      tradeActive() {
        return this.uiStore.inventoryActive && this.currentScreen === 'trade';
      },
      contextActive() {
        return this.uiStore.inventoryActive && this.active.context;
      },
    },
    data() {
      return {
        currentScreen: 'inventory',
        active: {
          context: false,
          info: false,
          drag: false,
        },
        dataTransfer: {
          from: null,
          dragging: false,
          id: 0,
          start: 0,
          end: 0,
          current: null,
          currentPers: null,
        },
        outerDataTransfer: {
          from: null,
          start: null,
          end: null,
          dragging: false,
          current: null,
          id: null,
        },
        tradeDataTransfer: {
          start: 0,
          end: 0,
          id: null,
          from: null,
          current: null,
          dragging: false,
        },
        contextStyle: {},
        dragStyle: {},
        dragId: 0,
        itemName: 'Предмет',
        type: 'player',
        target: 'inventory',
        itemIndex: 0,
        personItems: [
          { id: -12, active: false, cloth_style: null },
          { id: -11, active: false, cloth_style: null },
          { id: -8, active: false, cloth_style: null },
          { id: -4, active: false, cloth_style: null },
          { id: -6, active: false, cloth_style: null },
          { id: -13, active: false, cloth_style: null },
          { id: -14, active: false, cloth_style: null },
          { id: -3, active: false, cloth_style: null },
          { id: -7, active: false, cloth_style: null },
          { id: -1, active: false, cloth_style: null },
        ],
        invItems: Array(30).fill(null).map(() => ({ id: null, amount: 0, active: false, cloth_style: null })),
        invItemsDrag: [],
        playerItems: [],
        outerItems: [],
        dragCopy: [],
        players: {
          first: {
            name: 'Andrew Clover',
            money: '0',
            ready: false,
            items: Array(12).fill(null).map(() => ({ id: null, amount: 1, active: false })),
          },
          second: {
            name: 'Unknown',
            money: 0,
            ready: false,
            items: Array(12).fill(null).map(() => ({ id: null, amount: 1, active: false })),
          },
        },
      };
    },
    methods: {
      // Shared Methods
      hideContext() {
        this.active.context = false;
      },
      dropItem(event) {
        if (!this.uiStore.inventoryActive) {
          this.dataTransfer.dragging = false;
          this.outerDataTransfer.dragging = false;
          this.tradeDataTransfer.dragging = false;
          return;
        }
        if (this.dataTransfer.dragging) {
          this.callCursor('drag', this.dataTransfer.id, event.clientX, event.clientY);
        } else if (this.outerDataTransfer.dragging) {
          this.callCursor('drag', this.outerDataTransfer.id, event.clientX, event.clientY);
        } else if (this.tradeDataTransfer.dragging) {
          this.callCursor('drag', this.tradeDataTransfer.id, event.clientX, event.clientY);
        }
      },
      close() {
        if (window.mp) mp.trigger('inventory::close');
        this.uiStore.hideInventory();
      },
  
      // Main Inventory Drag Logic
      startDrag({ from, index, id }) {
        if (from === 'person' && !this.personItems[index].active) return;
        if (event.button === 2) return;
        this.dataTransfer.from = from;
        this.dataTransfer.start = index;
        this.dataTransfer.id = id;
        this.dataTransfer.dragging = true;
      },
      updateCurrent(index) {
        this.dataTransfer.current = index;
        if (this.invItems[index]?.id) {
          this.callCursor('info', this.invItems[index].id, event.clientX, event.clientY);
        }
      },
      updateCurrentPers(index) {
        this.dataTransfer.currentPers = index;
      },
      endDrag() {
        if (!this.dataTransfer.dragging) return;
        this.invItemsDrag = [...this.invItems];
  
        const { from, start, end, current, currentPers } = this.dataTransfer;
  
        if (from === 'slots' && current !== null) {
          if (window.mp) mp.trigger('inventory::swapItems', start, end);
        } else if (from === 'slots' && currentPers !== null) {
          if (this.invItems[start].id === this.personItems[currentPers].id) {
            if (window.mp) mp.trigger('inventory::useItem', start);
          }
        } else if (from === 'person' && current !== null) {
          if (window.mp) mp.trigger('inventory::unwearClothes', start, current);
        }
  
        this.resetDrag();
      },
      showContext({ x, y, index }) {
        this.callContext(true, x, y, index, 'player', 'inventory');
      },
  
      // Outer Inventory Drag Logic
      startOuterDrag({ from, index, id }) {
        if (event.button === 2) return;
        if (!id) return;
        this.outerDataTransfer.from = from;
        this.outerDataTransfer.start = index;
        this.outerDataTransfer.id = id;
        this.outerDataTransfer.dragging = true;
      },
      updateOuterCurrent({ index, from }) {
        this.outerDataTransfer.current = [index, from];
        this.outerDataTransfer.end = index;
        const items = from === 'player' ? this.playerItems : this.outerItems;
        if (items[index]?.id) {
          this.callCursor('info', items[index].id, event.clientX, event.clientY);
        }
      },
      endOuterDrag() {
        if (!this.outerDataTransfer.dragging) return;
        this.dragCopy = [[...this.playerItems], [...this.outerItems]];
  
        const { from, start, end, current } = this.outerDataTransfer;
  
        if (current && from === current[1]) {
          if (current[1] === 'player') {
            if (window.mp) mp.trigger('inventory::swapItems', start, end);
          } else if (current[1] === 'outer') {
            if (window.mp) mp.trigger('outerInventory::swapItems', start, end);
          }
        } else if (from === 'player' && current?.[1] === 'outer') {
          if (!this.playerItems[start].active && !this.outerItems[end].id) {
            if (window.mp) mp.trigger('outerInventory::transfer', start, end, true);
          }
        } else if (from === 'outer' && current?.[1] === 'player') {
          if (!this.playerItems[end].active) {
            if (window.mp) mp.trigger('outerInventory::transfer', start, end, false);
          }
        }
  
        this.resetOuterDrag();
      },
      showOuterContext({ x, y, from, index }) {
        this.callContext(true, x, y, index, from, 'outerInventory');
      },
  
      // Trade Drag Logic
      startTradeDrag({ from, index, id }) {
        if (this.players.first.ready || event.button === 2 || !id) return;
        this.tradeDataTransfer.from = from;
        this.tradeDataTransfer.start = index;
        this.tradeDataTransfer.id = id;
        this.tradeDataTransfer.dragging = true;
      },
      updateTradeCurrent(from) {
        this.tradeDataTransfer.current = from;
        const items = from === 'trade_inv' ? this.playerItems : this.players.first.items;
        if (items[this.tradeDataTransfer.start]?.id) {
          this.callCursor('info', items[this.tradeDataTransfer.start].id, event.clientX, event.clientY);
        }
      },
      endTradeDrag() {
        if (!this.tradeDataTransfer.dragging) return;
        const { start, end, from, current } = this.tradeDataTransfer;
  
        if (end !== null) {
          if (from === 'trade_inv' && current === 'trade_inv' && start !== end) {
            if (window.mp) mp.trigger('inventory::swapItems', start, end);
          } else if (from === 'trade_offer' && current === 'trade_offer') {
            if (window.mp) mp.trigger('outerInventory::swapItems', start, end);
          } else if (from === 'trade_inv' && current === 'trade_offer') {
            if (!this.playerItems[start].active) {
              if (window.mp) mp.trigger('outerInventory::transfer', start, end, true);
            }
          } else if (from === 'trade_offer' && current === 'trade_inv') {
            if (!this.playerItems[end].active) {
              if (window.mp) mp.trigger('outerInventory::transfer', start, end, false);
            }
          }
        }
  
        this.resetTradeDrag();
      },
      showTradeContext({ x, y, from, index }) {
        if (this.players.first.ready) return;
        this.callContext(true, x, y, index, from === 'trade_inv' ? 'player' : 'outer', from === 'trade_inv' ? 'tradeInventory' : 'tradeItems');
      },
  
      // Reset Drag States
      resetDrag() {
        this.callCursor('disabled', 0, 0, 0);
        this.dataTransfer.dragging = false;
        this.dataTransfer.current = null;
        this.dataTransfer.currentPers = null;
      },
      resetOuterDrag() {
        this.callCursor('disabled', 0, 0, 0);
        this.outerDataTransfer.dragging = false;
        this.outerDataTransfer.current = null;
      },
      resetTradeDrag() {
        this.callCursor('disabled', 0, 0, 0);
        this.tradeDataTransfer.dragging = false;
        this.tradeDataTransfer.current = null;
      },
  
      // Existing Methods (unchanged for brevity)
      setItems(data) {
        for (let i = 0; i < data.length; i++) {
          this.invItems[i] = { ...data[i], id: data[i].id === 0 ? null : data[i].id };
        }
        this.invItems = [...this.invItems];
        this.playerItems = [...this.invItems];
      },
      updateItem(item, itemIndex) {
        this.invItems[itemIndex] = { ...item, id: item.id === 0 ? null : item.id };
        this.invItems = [...this.invItems];
        this.playerItems = [...this.invItems];
      },
      setClothes(clothesList) {
        for (let i = 0; i < clothesList.length; i++) {
          this.personItems[i].active = clothesList[i].active;
          this.personItems[i].cloth_style = clothesList[i].cloth_style;
        }
      },
      setStockItems(data) {
        this.outerItems = data.map(item => ({ ...item, id: item.id === 0 ? null : item.id }));
        this.playerItems = [...this.invItems];
        this.currentScreen = 'outer-inventory';
      },
      updateOuterItem(item, itemIndex) {
        this.outerItems[itemIndex] = { ...item, id: item.id === 0 ? null : item.id };
        this.outerItems = [...this.outerItems];
      },
      openTransfer(offerName) {
        this.currentScreen = 'trade';
        this.playerItems = [...this.invItems];
        this.players.first.name = '';
        this.players.second.name = offerName;
        this.players.first.money = '0';
        this.players.second.money = 0;
        this.players.first.ready = false;
        this.players.second.ready = false;
        this.players.first.items = Array(12).fill(null).map(() => ({ id: null, amount: 1, active: false }));
        this.players.second.items = Array(12).fill(null).map(() => ({ id: null, amount: 1, active: false }));
      },
      giveMoney() {
        let money = this.players.first.money.replace(/\D/g, '');
        money = Math.abs(parseInt(money) || 0);
        if (money >= 100000) money = 100000;
        this.players.first.money = money.toString();
        if (window.mp) mp.trigger('trade::giveMoney', this.players.first.money);
      },
      getReady() {
        this.active.context = false;
        if (window.mp) mp.trigger('trade::getReady', !this.players.first.ready);
      },
      closeTrade() {
        if (this.players.first.ready) return;
        this.currentScreen = 'inventory';
        if (window.mp) mp.trigger('inventory::close');
        this.uiStore.hideInventory();
      },
      updateTradeItem(item, itemIndex) {
        this.players.first.items[itemIndex] = { ...item, id: item.id === 0 ? null : item.id };
        this.players.first.items = [...this.players.first.items];
      },
      updateSuggestedItem(item, itemIndex) {
        this.players.second.items[itemIndex] = { ...item, id: item.id === 0 ? null : item.id };
        this.players.second.items = [...this.players.second.items];
      },
      updateMoney(moneyCount) {
        this.players.second.money = moneyCount;
      },
      updateReadyStatus(isReady) {
        this.players.second.ready = isReady;
      },
      updateReady(isReady) {
        this.players.first.ready = isReady;
      },
      callCursor(type, id, posX, posY) {
        if (type === 'drag') this.active.context = false;
        else if (this.active.context) return;
  
        this.active.info = type === 'info';
        this.active.drag = type === 'drag';
        if (type === 'disabled') {
          this.active.info = false;
          this.active.drag = false;
        }
  
        this.dragId = id;
        this.itemName = this.getItemName(id);
        this.dragStyle = { left: `${posX}px`, top: `${posY}px` };
      },
      callContext(active, posX, posY, index, type, target) {
        document.oncontextmenu = () => false;
        this.active.context = active;
        this.itemIndex = index;
        this.type = type;
        this.target = target;
        this.contextStyle = { left: `${posX}px`, top: `${posY}px` };
      },
      action(act) {
        if (this.outerInventoryActive) {
          this.dragCopy = [[...this.playerItems], [...this.outerItems]];
          if (act === 1) {
            if (this.playerItems[this.itemIndex].active) return (this.active.context = false);
            for (let i = 0; i < this.dragCopy[1].length; i++) {
              if (!this.dragCopy[1][i].id) {
                if (window.mp) mp.trigger('outerInventory::transfer', this.itemIndex, i, true);
                break;
              }
            }
          }
          if (act === 3) {
            for (let i = 0; i < this.dragCopy[0].length; i++) {
              if (!this.dragCopy[0][i].id) {
                if (window.mp) mp.trigger('outerInventory::transfer', this.itemIndex, i, false);
                break;
              }
            }
          }
        }
        if (this.tradeActive) {
          // Add trade context actions here if needed
        }
        if (act === 0) {
          if (window.mp) mp.trigger('inventory::useItem', this.itemIndex);
        } else if (act === 2) {
          if (window.mp) mp.trigger('inventory::dropItem', this.itemIndex);
        }
        this.active.context = false;
      },
      getItemName(id) {
        return itemsData[id] || 'Неизвестный предмет';
      },
    },
    mounted() {
      if (window.mp && mp.events) {
        mp.events.add('inventory::setItems', (data) => this.setItems(JSON.parse(data)));
        mp.events.add('inventory::updateItem', (item, index) => this.updateItem(JSON.parse(item), index));
        mp.events.add('inventory::setClothes', (clothes) => this.setClothes(JSON.parse(clothes)));
        mp.events.add('inventory::setStockItems', (data) => this.setStockItems(JSON.parse(data)));
        mp.events.add('inventory::updateOuterItem', (item, index) => this.updateOuterItem(JSON.parse(item), index));
        mp.events.add('inventory::openTransfer', (offerName) => this.openTransfer(offerName));
        mp.events.add('trade::updateItem', (item, index) => this.updateTradeItem(JSON.parse(item), index));
        mp.events.add('trade::updateSuggestedItem', (item, index) => this.updateSuggestedItem(JSON.parse(item), index));
        mp.events.add('trade::updateMoney', (money) => this.updateMoney(money));
        mp.events.add('trade::updateReadyStatus', (isReady) => this.updateReadyStatus(isReady));
        mp.events.add('trade::updateReady', (isReady) => this.updateReady(isReady));
        mp.events.add('inventory::show', () => this.uiStore.showInventory());
      }
      // Global mouseup listener for outer and trade drag completion
      window.addEventListener('mouseup', () => {
        if (this.outerInventoryActive) this.endOuterDrag();
        if (this.tradeActive) this.endTradeDrag();
      });
    },
  };
  </script>
  
  <style scoped>
  @import '/css/inventory/style.css';
  </style>