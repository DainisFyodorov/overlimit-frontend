<template>
    <div>
      <div class="characterRotation" ref="rotationBlock"></div>
      <div v-if="active" class="characterEditor">
        <div class="character">
          <div class="editor-pers">
            <h1 class="editor-pers__title">Редактор персонажа</h1>
            <ul class="editor-pers__list">
              <li :class="{ 'editor-pers__item_active': currentWindow === 0 }" class="editor-pers__item" @click="changeWindow(0)">
                <p class="editor-pers__name"><i class="far fa-user"></i> Персонаж</p>
              </li>
              <li :class="{ 'editor-pers__item_active': currentWindow === 1 }" class="editor-pers__item" @click="changeWindow(1)">
                <p class="editor-pers__name"><i class="far fa-laugh"></i> Лицо</p>
              </li>
              <li
                v-if="!isSurgery"
                :class="{ 'editor-pers__item_active': currentWindow === 2 }"
                class="editor-pers__item"
                @click="changeWindow(2)"
              >
                <p class="editor-pers__name"><i class="far fa-eye"></i> Внешность</p>
              </li>
            </ul>
            <button class="editor-pers__save" @click="save">Сохранить</button>
          </div>
          <div class="properties">
            <!-- Персонаж Window -->
            <div class="properties__window" v-show="currentWindow === 0">
              <h1 class="properties__title">Персонаж</h1>
              <p class="properties__subtitle">Основные настройки вашего персонажа. Укажите пол, схожесть с родителями, цвет кожи.</p>
              <div class="all-properties">
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Отец:</h1>
                  <div class="set-properties">
                    <list id="father" />
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Мать:</h1>
                  <div class="set-properties">
                    <list id="mother" />
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Пол:</h1>
                  <div class="set-properties">
                    <button
                      :class="{ 'set-properties__btn_active': gender }"
                      class="set-properties__btn"
                      id="gendermale"
                      @click="genderSw(true)"
                    >
                      Мужской
                    </button>
                    <button
                      :class="{ 'set-properties__btn_active': !gender }"
                      class="set-properties__btn"
                      id="genderfemale"
                      @click="genderSw(false)"
                    >
                      Женский
                    </button>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Схожесть:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="similar" type="range" v-model="similar" step="0.1" min="0" max="1.0" @input="updateSlider('similar', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Цвет кожи:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="skin" type="range" v-model="skin" step="0.1" min="0" max="1" @input="updateSlider('skin', $event.target.value)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Лицо Window -->
            <div class="properties__window" v-show="currentWindow === 1">
              <h1 class="properties__title">Лицо</h1>
              <p class="properties__subtitle">Измените лицо, отрегулировав параметры ниже.</p>
              <div class="all-properties">
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Ширина носа:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="noseWidth" type="range" v-model="noseWidth" step="0.1" min="-1" max="1" @input="updateSlider('noseWidth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Высота носа:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="noseHeight" type="range" v-model="noseHeight" step="0.1" min="-1" max="1" @input="updateSlider('noseHeight', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Длина кончика носа:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="noseTipLength" type="range" v-model="noseTipLength" step="0.1" min="-1" max="1" @input="updateSlider('noseTipLength', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Глубина моста носа:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="noseDepth" type="range" v-model="noseDepth" step="0.1" min="-1" max="1" @input="updateSlider('noseDepth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Высота кончика носа:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="noseTipHeight" type="range" v-model="noseTipHeight" step="0.1" min="-1" max="1" @input="updateSlider('noseTipHeight', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Поломаность носа:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="noseBroke" type="range" v-model="noseBroke" step="0.1" min="-1" max="1" @input="updateSlider('noseBroke', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Высота бровей:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="eyebrowHeight" type="range" v-model="eyebrowHeight" step="0.1" min="-1" max="1" @input="updateSlider('eyebrowHeight', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Глубина бровей:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="eyebrowDepth" type="range" v-model="eyebrowDepth" step="0.1" min="-1" max="1" @input="updateSlider('eyebrowDepth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Высота скул:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="cheekboneHeight" type="range" v-model="cheekboneHeight" step="0.1" min="-1" max="1" @input="updateSlider('cheekboneHeight', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Ширина скул:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="cheekboneWidth" type="range" v-model="cheekboneWidth" step="0.1" min="-1" max="1" @input="updateSlider('cheekboneWidth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Глубина щеки:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="cheekDepth" type="range" v-model="cheekDepth" step="0.1" min="-1" max="1" @input="updateSlider('cheekDepth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Размер глаз:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="eyeScale" type="range" v-model="eyeScale" step="0.1" min="-1" max="1" @input="updateSlider('eyeScale', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Толщина губ:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="lipThickness" type="range" v-model="lipThickness" step="0.1" min="-1" max="1" @input="updateSlider('lipThickness', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Ширина челюсти:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="jawWidth" type="range" v-model="jawWidth" step="0.1" min="-1" max="1" @input="updateSlider('jawWidth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Форма челюсти:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="jawShape" type="range" v-model="jawShape" step="0.1" min="-1" max="1" @input="updateSlider('jawShape', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Высота подбородка:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="chinHeight" type="range" v-model="chinHeight" step="0.1" min="-1" max="1" @input="updateSlider('chinHeight', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Глубина подбородка:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="chinDepth" type="range" v-model="chinDepth" step="0.1" min="-1" max="1" @input="updateSlider('chinDepth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Ширина подбородка:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="chinWidth" type="range" v-model="chinWidth" step="0.1" min="-1" max="1" @input="updateSlider('chinWidth', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Подбородочный отступ:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="chinIndent" type="range" v-model="chinIndent" step="0.1" min="-1" max="1" @input="updateSlider('chinIndent', $event.target.value)" />
                    </div>
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Обхват шеи:</h1>
                  <div class="set-properties">
                    <div class="slider">
                      <input id="neck" type="range" v-model="neck" step="0.1" min="-1" max="1" @input="updateSlider('neck', $event.target.value)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Внешность Window -->
            <div class="properties__window" v-show="currentWindow === 2">
              <h1 class="properties__title">Внешность</h1>
              <p class="properties__subtitle">Измените внешность персонажа, указав цвет волос, цвет глаз и т.д</p>
              <div class="all-properties">
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Волосы:</h1>
                  <div class="set-properties">
                    <list id="hairM" v-if="gender" />
                    <list id="hairF" v-if="!gender" />
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Брови:</h1>
                  <div class="set-properties">
                    <list id="eyebrowsM" v-if="gender" />
                    <list id="eyebrowsF" v-if="!gender" />
                  </div>
                </div>
                <div class="all-properties__item" v-if="gender">
                  <h1 class="all-properties__title">Бородка:</h1>
                  <div class="set-properties">
                    <list id="beard" />
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Цвет волос:</h1>
                  <div class="set-properties">
                    <list id="hairColor" />
                  </div>
                </div>
                <div class="all-properties__item">
                  <h1 class="all-properties__title">Цвет глаз:</h1>
                  <div class="set-properties">
                    <list id="eyeColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import List from './List.vue';
  import { useUiStore } from '@/stores/ui';
  import $ from "jquery";
  import "rangeslider.js";
  
  export default {
    name: 'CharacterEditor',
    components: {
      List,
    },
    setup() {
      const uiStore = useUiStore();
      return { uiStore };
    },
    computed: {
      active() {
        return this.uiStore.characterEditorActive;
      },
    },
    data() {
      return {
        gender: true,
        isSurgery: false,
        playAnimation: false,
        currentWindow: 0,
        similar: 0.5,
        skin: 0.5,
        noseWidth: 0,
        noseHeight: 0,
        noseTipLength: 0,
        noseDepth: 0,
        noseTipHeight: 0,
        noseBroke: 0,
        eyebrowHeight: 0,
        eyebrowDepth: 0,
        cheekboneHeight: 0,
        cheekboneWidth: 0,
        cheekDepth: 0,
        eyeScale: 0,
        lipThickness: 0,
        jawWidth: 0,
        jawShape: 0,
        chinHeight: 0,
        chinDepth: 0,
        chinWidth: 0,
        chinIndent: 0,
        neck: 0,
      };
    },
    methods: {
      changeWindow(id) {
        this.currentWindow = id;
      },
      genderSw(type) {
        this.gender = type;
        if (window.mp) {
          mp.trigger('characterGender', type ? 'Male' : 'Female');
        }
      },
      save() {
        if (window.mp) {
          mp.trigger('characterSave');
        }
        this.uiStore.hideCharacterEditor(); // Hide editor after saving
      },
      updateSlider(id, value) {
        if (window.mp) {
          mp.trigger('editorList', id, Number(value));
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        $("input[type='range']").each(function () {
          $(this).rangeslider({
            polyfill: false,
          });
        });
      });

      const rotationBlock = this.$refs.rotationBlock;
      let mouseStartX = 0;
  
      rotationBlock.onmousedown = (e) => {
        mouseStartX = e.clientX;
        rotationBlock.onmousemove = (e) => {
          if (window.mp) {
            mp.trigger('character::rotate', e.pageX - mouseStartX);
          }
          mouseStartX = e.pageX;
        };
      };
  
      rotationBlock.onmouseup = () => (rotationBlock.onmousemove = null);
  
      // For testing: Toggle editor visibility via RAGE:MP event
      if (window.mp && mp.events) {
        mp.events.add('showCharacterEditor', () => this.uiStore.showCharacterEditor());
        mp.events.add('hideCharacterEditor', () => this.uiStore.hideCharacterEditor());
      }
    },
  };
  </script>
  
  <style scoped>
  /* External stylesheets (character.css, etc.) handle styling */
  </style>