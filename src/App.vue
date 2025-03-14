<template>
  <div id="app">
    <Hud v-if="uiStore.hudActive" />
    <Chat v-if="uiStore.chatActive" />
    <CharacterEditor v-if="uiStore.characterEditorActive" />
    <Auth v-if="uiStore.authActive" />
    <Inventory v-if="uiStore.inventoryActive" />
    <MainMenu v-if="uiStore.mainMenuActive" />
    <Masks v-if="uiStore.masksActive" />
    <Clothes v-if="uiStore.clothesActive" />
  </div>
</template>

<script>
import { useUiStore } from '@/stores/ui';
import Hud from './components/Hud.vue';
import Chat from './components/Chat.vue';
import CharacterEditor from './components/CharacterEditor.vue';
import Auth from './components/Auth.vue';
import Inventory from './components/Inventory.vue';
import MainMenu from './components/MainMenu.vue';
import Masks from './components/shops/Masks.vue';
import Clothes from './components/shops/Clothes.vue';

export default {
  name: 'App',
  components: {
    Hud,
    Chat,
    CharacterEditor,
    Auth,
    Inventory,
    MainMenu,
    Masks,
    Clothes,
  },
  setup() {
    const uiStore = useUiStore();
    return { uiStore };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
