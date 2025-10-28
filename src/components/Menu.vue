<template>
    <div class="menuContainer" :class="(active)?'menuActive':'menuDeactive'"  :style="cssVars">

    </div>
</template>

<script>

export default {
    name: 'Menu',
    props:{
        active: Boolean,
        headerHeight: Number
    },
    data() {
        return {

        }
    },
    methods: {
        
    },
    computed: {
        cssVars() {
      // Alle Variablen zentral binden; Farben etc. können ebenfalls via Theme aus Vuex kommen
            return {
                '--headerHeight': `${this.$props.headerHeight}px`,
            };
        }
    },
}
</script>

<style lang="scss" scoped>
    .menuContainer{
        z-index: 10;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--bg);
    }

    .menuActive{
        opacity: 100;
        transition: opacity 0.5s;
        top: var(--headerHeight);
        transition: top 0.5s;
    }

    .menuDeactive{
        top: 100vh;
        opacity: 0;
        transition: top 1.5s ease 0s,
                    opacity 0.5s ease 0.2s;
    }
</style>