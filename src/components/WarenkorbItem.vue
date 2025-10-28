<template>
    <button class="warenkorbItem" @click="this.itemClick()" :style="cssVars"
        @touchstart.passive="handleStart"
        @touchmove.passive="handleMove"
        @touchend="handleEnd"
        @pointerdown="handleStartPointer"
        @pointermove="handleMovePointer"
        @pointerup="handleEndPointer"
        @pointercancel="handleEndPointer">
        <span class="warenkorbItemContainer" :style="contentStyle" ref="content">
            <span class="artikelZeile">
                <strong class="artikelSchrift">
                    <span id="anzahl">{{ item.anzahl }}x</span>
                    <div id="bezeichnung">{{ items.find(i=> i.Id == item.Id).bezeichnung }}</div>
                </strong>
            </span>
            <span class="preisZeile">
                <div id="artikelPreis">{{ this.formatPrice(items.find(i=> i.Id == item.Id).preis * item.anzahl) }} €</div>
                <div id="pfandPreis" v-if="pfandItem != undefined">Pfand: {{ this.formatPrice(pfandItem.preis * item.anzahl) }} €</div>
            </span>
        </span>
        <span class="trash" @click="this.removeAll()">
            <span>🗑</span>
        </span>
    </button>
</template>

<script>

export default {
    name: 'WarenkorbItem',
    props:{
        item: Object,
        items: Array,
        pfandItem: Object,
        lineColor: String
    },
    data() {
        return {
            startX: null,
            currentX: null,
            translateX: 0,             // px (positive when content moved left)
            maxTranslate: 90,         // max reveal width in px (adjust to trash width)
            threshold: 40,            // px needed to snap open
            swiping: false,           // whether a swipe is in progress
            movedDuringTouch: false,  // whether we moved enough to suppress click
            pointerDown: false
        }
    },
    computed:{
        cssVars() {
      // Alle Variablen zentral binden; Farben etc. können ebenfalls via Theme aus Vuex kommen
            return {
                '--lineColor': `${this.$props.lineColor}`,
            };
        },
        // inline style applied to sliding content
        contentStyle() {
            return {
                transform: `translateX(${-this.translateX}px)`,
                transition: this.swiping ? 'none' : 'transform 0.25s ease'
            };
        }
    },
    methods: {
        formatPrice(price){
            if(price != undefined){
                return price.toFixed(2);
            }
        },
        onClick(){
            if (this.movedDuringTouch) {
                // reset moved flag, do not treat as click
                this.movedDuringTouch = false;
                return;
            }
            // If content is currently revealed (open) and user taps outside trash, close it
            if (this.translateX > 0 && this.translateX < this.maxTranslate) {
                this.closeSwipe();
                return;
            }
            // Normal item click (remove single item)
            this.$emit('removeItem', this.$props.item);
            console.log(this.$props.item);
        },
        itemClick(){
            this.$emit('removeItem',this.$props.item);
        },
        removeAll(){
            this.$emit('removeAll',this.$props.item);
        },
        // TOUCH events (mobile / tablet)
        handleStart(evt) {
            if (!evt.touches || evt.touches.length === 0) return;
            this.startX = evt.touches[0].clientX;
            this.currentX = this.startX;
            this.swiping = true;
            this.movedDuringTouch = false;
        },
        handleMove(evt) {
            if (!this.swiping || !evt.touches || evt.touches.length === 0) return;
            this.currentX = evt.touches[0].clientX;
            const dx = this.startX - this.currentX; // positive when swiping left
            if (dx > 0) {
                this.translateX = Math.min(dx, this.maxTranslate);
                if (this.translateX > 6) this.movedDuringTouch = true;
            } else {
                // allow small right swipe to close
                this.translateX = Math.max(0, this.translateX + dx); // smooth clamp
            }
        },
        handleEnd() {
            if (!this.swiping) return;
            this.swiping = false;
            // snap logic
            if (this.translateX >= this.threshold) {
                // open fully
                this.openSwipe();
            } else {
                // close
                this.closeSwipe();
            }
            // reset tracking
            this.startX = null;
            this.currentX = null;
        },

        // POINTER events — fallback for stylus / some tablets and desktops
        handleStartPointer(evt) {
            // only handle primary pointer (to avoid multi-pointer complications)
            if (evt.isPrimary === false) return;
            this.pointerDown = true;
            this.startX = evt.clientX;
            this.currentX = this.startX;
            this.swiping = true;
            this.movedDuringTouch = false;
        },
        handleMovePointer(evt) {
            if (!this.pointerDown || !this.swiping) return;
            this.currentX = evt.clientX;
            const dx = this.startX - this.currentX;
            if (dx > 0) {
                this.translateX = Math.min(dx, this.maxTranslate);
                if (this.translateX > 6) this.movedDuringTouch = true;
            } else {
                this.translateX = Math.max(0, this.translateX + dx);
            }
        },
        handleEndPointer(evt) {
            if (!this.pointerDown) return;
            this.pointerDown = false;
            this.handleEnd();
        },

        openSwipe() {
            this.translateX = this.maxTranslate;
        },
        closeSwipe() {
            this.translateX = 0;
        }
    }
}
</script>

<style lang="css" scoped>
    .warenkorbItem{
        width: 100%;
        height: 3.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: none;
        border-left: 5px solid var(--lineColor);
        border-radius: 5px;
        margin-bottom: 0.3rem;
        padding: 0;
        overflow: hidden;
        position: relative;

        cursor: pointer;

        &:hover .trash{
            transform: translateX(0%);
        }
        &:hover .preisZeile{
            transform: translateX(-3rem);
        }

        background-color: var(--witems);
    }

    .warenkorbItemContainer{
        width:100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6 1;
        margin-left: 6px;
        margin-right: 6px;
    }

    .trash{
        width: 1rem;
        position: absolute;
        display: flex;
        justify-content: center;
        font-size: x-large;
        background-color: var(--danger);
        padding: 0 1rem;
        align-items: center;
        vertical-align: middle;
        height: 100%;
        transition: transform 0.4s ease;
        transform: translateX(100%);
        right: 0;
        span{
            color: white;
        }
    }

    .artikelSchrift{
        font-size: large;
        align-items: center;
        display: flex;
        justify-content: left;
    }

    .artikelZeile{
        display: flex;
        justify-content: left;
        max-width: 60%;
    }

    #anzahl{
        margin-right: 0.35rem;
        color: var(--ink);
    }

    #bezeichnung{
        text-align: left;
        color: var(--ink);
    }

    #artikelPreis{
        font-size: larger;
        color: var(--ink);
    }

    #pfandPreis{
        color: var(--muted);
        font-size: 12.5px;
    }

    .preisZeile{
        text-align:end;
        transition: transform 0.4s ease;
        transform: translateX(0%);
    }
</style>