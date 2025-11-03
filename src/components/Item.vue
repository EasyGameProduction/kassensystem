<template>
  <button
    class="item"
    :class="{ 'item--start': start }"
    :style="[cssVars, { backgroundColor: ((darkMode)?item.dmcolor:item.color) }]"
    @click="itemClick"
  >
    <div>
      <div><strong>{{ item.bezeichnung }}</strong></div>
      <span>{{ formatPrice(item.preis) }} €</span>
    </div>
  </button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Item',
  props: {
    item: Object,
    editMode: Boolean,
    darkMode: Boolean
  },
  data() {
    return {
      start: true, // Startzustand: hat margin-top:2rem und opacity:0
    };
  },
  mounted() {
    // Sicherstellen, dass der Startzustand gerendert wurde,
    // bevor wir die Klasse entfernen — dann läuft die Transition.
    this.$nextTick(() => {
      // requestAnimationFrame stellt sicher, dass die Änderung in der nächsten Frame geschieht
      requestAnimationFrame(() => {
        this.start = false;
      });
    });
  },
  methods: {
    formatPrice(price) {
      try{
        return price.toFixed(2);
      } catch(err){
        return price;
      }
    },
    itemClick() {
      if (this.editMode) {
        // Bearbeitungs-Popup öffnen
      } else {
        this.$emit('addItem', this.item);
      }
    },
  },
  computed: {
    ...mapState('item', ['height', 'titleSize', 'priceSize']),
    cssVars() {
      return {
        '--height': `${this.height}px`,
        '--titleSize': `${this.titleSize}px`,
        '--priceSize': `${this.priceSize}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  /* Transition in der Basisregel */
  transition: margin-top 0.5s ease, opacity 0.5s ease;
  margin-top: 0;     /* Endzustand */
  opacity: 1;

  align-items: center;
  height: 100%;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  user-select: none;
  min-height: var(--height);
  background-color: var(--items);

  cursor: pointer;

  strong { font-size: var(--titleSize); color: var(--ink) }
  span { color: var(--muted); margin-top: 2px; font-size: var(--priceSize); }

  display: flex;
  justify-content: center;
}

/* Startzustand: beim ersten Render gesetzt */
.item--start {
  margin-top: 2rem;
  opacity: 0;
}

.item:active {
  background-color: var(--hover);
}

.item:hover{
    background-color: ver(--hover);
}
</style>
