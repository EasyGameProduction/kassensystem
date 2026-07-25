<template>
  <div
    class="menuContainer"
    :class="{
      menuActive: active,
      menuDeactive: !active,
      collapsed: collapsed
    }"
    :style="containerStyle"
    role="dialog"
    aria-hidden="false"
  >
    <aside
      class="leftContainer"
      role="complementary"
      aria-label="Seitenmenü"
      :aria-expanded="!collapsed"
    >
      <button
        class="collapseBtn"
        @click="toggleCollapsed"
        :aria-pressed="collapsed"
        :title="collapsed ? 'Ausklappen' : 'Einklappen'"
      >
        <span class="icon">{{ collapsed ? '➤' : '◀' }}</span>
        <span class="label" v-if="!collapsed">Menü</span>
      </button>

      <nav class="navList" aria-label="Navigation">
        <button class="navItem" :class="daten?'navItem-active':''" @click="daten = true; anzeige = false; admin = false; weitere = false; belege = false">
          <span class="navIcon">📝</span>
          <span class="navLabel">Daten</span>
        </button>

        <button class="navItem" :class="anzeige?'navItem-active':''" @click="anzeige = true; daten = false; admin = false; weitere = false; belege = false">
          <span class="navIcon">🖥️</span>
          <span class="navLabel">Anzeige</span>
        </button>

        <button class="navItem" :class="admin?'navItem-active':''" @click="anzeige = false; daten = false; admin = true; weitere = false; belege = false">
          <span class="navIcon">🧭</span>
          <span class="navLabel">Adminkonsole</span>
        </button>

        <button class="navItem" :class="belege?'navItem-active':''" @click="anzeige = false; daten = false; admin = false; weitere = false; belege = true">
          <span class="navIcon">🧾</span>
          <span class="navLabel">Belege</span>
        </button>

        <button class="navItem" :class="weitere?'navItem-active':''" @click="anzeige = false; daten = false; admin = false; weitere = true; belege = false">
          <span class="navIcon">⚙️</span>
          <span class="navLabel">Erweiterte Einstellungen</span>
        </button>
      </nav>
    </aside>

    <main class="rightContainer" role="main">
      <div id="daten" class="contentContainer" v-if="daten">
        <h1>Daten</h1>
        <div class="datenHeader"><h2>Artikel:</h2><div><button class="plusButton" @click="this.addArtikel()" :disabled="this.$props.selectedKassenprojekt.closed">+</button><button class="exportButton" @click="this.exportData(artikel, 'artikel')">📥</button><button class="importButton" @click="this.importWithSwal('artikel')" :disabled="this.$props.selectedKassenprojekt.closed">📤</button></div></div>

        <!-- draggable wrapper: v-model linked to items -->
        <draggable
          v-model="artikelItems"
          item-key="id"
          class="itemsWrapper"
          ghost-class="drag-ghost"
          chosen-class="drag-chosen"
          handle=".dragHandle"
          @end="onDragEnd"
          :disabled="this.$props.selectedKassenprojekt.closed"
        >
          <template #item="{ element: item, index }">
            <div class="itemContainer" :data-id="item.id" >
              <div class="itemHeader">
                <button class="loeschen" @click="this.deleteArtikel(item)" :disabled="this.$props.selectedKassenprojekt.closed">🗑</button>
                <button class="colorWheel" @click="this.openColorPicker(item)"><div class="dot"  :style="'background-color: ' + ((darkMode)?item.bgcolor:item.color)"></div></button>

                <span class="dragHandle" title="Ziehen">⠿</span>
                <input
                    :id="'bezeichnung-'+item.id"
                    maxlength="40"
                    placeholder="Bezeichnung"
                    type="text"
                    v-model="item.bezeichnung"
                     @blur="this.updateArtikel(item)"
                     :disabled="this.$props.selectedKassenprojekt.closed"
                />
                <span class="itemButton fa" @click="switchSichtbarkeitArtikel(item)" title="Sichtbar" v-if="item.sichtbarkeit">&#xf06e;</span>
                <span class="itemButton fa" @click="switchSichtbarkeitArtikel(item)" title="Unsichtbar" v-if="!item.sichtbarkeit">&#xf070;</span>
              </div>

              <label :for="'preis-'+item.id">Preis (€): </label>
              <input
                :id="'preis-'+item.id"
                placeholder="Preis"
                type="number"
                step="0.01"
                min="0.00"
                max="999.99"
                v-model.number="item.preis"
                 @blur="this.updateArtikel(item)"
                  :disabled="this.$props.selectedKassenprojekt.closed"
              />

              <label :for="'pfand-'+item.id">Pfand: </label>
              <select :id="'pfand-'+item.pfandId" v-model="item.pfandId"  @blur="this.updateArtikel(item)" :disabled="this.$props.selectedKassenprojekt.closed">
                <option v-for="pfand in this.pfandItems" :key="pfand.Id" :value="pfand.Id">{{ pfand.bezeichnung }}</option>
              </select>
            </div>
          </template>
        </draggable>
        <br/>
        <div class="datenHeader"><h2>Pfand:</h2><div><button class="plusButton" @click="this.addPfand()" :disabled="this.$props.selectedKassenprojekt.closed">+</button><button class="exportButton" @click="this.exportData(pfand, 'pfand')">📥</button><button class="importButton" @click="this.importWithSwal('pfand')" :disabled="this.$props.selectedKassenprojekt.closed">📤</button></div></div>
        <draggable
          v-model="pfandItems"
          item-key="Id"
          class="itemsWrapper"
          ghost-class="drag-ghost"
          chosen-class="drag-chosen"
          handle=".dragHandle"
          @end="onDragEndPfand"
           :disabled="this.$props.selectedKassenprojekt.closed"
        >
          <template #item="{ element: item, index }">
            <div class="itemContainer" :data-id="item.Id" >
              <div class="itemHeader">
                <button class="loeschen" @click="this.deletePfand(item)" :disabled="this.$props.selectedKassenprojekt.closed">🗑</button>
                <button class="colorWheel" @click="this.openColorPicker(item)"><div class="dot"  :style="'background-color: ' + ((darkMode)?item.bgcolor:item.color)"></div></button>

                <span class="dragHandle" title="Ziehen">⠿</span>
                <input
                    :id="'bezeichnung-'+item.Id"
                    maxlength="20"
                    placeholder="Bezeichnung"
                    type="text"
                    v-model="item.bezeichnung"
                    @blur="this.updatePfand(item)"
                     :disabled="this.$props.selectedKassenprojekt.closed"
                />
                <span class="itemButton fa" @click="switchSichtbarkeitPfand(item)" title="Sichtbar" v-if="item.sichtbarkeit">&#xf06e;</span>
                <span class="itemButton fa" @click="switchSichtbarkeitPfand(item)" title="Unsichtbar" v-if="!item.sichtbarkeit">&#xf070;</span>
              </div>

              <label :for="'preis-'+item.Id">Preis (€): </label>
              <input
                :id="'preis-'+item.Id"
                placeholder="Preis"
                type="number"
                step="0.01"
                min="0.00"
                max="999.99"
                v-model.number="item.preis"
                @blur="this.updatePfand(item)"
                 :disabled="this.$props.selectedKassenprojekt.closed"
              />
            </div>
          </template>
        </draggable>
      </div>
      <div id="anzeige" class="contentContainer" v-if="anzeige">
        <h1>Anzeige</h1>
        <div class="anzeigeTitle">
          <h2>Artikel:</h2>
          <button @click="this.itemReset()">Reset</button>
        </div>
        <div id="itemAnzeige">
          <div>
            <p>Schriftgröße Titel:</p>
            <span>{{ itemTitleSize }}</span>
            <input type="range" min="12" max="60" class="slider" v-model="itemTitleSize" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Schriftgröße Preis:</p>
            <span>{{ itemPriceSize }}</span>
            <input type="range" min="12" max="50" class="slider" v-model="itemPriceSize" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Höhe</p>
            <span>{{ itemHeight }}</span>
            <input type="range" min="90" max="180" class="slider" v-model="itemHeight" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Breite</p>
            <span>{{ itemWidth }}</span>
            <input type="range" min="200" max="300" class="slider" v-model="itemWidth" @pointerdown="startInteraction" />
          </div>
        </div>
        <br><br><br>
        <div class="anzeigeTitle">
          <h2>Pfand:</h2>
          <button @click="this.itemPReset()">Reset</button>
        </div>
        <div id="itemAnzeige">
          <div>
            <p>Schriftgröße Titel:</p>
            <span>{{ itemTitleSizeP }}</span>
            <input type="range" min="12" max="60" class="slider" v-model="itemTitleSizeP" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Schriftgröße Preis:</p>
            <span>{{ itemPriceSizeP }}</span>
            <input type="range" min="12" max="50" class="slider" v-model="itemPriceSizeP" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Höhe</p>
            <span>{{ itemHeightP }}</span>
            <input type="range" min="90" max="180" class="slider" v-model="itemHeightP" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Breite</p>
            <span>{{ itemWidthP }}</span>
            <input type="range" min="200" max="300" class="slider" v-model="itemWidthP" @pointerdown="startInteraction" />
          </div>
        </div>
        <br><br><br>
        <div class="anzeigeTitle">
          <h2>Warenkorbitem:</h2>
          <button @click="this.witemReset()">Reset</button>
        </div>
        <div id="itemAnzeige">
          <div>
            <p>Schriftgröße Anzahl:</p>
            <span>{{ witemAnzahlSize }}</span>
            <input type="range" min="12" max="30" class="slider" v-model="witemAnzahlSize" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Schriftgröße Bezeichnung:</p>
            <span>{{ witemTitleSize }}</span>
            <input type="range" min="12" max="30" class="slider" v-model="witemTitleSize" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Schriftgröße Preis:</p>
            <span>{{ witemPriceSize }}</span>
            <input type="range" min="12" max="24" class="slider" v-model="witemPriceSize" @pointerdown="startInteraction" />
          </div>
          <div>
            <p>Schriftgröße Pfand</p>
            <span>{{ witemPfandSize }}</span>
            <input type="range" min="10" max="20" step="0.5" class="slider" v-model="witemPfandSize" @pointerdown="startInteraction" />
          </div>
        </div>
      </div>
      <div id="admin" class="contentContainer" v-if="admin">
        <h1>Adminkonsole</h1>
        <Adminkonsole v-if="active" :artikel="this.artikelItems" :pfand="this.pfandItems" :selectedKassenprojekt="this.$props.selectedKassenprojekt" :selectedDesktop="this.$props.selectedDesktop" :style="cssVars" :darkMode="this.$props.darkMode" @openBeleg="this.openBeleg"/>
      </div>
      <div id="belege" class="contentContainer" v-if="belege">
        <h1>Belege</h1>
        <div class="anzeigeTitle">
          <h2>{{ selectedKassenprojekt.name }} - {{ selectedDesktop.name }}:</h2>
          <button v-if="false" @click="this.belegeLoeschen()">Löschen</button>
        </div>
        <BelegAnzeige :artikelItems="this.artikelItems" :pfandItems="this.pfandItems" :selectedKassenprojekt="this.$props.selectedKassenprojekt" :selectedDesktop="this.$props.selectedDesktop" :style="cssVars" :selectedBeleg="this.selectedBeleg" @clearSelectedBeleg="this.selectedBeleg = {}"/>
      </div>
      <div id="weitere" class="contentContainer" v-if="weitere">
        <h1>Erweiterte Einstellungen</h1>
          
      </div>
    </main>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapState } from 'vuex';
import Swal from 'sweetalert2';
import Adminkonsole from "./Menu/Adminkonsole.vue";
import BelegAnzeige from "./Menu/BelegAnzeige.vue";

export default {
  name: "Menu",
  components: { 
    draggable,
    Adminkonsole,
    BelegAnzeige
   },
  props: {
    artikel: Array,
    pfand: Array,
    active: {
      type: Boolean,
      default: true,
    },
    headerHeight: {
      type: Number,
      default: 0,
    },
    sidebarWidth: {
      type: Number,
      default: 280,
    },
    sidebarCollapsedWidth: {
      type: Number,
      default: 64,
    },
    artikelItemsSichtbarkeit: Array,
    pfandItemsSichtbarkeit: Array,
    darkMode: Boolean,
    selectedKassenprojekt: Object,
    selectedDesktop: Object
  },
  data() {
    return {
      collapsed: false,
      daten: true,
      anzeige: false,
      admin: false,
      weitere: false,
      belege: false,
      // items Array: nutze id, name, preis, pfand
      items: [
        { id: 1, name: "Cola", preis: 1.99, pfand: "0.25" },
        { id: 2, name: "Wasser", preis: 0.89, pfand: "0.25" },
        { id: 3, name: "Saft", preis: 2.49, pfand: "kein" },
        { id: 4, name: "Tee", preis: 1.29, pfand: "kein" },
        { id: 5, name: "Kaffee", preis: 2.99, pfand: "kein" },
        { id: 6, name: "Limo", preis: 1.59, pfand: "0.25" },
      ],
      artikelItems: [],
      pfandItems: [],

      itemTitleSize: 18,
      itemPriceSize: 15,
      itemHeight: 100,
      itemWidth: 220,

      itemTitleSizeP: 18,
      itemPriceSizeP: 15,
      itemHeightP: 100,
      itemWidthP: 220,

      witemAnzahlSize: 0,
      witemTitleSize: 0,
      witemPriceSize: 0,
      witemPfandSize: 0,

      importedData: null,

      selectedBeleg: {},

      interactingSlider: false,
    };
  },
  methods: {
    openBeleg(beleg){
      this.selectedBeleg = beleg;
      this.admin = false;
      this.belege = true;
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    onDragEnd(evt) {
      //this.$emit('setArticleItems', this.artikelItems);
      let index = 1;
      this.artikelItems.forEach(item=>{
        item.reihenfolge = index;
        index++;
        this.updateArtikel(item);
      })
      console.log(this.artikelItems);
    },
    onDragEndPfand(evt) {
      this.$emit('setPfandItems', this.pfandItems);
    },
    switchSichtbarkeitArtikel(item){
      item.sichtbarkeit = !item.sichtbarkeit;
      this.updateArtikel(item);
      console.log(item);
      this.$emit('setArtikelSichtbarkeit', item);
    },
    switchSichtbarkeitPfand(item){
      item.sichtbarkeit = !item.sichtbarkeit;
      this.updatePfand(item);
      this.$emit('setPfandSichtbarkeit', item);
    },
    addArtikel(){
      this.$emit('addArtikel');
    },
    addPfand(){
      this.$emit('addPfand');
    },
    updateArtikel(artikel){
      this.$emit('updateArtikel', artikel)
    },
    updatePfand(pfand){
      this.$emit('updatePfand', pfand)
    },
    deleteArtikel(item){
      this.$emit('deleteArtikel',item);
      console.log('Lösche');
    },
    deletePfand(item){
      this.$emit('deletePfand',item);
    },
    itemReset(){
      this.itemTitleSize = '18';
      this.itemPriceSize = '15';
      this.itemHeight = '100';
      this.itemWidth = '220';
    },
    itemPReset(){
      this.itemTitleSizeP = '18';
      this.itemPriceSizeP = '15';
      this.itemHeightP = '100';
      this.itemWidthP = '220';
    },
    witemReset(){
      this.witemAnzahlSize = '18';
      this.witemTitleSize = '18';
      this.witemPriceSize = '16';
      this.witemPfandSize = '12.5';
    },
    async openColorPicker(item) {
      let colorVal = (this.$props.darkMode)?item.dmcolor:item.color;
      const { value: color } = await Swal.fire({
        title: 'Farbe wählen',
        html: `<input id="swal-color" type="color" value="${colorVal}" style="width:100%; height:56px; border:none; padding:0; background:transparent;">`,
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Clear',
        focusConfirm: false,
        preConfirm: () => {
          const el = document.getElementById('swal-color');
          return el ? el.value : null;
        }
      });

      if (color) {
        if(this.$props.darkMode){
          item.dmcolor = color;
        } else{
          item.color = color; // Beispiel: setzen in component state
        }
      } else {
        if(this.$props.darkMode){
          item.dmcolor = undefined;
        } else{
          item.color = undefined;
        }
      }
      this.updateArtikel(item);
    },
    exportData(data, name){
      let array = Array.isArray(data) ? data : JSON.parse(data);

      array = JSON.parse(JSON.stringify(array));

      array = array.map(obj=>{
        const kopie = { ...obj };
        delete kopie.kassenprojektID;
        delete kopie.desktopID;
        return kopie;
      })

      const header = Object.keys(array[0]).join(";"); // Semikolon für DE-Excel
      const rows = array.map(obj =>
        Object.values(obj)
          .map(v => `"${String(v).replace(/"/g, '""')}"`) // schützt Sonderzeichen
          .join(";")
      );
      const csv = header + "\n" + rows.join("\n");
      const bom = "\uFEFF";
      const blob = new Blob([bom+csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =  name+".csv";
      a.click();

      URL.revokeObjectURL(url);
    },

    async importWithSwal(typ) {
      if(typ=='artikel'){
          if(this.artikelItems != false && this.artikelItems != undefined && this.artikelItems.length != 0){
            Swal.fire({
              icon: 'error',
              title: 'Import fehlgeschlagen',
              text: 'Es existieren noch Artikel im Desktop'
            });
            return;
          }
      } else if(typ=='pfand'){
          if(this.pfandItems != false && this.pfandItems != undefined && this.pfandItems.length != 0){
            Swal.fire({
              icon: 'error',
              title: 'Import fehlgeschlagen',
              text: 'Es existieren noch Pfand-Items im Desktop'
            });
            return;
          }
      }
      try {
        const { value: file } = await Swal.fire({
          title: 'CSV-Datei auswählen',
          text: 'Wähle eine semikolon-separierte CSV-Datei (UTF-8, ggf. mit BOM).',
          input: 'file',
          inputAttributes: {
            'aria-label': 'Lade eine CSV-Datei hoch'
          },
          showCancelButton: true,
          confirmButtonText: 'Importieren',
          preConfirm: (f) => {
            // preConfirm wird bereits mit dem File-Objekt aufgerufen
            if (!f) {
              Swal.showValidationMessage('Keine Datei ausgewählt');
              return;
            }
            // weitere Validierung: Dateiendung
            const name = f.name || '';
            if (!name.toLowerCase().endsWith('.csv')) {
              Swal.showValidationMessage('Bitte eine CSV-Datei auswählen (.csv)');
              return;
            }
            return f; // File wird als value zurückgegeben
          }
        });

        if (!file) {
          // Abgebrochen
          return;
        }

        Swal.fire({
          title: 'Datei wird gelesen...',
          didOpen: () => Swal.showLoading()
        });

        const text = await this.readFileAsText(file, 'utf-8');

        // Parse CSV (Semikolon-Standard für DE-Excel)
        const array = this.parseCsv(text, ';');

        // Ergänze kassenprojektID und desktopID aus Props
        const kassenprojektID = this.selectedKassenprojekt?.Id ?? null;
        const desktopID = this.selectedDesktop?.Id ?? null;

        const enriched = array.map(obj => ({
          ...obj,
          kassenprojektID,
          desktopID
        }));

        // Ergebnis speichern
        this.importedData = enriched;

        Swal.fire({
          icon: 'success',
          title: 'Import erfolgreich',
          text: `Es wurden ${enriched.length} Zeilen importiert.`,
          timer: 2500
        });
        console.log(this.importedData);

        // Falls du das Array sofort weiterverarbeiten willst, kannst du es hier zurückgeben oder emitten:
        // this.$emit('imported', enriched);
        if(typ == 'artikel'){
          if(this.artikelItems != false && this.artikelItems != undefined && this.artikelItems.length != 0){
            Swal.fire({
              icon: 'error',
              title: 'Import fehlgeschlagen',
              text: 'Es existieren noch Artikel im Desktop'
            });
            return;
          }
          this.artikelItems = this.importedData;
          this.$emit('clearArtikelSichtbarkeit');
          this.$emit('setArtikelItems', []);
          this.artikelItems.forEach(obj=>{
            if(obj.pfandId == "null"){
              obj.pfandId = null;
            }
            this.$emit('addArtikel', obj)
          })
        } else if(typ == 'pfand'){
          if(this.pfandItems != false && this.pfandItems != undefined && this.pfandItems.length != 0){
            Swal.fire({
              icon: 'error',
              title: 'Import fehlgeschlagen',
              text: 'Es existieren noch Pfand-Items im Desktop'
            });
            return;
          }
          this.pfandItems = this.importedData;
          this.$emit('clearPfandSichtbarkeit');
          //this.$emit('setPfandItems', []);
          this.pfandItems.forEach(obj=>{
            this.$emit('addPfand', obj)
          })
        }
        return enriched;

      } catch (err) {
        console.error('Import-Fehler', err);
        Swal.fire({
          icon: 'error',
          title: 'Import fehlgeschlagen',
          text: err.message || String(err)
        });
        throw err;
      }
    },

    readFileAsText(file, encoding = 'utf-8') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file, encoding);
      });
    },

    // -------- CSV Parsing (Semikolon, quoted fields, einfache Typ-Erkennung) --------
    parseCsv(text, sep = ';') {
      if (typeof text !== 'string') throw new Error('parseCsv erwartet Text');

      // BOM entfernen falls vorhanden
      if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

      // Zeilen normalisieren (CRLF/CR -> LF)
      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      // Trenne in Zeilen — wir ignorieren komplett leere Zeilen
      const rawLines = text.split('\n');

      // BUT: Wenn Felder Zeilenumbrüche enthalten (Innerhalb quotes), brauchen wir robusteren Ansatz.
      // Diese Implementierung fügt Zeilen zusammen, bis ein vollständiges record (balanced quotes) vorliegt.
      const lines = [];
      let buffer = '';
      let inQuotes = false;

      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];
        // Falls buffer leer, initial setzen; ansonsten anfügen
        buffer += (buffer === '' ? '' : '\n') + line;

        // count quotes that are not escaped ("" counts as two quotes but escapes)
        // einfache Heuristik: Count of unescaped quotes parity
        let count = 0;
        for (let j = 0; j < buffer.length; j++) {
          if (buffer[j] === '"') {
            // if next char is also quote, skip both (escaped)
            if (buffer[j + 1] === '"') {
              j++; // skip escaped quote
            } else {
              count++;
            }
          }
        }
        // wenn count (Anzahl nicht-escaped quotes) gerade -> balanced
        if (count % 2 === 0) {
          lines.push(buffer);
          buffer = '';
        } else {
          // noch unvollständig — lese nächste physische Zeile dazu
          continue;
        }
      }
      if (buffer.trim() !== '') {
        // verbleibende Zeile hinzufügen (falls vorhanden)
        lines.push(buffer);
      }

      // Entferne komplett-leere Zeilen
      const filtered = lines.filter(l => l.trim() !== '');
      if (filtered.length === 0) return [];

      // header
      const header = this.parseCsvLine(filtered[0], sep).map(h => h.trim());

      const rows = [];
      for (let i = 1; i < filtered.length; i++) {
        const fields = this.parseCsvLine(filtered[i], sep);
        const obj = {};
        for (let j = 0; j < header.length; j++) {
          const key = header[j] || `col${j}`;
          let val = fields[j] === undefined ? '' : fields[j];
          val = val.trim();

          // einfache Typumwandlung: integer / float erkennen
          if (/^-?\d+$/.test(val)) {
            val = parseInt(val, 10);
          } else if (/^-?\d+\.\d+$/.test(val)) {
            val = parseFloat(val);
          }

          obj[key] = val;
        }
        rows.push(obj);
      }
      return rows;
    },

    parseCsvLine(line, sep = ';') {
      const result = [];
      let cur = '';
      let inQuotes = false;
      let i = 0;

      while (i < line.length) {
        const ch = line[i];

        if (inQuotes) {
          if (ch === '"') {
            // Doppeltes Anführungszeichen -> ein " in Feld
            if (line[i + 1] === '"') {
              cur += '"';
              i += 2;
              continue;
            } else {
              // Ende des quoted field
              inQuotes = false;
              i++;
              continue;
            }
          } else {
            cur += ch;
            i++;
            continue;
          }
        } else {
          if (ch === '"') {
            inQuotes = true;
            i++;
            continue;
          }
          if (ch === sep) {
            result.push(cur);
            cur = '';
            i++;
            continue;
          }
          cur += ch;
          i++;
        }
      }

      result.push(cur);
      return result;
    },
    belegeLoeschen(){
      this.$emit('deleteBelege');
    },
    startInteraction() {
      this.interactingSlider = true;
    },
    stopInteraction() {
      this.interactingSlider = false;
    },
  },
  computed: {
    ...mapState('item', ['height', 'titleSize', 'priceSize', 'width', 'heightP', 'titleSizeP', 'priceSizeP', 'widthP']),
    ...mapState('witem', ['anzahlSize', 'titleSize', 'priceSize', 'pfandSize']),

    cssVars() {
      return {
        "--headerHeight": `${this.headerHeight}px`,
        "--sidebarWidth": `${this.sidebarWidth}px`,
        "--sidebarCollapsed": `${this.sidebarCollapsedWidth}px`,
      };
    },

    containerStyle(){
      const base = { ...this.cssVars };

      if (this.interactingSlider) {
        base.opacity = 0;
      }

      return base;
    }
  },
  mounted(){
    window.addEventListener('pointerup', this.stopInteraction);
  },
  created(){
    this.artikelItems = this.$props.artikel;
    this.pfandItems = this.$props.pfand;
    console.log(this.artikelItems);

    this.itemTitleSize = this.$store.state.item.titleSize;
    this.itemPriceSize = this.$store.state.item.priceSize;
    this.itemHeight = this.$store.state.item.height;
    this.itemWidth = this.$store.state.item.width;

    this.witemAnzahlSize = this.$store.state.witem.anzahlSize;
    this.witemTitleSize = this.$store.state.witem.titleSize;
    this.witemPriceSize = this.$store.state.witem.priceSize;
    this.witemPfandSize = this.$store.state.witem.pfandSize;

    if(window.screen.width <= 700){
      this.collapsed = true;
    }
  },
  watch: {
    artikel(newVal) {
        if (newVal) {
            this.artikelItems = this.$props.artikel;
            //this.$emit('setArticleItems', this.artikelItems);
            console.log("Artikel:");
            console.log(this.artikelItems);
        }
    },
    pfand(newVal) {
        if (newVal) {
            this.pfandItems = this.$props.pfand;
            console.log("Pfand:");
            console.log(this.pfandItems);
            //this.$emit('setPfandItems', this.pfandItems);
        }
    },
    itemTitleSize(newVal){
      if(newVal){
        this.$store.commit('item/SET_TITLE_SIZE', newVal);
      }
    },
    itemPriceSize(newVal){
      if(newVal){
        this.$store.commit('item/SET_PRICE_SIZE', newVal);
      }
    },
    itemHeight(newVal){
      if(newVal){
        this.$store.commit('item/SET_HEIGHT', newVal);
      }
    },
    itemWidth(newVal){
      if(newVal){
        this.$store.commit('item/SET_WIDTH', newVal);
      }
    },
    itemTitleSizeP(newVal){
      if(newVal){
        this.$store.commit('item/SET_TITLE_SIZEP', newVal);
      }
    },
    itemPriceSizeP(newVal){
      if(newVal){
        this.$store.commit('item/SET_PRICE_SIZEP', newVal);
      }
    },
    itemHeightP(newVal){
      if(newVal){
        this.$store.commit('item/SET_HEIGHTP', newVal);
      }
    },
    itemWidthP(newVal){
      if(newVal){
        this.$store.commit('item/SET_WIDTHP', newVal);
      }
    },
    witemAnzahlSize(newVal){
      if(newVal){
        this.$store.commit('witem/SET_ANZAHL_SIZE', newVal);
      }
    },
    witemTitleSize(newVal){
      if(newVal){
        this.$store.commit('witem/SET_TITLE_SIZE', newVal);
      }
    },
    witemPriceSize(newVal){
      if(newVal){
        this.$store.commit('witem/SET_PRICE_SIZE', newVal);
      }
    },
    witemPfandSize(newVal){
      if(newVal){
        this.$store.commit('witem/SET_PFAND_SIZE', newVal);
      }
    },
  },
  beforeDestroy(){
    window.removeEventListener('pointerup', this.stopInteraction);
  }
};
</script>

<style lang="scss" scoped>
.menuContainer {
  z-index: 10;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  /*height: 100vh;*/
  background-color: var(--bg, rgba(250, 250, 254, 0.96));
  display: grid;
  grid-template-columns: var(--sidebarWidth, 280px) 1fr;
  gap: 20px;
  transition: grid-template-columns 280ms ease, top 280ms ease, opacity 280ms ease;
  overflow: hidden;
  color: var(--ink);
}
.menuDeactive {
  top: 100vh;
  opacity: 0;
  transition: top 420ms ease, opacity 240ms ease 0s;
}
.menuActive {
  top: var(--headerHeight, 0px);
  opacity: 1;
  transition: top 280ms ease, opacity 220ms ease;
}
.menuContainer.collapsed {
  grid-template-columns: var(--sidebarCollapsed, 64px) 1fr;
}

/* Sidebar */
.leftContainer {
  /*background: linear-gradient(180deg, #ffffff, #fbfbff);*/
  background-color: var(--menu-left);
  padding: 16px;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  transition: padding 240ms ease;
}
.menuContainer.collapsed .leftContainer {
  padding: 8px;
}
.collapseBtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background-color: var(--menu-button);
  color: var(--ink);
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  align-self: flex-end;
  transition: transform 180ms ease, opacity 180ms ease;
}
.collapseBtn .icon {
  font-size: 14px;
}
.menuContainer.collapsed .collapseBtn .label {
  opacity: 0;
  width: 0;
  transform: translateX(-6px);
  pointer-events: none;
  transition: opacity 200ms ease, transform 200ms ease, width 200ms ease;
}
.navList {
  display: grid;
  gap: 8px;
  margin-top: 6px;
}
.navItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.navItem-active{
  background-color: var(--bg);
}

.navIcon {
  min-width: 36px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--menu-button);
}
.navLabel {
  transition: opacity 200ms ease, transform 200ms ease;
  color: var(--ink);
}
.menuContainer.collapsed .navLabel {
  opacity: 0;
  width: 0;
  transform: translateX(-6px);
  pointer-events: none;
}

/* Right content */
.rightContainer {
  padding: 20px;
  overflow: auto;
  background: transparent;
}

.contentContainer{
  margin-bottom: 20px;
}

/* Grid of items (draggable) */
.itemsWrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding-top: 12px;
  padding-bottom: 16px;
}

/* Each card */
.itemContainer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: var(--items);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  user-select: none;
  position: relative;
  box-shadow: var(--shadow);
}

/* small header with drag handle */
.itemHeader {
  display:flex;
  align-items:center;
  gap:8px;
  justify-content:flex-start;
}
.dragHandle {
  cursor: grab;
  padding:4px 6px;
  border-radius:6px;
  background: rgba(0,0,0,0.03);
  user-select:none;
}
.itemIndex { color: #666; font-size:0.85rem; }

.itemButton{
  padding:4px 6px;
  border-radius:6px;
  background: rgba(0,0,0,0.03);
  cursor: pointer;
}

/* Hover feedback */
.itemContainer:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

/* Inputs */
.itemContainer label {
  font-weight: 600;
  font-size: 0.9rem;
}
.itemContainer input,
.itemContainer select {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.9rem;
}

/* Drag classes (ghost/chosen) */
.drag-ghost {
  opacity: 0.5 !important;
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.drag-chosen {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

input{
    background-color: var(--bg);
    color: var(--ink);
}

select{
    background-color: var(--bg);
    color: var(--ink);
}


h2{
    margin-top: 0;
}

.datenHeader{
  display: flex;
  justify-content: space-between;

  h2{
    margin-top: 0;
    margin-bottom: 0;
  }
}

.anzeigeTitle{
  button{
    margin-top: 0 !important;
  }
}

.plusButton, .exportButton, .importButton{
  padding: 0;
  height: 2rem;
  width: 2rem;
  background-color: var(--items);
  border-color: var(--border);
  border-radius: 90px;
  color: var(--ink);
}

.plusButton:hover, .exportButton:hover, .importButton:hover{
  background-color: var(--hover);
}

.loeschen{
  position: absolute;
  left: 50%;
  z-index: 90;
  transform: translateX(-50%);
  top: -1.5rem;
  width: 2rem;
  height: 2rem;
  border-color: var(--border);
  color: var(--ink);
  background-color: var(--items);
  border-radius: 90px;
  font-size: larger;
  opacity: 0;
  pointer-events: all;
  transition: opacity 0.2s ease;
}

.itemContainer:hover .loeschen{
  opacity: 1;
  pointer-events: all;
  transition: opacity 0.2s ease;
}

.itemContainer:hover .loeschen,
.itemContainer .loeschen:hover {
  opacity: 1;
  pointer-events: all;
}


.colorWheel{
  position: absolute;
  left: 70%;
  z-index: 90;
  transform: translateX(-50%);
  top: -1.5rem;
  width: 2rem;
  height: 2rem;
  border-color: var(--border);
  color: var(--ink);
  background-color: var(--items);
  border-radius: 90px;
  font-size: larger;
  opacity: 0;
  pointer-events: all;
  transition: opacity 0.2s ease;
  padding: 6px;
}

.itemContainer:hover .colorWheel{
  opacity: 1;
  pointer-events: all;
  transition: opacity 0.2s ease;
}

.itemContainer:hover .colorWheel,
.itemContainer .colorWheel:hover {
  opacity: 1;
  pointer-events: all;
}

#itemAnzeige{
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  background-color: var(--items);
  padding: 13px;
  border-radius: 13px;
  padding-top: 0px;
  //box-shadow: var(--shadow);
}

.anzeigeTitle{
  display: flex;
  justify-content: space-between;

  button{
    width: auto;
    height: 2.3rem;
    padding: 3px 6px;
    font-size: larger;
    background-color: var(--items);
    color: var(--ink);
    border-radius: 20px;
    border-color: var(--border);
    margin-top: 16px;
    cursor: pointer;
  }
}

  .dot { height: 100%; width: 100%; border-radius: 50%; background: rgb(216, 216, 216); }

/* Very small screens: hide sidebar */
@media (max-width: 700px) {
  .menuContainer{
    gap: 10px;
  }

  .datenHeader{
    margin-bottom: 10px;
  }

  .itemsWrapper{
    padding: 0px;
  }

  .rightContainer{
    padding: 0px;
  }
}
</style>
