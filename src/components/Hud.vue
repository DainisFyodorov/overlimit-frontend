<template>
    <div id="hud" v-show="active" v-cloak>
      <Icons />
      <Gradients />
      <!-- Hot Keys -->
      <div class="hot-keys" v-if="HUDActive">
        <div class="hot-keys__wrapper">
          <p class="hot-keys__desc"><span class="hot-keys__key">M</span> Меню персонажа</p>
          <p class="hot-keys__desc"><span class="hot-keys__key">I</span> Открыть инвентарь</p>
          <p class="hot-keys__desc"><span class="hot-keys__key"><i class="fas fa-long-arrow-alt-up"></i></span> Достать телефон</p>
          <p class="hot-keys__desc"><span class="hot-keys__key">U</span> Список анимаций</p>
          <p class="hot-keys__desc"><span class="hot-keys__key">B</span> Завести двигатель</p>
          <p class="hot-keys__desc"><span class="hot-keys__key">5</span> Скрыть никнеймы</p>
          <p class="hot-keys__desc"><span class="hot-keys__key">6</span> Включить круиз-контроль</p>
          <p class="hot-keys__desc"><span class="hot-keys__key">F2</span> Отображение курсора мыши</p>
        </div>
        <p class="hot-keys__desc hot-keys__desc_visible"><span class="hot-keys__key">F6</span> Показать список клавиш</p>
      </div>
  
      <!-- Vehicle Section -->
      <div v-if="vehicle.seated && HUDActive" class="vehicle">
        <div v-if="vehicle.type === 'car'" class="car-speedometer">
          <div class="car-speed">
            <div class="car-speed__speed-count">
              <h1 class="car-speed__speed">{{ vehicle.speed }}</h1>
              <p class="car-speed__measure">km/h</p>
            </div>
            <svg class="car-speed-svg">
              <circle cx="50%" cy="50%" r="45%" class="car-speed-svg__circle car-speed-svg__circle_rear"></circle>
              <circle cx="50%" cy="50%" r="45%" :style="{ 'stroke-dashoffset': refreshCarSpeetometer }" class="car-speed-svg__circle car-speed-svg__circle_frontal"></circle>
            </svg>
          </div>
          <div class="car-fuel">
            <div class="car-fuel__fuel-count">
              <img :class="{ 'wink': vehicle.fuel <= 15 }" src="/img/gas-station.svg" class="car-fuel__icon" />
              <p class="car-fuel__fuel">{{ vehicle.fuel }} л.</p>
            </div>
            <svg class="car-fuel-svg">
              <circle cx="50%" cy="50%" r="40%" class="car-fuel-svg__circle car-fuel-svg__circle_rear"></circle>
              <circle cx="50%" cy="50%" r="40%" :style="{ 'stroke-dashoffset': refreshCarFuel }" class="car-fuel-svg__circle car-fuel-svg__circle_frontal"></circle>
            </svg>
          </div>
          <div class="car-panel">
            <div class="car-panel__side car-panel__side_left">
              <img src="/img/car_line.png" class="car-panel__img" />
              <div class="car-panel__states">
                <p :class="{ 'car-panel__state_enabled': vehicle.seatbelt }" class="car-panel__state">seatbelt</p>
                <p :class="{ 'car-panel__state_enabled': vehicle.doorsLock }" class="car-panel__state">lock</p>
              </div>
              <div class="car-panel__elements">
                <svg :class="{ 'orange-light': vehicle.indicator[0] }" id="car-arrow-reversed" class="car-panel__icon-svg">
                  <use xlink:href="#right-arrow"></use>
                </svg>
                <svg :class="{ 'orange-light': vehicle.indicator[1] }" id="car-arrow" class="car-panel__icon-svg">
                  <use xlink:href="#right-arrow"></use>
                </svg>
                <svg id="car-alarm" class="car-panel__icon-svg">
                  <use xlink:href="#hazard"></use>
                </svg>
              </div>
            </div>
            <div class="car-panel__side car-panel__side_right">
              <img src="/img/car_line.png" class="car-panel__img car-panel__img_right" />
              <div class="car-panel__states">
                <p :class="{ 'car-panel__state_enabled': vehicle.engine }" class="car-panel__state">engine</p>
              </div>
              <div class="car-panel__elements">
                <svg :class="{ 'green-light': vehicle.lights[0] }" id="car-light-middle" class="car-panel__icon-svg">
                  <use xlink:href="#low-beam"></use>
                </svg>
                <svg :class="{ 'blue-light': vehicle.lights[1] }" id="car-light-far" class="car-panel__icon-svg">
                  <use xlink:href="#high-beam"></use>
                </svg>
                <svg :class="{ 'red-light': vehicle.isBrake }" id="car-brake" class="car-panel__icon-svg">
                  <use xlink:href="#warning"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
  
        <div v-else ref="vehSpeedometer" class="other-vehicle-speedometer">
          <div class="vehicle-speed">
            <div class="vehicle-speed__count">
              <h1 class="vehicle-speed__speed">{{ vehicle.speed }}</h1>
              <p class="vehicle-speed__measure">KM/H</p>
            </div>
            <svg class="vehicle-speed-svg">
              <circle cx="50%" cy="50%" r="45%" class="vehicle-speed-svg__circle vehicle-speed-svg__circle_rear"></circle>
              <circle cx="50%" cy="50%" r="45%" :style="{ 'stroke-dashoffset': refreshCarSpeetometer }" class="car-speed-svg__circle car-speed-svg__circle_frontal"></circle>
            </svg>
          </div>
          <div class="vehicle-fuel">
            <div class="vehicle-fuel__count">
              <img :class="{ 'wink': vehicle.fuel <= 15 }" src="/img/gas-station.svg" class="vehicle-fuel__icon" />
              <p class="vehicle-fuel__fuel">{{ vehicle.fuel }} л.</p>
            </div>
            <svg class="vehicle-fuel-svg">
              <circle cx="50%" cy="50%" r="45%" class="vehicle-fuel-svg__circle vehicle-fuel-svg__circle_rear"></circle>
              <circle cx="50%" cy="50%" r="45%" :style="{ 'stroke-dashoffset': refreshCarFuel }" class="car-fuel-svg__circle car-fuel-svg__circle_frontal"></circle>
            </svg>
          </div>
        </div>
      </div>
  
      <!-- Logo Info -->
      <div class="logo-info">
        <img src="/img/ol-logo.png" class="logo-info__img" />
        <div class="server-stats">
          <div class="server-stats__block">
            <i class="fas fa-users server-stats__icon"></i>
            <p class="server-stats__text">{{ waterMark.online }} / 1000</p>
          </div>
          <div class="server-stats__block">
            <i class="far fa-user server-stats__icon"></i>
            <p class="server-stats__text">ID: {{ waterMark.playerID }}</p>
          </div>
        </div>
      </div>
  
      <!-- Player Stats -->
      <div class="player-stats" v-if="HUDActive">
        <div class="player-stats__stars">
          <i v-for="(item, index) in player.stars" :key="index" :class="[item ? 'fas fa-star' : 'far fa-star', { 'player-stats__star_active': item }]" class="player-stats__star"></i>
        </div>
        <div class="player-stats__money">
          <p class="player-stats__cash">$ {{ getCash }}</p>
          <p class="player-stats__bank">
            <i class="fas fa-money-check player-stats__icon"></i> ${{ player.bankCash }}
          </p>
        </div>
        <div v-if="player.weapon.bullets > 0" class="player-stats__weapon">
          <svg class="player-stats__bullet-svg">
            <use xlink:href="#bullet"></use>
          </svg>
          <div class="player-stats__bullet-count">{{ player.weapon.bullets }} шт.</div>
        </div>
        <div class="player-mic">
          <div class="player-mic__block">
            <p v-show="!player.mic" class="player-mic__key">B</p>
            <div :class="{ 'player-mic__circle_enabled': player.mic }" class="player-mic__circle">
              <img :src="player.mic ? '/img/mic_enabled.png' : '/img/mic_disabled.png'" class="player-mic__img" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Time Info -->
      <div :class="{ 'time-info_depose': vehicle.type !== 'car' && vehicle.seated }" class="time-info" v-if="HUDActive">
        <div class="time-info__time-wrapper">
          <h1 class="time-info__time">{{ timeInfo.time }}</h1>
          <p class="time-info__date">{{ timeInfo.date }}</p>
        </div>
        <div class="time-circle">
          <div class="time-circle__arrow"></div>
          <div class="time-circle__arrow"></div>
        </div>
      </div>
  
      <!-- Left Side Info -->
      <div class="left-side-info" v-if="HUDActive">
        <div class="player-strave">
          <div class="player-strave__block">
            <p class="player-strave__title">
              <i class="fas fa-tint player-strave__icon"></i> Вода
            </p>
            <div class="player-strave-progress">
              <div :style="{ width: player.strave.water + '%' }" class="player-strave-progress__value player-strave-progress__value_water"></div>
            </div>
          </div>
          <div class="player-strave__block">
            <p class="player-strave__title">
              <i class="fas fa-utensils player-strave__icon"></i> Еда
            </p>
            <div class="player-strave-progress">
              <div :style="{ width: player.strave.eat + '%' }" class="player-strave-progress__value player-strave-progress__value_eat"></div>
            </div>
          </div>
        </div>
        <div class="street-info">
          <i v-if="!street.greenZone" class="fas fa-map-marker-alt street-info__icon"></i>
          <i v-else class="fas fa-shield-alt street-info__icon street-info__icon_green"></i>
          <div class="street-info__block">
            <p :class="{ 'street-info__title_green': street.greenZone }" class="street-info__title">{{ street.zoneName }}</p>
            <p class="street-info__subtitle">{{ street.streetName }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Icons from './Icons.vue';
  import Gradients from './Gradients.vue';

  export default {
    name: 'Hud',
    components: {
        Icons,
        Gradients,
    },
    data() {
      return {
        active: true,
        HUDActive: true,
        player: {
          mic: false,
          cash: 0,
          bankCash: 0,
          stars: [false, false, false, false, false],
          weapon: {
            bullets: 0,
          },
          strave: {
            water: 55,
            eat: 84,
          },
        },
        vehicle: {
          seated: false,
          type: 'car',
          engine: false,
          doorsLock: false,
          seatbelt: false,
          speed: 149,
          maxSpeed: 150,
          fuel: 11,
          maxFuel: 150,
          lights: [0, 0],
          indicator: [0, 0],
          isBrake: false,
        },
        timeInfo: {
          date: '01.01.1990',
          time: '0:00',
        },
        waterMark: {
          playerID: 0,
          online: 0,
        },
        street: {
          greenZone: false,
          zoneName: 'San Chainski Mountain Range',
          streetName: 'Местоположение',
        },
      };
    },
    methods: {
      setPlayerStars(value) {
        this.player.stars.forEach((item, index) => (this.player.stars[index] = false));
        for (let i = 0; i < value; i++) {
          this.player.stars[i] = true;
        }
        this.player.stars.reverse();
      },
    },
    computed: {
      refreshCarSpeetometer() {
        let totalLength, divider;
        if (this.vehicle.type === 'car') {
          totalLength = 606.916;
          divider = 1.56;
        } else {
          totalLength = 825.492;
          divider = 1.47;
        }
  
        let carSpeed = this.vehicle.speed,
          carMaxSpeed = this.vehicle.maxSpeed + 45;
  
        let speedPercent = (carSpeed / carMaxSpeed) * 100,
          lengthPercent = (totalLength / 100) * speedPercent;
  
        if (carSpeed >= carMaxSpeed && this.vehicle.type === 'car') return 217;
        else if (carSpeed >= carMaxSpeed) return 263;
  
        return totalLength - lengthPercent / divider;
      },
      refreshCarFuel() {
        let totalLength, divider;
        if (this.vehicle.type === 'car') {
          totalLength = 188.191;
          divider = 1.3;
        } else {
          totalLength = 276.4;
          divider = 1.28;
        }
  
        let carFuel = this.vehicle.fuel,
          maxFuel = this.vehicle.maxFuel;
  
        let fuelPercent = (carFuel / maxFuel) * 100,
          lengthPercent = (totalLength / 100) * fuelPercent;
  
        if (carFuel >= maxFuel && this.vehicle.type === 'car') return 43;
        else if (carFuel >= maxFuel) return 62;
  
        return totalLength - lengthPercent / divider;
      },
      getCash() {
        return this.player.cash.toLocaleString();
      },
    },
    mounted() {
      // Hotkeys visibility toggle (F6 key, keycode 117)
      const noty = document.querySelector('.noty-main');
      const hotKeys = document.querySelector('.hot-keys__wrapper');
      const hotKeysDesc = document.querySelector('.hot-keys__desc_visible');
  
      document.onkeyup = (e) => {
        if (e.which === 117) {
          if (noty) noty.style.visibility = 'initial';
          if (hotKeys) hotKeys.style.display = 'none';
          if (hotKeysDesc) hotKeysDesc.style.display = 'flex';
        }
      };
  
      document.onkeydown = (e) => {
        if (e.which === 117) {
          if (noty) noty.style.visibility = 'hidden';
          if (hotKeys) hotKeys.style.display = 'initial';
          if (hotKeysDesc) hotKeysDesc.style.display = 'none';
        }
      };
  
      // Real-time date and time update
      setInterval(() => {
        const date = new Date();
        this.timeInfo.date = date.toLocaleDateString('ru');
        this.timeInfo.time = date.toLocaleTimeString('ru').slice(0, -3);
      }, 500);
    },
  };
  </script>
  
  <style scoped>
  /* External hud.css handles styling, so we leave this empty for now */
  </style>