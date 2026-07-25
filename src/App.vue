<template>
  <div :style="cssVars" id="mainApp">
    <KassenprojektAuswahl v-if="this.kassenprojektAuswahl" :online="this.online" :kassenprojekte="kassenprojekte" @selectKassenprojekt="this.selectKassenprojekt" @switchDarkmode="this.switchDarkmode" :darkModeDefault="this.darkMode" @addKassenprojekt="this.addKassenprojekt" @deleteKassenprojekt="this.deleteKassenprojekt" @changeName="this.changeKassenprojektName" @changePassword="this.changeKassenprojektPassword" @updateKassenprojekt="this.updateKassenprojekt"/>
    <DesktopAuswahl v-if="this.desktopAuswahl" :online="this.online" :selectedKassenprojekt="selectedKassenprojekt" @selectDesktop="this.selectDesktop" :darkModeDefault="this.darkMode" @switchDarkmode="this.switchDarkmode" :kassenprojekt="this.selectedKassenprojekt"/>
    <KassensystemMain v-if="this.kassensystemMain" :online="this.online" :selectedKassenprojekt="selectedKassenprojekt" :selectedDesktop="selectedDesktop" :selectedKasse="selectedKasse" @switchDarkmode="this.switchDarkmode" :darkModeDefault="this.darkMode" @selectDesktop="this.selectDesktop"/>
    <button class="backButton fa" @click="this.goBack()">&#xf015</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import KassenprojektAuswahl from './views/KassenprojektAuswahl.vue';
import DesktopAuswahl from './views/DesktopAuswahl.vue';
import KassensystemMain from './views/KassensystemMain.vue';
import Swal from 'sweetalert2';
import { Kassenprojekt } from './backend_controller/kassenprojekt';
import { Settings } from '@/backend_settings';
import { Benutzer } from './backend_controller/benutzer';
import CryptopJS from 'crypto-js';

export default {
  name: 'App',
  components:{
    KassenprojektAuswahl,
    DesktopAuswahl,
    KassensystemMain
  },
  props: {
  },
  data() {
    return {
      desktopAuswahl: false,
      kassenprojektAuswahl: true,
      kassensystemMain: false,

      kassenprojekte:[],
      selectedKassenprojekt:{},
      selectedDesktop:{},
      selectedKasse:{},
      darkMode: false,
      fullscreen: null,

      konvKey: ''
    };
  },
  computed:{
    ...mapState('kasse', ['kassenprojektItems','online']),

    cssVars() {
      // Alle Variablen zentral binden; Farben etc. können ebenfalls via Theme aus Vuex kommen
      if(!this.darkMode){
        return {
          '--bg': '#f4f5f7',
          '--warenauswahl': '#fdfdfd',
          '--pfandauswahl': '#f8f8f8',
          '--warenkorb': '#ffffff',
          '--header': '#ffffff',
          '--items': '#ffffff',
          '--witems': '#f4f5f7',
          '--ink': '#222',
          '--muted': '#8b8f97',
          '--brand': '#0b66ff',
          '--danger': '#d21f3c',
          '--success': '#006b00',
          '--default': '#8a8a8a',
          '--ok': '#2ecc71',
          '--handle': '#5a5f68',
          '--border': '#e5e7eb',
          '--radius': '14px',
          '--shadow': '0 1px 2px rgba(0,0,0,.06), 0 6px 24px rgba(0,0,0,.08)',
          '--hover': '#eeeeee',
          '--menu-button': '#f1f3f5',
          '--menu-left': '#ffffff',
          '--grid-line': '#e1e1e1',
        };
      } else{
        return {
          '--bg': '#000000',
          '--warenauswahl': '#000000',
          '--pfandauswahl': '#040404',
          '--warenkorb': '#000000',
          '--header': '#040404',
          '--items': '#212121',
          '--witems': '#212121',
          '--ink': '#ffffff',
          '--muted': '#bfbfbf',
          '--brand': '#0b66ff',
          '--danger': '#d21f3c',
          '--success': '#006b00',
          '--default': '#8a8a8a',
          '--ok': '#2ecc71',
          '--handle': '#5a5f68',
          '--border': '#474747',
          '--radius': '14px',
          '--shadow': '0 1px 2px rgba(0,0,0,.06), 0 6px 24px rgba(0,0,0,.08)',
          '--hover': '#2f2f2f',
          '--menu-button': '#303030',
          '--menu-left': '#161616',
          '--grid-line': '#ffffff'
        };
      }
    },
  },
  methods: {
    enterFullscreen(element) {
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.msRequestFullscreen) {      // for IE11 (remove June 15, 2022)
        element.msRequestFullscreen();
      } else if(element.webkitRequestFullscreen) {  // iOS Safari
        element.webkitRequestFullscreen();
      }
    },
    isBrowser(){
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Überprüfen auf gängige Browser-Strings
      if ((userAgent.includes("Chrome") || userAgent.includes("Safari") || userAgent.includes("Firefox") || userAgent.includes("Edge")) && typeof window.cordova == "undefined") {
          return true;  // Wahrscheinlich ein Browser
      } else {
          return false;  // Möglicherweise eine App
      }
    },
    requestFullscreen(){
      if(this.isBrowser()){
        Swal.fire({
          title: "Anwendung im Vollbild starten",
          showDenyButton: true,
          confirmButtonText: "Ja",
          denyButtonText: `Nein`
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.enterFullscreen(document.documentElement)
            this.fullscreen = true;
          } else if (result.isDenied) {
            this.fullscreen = false;
          }
        });
      }
    },
    selectKassenprojekt(kassenprojekt){
      this.selectedKassenprojekt = kassenprojekt;
      this.desktopAuswahl = true;
      this.kassenprojektAuswahl = false;
      this.kassensystemMain = false;
    },
    toKassenprojekt(){
      this.kassenprojektAuswahl = true;
      this.desktopAuswahl = false;
      this.kassensystemMain = false;
    },
    toDesktop(){
      this.desktopAuswahl = true;
      this.kassenprojektAuswahl = false;
      this.kassensystemMain = false;
    },
    toKassensystemMain(){
      this.desktopAuswahl = false;
      this.kassenprojektAuswahl = false;
      this.kassensystemMain = true;
    },
    async selectKassenprojekt(kassenprojekt){
      if(kassenprojekt.password != undefined && kassenprojekt.password != ''){
        await Swal.fire({
          title: "Kassenprojekt Passwort",
          input: "text",
          showDenyButton: true,
          confirmButtonText: "Speichern",
          denyButtonText: "Abbrechen",
        }).then((result) => {
            if(kassenprojekt.password != result.password){
              return;
            }
        })
      }
      this.selectedKassenprojekt = kassenprojekt;
      this.toDesktop();
    },
    async selectDesktop(desktop){
      if(desktop.password != undefined && desktop.password != ''){
        await Swal.fire({
          title: "Kassenprojekt Passwort",
          input: "text",
          showDenyButton: true,
          confirmButtonText: "Speichern",
          denyButtonText: "Abbrechen",
        }).then((result) => {
            if(desktop.password != result.password){
              return;
            }
        })
      }
      this.selectedDesktop = desktop;
      this.toKassensystemMain();
    },
    switchDarkmode(mode){
      this.darkMode = mode;
    },
    switchDesktop(desktop){
      this.selectedDesktop = desktop;
      console.log(desktop);
    },
    async addKassenprojekt(obj){
      let newId;
      if(this.kassenprojekte != false && this.kassenprojekte!=undefined && this.kassenprojekte != '' && this.kassenprojekte.length > 0){
        this.kassenprojekte.sort((a,b) => a.Id - b.Id);
        newId = +this.kassenprojekte[this.kassenprojekte.length-1].Id + 1;
      } else{
        this.kassenprojekte = new Array();
        newId = 1;
      }
      let newObj = {
        Id: newId,
        name: obj.name,
        password: obj.password,
        image: obj.image,
        benutzerKonvKey: obj.benutzerKonvKey,
        closed: false,
      }
      console.log(newObj);
      /*this.kassenprojekte.push(newObj);
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));*/
      try{
        await Kassenprojekt.add(newObj);
      } catch(err){
        Kassenprojekt.addLocal(newObj);
      }
      this.getKassenprojekte();
    },
    async deleteKassenprojekt(obj){
      /*this.kassenprojekte = this.kassenprojekte.filter(p => p.Id != obj.Id);
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));*/
      try{
        await Kassenprojekt.delete(obj);
      } catch(err){
        Kassenprojekt.deleteLocal(obj);
      }
      this.getKassenprojekte();
    },
    async changeKassenprojektName(obj){
      /*let index = this.kassenprojekte.findIndex(o=>o.Id == obj.Id);
      this.kassenprojekte[index].name = obj.name;
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));*/
      try{
        await Kassenprojekt.update(obj)
      } catch(err){
        Kassenprojekt.updateLocal(obj)
      }
      this.getKassenprojekte();
    },
    async changeKassenprojektPassword(obj){
      /*let index = this.kassenprojekte.findIndex(o=>o.Id == obj.Id);
      this.kassenprojekte[index].password = obj.password;
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));*/
      try{
        await Kassenprojekt.update(obj)
      } catch(err){
        Kassenprojekt.updateLocal(obj)
      }
      this.getKassenprojekte();
    },
    async updateKassenprojekt(obj){
      console.log("updateKassenprojekt", obj);
      try{
        await Kassenprojekt.update(obj)
      } catch(err){
        Kassenprojekt.updateLocal(obj)
      }
      this.getKassenprojekte();
    },
    goBack(){
      switch (true) {
        case this.kassensystemMain:
          this.toDesktop()
          break;
        case this.desktopAuswahl:
          this.toKassenprojekt();
          break;
      }
    },
    async getKassenprojekte(){
      try{
        this.kassenprojekte = await Kassenprojekt.get(this.konvKey)
      } catch(err){
        this.kassenprojekte = Kassenprojekt.getLocal()
      }
    },
    async login(){
      return new Promise(async (resolve) => {
        const result = await this.registrierungsPopup();
        resolve(result);
      });
    },
    async loginPopup(){
      const { value: formValues } = await Swal.fire({
          title: "Einloggen",
          html: `
              <input id="swal-email" class="swal2-input" placeholder="E-Mail">
              <input id="swal-password" type="password" class="swal2-input" placeholder="Passwort">
          `,
          focusConfirm: false,
          showCancelButton: false,
          showDenyButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Login",
          denyButtonText: 'Registrieren',
          confirmButtonColor: 'blue',
          denyButtonColor: 'green',
          preConfirm: () => {
              const email = document.getElementById("swal-email").value;
              const password = document.getElementById("swal-password").value;

              if (!email || !password) {
                  Swal.showValidationMessage("Bitte alle Felder ausfüllen");
                  return false;
              }

              return { email, password };
          },

          preDeny: () => {
            this.registrierungsPopup();
            return;
          }
      });

      if (formValues) {
          console.log("Einloggen:", formValues);

          try{
            const response = await Benutzer.get(formValues.email, formValues.password);
            if(response == null || response.konvKey == null){
              await Swal.fire('Fehlgeschlagen', 'Die Anmeldung ist fehlgeschlagen', 'error');
              this.loginPopup();
              return;
            }
            Swal.fire('Hallo ' + response.vorname, 'Sie haben sich erfolgreich angemeldet', 'success')
            localStorage.setItem("konvKey", response.konvKey);
            this.konvKey = response.konvKey;
            this.getKassenprojekte();
          } catch(err){
            await Swal.fire('Fehlgeschlagen', 'Die Anmeldung ist fehlgeschlagen', 'error');
            this.loginPopup();
          }
      }
    },
    async registrierungsPopup(){
      const { value: formValues } = await Swal.fire({
          title: "Registrieren",
          html: `
              <input id="swal-email" class="swal2-input" placeholder="E-Mail">
              <input id="swal-password" type="password" class="swal2-input" placeholder="Passwort">
              <input id="swal-firstname" class="swal2-input" placeholder="Vorname">
              <input id="swal-lastname" class="swal2-input" placeholder="Nachname">
          `,
          focusConfirm: false,
          showCancelButton: false,
          showDenyButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Registrieren",
          denyButtonText: 'Zum Login',
          confirmButtonColor: 'green',
          denyButtonColor: 'blue',
          preConfirm: () => {
              const email = document.getElementById("swal-email").value;
              const password = document.getElementById("swal-password").value;
              const firstName = document.getElementById("swal-firstname").value;
              const lastName = document.getElementById("swal-lastname").value;

              if (!email || !password || !firstName || !lastName) {
                  Swal.showValidationMessage("Bitte alle Felder ausfüllen");
                  return false;
              }

              return { email, password, firstName, lastName };
          },

          preDeny: () => {
            this.loginPopup();
            return;
          }
      });

      if (formValues) {
          console.log("Registrierung:", formValues);

          let konvKey = await this.encryptString(formValues.email + formValues.password + formValues.firstName + formValues.lastName)

          let benutzerObj = {
            konvKey: konvKey,
            email: formValues.email,
            passwort: formValues.password,
            vorname: formValues.firstName,
            nachname: formValues.lastName
          }

          try{
            await Benutzer.add(benutzerObj);
            Swal.fire('Hallo ' + benutzerObj.vorname, 'Die Registrierung war erfolgreich', 'success')
            localStorage.setItem("konvKey", konvKey);
            this.konvKey = konvKey;
          } catch(err){
            await Swal.fire('Fehlgeschlagen', 'Die Registrierung ist fehlgeschlagen', 'error')
            this.registrierungsPopup();
          }
      }
    },
    encryptString(inputString){
      var encrypted = CryptopJS.AES.encrypt(inputString, "ökas893q5högha83pqthASKHG§Z(ERQZ)").toString();
      encrypted = encrypted.replace(/\//g, "z");
      encrypted = encrypted.replace(/:/g, "y");
      encrypted = encrypted.replace(/\./g, "9");
      return encrypted;
    },
  },
  async created(){
    //localStorage.setItem("konvKey", 'dafsjokj274');
    this.konvKey = localStorage.getItem("konvKey");

    if(this.konvKey == null || this.konvKey == undefined || !this.konvKey){
      await this.login();
    }
    //this.requestFullscreen();
    this.getKassenprojekte();
  },
};
</script>

<style lang="scss">
  body{
    margin: 0;
    height: 100vh;
    //width: 100vw;
    overflow:hidden;
    font: 15px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }

  .backButton{
    z-index: 999;
    display: block;
    position: fixed;
    bottom: 0.3rem;
    width: 2.2rem;
    height: 2.2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: large;
    border-radius: 90px;
    border-color: var(--border);
    color: var(--ink);
    background-color: var(--items);
    box-shadow: var(--shadow);
    cursor:pointer;
  }
  .backButton:hover{
    background-color: var(--hover);
  }

  #mainApp{
      width: 100vw;
  }
</style>