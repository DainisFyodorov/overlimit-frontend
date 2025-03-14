import { defineStore } from "pinia";

export const useUiStore = defineStore('ui', {
    state: () => ({
        // hudActive: true,
        // chatActive: true,
        // characterEditorActive: false,
        // authActive: true,
        // inventoryActive: false,
        // mainMenuActive: false,
        // masksActive: false,
        // clothesActive: false,

        // Debugging:
        hudActive: true,
        chatActive: true,
        characterEditorActive: false,
        authActive: false,
        inventoryActive: false,
        mainMenuActive: false,
        masksActive: false,
        clothesActive: true,
    }),
    actions: {
        showClothesShop() { this.clothesActive = true; },
        hideClothesShop() { this.clothesActive = false; },
        showMasksShop() { this.masksActive = true; },
        hideMasksShop() { this.masksActive = false; },
        showMainMenu() { this.mainMenuActive = true; },
        hideMainMenu() { this.mainMenuActive = false; },
        showInventory() {
            this.inventoryActive = true;
            this.authActive = false;
            this.characterEditorActive = false;
            // HUD and Chat remain active
        },
        hideInventory() {
            this.inventoryActive = false;
        },
        showAuth() {
            this.authActive = true;
            this.hudActive = false;
            this.chatActive = false;
            this.characterEditorActive = false;
            this.inventoryActive = false;
        },
        hideAuth() {
            this.authActive = false;
            this.hudActive = true;
            this.chatActive = true;
            this.characterEditorActive = false;
            this.inventoryActive = false;
          },
          showCharacterEditor() {
            this.characterEditorActive = true;
            this.hudActive = false;
            this.chatActive = false;
            this.authActive = false;
            this.inventoryActive = false;
          },
          hideCharacterEditor() {
            this.characterEditorActive = false;
            this.hudActive = true;
            this.chatActive = true;
            this.authActive = false;
            this.inventoryActive = false;
          },
    },
});