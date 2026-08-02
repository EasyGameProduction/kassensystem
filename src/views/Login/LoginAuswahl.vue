<template>
  <div class="login-auswahl">
    <img class="icon" src="@/assets/logo.png">
    <div class="content">
      <h1>Kassensystem</h1>
      <p>Einfache Abwicklung von Bestellungen</p>

      <button class="login" @click="this.$emit('login')">Einloggen</button>
      <button class="register" @click="this.$emit('register')">Registrieren</button>

      <!--<a class="guest" @click="this.testuserLogin()">Als Gast fortfahren</a>-->
    </div>
  </div>
</template>
  
<script>
import Swal from 'sweetalert2';

export default {
    name: 'LoginAuswahl',
    components: {
    },
    data() {
      return{

      }
    },
    created() {
        //this.getUser('sebastianpfuelb@gmail.com');
    },
    methods: {
        async testuserLogin(){
              await Swal.fire(
                  'Gastzugang',
                  'Im Gastzugang haben Sie verminderte Rechte. Sie sind keiner Feuerwehr zugeordnet und sehen somit keine Hydranten/Leitungen',
                  'info'
              )

            var path = '/home/:test';
            this.$router.push({ path: path });
        },
    },
    async created(){

    }
}
</script>

<style lang="scss" scoped>
.login-auswahl {
  min-height: 100vh;
  width: 100vw;
  display: flex;

  background-image: 
    linear-gradient(
      to top,
      rgba(255, 255, 255, 1) 53%,
      rgba(255, 255, 255, 0.6) 80%,
      rgba(255, 255, 255, 0.2) 100%
    );

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.icon{
    height: 4rem;
    display: block;
    position:fixed;
    right: 1rem;
    top: 1rem;
    z-index: 2;
}

@keyframes contentLoaded{
    from{
        transform: translateY(2rem);
        opacity: 0;
    }
    to{
        transform: translateY(0);
        opacity: 1;
    }
}

.content {
  margin-top: auto; // schiebt Content nach unten
  padding: 2rem;
  width: 100%;
  //max-width: 420px;

  animation: contentLoaded 0.5s ease-out forwards;

  h1 {
    font-size: 1.6rem;
    text-align: left;
  }

  p {
    margin-bottom: 2rem;
    text-align: left;
  }

  button {
    width: 100%;
    margin-bottom: 0.7rem;
  }

  .guest {
    display: block;
    text-align: center;
    margin-top: 3.5rem;
    color: #888;
    cursor: pointer;
  }

  .guest:hover{
    color: black;
  }
}

@media (min-width: 968px) {
  .login-auswahl {
    background-image:
      linear-gradient(
        to right,
        rgba(255, 255, 255, 1) 50%,
        rgba(255, 255, 255, 0.7) 80%,
        rgba(255, 255, 255, 0.2) 100%
      ),
      url("@/assets/loginBG.jpg");

    background-position: right center; // Karte nach rechts schieben
  }

  .content {
    margin: auto 0;
    margin-bottom: 1rem;
    margin-left: 3vw;
    max-width: 30vw;
  }

@keyframes contentLoaded{
    from{
        transform: translateX(-2rem);
        opacity: 0;
    }
    to{
        transform: translateX(0);
        opacity: 1;
    }
}
}

button {
  padding: 0.9rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover{
    transform: scale(1.02);
}

.login {
  background: #0a6ed1;
  color: white;
  border: none;
}

.register {
    color: #0f0f0f;
  background: white;
  border: 1px solid #0f0f0f;
}

</style>
  