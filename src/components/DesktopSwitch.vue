<template>
  <div
    class="desktopSwitchContainer"
    :class="active ? 'switchActive' : 'switchDeactive'"
    :style="cssVars"
  >
    <ul class="desktopList" ref="list">
      <li v-for="item in desktops" :key="item.id" @click="this.switchDesktop(item)">
        {{ kassenprojekt.name }} - {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DesktopSwitch',
  props: {
    active: Boolean,
    headerHeight: Number,
    kassenprojekt: Object,
    desktops: Array
  },
  data() {
    return {
      listHeight: 0,
    };
  },
  watch: {
    desktops: {
      handler() {
        this.$nextTick(()=>{
          this.updateHeight();
        })
      },
      deep: true
    }
  },
  computed: {
    cssVars() {
      return {
        '--headerHeight': `${this.headerHeight}px`,
        '--listHeight': `${this.listHeight}px`,
      };
    },
  },
  methods: {
    switchDesktop(item){
      this.$emit('switchDesktop', item)
    },
    updateHeight() {
      if (this.$refs.list) {
        this.listHeight = this.$refs.list.offsetHeight;
      }
    }
  },
  async created(){
    
  }
};
</script>

<style lang="scss" scoped>
.desktopSwitchContainer {
  z-index: 10;
  position: fixed;
  //top: var(--headerHeight);
  left: 30px;
  background-color: var(--header);
  overflow: hidden;
  transition: all 0.5s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Sichtbarkeit */
.switchActive {
  opacity: 1;
  top: var(--headerHeight);
}
.switchDeactive {
  //top: -150px;
  top: calc(-1 * var(--listHeight));
  /*opacity: 0;*/
}

/* Liste */
.desktopList {
    list-style: none;
    margin: 0;
    display: flex;
    flex-direction: column;
    padding-inline-start: 0;
}

/* Einzelne Einträge */
.desktopList li {
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  color: var(--ink);
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--hover);
  }
  list-style: none;
}

/* Optional für Touch-Geräte etwas mehr Abstand */
@media (pointer: coarse) {
  .desktopList li {
    padding: 1.5rem;
  }
}
</style>
