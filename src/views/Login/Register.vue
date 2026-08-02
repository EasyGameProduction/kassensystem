<template>
  <div class="register">
    <img class="logo" src="@/assets/logo.png">
    <button class="back fa" @click="this.$emit('back')">&#xf104;</button>
    <h1>Willkommen!</h1>
    <input v-model="firstname" ref="firstname" type="text" id="firstname" name="firstname" placeholder="Vorname">
    <input v-model="lastname" ref="lastname" type="text" id="lastname" name="lastname" placeholder="Nachname">
    <input v-model="email" ref="email" type="email" id="email" name="email" placeholder="Email">
    <input v-model="password" ref="password" type="password" id="password" name="password" placeholder="Passwort">
    <input v-model="passwordWdh" ref="passwordWdh" type="password" id="passwordWdh" name="passwordWdh" placeholder="Passwort wiederholen">

    <button class="registerButton" @click="register()">Registrieren</button>

    <p class="Datenschutzsatz">Durch das Registrieren erklären Sie sich mit den <a class="rechtsLink" @click="$router.push('/datenschutz')">Datenschutzbestimmungen</a> und der Verwendung von Cookies einverstanden.</p>
    <!-- Verbraucht zu viel Platz und steht sonst über dem Datenschutzsatz
    <p class="hasAccount">Sie haben einen Account? <a class="hasAccountLink" @click="this.$emit('login')">Jetzt anmelden</a></p>-->
  </div>
</template>
  
<script>
import axios from 'axios';
import CryptopJS from 'crypto-js';
import Swal from 'sweetalert2';
import {Benutzer} from '@/backend_controller/benutzer.js';

export default {
    name: 'Register',
    components: {
    },
    data() {
      return{
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwordWdh: ''
      }
    },
    methods: {
        register(){
            if(this.password !== this.passwordWdh){
                Swal.fire("Passwortfehler", "Passwörter sind ungleich!", "error");
                return;
            } else if(!this.password || !this.email || !this.firstname || !this.lastname){
                Swal.fire("Registrierung nicht möglich", "Bitte füllen Sie alle Felder und versuchen Sie es erneut", "error");
                return;
            }
            this.createBenutzer(this.email, this.password, this.firstname, this.lastname);
        },
        async createBenutzer(email, password, firstname, lastname){
            var konvKey = await this.encryptString(email + password)
            email = email.toLowerCase();
            const userData = {
                email: email,
                konvKey: konvKey,
                passwort: password,
                vorname: firstname,
                nachname: lastname
            };
            console.log(userData);

                // Beispiel-Axios-Anfrage für die Benutzerregistrierung
            const response = await Benutzer.add(userData);

            if(response == false){
                Swal.fire("Es ist ein Fehler aufgetreten", "Bitte wenden Sie sich an den Administrator", "error");
            } else{
                Swal.fire("Sie wurden registriert", "Sie können sich nun am System einloggen.", "success");

                var subject = "Kassensystem Neuregistrierung";
                var text = "Der Benutzer " + firstname + " " + lastname + " hat sich für das Kassensystem registriert.";
                this.sendEmail(subject, text, 'feuerwehr.server.pph@gmail.com');
            }
        },
        encryptString(inputString){
            /*var encrypted = CryptopJS.AES.encrypt(inputString, "ökas893q5högha83pqthASKHG§Z(ERQZ)").toString();
            encrypted = encrypted.replace("/","z");
            encrypted = encrypted.replace(":","y");
            encrypted = encrypted.replace(".","9");
            return encrypted;*/
            var encrypted = CryptopJS.AES.encrypt(inputString, "ökas893q5högha83pqthASKHG§Z(ERQZ)").toString();
            encrypted = encrypted.replace(/\//g, "z");
            encrypted = encrypted.replace(/:/g, "y");
            encrypted = encrypted.replace(/\./g, "9");
            return encrypted;
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
        }
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

.register {
  min-height: 100vh;
  width: 100vw;
  background-color: white;
  position: fixed;
  top: 0;
}

.logo{
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

input, option, select{
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

.registerButton{
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

.registerButton:hover{
  transform: scale(1.02);
}

input, button, option, select{
  box-sizing: border-box;
  width: 90vw;
  max-width: 25rem;
  margin-left: auto;
  margin-right: auto;
}

.hasAccount {
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

.hasAccountLink, .rechtsLink {
  color: #0a6ed1;
  cursor: pointer;
}

.hasAccountLink:hover, .rechtsLink:hover{
  color: #094480;
}

.neueFeuerwehr{
  color: green;
}

.Datenschutzsatz{
    max-width: 25rem;
    width: 90vw;
    margin-left: auto;
    margin-right: auto;
    font-size: small;
}


// Gab bei Cordova builds Probleme
/*@media (max-height: 750px) {
    input, select, .registerButton{
        padding-top: 0.6rem !important;
        padding-bottom: 0.6rem !important;
        margin-bottom: 0.2rem;
        margin-top: 0.6rem !important;
    }

    h1{
      margin-bottom: 1rem;
    }
}*/
</style>
  