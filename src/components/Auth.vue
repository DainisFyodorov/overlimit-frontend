<template>
    <div>
      <div class="bg">
        <img src="/img/bg.png" class="bg__img" alt="Background" />
      </div>
      <div ref="background" :class="{ 'background_filter': applyFilter }" class="background background_zIndex">
        <img ref="backgroundImage" src="/img/auth-reg__background.png" class="background__image" alt="Auth Background" />
        <div class="background__triangles">
          <img ref="triangle1" src="/img/triangles/t1.png" class="background__triangle" alt="Triangle 1" />
          <img ref="triangle2" src="/img/triangles/t2.png" class="background__triangle" alt="Triangle 2" />
          <img ref="triangle3" src="/img/triangles/t3.png" class="background__triangle" alt="Triangle 3" />
          <img ref="triangle4" src="/img/triangles/t4.png" class="background__triangle" alt="Triangle 4" />
          <img ref="triangle5" src="/img/triangles/t5.png" class="background__triangle" alt="Triangle 5" />
        </div>
      </div>
      <div class="screen">
        <!-- Authorization -->
        <div ref="auth" v-show="authActive" class="auth">
          <div class="auth-form">
            <h1 class="screen__title">Авторизация</h1>
            <p class="screen__subtitle">Уже зарегистрированы на сервере? Введите свои данные ниже, чтобы войти в аккаунт.</p>
            <div class="auth-data">
              <div class="screen__field" :class="{ 'screen__field_active': login }">
                <input type="text" placeholder="Логин или E-mail" v-model.trim="login" class="screen__input" @focus="onFocus" @blur="onBlur" />
                <i class="fas fa-sign-in-alt screen__icon"></i>
              </div>
              <div class="screen__field" :class="{ 'screen__field_active': password }">
                <input type="password" placeholder="Пароль от аккаунта" v-model.trim="password" class="screen__input" @focus="onFocus" @blur="onBlur" />
                <i class="fas fa-lock screen__icon"></i>
              </div>
              <div class="auth-buttons">
                <button :disabled="animating" @click="signIn" class="screen__btn screen__btn_active">Войти в аккаунт</button>
                <button :disabled="animating" @click="create" class="screen__btn">Регистрация</button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Registration -->
        <div ref="register" v-show="registerActive" class="register">
          <div class="register-form">
            <h1 class="screen__title">Регистрация</h1>
            <p class="screen__subtitle">У тебя еще нет аккаунта? Пройди простую регистрацию и начни игру на нашем сервере!</p>
            <div class="register-data">
              <div class="screen__field" :class="{ 'screen__field_active': email }">
                <input type="text" v-model.trim="email" placeholder="E-mail" class="screen__input" @focus="onFocus" @blur="onBlur" />
                <i class="far fa-envelope screen__icon"></i>
              </div>
              <div class="screen__field" :class="{ 'screen__field_active': login }">
                <input type="text" v-model.trim="login" placeholder="Логин" class="screen__input" @focus="onFocus" @blur="onBlur" />
                <i class="far fa-user screen__icon"></i>
              </div>
              <div class="screen__field" :class="{ 'screen__field_active': password }">
                <input type="password" v-model.trim="password" placeholder="Пароль" class="screen__input" @focus="onFocus" @blur="onBlur" />
                <i class="fas fa-lock screen__icon"></i>
              </div>
              <div class="screen__field" :class="{ 'screen__field_active': repeatPassword }">
                <input type="password" v-model.trim="repeatPassword" placeholder="Повторите пароль" class="screen__input" @focus="onFocus" @blur="onBlur" />
                <i class="fas fa-lock screen__icon"></i>
              </div>
              <div class="register-buttons">
                <button :disabled="animating" @click="signUp" class="screen__btn screen__btn_active">Зарегистрироваться</button>
                <button :disabled="animating" @click="goBack" class="screen__btn">Отмена</button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Ban Screen -->
        <div ref="ban" v-show="banActive" class="ban">
          <i class="fa fa-times ban__exit" aria-hidden="true" @click="exit"></i>
          <h1 class="ban__title">Персонаж заблокирован</h1>
          <div class="ban__reason-by">
            <p class="ban__text">Причина: <span>{{ ban.reason }}</span></p>
            <p class="ban__text">Забанил: <span>{{ ban.by }}</span></p>
          </div>
          <hr />
          <div class="ban__unban-time">
            <p class="ban__text">Дата блокировки: <span>{{ time.ban }}</span></p>
            <p class="ban__text">Дата снятия блокировки: <span>{{ time.unban }}</span></p>
          </div>
        </div>
  
        <!-- Personal Data -->
        <div ref="personData" v-show="personDataActive" class="person-data">
          <h1 class="person-data__title">Личные данные</h1>
          <div class="person-data__wrapper">
            <div class="person-data__item">
              <p class="person-data__text">Имя персонажа:</p>
              <input type="text" v-model.trim="name" class="person-data__input" />
            </div>
            <div class="person-data__item">
              <p class="person-data__text">Фамилия персонажа:</p>
              <input type="text" v-model.trim="surname" class="person-data__input" />
            </div>
            <div class="person-data__item">
              <p class="person-data__text">Возраст персонажа:</p>
              <input type="number" v-model="age" class="person-data__input" />
            </div>
          </div>
          <div class="person-data__btns">
            <button :disabled="animating" @click="accept" class="person-data__create person-data__create_active">Создать персонажа</button>
            <button
              v-if="!hideCancel"
              :disabled="animating"
              @click="cancel"
              class="person-data__create person-data__create_cancel"
              ref="cancelData"
            >
              Отмена
            </button>
          </div>
        </div>
  
        <!-- Character Slots -->
        <div ref="slots" v-show="slotsActive" class="slots">
          <div class="slots-list">
            <h1 class="slots-list__title">С возвращением, {{ playerLogin }}!</h1>
            <p class="slots-list__subtitle">Выбери персонажа, за которого будешь играть</p>
            <div class="list">
              <div
                v-for="(item, index) in characters"
                :key="index"
                :class="{ 'list__item_active': item.active }"
                @click="selectCharacter(index)"
                class="list__item"
              >
                <div v-if="item.employed === 0" class="list__not-employed">
                  <i class="fas fa-user-plus list__icon"></i>
                  <h1 class="list__not-employed-title">Слот №{{ index + 1 }}</h1>
                  <p class="list__not-employed-subtitle">Нет персонажа</p>
                </div>
                <div v-else-if="item.employed === -1" class="list__not-employed">
                  <i class="fas fa-user-lock list__icon"></i>
                  <h1 class="list__not-employed-title">Слот №{{ index + 1 }}</h1>
                  <p class="list__not-employed-subtitle">Не приобретён</p>
                </div>
                <div v-else class="list__active">
                  <h1 class="list__person-name"><span>{{ stats[index].name }}</span></h1>
                  <h1 class="list__number-middle">{{ index + 1 }}</h1>
                  <h1 class="list__number-top"># {{ index + 1 }}</h1>
                  <img :src="`/img/person_${index}.png`" class="list__person" :alt="'Person ' + index" />
                  <img :src="`/img/gradient_wave.png`" :class="`list__gradient-wave_${index}`" class="list__gradient-wave" alt="Gradient Wave" />
                </div>
              </div>
            </div>
          </div>
          <div :style="{ background: `url(/img/person_stats_${selectedSlot}.png) center/cover, rgba(0,0,0,0.85)` }" class="slots-stats">
            <div class="main-stats">
              <div class="main-stats__lvl-name">
                <h1 :class="[stats[selectedSlot].name.length > 18 ? 'main-stats__name_small' : '', 'main-stats__name']">
                  {{ stats[selectedSlot].name }}
                </h1>
                <div class="main-stats__lvl-and-delete">
                  <p class="main-stats__lvl">{{ stats[selectedSlot].lvl }} уровень</p>
                  <i class="far fa-trash-alt" @click="deletePers"></i>
                </div>
              </div>
              <div class="main-stats__exp">
                <div class="main-stats__svg-wrapper">
                  <p class="main-stats__exp-count">{{ stats[selectedSlot].exp[0] }} / {{ stats[selectedSlot].exp[1] }}</p>
                  <svg class="circle-exp">
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke-width="3" class="circle-exp__circle circle-exp__circle_back"></circle>
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke-width="2.8"
                      :style="{ 'stroke-dasharray': 220, 'stroke-dashoffset': 220 - (220 / stats[selectedSlot].exp[1] * stats[selectedSlot].exp[0]) }"
                      class="circle-exp__circle"
                    ></circle>
                  </svg>
                </div>
                <p class="main-stats__bottom-text">EXP</p>
              </div>
            </div>
            <hr />
            <div class="player-stats">
              <div class="player-stats__item">
                <p class="player-stats__text">Последний вход:</p>
                <p class="player-stats__text player-stats__text_bold">{{ stats[selectedSlot].lastSign }}</p>
              </div>
              <div class="player-stats__item">
                <p class="player-stats__text">Фракция:</p>
                <p class="player-stats__text player-stats__text_bold">{{ stats[selectedSlot].fraction || 'Отсутствует' }}</p>
              </div>
              <div class="player-stats__item">
                <p class="player-stats__text">Должность:</p>
                <p class="player-stats__text player-stats__text_bold">{{ stats[selectedSlot].post || 'Отсутствует' }}</p>
              </div>
              <div class="player-stats__item">
                <p class="player-stats__text">Деньги на руках:</p>
                <p class="player-stats__text player-stats__text_bold">{{ stats[selectedSlot].cash }}$</p>
              </div>
              <div class="player-stats__item">
                <p class="player-stats__text">Деньги на счету:</p>
                <p class="player-stats__text player-stats__text_bold">{{ stats[selectedSlot].bill }}$</p>
              </div>
            </div>
            <button :disabled="animating" @click="useCharacter" class="slots-stats__play">Играть</button>
          </div>
        </div>
  
        <!-- Spawn Selection -->
        <div ref="spawn" v-show="spawnActive" class="spawn">
          <div class="spawn__item" ref="spawnItem1">
            <i class="fas fa-map-marker-alt spawn__icon"></i>
            <h1 class="spawn__title">Точка последнего выхода</h1>
            <p class="spawn__subtitle">Вы появитесь в той точке, где последний раз вышли из игры.</p>
            <button :disabled="animating" @click="spawnCharacter(0)" class="spawn__btn">Выбрать</button>
          </div>
          <div class="spawn__item" ref="spawnItem2">
            <i class="fas fa-globe spawn__icon"></i>
            <h1 class="spawn__title">Территория вашей фракции</h1>
            <p class="spawn__subtitle">Вы появитесь на территории вашей фракции.</p>
            <button :disabled="animating" @click="spawnCharacter(1)" class="spawn__btn">Выбрать</button>
          </div>
          <div class="spawn__item" ref="spawnItem3">
            <i class="fas fa-home spawn__icon"></i>
            <h1 class="spawn__title">Территория вашего дома</h1>
            <p class="spawn__subtitle">Вы появитесь на территории вашего дома.</p>
            <button :disabled="animating" @click="spawnCharacter(2)" class="spawn__btn">Выбрать</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useUiStore } from '@/stores/ui';
  import gsap from 'gsap';
  
  export default {
    name: 'Auth',
    setup() {
      const uiStore = useUiStore();
      return { uiStore };
    },
    computed: {
      authActive() {
        return this.uiStore.authActive && this.currentScreen === 'auth';
      },
      registerActive() {
        return this.uiStore.authActive && this.currentScreen === 'register';
      },
      banActive() {
        return this.uiStore.authActive && this.currentScreen === 'ban';
      },
      personDataActive() {
        return this.uiStore.authActive && this.currentScreen === 'person-data';
      },
      slotsActive() {
        return this.uiStore.authActive && this.currentScreen === 'slots';
      },
      spawnActive() {
        return this.uiStore.authActive && this.currentScreen === 'spawn';
      },
    },
    data() {
      return {
        currentScreen: 'auth',
        login: '',
        password: '',
        email: '',
        repeatPassword: '',
        name: '',
        surname: '',
        age: '',
        playerLogin: 'login',
        selectedSlot: 0,
        animCompleted: false,
        animating: false,
        hideCancel: false,
        slotID: 0,
        applyFilter: false,
        characters: [
          { employed: 1, active: true },
          { employed: 0, active: false },
          { employed: -1, active: false },
        ],
        stats: [
          {
            name: 'Имя Фамилия',
            lvl: 0,
            exp: [0, 0],
            lastSign: '00.00.0000',
            fraction: false,
            post: false,
            cash: 0,
            bill: 0,
          },
          {
            name: 'Имя Фамилия',
            lvl: 0,
            exp: [0, 0],
            lastSign: '00.00.0000',
            fraction: false,
            post: false,
            cash: 0,
            bill: 0,
          },
          {
            name: 'Имя Фамилия',
            lvl: 0,
            exp: [0, 0],
            lastSign: '00.00.0000',
            fraction: false,
            post: false,
            cash: 0,
            bill: 0,
          },
        ],
        ban: { reason: '', by: '' },
        time: { ban: '00.00.0000', unban: '00.00.0000' },
        spawnStatus: [false, false, false],
      };
    },
    methods: {
      // Animation Methods
      authAnimation() {
        const tl = gsap.timeline();
        tl.to(this.$refs.backgroundImage, { duration: 1.25, opacity: 1, scale: 1, ease: 'power2.inOut' }, 0.1)
          .from(this.$refs.auth, { duration: 1.25, opacity: 0, top: '100%', ease: 'power4.inOut' }, '-=1.15')
          .staggerTo(
            [this.$refs.triangle1, this.$refs.triangle2, this.$refs.triangle3, this.$refs.triangle4, this.$refs.triangle5],
            0.5,
            { opacity: 1, ease: 'power2.out' },
            0.3 / 5,
            '-=0.7'
          );
      },
      loginToReg() {
        this.animating = true;
        const tl = gsap.timeline({
          onComplete: () => {
            this.currentScreen = 'register';
            this.animating = false;
          },
        });
        tl.to(this.$refs.auth, { duration: 1, opacity: 0, x: '-80%', ease: 'power3.inOut' })
          .to(this.$refs.backgroundImage, { duration: 1.15, scale: 1.25, ease: 'power2.inOut' }, '-=0.75')
          .from(this.$refs.register, { duration: 1.1, opacity: 0, x: '80%', ease: 'power2.inOut' }, '-=1');
      },
      regToLogin() {
        this.animating = true;
        const tl = gsap.timeline({
        onComplete: () => {
            this.currentScreen = 'auth';
            this.animating = false;
            gsap.set(this.$refs.auth, { clearProps: 'all' }); // Reset GSAP styles to avoid conflicts with v-show
        },
        });
        tl.to(this.$refs.register, { duration: 1, opacity: 0, x: '80%', ease: 'power3.inOut' })
        .to(this.$refs.backgroundImage, { duration: 1.15, scale: 1, ease: 'power2.inOut' }, '-=0.75')
        .to(this.$refs.auth, { duration: 1, opacity: 1, x: '0%', ease: 'power2.inOut' }, '-=1');
      },
      regOrLogin(wType, personStats) {
        this.animating = true;
        const tl = gsap.timeline({
          onComplete: () => {
            this.applyFilter = true;
            if (wType === 'register') this.currentScreen = 'person-data';
            else if (personStats) this.currentScreen = 'person-data';
            else this.currentScreen = 'slots';
            this.animating = false;
            if (this.currentScreen === 'slots') this.animCompleted = true;
          },
        });
        const triangles = [this.$refs.triangle1, this.$refs.triangle2, this.$refs.triangle3, this.$refs.triangle4, this.$refs.triangle5];
        tl.staggerTo(triangles, 0.65, { opacity: 0, x: '-145%', rotate: 35, ease: 'power3.inOut' }, 0.2 / 5)
          .to(wType === 'register' ? this.$refs.register : this.$refs.auth, { duration: 0.9, opacity: 0, x: '-80%', ease: 'power3.inOut' }, '-=0.62')
          .to(this.$refs.backgroundImage, { duration: 0.4, opacity: 0, ease: 'power2.out' }, '-=0.2')
          .to(this.$refs.background, { duration: 0.7, background: 'rgba(0,0,0,0)', ease: 'power2.inOut' }, '-=0.4');
  
        if (wType === 'register' || personStats) {
          tl.from(this.$refs.personData, { duration: 1.1, opacity: 0, x: '120%', ease: 'power3.out' }, '-=0.1');
        } else {
          tl.from(this.$refs.slots, { duration: 1.1, opacity: 0, x: '120%', ease: 'power3.out' }, '-=0.1');
        }
      },
      goToSpawn() {
        this.animating = true;
        const tl = gsap.timeline({
          onComplete: () => {
            this.currentScreen = 'spawn';
            this.animating = false;
          },
        });
        tl.to(this.$refs.slots, { duration: 0.85, opacity: 0, y: '-180%', ease: 'power3.inOut' }).staggerFrom(
          [this.$refs.spawnItem1, this.$refs.spawnItem2, this.$refs.spawnItem3],
          0.9,
          { opacity: 0, y: '120%', ease: 'power4.out' },
          0.12
        );
      },
      handleTriangleMovement(event) {
        const x = event.clientX;
        const y = event.clientY;
        const pos = [100, 35, 95, 80, 50];
        const triangles = [this.$refs.triangle1, this.$refs.triangle2, this.$refs.triangle3, this.$refs.triangle4, this.$refs.triangle5];
        const initialScale = gsap.getProperty(triangles[0], 'scale') || 1;
        triangles.forEach((triangle, index) => {
          gsap.to(triangle, {
            x: -x / pos[index],
            y: -y / pos[index],
            scale: initialScale,
            duration: 0,
          });
        });
      },
      onFocus(event) {
        event.target.parentNode.classList.add('screen__field_active');
      },
      onBlur(event) {
        if (!event.target.value) event.target.parentNode.classList.remove('screen__field_active');
      },
  
      // Auth Methods
      signIn() {
        if (this.animating) return;
        if (this.login.length < 6 || this.password.length < 6) {
          if (window.mp) mp.trigger('auth::notify', 4, 9, 'Укажите корректные данные для входа', 3000);
          return;
        }
        if (window.mp) mp.trigger('auth::signin', this.login, this.password);
      },
      create() {
        if (this.animating) return;
        this.loginToReg();
      },
  
      // Register Methods
      signUp() {
        if (this.animating) return;
        if (this.email.length < 6) {
          if (window.mp) mp.trigger('auth::notify', 4, 9, 'Укажите корректный адрес электронной почты', 3000);
          return;
        }
        if (this.login.length < 5 || this.login.length > 32) {
          if (window.mp) mp.trigger('auth::notify', 4, 9, 'Длина логина должна быть от 5 символов до 32 символов', 3000);
          return;
        }
        if (!/^[a-zA-Z1-9]*$/.test(this.login)) {
          if (window.mp) mp.trigger('auth::notify', 4, 9, 'Укажите корректный логин', 3000);
          return;
        }
        if (this.password.length < 6 || this.password.length > 64) {
          if (window.mp) mp.trigger('auth::notify', 4, 9, 'Длина пароля должна быть от 6 символов до 64 символов', 3000);
          return;
        }
        if (this.password !== this.repeatPassword) {
          if (window.mp) mp.trigger('auth::notify', 4, 9, 'Введённые пароли не совпадают', 3000);
          return;
        }
        if (window.mp) mp.trigger('auth::signup', this.email, this.login, this.password);
      },
      goBack() {
        if (this.animating) return;
        this.regToLogin();
      },
  
      // Ban Methods
      setBan(banInfo) {
        const parsedBan = JSON.parse(banInfo);
        this.ban.reason = parsedBan.Reason;
        this.ban.by = parsedBan.ByAdmin;
        this.time.ban = new Date(parsedBan.Time).toLocaleDateString();
        this.time.unban = new Date(parsedBan.Until).toLocaleDateString();
        this.currentScreen = 'ban'; // No animation specified
      },
      exit() {
        this.currentScreen = 'slots'; // No animation specified
      },
  
      // Person Data Methods
      showPersonData(slotID) {
        this.name = '';
        this.surname = '';
        this.age = '';
        this.slotID = slotID;
        this.hideCancel = this.registerActive;
        if (this.currentScreen === 'register') this.regOrLogin('register');
        else if (
          this.stats[0].name === 'Имя Фамилия' &&
          this.stats[1].name === 'Имя Фамилия' &&
          this.stats[2].name === 'Имя Фамилия'
        ) {
          this.regOrLogin('auth', true);
        } else this.currentScreen = 'person-data'; // Direct transition if not from auth/register
      },
      accept() {
        if (this.animating) return;
        if (!/^[a-zA-Z]*$/.test(this.name) || !/^[a-zA-Z]*$/.test(this.surname)) {
          if (window.mp) mp.trigger('auth::notify', 1, 9, 'Укажите корректные имя и фамилия персонажа', 3000);
          return;
        }
        if (this.name.length < 4 || this.name.length > 15) {
          if (window.mp) mp.trigger('auth::notify', 1, 9, 'Длина имени персонажа должна быть от 4 до 15 символов', 3000);
          return;
        }
        if (this.surname.length < 3 || this.surname.length > 15) {
          if (window.mp) mp.trigger('auth::notify', 1, 9, 'Длина фамилии персонажа должна быть от 3 до 15 символов', 3000);
          return;
        }
        if (this.age < 18 || this.age > 30) {
          if (window.mp) mp.trigger('auth::notify', 1, 9, 'Допустимый возраст персонажа от 18 до 30 лет', 3000);
          return;
        }
        if (window.mp) mp.trigger('auth::characterCreator', this.name, this.surname, this.age, this.slotID);
      },
      cancel() {
        if (this.animating) return;
        this.currentScreen = 'slots';
      },
  
      // Slots Methods
      showSlots(login, characterDatas) {
        this.playerLogin = login;
        const parsedData = JSON.parse(characterDatas);
        for (let i = 0; i < 3; i++) {
          if (parsedData[i] == null) {
            this.characters[i].employed = 0;
          } else if (parsedData[i] === -1) {
            this.characters[i].employed = -1;
          } else {
            this.characters[i].employed = 1;
            this.stats[i].name = parsedData[i].characterName;
            this.stats[i].lastSign = new Date(parsedData[i].characterLastLogin).toLocaleDateString();
            this.stats[i].lvl = parsedData[i].characterLevel;
            this.stats[i].exp = [parsedData[i].characterExp, 3 + parsedData[i].characterLevel * 3];
            this.stats[i].fraction = parsedData[i].characterFaction;
            this.stats[i].post = parsedData[i].characterRank;
            this.stats[i].cash = parsedData[i].characterMoney;
            this.stats[i].bill = parsedData[i].characterBank;
          }
        }
        this.regOrLogin('auth');
      },
      selectCharacter(i) {
        if (this.animating) return;
        if (this.characters[i].employed === 0) {
          if (!this.animCompleted) return;
          this.showPersonData(i);
        } else if (this.characters[i].employed === 1) {
          this.characters.forEach((item, index) => (item.active = index === i));
          this.selectedSlot = i;
        }
      },
      deletePers() {
        if (this.animating) return;
        if (window.mp) mp.trigger('auth::deleteCharacter', this.selectedSlot);
      },
      clearSlot(slotID) {
        if (slotID === 0) {
          this.stats[0].name = 'Имя Фамилия';
          this.showPersonData(0);
        } else {
          this.characters[slotID].employed = 0;
          this.selectCharacter(0);
        }
      },
      useCharacter() {
        if (this.animating) return;
        this.goToSpawn();
        if (window.mp) mp.trigger('auth::selectCharacter', this.selectedSlot);
      },
  
      // Spawn Methods
      showSpawn(spawnData) {
        const parsedSpawn = JSON.parse(spawnData);
        this.spawnStatus = [parsedSpawn[0], parsedSpawn[1], parsedSpawn[2]];
        this.goToSpawn();
      },
      spawnCharacter(spawnID) {
        if (this.animating) return;
        if (!this.spawnStatus[spawnID]) {
          if (window.mp) mp.trigger('auth::notify', 4, 9, 'Вам недоступна данная точка спавна', 3000);
          return;
        }
        if (window.mp) {
          mp.trigger('auth::spawnCharacter', spawnID);
          this.uiStore.hideAuth();
        }
      },
    },
    mounted() {
      this.$refs.background.classList.remove('background_zIndex');
      this.authAnimation();
      window.addEventListener('mousemove', this.handleTriangleMovement);

      // Ensure initial state for auth is reset
      gsap.set(this.$refs.auth, { opacity: 1, x: '0%' });
  
      if (window.mp && mp.events) {
        mp.events.add('auth::showSlots', (login, characterDatas) => this.showSlots(login, characterDatas));
        mp.events.add('auth::setBan', (banInfo) => this.setBan(banInfo));
        mp.events.add('auth::showSpawn', (spawnData) => this.showSpawn(spawnData));
        mp.events.add('auth::clearSlot', (slotID) => this.clearSlot(slotID));
      }
    },
    beforeUnmount() {
      window.removeEventListener('mousemove', this.handleTriangleMovement);
    },
  };
  </script>
  
  <style scoped>
  /* External stylesheets (style.css, theme.css, etc.) handle styling */
  .background_filter {
    filter: none; /* Adjust if filter is needed */
  }
  </style>