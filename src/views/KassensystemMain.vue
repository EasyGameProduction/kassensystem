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
      <!--<div class="title">{{ selectedKasse.name }}</div>-->
      <div class="title"><button v-if="bargeldActive" @click="bargeld()" class="bargeldButton btn btn-primary btn-bestaetigen">Wechselgeld anfragen</button></div>
      <div class="right-actions">
        <div class="status"><span class="dot" :class="(online)?'online':'offline'"></span> {{ (online)?'online':'offline' }}</div>
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
          <Item class="artikelItem" :type="'Artikel'" v-for="artikel in this.artikelItems" :key="artikel.kassenprojektID + '-' + artikel.desktopID + '-' + artikel.Id" :item="artikel" @addItem="this.addArtikel" v-show="artikel.sichtbarkeit" :darkMode="this.darkMode"/>
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
          <Item class="pfandItem" :type="'Pfand'" v-for="pfand in this.pfandItems" :key="pfand.kassenprojektID + '-' + pfand.desktopID + '-' + pfand.Id" :item="pfand" @addItem="this.addPfand" v-show="pfand.sichtbarkeit" :darkMode="this.darkMode"/>
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
          <WarenkorbItem v-for="artikel in this.artikelAuswahl" :key="artikel.kassenprojektID + '-' + artikel.desktopID + '-' + artikel.Id" :item="artikel" :items="this.artikelItems" :pfandItem="this.getPfandItem(artikel.pfandId)" @removeItem="this.removeWArtikel" @removeAll="this.removeWAllArtikel" :lineColor="'blue'"/>
          <WarenkorbItem v-for="pfand in this.pfandAuswahl" :key="pfand.kassenprojektID + '-' + pfand.desktopID + '-' + pfand.Id" :item="pfand" :items="this.pfandItems" @removeItem="this.removeWPfand" @removeAll="this.removeWAllPfand" :lineColor="'green'"/>
        </div>

        <div class="totalCont" :style="{ transform: `translateY(calc(-1 * var(--total-up)))` }" ref="totalCont">
          <!-- Handle jetzt im totalCont - bleibt genau auf der border-top -->
          <div
            class="h-handle total-handle"
            id="hHandleRight"
            ref="hHandleRight"
            aria-label="Gesamtbereich anpassen"
            @pointerdown="onPointerDownTotal"
          >
            <div class="handle-square" role="separator" aria-orientation="horizontal"></div>
          </div>

          <div id="showTotal">
            <div class="total">
              <span>Gesamt</span>
              <span>{{rechnungsbetrag}} €</span>
            </div>
            <div class="actions">
              <div>
                <button @click="removeWAll" class="btn btn-danger"><span class="btn-text">Löschen</span></button>
                <button @click="bestaetigen(false)" class="btn btn-primary btn-bestaetigen"><span class="btn-text">Bestätigen</span></button>
              </div>
            </div>
          </div>
          <div id="zusatzButtons" class="actions">
              <div>
                <button @click="this.rechnerActive = !this.rechnerActive" class="btn btn-default"><span class="btn-text">Rechner</span></button>
                <button @click="bestaetigen(true)" class="btn btn-success"><span class="btn-text">Helfer frei</span></button>
              </div>
              <div>
                <button @click="this.showLetzteBestellung()" class="btn btn-primary"><span class="btn-text">Letzte anzeigen</span></button>
                <button @click="this.stornoLetzte()" class="btn btn-danger"><span class="btn-text">Storno Letzte</span></button>
              </div>
          </div>
        </div>
      </aside>
    </main>
  </div>

  <Menu :active="this.menuActive" :headerHeight="this.headerHeight" :style="cssVars" :artikel="this.artikelItems" :pfand="this.pfandItems" @setArticleItems="this.setArticleItems" @setPfandItems="this.setPfandItems" :artikelItemsSichtbarkeit="this.artikelItemsSichtbarkeit" :pfandItemsSichtbarkeit="this.pfandItemsSichtbarkeit" @setArtikelSichtbarkeit="this.setArtikelSichtbarkeit" @setPfandSichtbarkeit="this.setPfandSichtbarkeit" @addArtikel="this.addArtikelItem" @addPfand="this.addPfandItem" @deleteArtikel="this.deleteArtikel" @deletePfand="this.deletePfand" :darkMode="darkMode" :selectedKassenprojekt="this.$props.selectedKassenprojekt" :selectedDesktop="this.$props.selectedDesktop" @clearArtikelSichtbarkeit="this.clearArtikelSichtbarkeit" @clearPfandSichtbarkeit="this.clearPfandSichtbarkeit" @deleteBelege="this.deleteBelege" @updateArtikel="this.updateArtikel" @updatePfand="this.updatePfand"/>
  <DesktopSwitch :active="this.desktopSwitchActive" :headerHeight="this.headerHeight" :desktops="this.desktops" :kassenprojekt="selectedKassenprojekt" :style="cssVars" @switchDesktop="switchDesktop"/>
  <Rechner v-if="this.rechnerActive" :active="this.rechnerActive" :rechnerBetrag="this.rechnungsbetrag" @closeRechner="this.rechnerActive = !this.rechnerActive"/>
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
import Rechner from '@/components/Rechner.vue';
import { Desktop } from '@/backend_controller/desktop';
import { Artikel } from '@/backend_controller/artikel';
import { Pfand } from '@/backend_controller/pfand';
import { Beleg } from '@/backend_controller/beleg';

export default {
  name: 'KassensystemMain',
  components:{
    Item,
    WarenkorbItem,
    Menu,
    DesktopSwitch,
    Rechner
  },
  props:{
    selectedKassenprojekt: Object,
    selectedDesktop: Object,
    selectedKasse: Object,
    darkModeDefault: Boolean,
    online: Boolean
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

      // total handle
      totalUp: -80,             // px, wie weit die totalCont nach oben gezogen ist
      _startYTotal: 0,
      _startTotalUp: 0,
      _pointerIdTotal: null,
      MIN_TOTAL_UP: 0,        // komplett zu (nur Header sichtbar)
      MAX_TOTAL_UP: 160,      // wieviel du maximal aufdecken willst (z.B. Höhe der actions)

      // Grenzen (px)
      MIN_RIGHT: 0,
      MAX_RIGHT: 340,
      MIN_BOTTOM: 0.1,
      MAX_BOTTOM: 380,

      rechnungsbetrag: (0.00).toFixed(2),

      artikelItemsSichtbarkeit: [],
      pfandItemsSichtbarkeit: [],

      artikelItems: [],
      pfandItems: [],
      artikelAuswahl: [],
      pfandAuswahl: [],
      desktops: [],

      letzteBestellung: {
        artikelAuswahl: [],
        pfandAuswahl: [],
        rechnungsbetrag: (0.00).toFixed(2),
      },

      menuActive: false,
      headerHeight: 0,
      darkMode: this.darkModeDefault,
      desktopSwitchActive: false,
      rechnerActive: false,

      bargeldActive: false
    };
  },
  computed: {
    ...mapState('kasse', ['rightPanelWidth', 'bottomRowHeight', 'artikelItems', 'pfandItems', 'belegItems', 'desktopItems']),
    ...mapState('item', ['width', 'widthP']),

    cssVars() {
      // Alle Variablen zentral binden; Farben etc. können ebenfalls via Theme aus Vuex kommen
      if(!this.darkMode){
        return {
          '--right-panel-width': `${this.rightPanelWidth}px`,
          '--bottom-row-height': `${this.bottomRowHeight}px`,
          '--header-height': '54px',

          '--itemWidth': `${this.width}px`,
          '--itemWidthP': `${this.widthP}px`,
          '--total-up': `${this.totalUp}px`   // neu
        };
      } else{
        return {
          '--right-panel-width': `${this.rightPanelWidth}px`,
          '--bottom-row-height': `${this.bottomRowHeight}px`,
          '--header-height': '54px',

          '--itemWidth': `${this.width}px`,
          '--itemWidthP': `${this.widthP}px`,
          '--total-up': `${this.totalUp}px`   // neu
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

    // ====== Horizontaler Griff (rechts / Warenkorb) ======
    onPointerDownTotal(e) {
      // capture
      this._pointerIdTotal = e.pointerId;
      e.currentTarget.setPointerCapture?.(this._pointerIdTotal);
      this._startYTotal = e.clientY;
      this._startTotalUp = this.totalUp;

      window.addEventListener('pointermove', this.onPointerMoveTotal);
      window.addEventListener('pointerup', this.onPointerUpTotal);
    },

    onPointerMoveTotal(e) {
      const dy = e.clientY - this._startYTotal;
      // dy > 0 -> pointer nach unten bewegt -> totalUp soll kleiner werden (nach unten schieben)
      // dy < 0 -> pointer nach oben -> totalUp erhöhen (mehr aufdecken)
      let newTotalUp = this._startTotalUp - dy; // weil y-Koord nach unten wächst
      newTotalUp = Math.max(this.MIN_TOTAL_UP, Math.min(this.MAX_TOTAL_UP, Math.round(newTotalUp)));
      this.totalUp = newTotalUp;
    },

    onPointerUpTotal() {
      window.removeEventListener('pointermove', this.onPointerMoveTotal);
      window.removeEventListener('pointerup', this.onPointerUpTotal);
      this.$refs.hHandleRight?.releasePointerCapture?.(this._pointerIdTotal);
      this._pointerIdTotal = null;
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
          pfandId: artikel.pfandId,
          reihenfolge: this.artikelItems[this.artikelItems.length - 1].reihenfolge + 1
        }
        this.artikelAuswahl.push(newArtikel);
      }
      console.log(this.artikelAuswahl);

      let preis = +this.artikelItems.find(a=>a.Id == artikel.Id).preis;
      if(artikel.pfandId != undefined && artikel.pfandId != ""){
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
      if(artikel.pfandId != undefined && artikel.pfandId != ""){
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
      if(artikel.pfandId != undefined && artikel.pfandId != ""){
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
      } else{
        this.getArtikel();
        this.getPfand();
        this.getBelege();
      }
    },
    async getBelege(){
        try{
            this.belege = await Beleg.get(this.$props.selectedKassenprojekt.Id);
        } catch(err){
            this.belege = await Beleg.getLocal(this.$props.selectedKassenprojekt.Id);
        }
        this.belege = this.belege.filter(obj=>obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
        this.belege = this.belege.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    },
    openDesktopSwitch(){
      this.desktopSwitchActive = !this.desktopSwitchActive;
      this.headerHeight = document.getElementById('topbar').getBoundingClientRect().height;
      console.log(this.headerHeight);
    },
    bestaetigen(helferFrei, storno){
      let artikelAuswahl = this.artikelAuswahl;
      let pfandAuswahl = this.pfandAuswahl;
      let rechnungsbetrag = this.rechnungsbetrag;

      this.letzteBestellung = {
        artikelAuswahl: artikelAuswahl,
        pfandAuswahl: pfandAuswahl,
        rechnungsbetrag: rechnungsbetrag
      }

      if(storno){
        rechnungsbetrag = -rechnungsbetrag;
        console.log(this.rechnungsbetrag);
      }

      var neuerBeleg = {
        time: new Date(),
        kasse: this.$props.selectedKasse.Id,
        kassenprojektID: this.$props.selectedKassenprojekt.Id,
        desktopID: this.$props.selectedDesktop.Id,
        artikelAuswahl: artikelAuswahl,
        pfandAuswahl: pfandAuswahl,
        rechnungsbetrag: rechnungsbetrag,
        helferFrei: helferFrei,
        storno: storno
      }
      console.log(neuerBeleg);

      /*try{
        let belege = JSON.parse(this.$store.state.kasse.belegItems);
        belege.push(neuerBeleg);
        this.$store.commit('kasse/SET_BELEG_ITEMS', JSON.stringify(belege))
      } catch(err){
        let neueBelege = new Array();
        neueBelege.push(neuerBeleg);
        this.$store.commit('kasse/SET_BELEG_ITEMS', JSON.stringify(neueBelege))
      }*/
      this.appendBeleg(neuerBeleg);
      console.log(neuerBeleg);
      this.removeWAll();
    },
    async switchDesktop(desktop){
      await this.$emit('selectDesktop', desktop);
      this.desktopSwitchActive = false;
      this.getArtikel();
      this.getPfand();
      this.removeWAll();
    },
    async getDesktops(){
      try{
        this.desktops = await Desktop.get(this.$props.selectedKassenprojekt.Id)
      } catch(err){
        this.desktops = Desktop.getLocal(this.$props.selectedKassenprojekt.Id)
      }
    },
    async getArtikel(){
      try{
        this.artikelItems = await Artikel.get(this.$props.selectedKassenprojekt.Id, this.$props.selectedDesktop.Id)
      } catch(err){
        this.artikelItems = Artikel.getLocal(this.$props.selectedKassenprojekt.Id, this.$props.selectedDesktop.Id)
      }
    },
    async updateArtikel(artikel){
      if(artikel != undefined){
        try{
          await Artikel.update(artikel)
          
        } catch(err){
          Artikel.updateLocal(artikel)
        }
        this.getArtikel();
      }
    },
    async deleteArtikelItem(artikel){
      try{
        await Artikel.delete(artikel)
      } catch(err){
        Artikel.deleteLocal(artikel)
      }
    },
    async appendArtikel(artikel){
      try{
        await Artikel.add(artikel)
      } catch(err){
        Artikel.addLocal(artikel)
      }
    },
    async appendBeleg(beleg){
      try{
        await Beleg.add(beleg)
      } catch(err){
        Beleg.addLocal(beleg)
      }
    },
    async updatePfand(pfand){
      if(pfand != undefined){
        try{
          await Pfand.update(pfand)
        } catch(err){
          Pfand.updateLocal(pfand)
        }
      }
    },
    async deletePfandItem(pfand){
      try{
        await Pfand.delete(pfand)
      } catch(err){
        Pfand.deleteLocal(pfand)
      }
    },
    async appendPfand(pfand){
      try{
        await Pfand.add(pfand)
      } catch(err){
        Pfand.addLocal(pfand)
      }
    },
    async getPfand(){
      try{
        this.pfandItems = await Pfand.get(this.$props.selectedKassenprojekt.Id, this.$props.selectedDesktop.Id)
        console.log(this.pfandItems);
      } catch(err){
        this.pfandItems = Pfand.getLocal(this.$props.selectedKassenprojekt.Id, this.$props.selectedDesktop.Id)
      }
    },
    async setArticleItems(artikelItems){

      /*if (!artikelItems) {
        this.artikelItems = [];
        return;
      }
      await Artikel.deleteLocalFromDesktop(this.$props.selectedKassenprojekt.Id, this.$props.selectedDesktop.Id)
      for (const item of artikelItems) {
        this.appendArtikel(item);
      }
      this.artikelItems = artikelItems;*/
    },
    async setPfandItems(pfandItems){
      /*if (!pfandItems) {
        this.pfandItems = [];
        return;
      }
      await Pfand.deleteLocalFromDesktop(this.$props.selectedKassenprojekt.Id, this.$props.selectedDesktop.Id)
      for (const item of pfandItems) {
        this.appendPfand(item);
      }
      this.pfandItems = pfandItems;*/
    },
    setArtikelSichtbarkeit(item){
      /*let index = this.artikelItemsSichtbarkeit.findIndex(obj=>obj.artikelId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID);
      if(index >= 0){
        this.artikelItemsSichtbarkeit[index].sichtbar = !this.artikelItemsSichtbarkeit[index].sichtbar;
      }
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.artikelItemsSichtbarkeit));*/
    },
    setPfandSichtbarkeit(item){
      /*let index = this.pfandItemsSichtbarkeit.findIndex(obj=>obj.pfandId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID);
      if(index >= 0){
        this.pfandItemsSichtbarkeit[index].sichtbar = !this.pfandItemsSichtbarkeit[index].sichtbar;
      }
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.pfandItemsSichtbarkeit));*/
    },
    addArtikelItem(artikelDefault){
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
        pfandId: undefined,
        reihenfolge: newId,
        sichtbarkeit: true
      }

      if(artikelDefault != undefined && artikelDefault != null){
        artikel.bezeichnung = artikelDefault.bezeichnung;
        artikel.preis = artikelDefault.preis;
        artikel.pfandId = artikelDefault.pfandId
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
      //this.setArticleItems(this.artikelItems);
      this.appendArtikel(artikel);
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.artikelItemsSichtbarkeit));
    },
    addPfandItem(pfandDefault){
      console.log(this.pfandItems);
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
        sichtbarkeit: true
        //pfandId: undefined
      }

      if(pfandDefault != undefined && pfandDefault != null){
        pfand.bezeichnung = pfandDefault.bezeichnung;
        pfand.preis = pfandDefault.preis;
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
      //this.setPfandItems(this.pfandItems);
      this.appendPfand(pfand);
      this.$store.commit('kasse/SET_PFAND_ITEMS_SICHTBARKEIT',JSON.stringify(this.pfandItemsSichtbarkeit));
      console.log(this.pfandItems);
    },
    getArtikelSichtbarkeit(){
      this.artikelItemsSichtbarkeit = JSON.parse(this.$store.state.kasse.artikelItemsSichtbarkeit)
    },
    getPfandSichtbarkeit(){
      this.pfandItemsSichtbarkeit = JSON.parse(this.$store.state.kasse.pfandItemsSichtbarkeit)
    },
    deleteArtikel(item){
      this.artikelAuswahl = this.artikelAuswahl.filter(obj=>obj.Id != item.Id);
      
      let index = this.artikelItems.findIndex(obj=>obj.Id == item.Id && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID);
      this.artikelItems.splice(index, 1);

      /*index = this.artikelItemsSichtbarkeit.findIndex(obj=>obj.Id == item.artikelId && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID);
      this.artikelItemsSichtbarkeit.splice(index, 1);
      this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.artikelItemsSichtbarkeit));*/

      this.deleteArtikelItem(item);
      //this.setArticleItems(this.artikelItems);
    },
    deletePfand(item){
      let index = this.pfandItems.findIndex(obj=>obj.Id == item.Id && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID);

      try{
        let exists = this.artikelItems.findIndex(obj=>obj.pfandId == item.Id && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID)

        if(exists >= 0){
          Swal.fire({
            title: "Nicht löschbar!",
            text: "Wird noch in einem anderen Objekt verwendet",
            icon: "error"
          });
          return;
        }
      } catch(err){
        
      }

      this.pfandAuswahl = this.pfandAuswahl.filter(obj=>obj.Id != item.pfandId)

      this.pfandItems.splice(index, 1);

      /*index = this.pfandItemsSichtbarkeit.findIndex(obj=>obj.Id == item.pfandId && obj.kassenprojektID == item.kassenprojektID && obj.desktopID == item.desktopID);
      this.pfandItemsSichtbarkeit.splice(index, 1);
      this.$store.commit('kasse/SET_PFAND_ITEMS_SICHTBARKEIT',JSON.stringify(this.pfandItemsSichtbarkeit));*/

      this.deletePfandItem(item);
      //this.setPfandItems(this.pfandItems);
    },
    getItemVisible(item, objekt){
      if(objekt == 'artikel'){
        let artikel = item;
        try{
          if(this.artikelItemsSichtbarkeit != undefined && this.artikelItemsSichtbarkeit.find(obj=>obj.artikelId == artikel.Id && obj.desktopID == artikel.desktopID && obj.kassenprojektID == artikel.kassenprojektID).sichtbar){
            return true;
          } else{
            return false;
          }
        } catch(err){
          try{
            if(this.artikelItemsSichtbarkeit.findIndex(obj=>obj.artikelId == artikel.Id && obj.desktopID == artikel.desktopID && obj.kassenprojektID == artikel.kassenprojektID) < 0){
              let artikelSichtbarkeit = {
                artikelId: artikel.Id,
                kassenprojektID: artikel.kassenprojektID,
                desktopID: artikel.desktopID,
                sichtbar: true
              }
              this.artikelItemsSichtbarkeit.push(artikelSichtbarkeit);
              this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.artikelItemsSichtbarkeit));
            }
          } catch(err2){
            return;
          }
        }
      } else{
        let pfand = item;
        try{
          if(this.pfandItemsSichtbarkeit != undefined && this.pfandItemsSichtbarkeit.find(obj=>obj.pfandId == pfand.Id && obj.desktopID == pfand.desktopID && obj.kassenprojektID == pfand.kassenprojektID).sichtbar){
            return true;
          } else{
            return false;
          }
        } catch(err){
          try{
            if((this.pfandItemsSichtbarkeit.findIndex(obj=>obj.pfandId == pfand.Id && obj.desktopID == pfand.desktopID && obj.kassenprojektID == pfand.kassenprojektID)) < 0){
              let pfandSichtbarkeit = {
                pfandId: pfand.Id,
                kassenprojektID: pfand.kassenprojektID,
                desktopID: pfand.desktopID,
                sichtbar: true
              }
              this.pfandItemsSichtbarkeit.push(pfandSichtbarkeit);
              this.$store.commit('kasse/SET_PFAND_ITEMS_SICHTBARKEIT',JSON.stringify(this.pfandItemsSichtbarkeit));
            }
          } catch(err2){
            return;
          }
        }
      }
    },
    showLetzteBestellung(){
      this.artikelAuswahl = this.letzteBestellung.artikelAuswahl;
      this.pfandAuswahl = this.letzteBestellung.pfandAuswahl;
      this.rechnungsbetrag = this.letzteBestellung.rechnungsbetrag;
      if((this.artikelAuswahl == undefined || this.artikelAuswahl.length == 0) && (this.pfandAuswahl == undefined || this.pfandAuswahl.length == 0)){
        let belege = JSON.parse(this.$store.state.kasse.belegItems);
        let index = belege.length - 1;
        let stornoBeleg;
        while(index >= 0){
          if(belege[index].kassenprojektID == this.$props.selectedKassenprojekt.Id && belege[index].desktopID ==this.$props.selectedDesktop.Id){
            stornoBeleg = belege[belege.length - 1];
            break;
          }
          index--;
        }
        if(index >= 0){
          this.artikelAuswahl = stornoBeleg.artikelAuswahl;
          this.pfandAuswahl = stornoBeleg.pfandAuswahl;
          this.rechnungsbetrag = stornoBeleg.rechnungsbetrag;
        } else{
          this.artikelAuswahl = [];
          this.pfandAuswahl = [];
          this.rechnungsbetrag = '0.00';
        }
      }
    },
    async stornoLetzte(){
      let belege = JSON.parse(this.$store.state.kasse.belegItems);
      if(!belege || belege == undefined || belege.length <= 0){
        return;
      } else{
        let index = belege.length - 1;
        let stornoBeleg;
        while(index >= 0){
          if(belege[index].kassenprojektID == this.$props.selectedKassenprojekt.Id && belege[index].desktopID ==this.$props.selectedDesktop.Id){
            stornoBeleg = belege[belege.length - 1];
            break;
          }
          index--;
        }
        if(index >= 0){
          await Swal.fire({
            title: "Bestellung mit Rechnungsbetrag: " + stornoBeleg.rechnungsbetrag + " € wirklich stornieren?",
            showCancelButton: true,
            confirmButtonText: "Stornieren",
            cancelButtonText: `Abbrechen`,
            confirmButtonColor: `var(--swal2-deny-button-background-color)`
          }).then((result)=>{
            if(result.isConfirmed){
              this.bestaetigen(stornoBeleg.helferFrei, true);
              console.log(stornoBeleg);
              //belege.splice(index, 1);
              
              Swal.fire({
                title: "Rechnung storniert",
                text: "Die letzte Rechnung mit dem Rechnungsbetrag: " + stornoBeleg.rechnungsbetrag + " € wurde storniert.",
                icon: "info"
              });
              this.artikelAuswahl = [];
              this.pfandAuswahl = [];
              this.rechnungsbetrag = 0.00;
              this.$store.commit('kasse/SET_BELEG_ITEMS',JSON.stringify(belege));
              this.belegItems = belege;
            }
          });
        }
      }
    },
    clearArtikelSichtbarkeit(){
      try{
        this.artikelItemsSichtbarkeit = JSON.parse(this.$store.state.kasse.artikelItemsSichtbarkeit);
        this.artikelItemsSichtbarkeit = this.artikelItemsSichtbarkeit.filter(obj=>obj.kassenprojektID != this.$props.selectedKassenprojekt.Id && obj.desktopID != this.$props.selectedDesktop.Id);
        this.$store.commit('kasse/SET_ARTIKEL_ITEMS_SICHTBARKEIT',JSON.stringify(this.artikelItemsSichtbarkeit));
      } catch(err){

      }
    },
    clearPfandSichtbarkeit(){
      try{
        this.pfandItemsSichtbarkeit = JSON.parse(this.$store.state.kasse.pfandItemsSichtbarkeit);
        this.pfandItemsSichtbarkeit = this.pfandItemsSichtbarkeit.filter(obj=>obj.kassenprojektID != this.$props.selectedKassenprojekt.Id && obj.desktopID != this.$props.selectedDesktop.Id);
        this.$store.commit('kasse/SET_PFAND_ITEMS_SICHTBARKEIT',JSON.stringify(this.pfandItemsSichtbarkeit));
      } catch(err){

      }
    },
    deleteBelege(){
      try{
        let belege = JSON.parse(this.$store.state.kasse.belegItems);
        belege = belege.filter(obj=>obj.kassenprojektID != this.$props.selectedKassenprojekt.Id && obj.desktopID != this.$props.selectedDesktop.Id);
        this.belegItems = belege;
        console.log(this.belegItems);
        this.$store.commit('kasse/SET_BELEG_ITEMS', JSON.stringify(belege));
      } catch(err){
        return;
      }
    },
    getPfandItem(pfandId){
      try{
        return this.pfandItems.find(p=>p.Id == pfandId)
      } catch(err){
        return undefined;
      }
    },
    async bargeld(){
      const emailData = {
          to: 'kassier@ffw-poppenhausen.de',
          subject: 'Wechselgeld auffüllen: ' + this.$props.selectedDesktop.name,
          text: 'Wechselgeld bei Kasse: ' + this.$props.selectedDesktop.name + ' muss aufgefüllt werden.'
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
          } else{
            Swal.fire({
              title: "Kassiere benachrichtigt",
              text: "Es wurde eine Email an die Kassiere geschickt.",
              icon: "info"
            })
          }
      } catch (error) {
          Swal.fire({
            title: "Fehler",
            text: "Benachrichtigung konnte nicht gesendet werden.",
            icon: "error"
          })
          console.error('Error in sendEmail:', error);
      }
    }
  },
  async created(){
    if(window.screen.width < 700){
      this.$store.commit('kasse/SET_RIGHT_PANEL_WIDTH', '0')
    }

    await this.getArtikel();
    await this.getPfand();
    this.getArtikelSichtbarkeit();
    this.getPfandSichtbarkeit();
    if((this.artikelItems == undefined || this.artikelItems.length == 0) && (this.pfandItems == undefined || this.pfandItems.length == 0)){
        Swal.fire({
          title: "Artikel hinzufügen",
          text: `Sie können über "Menü->Daten" neue Artikel anlegen`,
          icon: "info"
        });
    };
    this.getDesktops();

    if(localStorage.getItem('konvKey') == 'dafsjokj274' || localStorage.getItem('konvKey') == 'U2FsdGVkX1867k9DRE7eQ+27VEzN0fGtSxR6A8VVXMvARueP3JWpqKOFjwu9ZKtbqyfVhwnBmqVT8n+lHQBiLtrFO82Ybt5Qs9TZ8DK7L9kDkBxz0vyJVLRWhGzI49WO'){
      this.bargeldActive = true;
    }
  },
  mounted(){
    const showTotalEl = document.getElementById("showTotal");
    const zusatzEl = document.getElementById("zusatzButtons");

    if (showTotalEl && zusatzEl) {
      const showTotalHeight = showTotalEl.offsetHeight;
      const zusatzHeight = zusatzEl.offsetHeight;

      // totalCont-Höhe nur so hoch wie showTotal
      this.$refs.totalCont.style.height = `${showTotalHeight}px`;

      // totalUp initial = 0 (nur showTotal sichtbar)
      this.totalUp = 0;

      // MAX_TOTAL_UP = Höhe von zusatzButtons
      this.MAX_TOTAL_UP = zusatzHeight + 10;
      this.MIN_TOTAL_UP = 0;
    }
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
  width: 100%;

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
      .dot { width: 7px; height: 7px; border-radius: 50%; }

      .online{
        background: var(--ok);
      }

      .offline{
        background: var(--danger);
      }
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

  .warenkorb-scroll{
    max-height: 65vh;
  }

  #zusatzButtons{
    padding-bottom: 0;
    margin-bottom: 0;
    div{
      display: flex;
      justify-content: space-between;
      button{
        width: 50%;
      }
    }
  }

  .warenkorb {
    display: grid;
    grid-template-rows: 1fr auto;
    background: var(--warenkorb);
    box-shadow: var(--shadow);
    z-index: 10;
    position: relative;

    &-scroll { overflow: auto; padding: 14px; }

    .total {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 16px;
      font-weight: 700; font-size: 18px;
      cursor: default;
    }

    .totalCont{
      border-top: 1px solid var(--border);
    }

    .actions {
      padding: 0 16px 4px 16px; 
      div{
        margin-bottom: 0.5rem;
        display: flex; gap: 12px; 
      }
    }
  }

  /* Handle, das über der border-top von .totalCont liegt */
  .total-handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(var(--total-up)); /* 54px ist die Höhe der .total (header) - evtl anpassen */
    z-index: 6;
    cursor: row-resize;
  }

  /* Handle INSIDE totalCont: genau über der border-top */
  .totalCont .total-handle {
    position: absolute;
    top: -8px;                     /* halbe Höhe des handles über der border-top */
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
    cursor: row-resize;
  }

  /* totalCont: wird nach oben verschoben */
  .totalCont {
    //position: fixed;
    border-top: 1px solid var(--border);
    background: var(--warenkorb);
    will-change: transform;
    transition: transform 0s; /* kein Übergang beim Ziehen; wenn gewünscht: add easing beim release */
    z-index: 5;
    bottom: 0px;
    min-width: 100%;
    position: absolute;
    /* falls du einen "Sichtbarkeitsclip" brauchst: */
    /* overflow: hidden; */
  }

  /* kleine optische Anpassung: der Handle soll genau über der border-top sitzen */
  .totalCont::before {
    content: "";
    display: block;
    height: 0;
  }


  .btn {
    appearance: none; border: 0; cursor: pointer;
    padding: 14px 18px; border-radius: 12px; font-weight: 600; box-shadow: var(--shadow);
    &-primary { background: var(--brand); color: #fff; }
    &-danger  { background: var(--danger); color: #fff; }
    &-bestaetigen { width: 100%; }
    &-success {background: var(--success); color: #fff;}
    &-default {background: var(--default); color: #fff;}
  }

  .bottom-bar {
    position: absolute; left: 0; right: 0; bottom: 0;
    height: var(--bottom-row-height);
    background: var(--pfandauswahl);
    border-top: 1px solid var(--border);
    padding: 12px 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--itemWidthP), 1fr));
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
    z-index: 10;
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
