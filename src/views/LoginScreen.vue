<template>
  <div class="login-view">
    <transition :name="transitionName">
      <component
        :is="currentView"
        :key="currentView"
        @login="toLogin"
        @register="toRegister"
        @registerBack="toRegisterBack"
        @back="toSelect"
        @tryLogin="tryLogin"
      />
    </transition>
  </div>
</template>

<script>
import LoginAuswahl from './Login/LoginAuswahl.vue'
import Login from './Login/Login.vue';
import Register from './Login/Register.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  components: {
    LoginAuswahl,
    Login,
    Register
  },
  data() {
    return {
      currentView: 'LoginAuswahl',
      transitionName: 'view-slide-forward'
    }
  },
  methods: {
    toLogin() {
      this.transitionName = 'view-slide-forward';
      this.currentView = 'Login'
    },
    tryLogin(loginData){
      console.log(loginData);
      this.$emit('tryLogin', loginData);
    },
    toRegister() {
      this.transitionName = 'view-slide-forward';
      this.currentView = 'Register'
    },
    toRegisterBack(){
      this.transitionName = 'view-slide-back';
      this.currentView = 'Register'
    },  
    toSelect() {
      this.transitionName = 'view-slide-back';
      this.currentView = 'LoginAuswahl'
    }
  },
  async created(){
    const router = useRouter()
  }
}
</script>

<style lang="scss" scoped>
.login-view {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;

  background-image: url("@/assets/loginBG.jpg");
  background-size: cover;
  background-position: center;
}

/* ===== Transition ===== */

/* ===== Forward (wie jetzt) ===== */
.view-slide-forward-enter-active,
.view-slide-forward-leave-active {
  transition: transform 0.8s ease;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.view-slide-forward-leave-to {
  transform: translateY(-100vh);
}

.view-slide-forward-enter-from {
  transform: translateY(100vh);
}

.view-slide-forward-enter-to {
  transform: translateY(0);
}

/* ===== Back (umgekehrt) ===== */
.view-slide-back-enter-active,
.view-slide-back-leave-active {
  transition: transform 0.8s ease;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.view-slide-back-leave-to {
  transform: translateY(100vh);
}

.view-slide-back-enter-from {
  transform: translateY(-100vh);
}

.view-slide-back-enter-to {
  transform: translateY(0);
}

@media (min-width: 968px) {
  /* Forward */
  .view-slide-forward-leave-to {
    transform: translateX(100vw);
  }
  .view-slide-forward-enter-from {
    transform: translateX(-100vw);
  }

  /* Back */
  .view-slide-back-leave-to {
    transform: translateX(-100vw);
  }
  .view-slide-back-enter-from {
    transform: translateX(100vw);
  }
}
</style>