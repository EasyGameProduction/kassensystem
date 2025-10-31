<template>
  <div
    class="menuContainer"
    :class="{
      menuActive: active,
      menuDeactive: !active,
      collapsed: collapsed
    }"
    :style="cssVars"
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
        <button class="navItem" :class="daten?'navItem-active':''" @click="daten = true">
          <span class="navIcon">📝</span>
          <span class="navLabel">Daten</span>
        </button>

        <button class="navItem">
          <span class="navIcon">🖥️</span>
          <span class="navLabel">Anzeige</span>
        </button>

        <button class="navItem">
          <span class="navIcon">🧭</span>
          <span class="navLabel">Adminkonsole</span>
        </button>

        <button class="navItem">
          <span class="navIcon">⚙️</span>
          <span class="navLabel">Erweiterte Einstellungen</span>
        </button>
      </nav>
    </aside>

    <main class="rightContainer" role="main">
      <div id="daten" v-if="daten">
        <h1>Daten</h1>
        <div class="datenHeader"><h3>Artikel:</h3><button class="plusButton" @click="this.addArtikel()">+</button></div>

        <!-- draggable wrapper: v-model linked to items -->
        <draggable
          v-model="artikelItems"
          item-key="id"
          class="itemsWrapper"
          ghost-class="drag-ghost"
          chosen-class="drag-chosen"
          @end="onDragEnd"
        >
          <template #item="{ element: item, index }">
            <div class="itemContainer" :data-id="item.id" >
              <div class="itemHeader">
                <button class="loeschen" @click="this.deleteArtikel(item)">🗑</button>

                <span class="dragHandle" title="Ziehen">⠿</span>
                <input
                    :id="'bezeichnung-'+item.id"
                    maxlength="20"
                    placeholder="Bezeichnung"
                    type="text"
                    v-model="item.bezeichnung"
                />
                <span class="itemButton fa" @click="switchSichtbarkeitArtikel(item)" title="Sichtbar" v-if="artikelItemsSichtbarkeit.find(obj=>obj.artikelId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID).sichtbar">&#xf06e;</span>
                <span class="itemButton fa" @click="switchSichtbarkeitArtikel(item)" title="Unsichtbar" v-if="!artikelItemsSichtbarkeit.find(obj=>obj.artikelId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID).sichtbar">&#xf070;</span>
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
              />

              <label :for="'pfand-'+item.id">Pfand: </label>
              <select :id="'pfand-'+item.pfandId" v-model="item.pfandId">
                <option v-for="pfand in this.pfandItems" :key="pfand.Id" :value="pfand.Id">{{ pfand.bezeichnung }}</option>
              </select>
            </div>
          </template>
        </draggable>
        <br/>
        <div class="datenHeader"><h3>Pfand:</h3><button class="plusButton" @click="this.addPfand()">+</button></div>
        <draggable
          v-model="pfandItems"
          item-key="id"
          class="itemsWrapper"
          ghost-class="drag-ghost"
          chosen-class="drag-chosen"
          @end="onDragEndPfand"
        >
          <template #item="{ element: item, index }">
            <div class="itemContainer" :data-id="item.id" >
              <div class="itemHeader">
                <button class="loeschen" @click="this.deletePfand(item)">🗑</button>

                <span class="dragHandle" title="Ziehen">⠿</span>
                <input
                    :id="'bezeichnung-'+item.id"
                    maxlength="20"
                    placeholder="Bezeichnung"
                    type="text"
                    v-model="item.bezeichnung"
                />
                <span class="itemButton fa" @click="switchSichtbarkeitPfand(item)" title="Sichtbar" v-if="pfandItemsSichtbarkeit.find(obj=>obj.pfandId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID).sichtbar">&#xf06e;</span>
                <span class="itemButton fa" @click="switchSichtbarkeitPfand(item)" title="Unsichtbar" v-if="!pfandItemsSichtbarkeit.find(obj=>obj.pfandId == item.Id && obj.desktopID == item.desktopID && obj.kassenprojektID == item.kassenprojektID).sichtbar">&#xf070;</span>
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
              />
            </div>
          </template>
        </draggable>
      </div>
    </main>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "Menu",
  components: { draggable },
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
    pfandItemsSichtbarkeit: Array
  },
  data() {
    return {
      collapsed: false,
      daten: true,
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
    };
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    onDragEnd(evt) {
      this.$emit('setArticleItems', this.artikelItems);
    },
    onDragEndPfand(evt) {
      this.$emit('setPfandItems', this.pfandItems);
    },
    switchSichtbarkeitArtikel(item){
      this.$emit('setArtikelSichtbarkeit', item);
    },
    switchSichtbarkeitPfand(item){
      this.$emit('setPfandSichtbarkeit', item);
    },
    addArtikel(){
      this.$emit('addArtikel');
    },
    addPfand(){
      this.$emit('addPfand');
    },
    deleteArtikel(item){
      this.$emit('deleteArtikel',item);
      console.log('Lösche');
    },
    deletePfand(item){
      this.$emit('deletePfand',item);
    }
  },
  computed: {
    cssVars() {
      return {
        "--headerHeight": `${this.headerHeight}px`,
        "--sidebarWidth": `${this.sidebarWidth}px`,
        "--sidebarCollapsed": `${this.sidebarCollapsedWidth}px`,
      };
    },
  },
  created(){
    this.artikelItems = this.$props.artikel;
    this.pfandItems = this.$props.pfand;
    console.log(this.artikelItems);
  },
  watch: {
    artikel(newVal) {
        if (newVal) {
            this.artikelItems = this.$props.artikel;
            this.$emit('setArticleItems', this.artikelItems);
        }
    },
    pfand(newVal) {
        if (newVal) {
            this.pfandItems = this.$props.pfand;
            this.$emit('setPfandItems', this.pfandItems);
        }
    },
},

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
  width: 100vw;
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

/* Grid of items (draggable) */
.itemsWrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
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


h3{
    margin-top: 0;
    margin-bottom: 0;
}

.datenHeader{
  display: flex;
  justify-content: space-between;
}

.plusButton{
  padding: 0;
  height: 2rem;
  width: 2rem;
  background-color: var(--items);
  border-color: var(--border);
  border-radius: 90px;
  color: var(--ink);
}

.plusButton:hover{
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

/* Very small screens: hide sidebar */
@media (max-width: 700px) {
  .menuContainer {
    grid-template-columns: 0 1fr;
  }
  .leftContainer {
    display: none;
  }
  .menuContainer.collapsed .leftContainer {
    display: none;
  }
  .menuDeactive {
    top: 100vh;
  }
  .menuActive {
    top: 0;
  }
}
</style>
