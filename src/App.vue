<template>
  <div :style="cssVars">
    <KassenprojektAuswahl v-if="this.kassenprojektAuswahl" :kassenprojekte="kassenprojekte" @selectKassenprojekt="this.selectKassenprojekt" @switchDarkmode="this.switchDarkmode" :darkModeDefault="this.darkMode" @addKassenprojekt="this.addKassenprojekt" @deleteKassenprojekt="this.deleteKassenprojekt" @changeName="this.changeKassenprojektName" @changePassword="this.changeKassenprojektPassword"/>
    <DesktopAuswahl v-if="this.desktopAuswahl" :selectedKassenprojekt="selectedKassenprojekt" @selectDesktop="this.selectDesktop" :darkModeDefault="this.darkMode" @switchDarkmode="this.switchDarkmode" :kassenprojekt="this.selectedKassenprojekt"/>
    <KassensystemMain v-if="this.kassensystemMain" :selectedKassenprojekt="selectedKassenprojekt" :selectedDesktop="selectedDesktop" :selectedKasse="selectedKasse" @switchDarkmode="this.switchDarkmode" :darkModeDefault="this.darkMode" @switchDesktop="this.switchDesktop"/>
    <button class="backButton fa" @click="this.goBack()">&#xf015</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import KassenprojektAuswahl from './views/KassenprojektAuswahl.vue';
import DesktopAuswahl from './views/DesktopAuswahl.vue';
import KassensystemMain from './views/KassensystemMain.vue';
import Swal from 'sweetalert2';

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

      kassenprojekte:[{
        Id: 1,
        name: 'Bierfest',
        password: undefined,
        image: 'https://sw-anzeiger.de/wp-content/uploads/2024/04/Poppenhausen-Bierfest-am-Glockenberg_1.jpg'
      },
      {
        Id: 2,
        name: 'Feuerwehrfest',
        password: undefined,
        image: 'https://daten.verwaltungsportal.de/dateien//mypage/8/3/5/3/2/7/BannerAllg-1_1.png?v=1725290175'
      },{
        Id: 3,
        name: 'Weihnachtsbaumverkauf',
        password: undefined,
        image: 'https://img.sparknews.funkemedien.de/407811627/407811627_1733159868_v16_9_1200.jpeg'
      }],
      selectedKassenprojekt:{},
      selectedDesktop:{},
      selectedKasse:{},
      darkMode: false,
      fullscreen: null
    };
  },
  computed:{
    ...mapState('kasse', ['kassenprojektItems']),

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
          '--ok': '#2ecc71',
          '--handle': '#5a5f68',
          '--border': '#e5e7eb',
          '--radius': '14px',
          '--shadow': '0 1px 2px rgba(0,0,0,.06), 0 6px 24px rgba(0,0,0,.08)',
          '--hover': '#eeeeee',
          '--menu-button': '#f1f3f5'
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
          '--ok': '#2ecc71',
          '--handle': '#5a5f68',
          '--border': '#474747',
          '--radius': '14px',
          '--shadow': '0 1px 2px rgba(0,0,0,.06), 0 6px 24px rgba(0,0,0,.08)',
          '--hover': '#2f2f2f',
          '--menu-button': '#303030'
        };
      }
    }
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
    selectKassenprojekt(kassenprojekt){
      this.selectedKassenprojekt = kassenprojekt;
      this.toDesktop();
    },
    selectDesktop(desktop){
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
    addKassenprojekt(obj){
      let newId;
      if(this.kassenprojekte.length > 0){
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
        image: obj.image
      }
      this.kassenprojekte.push(newObj);
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));
    },
    deleteKassenprojekt(obj){
      this.kassenprojekte = this.kassenprojekte.filter(p => p.Id != obj.Id);
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));
    },
    changeKassenprojektName(obj){
      let index = this.kassenprojekte.findIndex(o=>o.Id == obj.Id);
      this.kassenprojekte[index].name = obj.name;
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));
    },
    changeKassenprojektPassword(obj){
      let index = this.kassenprojekte.findIndex(o=>o.Id == obj.Id);
      this.kassenprojekte[index].password = obj.password;
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));
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
    }
  },
  created(){
    this.requestFullscreen();
    try{
      this.kassenprojekte = JSON.parse(`${this.kassenprojektItems}`);
    } catch(err){
      this.$store.commit('kasse/SET_KASSENPROJEKT_ITEMS',JSON.stringify(this.kassenprojekte));
    }
  }
};
</script>

<style lang="scss">
  body{
    margin: 0;
    height: 100vh;
    width: 100vw;
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
</style>