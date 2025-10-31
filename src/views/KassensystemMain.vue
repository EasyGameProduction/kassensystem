<template>
  <div
    class="kassensystemMain"
    :style="cssVars"
    ref="rootEl"
  >
    <!-- Kopfzeile -->
    <header class="topbar" id="topbar">
      <div class="left-actions">
        <button class="menuButton" :class="(this.menuActive)?'menuButtonActive':'menuButtonDeactive'" @click="this.openMenu()">≡</button>
        <div class="desktopSwitch" @click="this.openDesktopSwitch()">
          <span class="title desktopTitle">{{ selectedKassenprojekt.name }} – {{ selectedDesktop.name }}</span>
          <button id="switchButton" :class="(this.desktopSwitchActive)?'switchActive':''" class="headerButton">&#9660;</button>
        </div>
      </div>
      <div class="title">{{ selectedKasse.name }}</div>
      <div class="right-actions">
        <div class="status"><span class="dot"></span> online</div>
        <label class="switch">
          <input :checked="darkModeDefault" id="checkbox" type="checkbox" v-model="darkMode" @change="$emit('switchDarkmode',darkMode)"/>
          <span class="slider">
            <div class="star star_1"></div>
            <div class="star star_2"></div>
            <div class="star star_3"></div>
            <svg viewBox="0 0 16 16" class="cloud_1 cloud">
              <path
                transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                fill="#fff"
                d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
              ></path>
            </svg>
          </span>
        </label>
      </div>
    </header>

    <!-- Arbeitsbereich -->
    <main class="workspace" id="workspace" ref="workspace">
      <!-- Linke Seite -->
      <section class="left" id="leftPane" ref="leftPane">
        <div class="artikelAuswahl" id="artikelAuswahl">
          <Item class="artikelItem" v-for="artikel in this.artikelItems" :key="artikel.kassenprojektID + '-' + artikel.desktopID + '-' + artikel.Id" :item="artikel" @addItem="this.addArtikel" v-show="this.artikelItemsSichtbarkeit != undefined && this.artikelItemsSichtbarkeit.find(obj=>obj.artikelId == artikel.Id && obj.desktopID == artikel.desktopID && obj.kassenprojektID == artikel.kassenprojektID).sichtbar"/>
        </div>

        <!-- Horizontaler Griff -->
        <div
          class="h-handle"
          id="hHandle"
          ref="hHandle"
          aria-label="Bereichshöhe anpassen"
          @pointerdown="onPointerDownH"
          v-if="this.pfandItems != undefined && this.pfandItems.length > 0" 
        >
          <div class="handle-square" role="separator" aria-orientation="horizontal" v-if="this.pfandItems != undefined && this.pfandItems.length > 0" ></div>
        </div>

        <!-- Untere Button-Reihe -->
        <div
          class="bottom-bar"
          :class="{ collapsed: bottomRowHeight <= 5 }"
          ref="bottomBar"
          v-if="this.pfandItems != undefined && this.pfandItems.length > 0" 
        >
          <Item class="pfandItem" v-for="pfand in this.pfandItems" :key="pfand.kassenprojektID + '-' + pfand.desktopID + '-' + pfand.Id" :item="pfand" @addItem="this.addPfand" v-show="this.pfandItemsSichtbarkeit != undefined && this.pfandItemsSichtbarkeit.find(obj=>obj.pfandId == pfand.Id && obj.desktopID == pfand.desktopID && obj.kassenprojektID == pfand.kassenprojektID).sichtbar"/>
        </div>
      </section>

      <!-- Vertikaler Griff -->
      <div
        class="v-handle"
        id="vHandle"
        ref="vHandle"
        aria-label="Bon-Breite anpassen"
        @pointerdown="onPointerDownV"
      >
        <div class="handle-square" role="separator" aria-orientation="vertical"></div>
      </div>

      <!-- Rechte Seite (Bon) -->
      <aside class="warenkorb" id="rightPane">
        <div class="warenkorb-scroll">
          <WarenkorbItem v-for="artikel in this.artikelAuswahl" :key="artikel.kassenprojektID + '-' + artikel.desktopID + '-' + artikel.Id" :item="artikel" :items="this.artikelItems" :pfandItem="this.pfandItems.find(p=>p.Id == artikel.pfandId)" @removeItem="this.removeWArtikel" @removeAll="this.removeWAllArtikel" :lineColor="'blue'"/>
          <WarenkorbItem v-for="pfand in this.pfandAuswahl" :key="pfand.kassenprojektID + '-' + pfand.desktopID + '-' + pfand.Id" :item="pfand" :items="this.pfandItems" @removeItem="this.removeWPfand" @removeAll="this.removeWAllPfand" :lineColor="'green'"/>
        </div>
        <div class="total">
          <span>Gesamt</span>
          <span>{{rechnungsbetrag}} €</span>
        </div>
        <div class="actions">
          <button @click="removeWAll" class="btn btn-danger"><span class="btn-text">Löschen</span></button>
          <button @click="bestaetigen" class="btn btn-primary btn-bestaetigen"><span class="btn-text">Bestätigen</span></button>
        </div>
      </aside>
    </main>
  </div>

  <Menu :active="this.menuActive" :headerHeight="this.headerHeight" :style="cssVars" :artikel="this.artikelItems" :pfand="this.pfandItems" @setArticleItems="this.setArticleItems" @setPfandItems="this.setPfandItems" :artikelItemsSichtbarkeit="this.artikelItemsSichtbarkeit" :pfandItemsSichtbarkeit="this.pfandItemsSichtbarkeit" @setArtikelSichtbarkeit="this.setArtikelSichtbarkeit" @setPfandSichtbarkeit="this.setPfandSichtbarkeit" @addArtikel="this.addArtikelItem" @addPfand="this.addPfandItem" @deleteArtikel="this.deleteArtikel" @deletePfand="this.deletePfand"/>
  <DesktopSwitch :active="this.desktopSwitchActive" :headerHeight="this.headerHeight" :desktops="this.getDesktops()" :kassenprojekt="selectedKassenprojekt" :style="cssVars" @switchDesktop="switchDesktop"/>
</template>

<script>
/**
 * Erwartet ein Vuex-Modul `kasse` mit State:
 *  - rightPanelWidth: Number (px)
 *  - bottomRowHeight: Number (px)
 * und Mutations:
 *  - SET_RIGHT_PANEL_WIDTH
 *  - SET_BOTTOM_ROW_HEIGHT
 */
import { mapState, mapMutations } from 'vuex';
import Item from '@/components/Item.vue';
import WarenkorbItem from '@/components/WarenkorbItem.vue';
import Menu from '@/components/Menu.vue';
import DesktopSwitch from '@/components/DesktopSwitch.vue';
import Swal from 'sweetalert2';

export default {
  name: 'KassensystemMain',
  components:{
    Item,
    WarenkorbItem,
    Menu,
    DesktopSwitch
  },
  props:{
    selectedKassenprojekt: Object,
    selectedDesktop: Object,
    selectedKasse: Object,
    darkModeDefault: Boolean,
  },
  data() {
    return {
      // Pointer-State (nicht in Vuex nötig)
      _startX: 0,
      _startWidth: 0,
      _pointerIdV: null,

      _startY: 0,
      _startHeight: 0,
      _pointerIdH: null,

      // Grenzen (px)
      MIN_RIGHT: 0,
      MAX_RIGHT: 340,
      MIN_BOTTOM: 0.1,
      MAX_BOTTOM: 180,

      rechnungsbetrag: (0.00).toFixed(2),

      artikelItemsSichtbarkeit: [
        /*{
          artikelId: 1,
          kassenprojektID: 1,
          desktopID: 1,
          sichtbar: true
        },
        {
          artikelId: 2,
          kassenprojektID: 1,
          desktopID: 1,
          sichtbar: true
        },
        {
          artikelId: 3,
          kassenprojektID: 1,
          desktopID: 1,
          sichtbar: true
        },
        {
          artikelId: 4,
          kassenprojektID: 1,
          desktopID: 1,
          sichtbar: true
        },
        {
          artikelId: 5,
          kassenprojektID: 1,
          desktopID: 1,
          sichtbar: true
        },
        {
          artikelId: 6,
          kassenprojektID: 1,
          desktopID: 1,
          sichtbar: true
        },
        {
          artikelId: 1,
          kassenprojektID: 1,
          desktopID: 2,
          sichtbar: true
        }*/
      ],
      pfandItemsSichtbarkeit: [
        /*{
          pfandId: 1,
          kassenprojektID: 1,
          desktopID: 1,
          sichtbar: true
        }*/
      ],

      artikelItems: [
        /*{
          Id: 1,
          kassenprojektID: 1,
          desktopID: 1,
          bezeichnung: 'Bier',
          preis: 3.50,
          pfandId: 1
        },
        {
          Id: 2,
          kassenprojektID: 1,
          desktopID: 1,
          bezeichnung: 'Hefe',
          preis: 3.50,
          pfandId: 1
        },
        {
          Id: 3,
          kassenprojektID: 1,
          desktopID: 1,
          bezeichnung: 'Maß',
          preis: 7.00,
          pfandId: 1
        },
        {
          Id: 4,
          kassenprojektID: 1,
          desktopID: 1,
          bezeichnung: 'Limo',
          preis: 1.50,
          pfandId: 1
        },
        {
          Id: 5,
          kassenprojektID: 1,
          desktopID: 1,
          bezeichnung: 'Wein',
          preis: 6.50,
          pfandId: 1
        },
        {
          Id: 6,
          kassenprojektID: 1,
          desktopID: 1,
          bezeichnung: 'Wasser',
          preis: 1.00,
          pfandId: 1
        },
        {
          Id: 1,
          kassenprojektID: 1,
          desktopID: 2,
          bezeichnung: 'Steak m. Brötchen',
          preis: 7.00,
          pfandId: undefined
        }*/
      ],
      pfandItems: [
        /*{
          Id: 1,
          kassenprojektID: 1,
          desktopID: 1,
          bezeichnung: 'PET',
          preis: 1.00
        }*/
      ],
      artikelAuswahl: [],
      pfandAuswahl: [],

      menuActive: false,
      headerHeight: 0,
      darkMode: this.darkModeDefault,
      desktopSwitchActive: false
    };
  },
  computed: {
    ...mapState('kasse', ['rightPanelWidth', 'bottomRowHeight', 'artikelItems', 'pfandItems', 'belegItems', 'desktopItems']),
    ...mapState('item', ['width']),

    cssVars() {
      // Alle Variablen zentral binden; Farben etc. können ebenfalls via Theme aus Vuex kommen
      if(!this.darkMode){
        return {
          '--right-panel-width': `${this.rightPanelWidth}px`,
          '--bottom-row-height': `${this.bottomRowHeight}px`,
          '--header-height': '54px',

          '--itemWidth': `${this.width}px`
        };
      } else{
        return {
          '--right-panel-width': `${this.rightPanelWidth}px`,
          '--bottom-row-height': `${this.bottomRowHeight}px`,
          '--header-height': '54px',

          '--itemWidth': `${this.width}px`
        };
      }
    }
  },
  methods: {
    ...mapMutations('kasse', {
      setRight: 'SET_RIGHT_PANEL_WIDTH',
      setBottom: 'SET_BOTTOM_ROW_HEIGHT'
    }),
    ...mapMutations('item', {
      width: 'SET_WIDTH',
    }),

    // ====== Vertikaler Griff ======
    onPointerDownV(e) {
      this._pointerIdV = e.pointerId;
      e.currentTarget.setPointerCapture?.(this._pointerIdV);
      this._startX = e.clientX;
      this._startWidth = this.rightPanelWidth;

      window.addEventListener('pointermove', this.onPointerMoveV);
      window.addEventListener('pointerup', this.onPointerUpV);
    },
    onPointerMoveV(e) {
      const dx = e.clientX - this._startX;
      let newWidth = this._startWidth - dx; // nach links ziehen => rechts breiter
      newWidth = Math.max(this.MIN_RIGHT, Math.min(this.MAX_RIGHT, newWidth));
      this.setRight(Math.round(newWidth));
    },
    onPointerUpV(e) {
      window.removeEventListener('pointermove', this.onPointerMoveV);
      window.removeEventListener('pointerup', this.onPointerUpV);
      this.$refs.vHandle?.releasePointerCapture?.(this._pointerIdV);
      this._pointerIdV = null;
    },

    // ====== Horizontaler Griff ======
    onPointerDownH(e) {
      this._pointerIdH = e.pointerId;
      e.currentTarget.setPointerCapture?.(this._pointerIdH);
      this._startY = e.clientY;
      this._startHeight = this.bottomRowHeight;

      window.addEventListener('pointermove', this.onPointerMoveH);
      window.addEventListener('pointerup', this.onPointerUpH);
    },
    onPointerMoveH(e) {
      const dy = e.clientY - this._startY;
      let newHeight = this._startHeight - dy; // nach oben => unten größer
      newHeight = Math.max(this.MIN_BOTTOM, Math.min(this.MAX_BOTTOM, newHeight));
      this.setBottom(Math.round(newHeight));
    },
    onPointerUpH() {
      window.removeEventListener('pointermove', this.onPointerMoveH);
      window.removeEventListener('pointerup', this.onPointerUpH);
      this.$refs.hHandle?.releasePointerCapture?.(this._pointerIdH);
      this._pointerIdH = null;
    },
    addArtikel(artikel){
      let index = -1
      if(this.artikelAuswahl.length > 0){
        index = this.artikelAuswahl.findIndex(a => a.Id == artikel.Id);
      }
      if(index >= 0){
        this.artikelAuswahl[index].anzahl++;
      } else{
        let newArtikel = {
          Id: artikel.Id,
          anzahl: 1,
          pfandId: artikel.pfandId
        }
        this.artikelAuswahl.push(newArtikel);
      }
      console.log(this.artikelAuswahl);

      let preis = +this.artikelItems.find(a=>a.Id == artikel.Id).preis;
      if(artikel.pfandId != undefined){
        preis += +this.pfandItems.find(p=>p.Id == artikel.pfandId).preis;
      }
      this.changeRechnungsbetrag(+this.rechnungsbetrag + +preis);
      this.artikelAuswahl.sort((a,b)=>a.Id - b.Id);
    },
    addPfand(pfand){
      let index = -1;
      if(this.pfandAuswahl.length > 0){
        index = this.pfandAuswahl.findIndex(p => p.Id == pfand.Id);
      }
      if(index >= 0){
        this.pfandAuswahl[index].anzahl++;
        this.changeRechnungsbetrag(+this.rechnungsbetrag - +this.pfandItems.find(p=>p.Id == pfand.Id).preis);
      } else{
        let newPfand = {
          Id: pfand.Id,
          anzahl: 1
        }
        this.pfandAuswahl.push(newPfand);
        this.changeRechnungsbetrag(+this.rechnungsbetrag - +this.pfandItems.find(p=>p.Id == pfand.Id).preis);
      }
      this.pfandAuswahl.sort((a,b)=>a.Id - b.Id);
    },
    removeWArtikel(artikel){
      let index = this.artikelAuswahl.findIndex(a=>a.Id == artikel.Id);
      this.artikelAuswahl[index].anzahl--;
      if(this.artikelAuswahl[index].anzahl == 0){
        this.artikelAuswahl.splice(index,1);
      }

      let preis = +this.artikelItems.find(a=>a.Id == artikel.Id).preis;
      if(artikel.pfandId != undefined){
        preis += +this.pfandItems.find(p=>p.Id == artikel.pfandId).preis;
      }
      this.changeRechnungsbetrag(+this.rechnungsbetrag - +preis);
    },
    removeWPfand(pfand){
      let index = this.pfandAuswahl.findIndex(p=>p.Id == pfand.Id);
      this.pfandAuswahl[index].anzahl--;
      if(this.pfandAuswahl[index].anzahl == 0){
        this.pfandAuswahl.splice(index,1);
      }
      console.log("Test");
      this.changeRechnungsbetrag(+this.rechnungsbetrag + +this.pfandItems.find(p=>p.Id == pfand.Id).preis);
    },
    removeWAllArtikel(artikel){
      let index = this.artikelAuswahl.findIndex(a=>a.Id == artikel.Id);
      let anzahl = this.artikelAuswahl[index].anzahl;
      this.artikelAuswahl.splice(index,1);

      let preis = +this.artikelItems.find(a=>a.Id == artikel.Id).preis * anzahl;
      if(artikel.pfandId != undefined){
        preis += +this.pfandItems.find(p=>p.Id == artikel.pfandId).preis * anzahl;
      }
      this.changeRechnungsbetrag(+this.rechnungsbetrag - +preis);
    },
    removeWAllPfand(pfand){
      let index = this.pfandAuswahl.findIndex(p=>p.Id == pfand.Id);
      let anzahl = this.pfandAuswahl[index].anzahl;
      this.pfandAuswahl.splice(index,1);
      this.changeRechnungsbetrag(+this.rechnungsbetrag + +(this.pfandItems.find(p=>p.Id == pfand.Id).preis * anzahl));
    },
    changeRechnungsbetrag(neuerRechnungsbetrag){
      this.rechnungsbetrag = neuerRechnungsbetrag.toFixed(2);
    },
    removeWAll(){
      this.changeRechnungsbetrag(0);
      this.pfandAuswahl = [];
      this.artikelAuswahl = [];
    },
    openMenu(){
      this.menuActive = !this.menuActive;
      this.headerHeight = document.getElementById('topbar').getBoundingClientRect().height;
      if(!this.menuActive){
        this.setArticleItems(this.artikelItems);
        this.setPfandItems(this.pfandItems);
      }
    },
    openDesktopSwitch(){
      this.desktopSwitchActive = !this.desktopSwitchActive;
      this.headerHeight = document.getElementById('topbar').getBoundingClientRect().height;
      console.log(this.headerHeight);
    },
    bestaetigen(){
      let artikelAuswahl = this.artikelAuswahl;
      let pfandAuswahl = this.pfandAuswahl;
      let rechnungsbetrag = this.rechnungsbetrag;
      var neuerBeleg = {
        time: Date.now(),
        kasse: this.$props.selectedKasse.Id,
        kassenprojektID: this.$props.selectedKassenprojekt.Id,
        desktopID: this.$props.selectedDesktop.Id,
        artikelAuswahl: artikelAuswahl,
        pfandAuswahl: pfandAuswahl,
        rechnungsbetrag: rechnungsbetrag
      }

      try{
        let belege = JSON.parse(this.$store.state.kasse.belegItems);
        belege.push(neuerBeleg);
        this.$store.commit('kasse/SET_BELEG_ITEMS', JSON.stringify(belege))
      } catch(err){
        let neueBelege = new Array();
        neueBelege.push(neuerBeleg);
        this.$store.commit('kasse/SET_BELEG_ITEMS', JSON.stringify(neueBelege))
      }
      console.log(neuerBeleg);
      this.removeWAll();
    },
    async switchDesktop(desktop){
      await this.$emit('switchDesktop', desktop);
      this.desktopSwitchActive = false;
      this.getArtikelStore();
      this.getPfandStore();
      this.removeWAll();
    },
    getDesktops(){
      let desktops = JSON.parse(this.$store.state.kasse.desktopItems);
      desktops = desktops.filter(obj => obj.kassenprojektID == this.$props.selectedKassenprojekt.Id);
      return desktops;
    },
    getArtikel(){
      try {
        this.artikelItems = JSON.parse(this.$store.state.kasse.artikelItems);
      } catch (e) {
        console.error("Fehler beim Parsen von artikelItems:", e);
      }
      
      if(this.artikelItems.length > 0){
        this.artikelItems = this.artikelItems.filter(obj => obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
      }
    },
    getArtikelStore(){
      this.artikelItems = JSON.parse(this.$store.state.kasse.artikelItems);
      this.artikelItems = this.artikelItems.filter(obj => obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
    },
    getPfand(){
      try{
        this.pfandItems = JSON.parse(this.$store.state.kasse.pfandItems)
      } catch(err){
        this.$store.commit('kasse/SET_PFAND_ITEMS',JSON.stringify(this.pfandItems));
      }

      if(this.pfandItems.length > 0){
        this.pfandItems = this.pfandItems.filter(obj => obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
      }
    },
    getPfandStore(){
      this.pfandItems = JSON.parse(this.$store.state.kasse.pfandItems);
      this.pfandItems = this.pfandItems.filter(obj => obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
    },
    setArticleItems(artikelItems){
      this.artikelItems = artikelItems;

      let itemsStore = JSON.parse(this.$store.state.kasse.artikelItems);
      if(itemsStore){
        this.artikelItems.forEach(item => {
          let index = itemsStore.findIndex(obj=>obj.Id == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID);
          if(index >= 0){
            itemsStore[index] = item;
          } else{
            itemsStore = new Array()
            itemsStore.push(item)
          }
        });

        if(this.artikelItems != undefined && this.artikelItems.length > 0){
          itemsStore = itemsStore.filter(storeItem => {
            if (
              storeItem.desktopID !== this.artikelItems[0].desktopID ||
              storeItem.kassenprojektID !== this.artikelItems[0].kassenprojektID
            ) {
              return true;
            }

            return this.artikelItems.some(item =>
              item.Id === storeItem.Id
            );
          });
        }
      } else{
        itemsStore = this.artikelItems;
      }
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS',JSON.stringify(itemsStore));
    },
    setPfandItems(pfandItems){
      this.pfandItems = pfandItems;

      let itemsStore = JSON.parse(this.$store.state.kasse.pfandItems);
      if(itemsStore){
        this.pfandItems.forEach(item => {
          let index = itemsStore.findIndex(obj=>obj.Id == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID);
          if(index >= 0){
            itemsStore[index] = item;
          } else{
            itemsStore = new Array()
            itemsStore.push(item)
          }
        });

        if(this.pfandItems != undefined && this.pfandItems.length > 0){
          itemsStore = itemsStore.filter(storeItem => {
            if (
              storeItem.desktopID !== this.pfandItems[0].desktopID ||
              storeItem.kassenprojektID !== this.pfandItems[0].kassenprojektID
            ) {
              return true;
            }

            return this.pfandItems.some(item =>
              item.Id === storeItem.Id
            );
          });
        }
      } else{
        itemsStore = this.pfandItems;
      }
      this.$store.commit('kasse/SET_PFAND_ITEMS',JSON.stringify(itemsStore));
    },
    setArtikelSichtbarkeit(item){
      let index = this.artikelItemsSichtbarkeit.findIndex(obj=>obj.artikelId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID);
      if(index >= 0){
        this.artikelItemsSichtbarkeit[index].sichtbar = !this.artikelItemsSichtbarkeit[index].sichtbar;
      }
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.artikelItemsSichtbarkeit));
    },
    setPfandSichtbarkeit(item){
      let index = this.pfandItemsSichtbarkeit.findIndex(obj=>obj.pfandId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID);
      if(index >= 0){
        this.pfandItemsSichtbarkeit[index].sichtbar = !this.pfandItemsSichtbarkeit[index].sichtbar;
      }
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.pfandItemsSichtbarkeit));
    },
    addArtikelItem(){
      let newId;
      if(this.artikelItems != undefined && this.artikelItems.length > 0){
        newId = +this.artikelItems[this.artikelItems.length-1].Id + 1;
      } else{
        this.artikelItems = new Array();
        newId = 1;
      }

      let artikel = {
        Id: newId,
        kassenprojektID: this.$props.selectedKassenprojekt.Id,
        desktopID: this.$props.selectedDesktop.Id,
        bezeichnung : undefined,
        preis: undefined,
        pfandId: undefined
      }

      let artikelSichtbarkeit = {
        artikelId: artikel.Id,
        kassenprojektID: artikel.kassenprojektID,
        desktopID: artikel.desktopID,
        sichtbar: true
      }

      this.artikelItems.push(artikel);
      if(!this.artikelItemsSichtbarkeit || this.artikelItemsSichtbarkeit == undefined || this.artikelItemsSichtbarkeit < 0){
        this.artikelItemsSichtbarkeit = new Array();
      }
      this.artikelItemsSichtbarkeit.push(artikelSichtbarkeit);
      this.setArticleItems(this.artikelItems);
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.artikelItemsSichtbarkeit));
    },
    addPfandItem(){
      let newId;
      if(this.pfandItems != undefined && this.pfandItems.length > 0){
        newId = +this.pfandItems[this.pfandItems.length-1].Id + 1;
      } else{
        this.pfandItems = new Array();
        newId = 1;
      }

      let pfand = {
        Id: newId,
        kassenprojektID: this.$props.selectedKassenprojekt.Id,
        desktopID: this.$props.selectedDesktop.Id,
        bezeichnung : undefined,
        preis: undefined,
        pfandId: undefined
      }

      let pfandSichtbarkeit = {
        pfandId: pfand.Id,
        kassenprojektID: pfand.kassenprojektID,
        desktopID: pfand.desktopID,
        sichtbar: true
      }

      this.pfandItems.push(pfand);
      if(!this.pfandItemsSichtbarkeit || this.pfandItemsSichtbarkeit == undefined || this.pfandItemsSichtbarkeit.length < 0){
        this.pfandItemsSichtbarkeit = new Array();
      }
      this.pfandItemsSichtbarkeit.push(pfandSichtbarkeit);
      this.setPfandItems(this.pfandItems);
      this.$store.commit('kasse/SET_PFAND_ITEMS_SICHTBARKEIT',JSON.stringify(this.pfandItemsSichtbarkeit));
    },
    getArtikelSichtbarkeit(){
      this.artikelItemsSichtbarkeit = JSON.parse(this.$store.state.kasse.artikelItemsSichtbarkeit)
    },
    getPfandSichtbarkeit(){
      this.pfandItemsSichtbarkeit = JSON.parse(this.$store.state.kasse.pfandItemsSichtbarkeit)
    },
    deleteArtikel(item){
      let index = this.artikelItems.findIndex(obj=>obj.Id == item.Id && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID);
      this.artikelItems.splice(index, 1);
      this.setArticleItems(this.artikelItems);
    },
    deletePfand(item){
      let index = this.pfandItems.findIndex(obj=>obj.Id == item.Id && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID);

      let exists = this.artikelItems.findIndex(obj=>obj.pfandId == item.Id && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID)

      if(exists >= 0){
        Swal.fire({
          title: "Nicht löschbar!",
          text: "Wird noch in einem anderen Objekt verwendet",
          icon: "error"
        });
        return;
      }

      this.pfandItems.splice(index, 1);
      this.setPfandItems(this.pfandItems);
    }
  },
  created(){
    this.getArtikel();
    this.getPfand();
    this.getArtikelSichtbarkeit();
    this.getPfandSichtbarkeit();
  }
};
</script>

<style lang="scss" scoped>
/* Basis */
* { box-sizing: border-box; }
:host, .kassensystemMain { height: 100%; }
.kassensystemMain {
  display: grid;
  grid-template-rows: var(--header-height) 1fr;
  background: var(--bg);
  color: var(--ink);
  font: 15px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  overflow: hidden;

  height: 100vh;
  width: 100vw;

  .topbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    padding: 0 14px;
    background: var(--header);
    border-bottom: 1px solid var(--border);
    z-index: 99;

    .left-actions, .right-actions {
      display: flex; align-items: center; gap: 10px;
    }
    .title { font-weight: 600; justify-self: start; cursor:default }
    .left-actions { justify-content: left; }
    .right-actions { justify-content: right; }

    .headerButton{
      background: none; color: #555; border: none;
      padding: 0;
      color: var(--ink);
    }
    
    .switchActive{
      rotate: 180deg;
    }

    .menuButton {
      padding: 6px 10px; border-radius: 999px;
      background: var(--menu-button); color: var(--ink); border: none;
      cursor: pointer;
    }

    .menuButtonActive{
      rotate:90deg;
      transition: rotate 0.5s;
    }

    .menuButtonDeactive{
      rotate:0deg;
      transition: rotate 0.5s;
    }

    .desktopTitle,.headerButton{
      cursor:pointer;
    }

    .status {
      display: flex; align-items: center; gap: 6px; color: var(--ink); font-size: 12px; cursor:default;
      .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); }
    }
  }

  .workspace {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 14px var(--right-panel-width);
    gap: 0;
  }

  .left {
    position: relative;
    display: block;
    background: var(--warenauswahl);
    border-right: 1px solid var(--border);

    .artikelAuswahl {
      position: absolute;
      inset: 0;
      overflow-y: auto;
      padding: 12px 16px 16px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(var(--itemWidth), 1fr));
      gap: 6px;
      align-content: start;
      align-items: start;
      bottom: calc(var(--bottom-row-height) + 6px);

      .hint {
        position: absolute; inset: 16px;
        border: 2px dashed #e6e8ec; border-radius: var(--radius);
      }
    }
  }

  .warenkorb {
    display: grid;
    grid-template-rows: 1fr auto;
    background: var(--warenkorb);
    box-shadow: var(--shadow);
    z-index: 0;

    &-scroll { overflow: auto; padding: 14px; }

    .total {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 16px; border-top: 1px solid var(--border);
      font-weight: 700; font-size: 18px;
      cursor: default;
    }

    .actions {
      display: flex; gap: 12px; padding: 0 16px 16px 16px;
    }
  }

  .btn {
    appearance: none; border: 0; cursor: pointer;
    padding: 14px 18px; border-radius: 12px; font-weight: 600; box-shadow: var(--shadow);
    &-primary { background: var(--brand); color: #fff; }
    &-danger  { background: var(--danger); color: #fff; }
    &-bestaetigen { width: 100%; }
  }

  .bottom-bar {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: var(--bottom-row-height);
    background: var(--pfandauswahl);
    border-top: 1px solid var(--border);
    padding: 12px 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 6px;
    align-content: start;
    align-items: start;
    max-height: 95vh;
    box-shadow: var(--shadow);
    z-index: 2;

    &.collapsed { padding: 0 16px !important; }
  }

  .v-handle, .h-handle {
    display: flex; align-items: center; justify-content: center;
    touch-action: none; user-select: none;
    .handle-square {
      width: 16px; height: 16px; background: var(--handle);
      border-radius: 4px;
      box-shadow: 0 1px 0 rgba(255,255,255,.25) inset, 0 2px 6px rgba(0,0,0,.15);
    }
  }

  .v-handle { 
    cursor: col-resize; background-color: var(--warenkorb); 
  }
  .h-handle {
    position: absolute; left: 0; right: 0;
    bottom: calc(var(--bottom-row-height)); height: 14px;
    display: flex; align-items: center; justify-content: center;
    cursor: row-resize; touch-action: none; user-select: none; z-index: 3;
  }

  @media (max-width: 900px) {
    /* Optional: Startwerte ggf. über Vuex initialisieren; hier nur Fallbacks */
  }

  /* From Uiverse.io by JustCode14 */ 
/* Theme Switch */
/* The switch - the box around the slider */
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 4em;
  height: 2em;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2a2a2a;
  transition: 0.4s;
  border-radius: 30px;
  overflow: hidden;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.2em;
  width: 1.2em;
  border-radius: 20px;
  left: 0.5em;
  bottom: 0.5em;
  transition: 0.4s;
  transition-timing-function: cubic-bezier(0.81, -0.04, 0.38, 1.5);
  box-shadow: inset 8px -4px 0px 0px #fff;
}

.switch input:checked + .slider {
  background-color: #00a6ff;
}

.switch input:checked + .slider:before {
  transform: translateX(1.8em);
  box-shadow: inset 15px -4px 0px 15px #ffcf48;
}

.star {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  width: 5px;
  transition: all 0.4s;
  height: 5px;
}

.star_1 {
  left: 2.5em;
  top: 0.5em;
}

.star_2 {
  left: 2.2em;
  top: 1.2em;
}

.star_3 {
  left: 3em;
  top: 0.9em;
}

.switch input:checked ~ .slider .star {
  opacity: 0;
}

.cloud {
  width: 3.5em;
  position: absolute;
  bottom: -1.4em;
  left: -1.1em;
  opacity: 0;
  transition: all 0.4s;
}

.switch input:checked ~ .slider .cloud {
  opacity: 1;
}

}
</style>
