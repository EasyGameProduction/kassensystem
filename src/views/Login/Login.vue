<template>
  <div class="login">
    <img class="icon" src="@/assets/logo.png">
    <button class="back fa" @click="this.$emit('back')">&#xf104;</button>
    <h1>Willkommen zurück!</h1>
    <input v-model="email" type="email" id="email" name="email" placeholder="Email eingeben" ref="email">
    <input v-model="password" type="password" id="password" name="password" placeholder="Passwort eingeben" ref="password">
    <!--<div class="forgotPasswordLine">
      <a class="forgotPassword" @click="passwortVergessen()">Passwort vergessen?</a>
    </div>-->
    <button class="loginButton" @click="login()">Einloggen</button>

    <p class="Datenschutzsatz">Durch das Einloggen erklären Sie sich mit den <a class="rechtsLink" @click="$router.push('/datenschutz')">Datenschutzbestimmungen</a> und der Verwendung von Cookies einverstanden.</p>

    <p class="noAccount">Noch kein Account? <a class="noAccountLink" @click="this.$emit('register')">Jetzt registrieren</a></p>
  </div>
</template>
  
<script>
import axios from 'axios';
import {Benutzer} from '@/backend_controller/benutzer.js';
import Swal from 'sweetalert2';

export default {
    name: 'Login',
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
        async login() {
            //const response = Benutzer.get(this.email, this.password);
            this.$emit('tryLogin', {email: this.email, password: this.password});
        },
        async passwortVergessen(){
            Swal.fire({
                title: "Email-Adresse eingeben",
                input: "email",
                showCancelButton: true,
                confirmButtonText: "Weiter",
                preConfirm: (eingabe) => {
                    return eingabe;
                }
            }).then((result) => {
                if(result.isConfirmed){
                    var email = result.value;
                    this.verschickePasswortAendernMail(email);
                }
            });
        },
        async verschickePasswortAendernMail(email){
            if(email == ""){
                return;
            }

            const response = await Benutzer.getWithMail(email);

            if(response != false){
                var subject = 'Passwort zurücksetzen';
                var text = 'Um ihr Passwort zurückzusetzen gehen Sie auf https://feuerwehr-server.org/home/:' + response.konvKey + " und gehen Sie hier auf Einstellungen>Passwort ändern";
                this.sendEmail(subject, text, email);
                Swal.fire(
                    'Email wurde verschickt',
                    'Sie erhalten gleich eine Email mit dem Link zum Ändern des Passworts',
                    'success'
                )
            } else{
                Swal.fire(
                    'Account nicht erreichbar!',
                    'Wiederholen Sie es später nochmal oder probieren Sie es mit einer anderen Email-Adresse!',
                    'error'
                )
                return false;
            }
        },
        async sendEmail(subject, text, to) {
          const emailData = {
              to: to,
              subject: subject,
              text: text
          };

          try {
              const response = await fetch('https://feuerwehr-server.org:5000/send-email', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(emailData)
              });

              if (!response.ok) {
                  const errorText = await response.text(); // Fehlernachricht vom Server lesen
                  console.error('Error sending email:', errorText);
                  throw new Error(`Failed to send email: ${errorText}`);
              }

              console.log('Email sent successfully!');
          } catch (error) {
              console.error('Error in sendEmail:', error);
          }
      },
    },
    async created(){

    }
}
</script>

<style lang="scss" scoped>
h1{
    width: 90vw;
    margin-left: 5vw;
    text-align: center;
}

.login {
  min-height: 100vh;
  width: 100vw;
  background-color: white;
  position: fixed;
  top: 0;
}

.icon{
    height: 4rem;
    display: block;
    position:fixed;
    right: 1rem;
    top: 1rem;
    z-index: 2;
}

.back{
  width: 2.5rem;
  height: 2.5rem;
  border: solid rgb(236, 236, 236) 1px;
  background-color:white;
  border-radius: 8px;
  color: rgb(34, 34, 34);
  position: fixed;
  left: 2rem;
  top: 2rem;
  font-size: 1.5rem;
}

.back:hover{
  transform: scale(1.05);
}

h1{
  margin-top: 7rem;
  width: 90vw;
  margin-left: 5vw;
  margin-bottom: 3.5rem;
}

input{
  display: block;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  margin-bottom: 0.8rem;
  border: solid rgb(236, 236, 236) 1px;
  border-radius: 8px;
  background-color: rgb(248, 248, 248);
}

.forgotPasswordLine{
  display: flex;
  justify-content: right;
}

.forgotPassword{
  text-align: right;
  font-size: smaller;
  cursor: pointer;
}

.loginButton{
  display: block;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  margin-top: 2rem;
  border: solid rgb(236, 236, 236) 1px;
  border-radius: 8px;
  background-color: rgb(0, 0, 0);
  color: white;
}

.loginButton:hover{
  transform: scale(1.02);
}

input, button, .forgotPasswordLine{
  box-sizing: border-box;
  width: 90vw;
  max-width: 25rem;
  margin-left: auto;
  margin-right: auto;
}

.noAccount {
  display: block;
  text-align: center;
  margin-top: 3.5rem;
  color: #888;
  position: absolute;
  bottom: 2rem;
  width: 100vw;
  left: 50%;
  transform: translate(-50%);
}

.noAccountLink, .rechtsLink {
  color: #0a6ed1;
  cursor: pointer;
}

.noAccountLink:hover, .rechtsLink:hover{
  color: #094480;
}

.Datenschutzsatz{
    max-width: 25rem;
    width: 90vw;
    margin-left: auto;
    margin-right: auto;
    font-size: small;
}
</style>
  