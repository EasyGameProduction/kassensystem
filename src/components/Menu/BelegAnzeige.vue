<template>
    <div class="belegItem" v-for="beleg in this.belege" :key="beleg.time" :style="cssVars" :id="'time'+beleg.time">
        <div class="headerLine" @click="beleg.open = !beleg.open">
            <h2 class="belegDatum">{{ this.convertDate(beleg.time) }} - {{ this.convertTime(beleg.time) }}</h2>
            <h3 class="helferFrei" v-if="beleg.helferFrei == true">Helfer frei</h3>
            <div class="rechteSchrift">
                <h2 class="Gesamt">{{ this.convertBetrag(beleg.rechnungsbetrag) }} €</h2>
                <!--<button @click.stop="this.deleteBeleg(beleg)" class="btn btn-danger trash">🗑</button>-->
            </div>
        </div>
        <div class="bottom" v-if="beleg.open || this.checkBeleg(beleg)">
            <h3 v-if="beleg.artikelAuswahl.length > 0">Artikel:</h3>
            <div v-if="beleg.artikelAuswahl.length > 0" class="bezeichnungen">
                <div class="bezeichnung">
                    Bezeichnung:
                </div>
                <div class="preis">
                    Preis Einzeln:
                </div>
                <div class="anzahl">
                    Anzahl:
                </div>
                <div class="preisGesamt">
                    Gesamt:
                </div>
            </div>
            <div v-if="beleg.artikelAuswahl.length > 0" class="artikelAuswahl" v-for="artikel in beleg.artikelAuswahl" :id="artikel.Id">
                <hr>
                <div class="artikelAuswahlCont">
                    <div class="bezeichnung">
                        {{ this.getArtikelBezeichnung(artikel) }}
                    </div>
                    <div class="preis">
                        {{ this.convertPreis(+this.getArtikelPreis(artikel)) }} €
                    </div>
                    <div class="anzahl">
                        {{ artikel.anzahl }}
                    </div>
                    <div class="preisGesamt">
                        {{ this.convertPreis(artikel.anzahl * this.getArtikelPreis(artikel)) }} €
                    </div>
                </div>
                <div class="artikelAuswahlPfand" v-if="artikel.pfandId != '' && artikel.pfandId != false && artikel.pfandId != undefined">
                    <div class="pfandBezeichnung">
                        {{ this.getArtikelPfandBezeichnung(artikel) }}
                    </div>
                    <div class="pfandPreis">
                        {{ this.convertPreis(+this.getArtikelPfandPreis(artikel)) }} €
                    </div>
                    <div class="pfandAnzahl">
                        {{ artikel.anzahl }}
                    </div>
                    <div class="pfandPreisGesamt">
                        {{ this.convertPreis(artikel.anzahl * this.getArtikelPfandPreis(artikel)) }} €
                    </div>
                </div>
            </div>
            <hr v-if="beleg.artikelAuswahl.length > 0 && beleg.pfandAuswahl.length > 0">
            <h3 v-if="beleg.pfandAuswahl.length > 0">Pfand:</h3>
            <div v-if="beleg.pfandAuswahl.length > 0" class="bezeichnungen">
                <div class="bezeichnung">
                    Bezeichnung:
                </div>
                <div class="preis">
                    Preis Einzeln:
                </div>
                <div class="anzahl">
                    Anzahl:
                </div>
                <div class="preisGesamt">
                    Gesamt:
                </div>
            </div>
            <hr>
            <div v-if="beleg.pfandAuswahl.length" class="pfandAuswahl" v-for="pfand in beleg.pfandAuswahl" :id="pfand.Id">
                <div class="bezeichnung">
                    {{ this.getPfand(pfand).bezeichnung }}
                </div>
                <div class="preis">
                    - {{ this.convertPreis(+this.getPfand(pfand).preis) }} €
                </div>
                <div class="anzahl">
                    {{ pfand.anzahl }}
                </div>
                <div class="preisGesamt">
                    - {{ this.convertPreis(+pfand.anzahl * +this.getPfand(pfand).preis) }} €
                </div>
            </div>
            <hr v-if="beleg.pfandAuswahl.length > 0">
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { Beleg } from '../../backend_controller/beleg'

export default {
  components: {
    
  },
  props: {
    artikelItems: Array,
    pfandItems: Array,
    selectedKassenprojekt: Object,
    selectedDesktop: Object,
    selectedBeleg: Object
  },
  data() {
    return {
      belege: [],
      open: false
    };
  },
  watch: {
    belegItems(){
        this.belege = JSON.parse(this.$store.state.kasse.belegItems);
        this.belege = this.belege.filter(obj=>obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
    },
    selectedDesktop(){
        this.belege = JSON.parse(this.$store.state.kasse.belegItems);
        this.belege = this.belege.filter(obj=>obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
    }
  },
  computed: {
    ...mapState('kasse', ['belegItems']),

    cssVars() {
      return {
        
      };
    },
  },
  methods: {
    checkBeleg(beleg){
        if(beleg.time == this.$props.selectedBeleg.time){
            this.$emit('clearSelectedBeleg');
            beleg.open = true;


            this.$nextTick(() => {
                // sichere Id-Zusammensetzung (falls beleg.time Sonderzeichen enthalten könnte)
                const safeId = 'time' + String(beleg.time).replace(/[^a-zA-Z0-9\-_:.]/g, '');
                const div = document.getElementById(safeId);
                if (div && typeof div.scrollIntoView === 'function') {
                    try {
                        div.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    } catch (err) {
                        // manche Browser werfen (oder geben ein Promise zurück) – fallback:
                        div.scrollIntoView();
                    }
                } else {
                    // Fallback-Log / optional: console.warn
                    console.warn('Element zum Scrollen nicht gefunden:', safeId, div);
                }
            });
            return true;
        } else{
            return false;
        }
    },
    convertDate(timestamp){
        let datum = new Date(timestamp);
        datum = datum.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return datum;
    },
    convertTime(timestamp){
        let time = new Date(timestamp);
        time = time.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return time;
    },
    convertBetrag(betrag){
        try{
            return betrag.toFixed(2).toString();
        } catch(err){
            return betrag;
        }
    },
    deleteBeleg(beleg){
        // sichere Parsung
        let items = [];
        try {
            items = JSON.parse(this.$store.state.kasse.belegItems || '[]');
        } catch (e) {
            items = [];
        }

        // Behalte alle, die NICHT (gleich in allen drei Feldern) sind
        items = items.filter(obj =>
            !(obj.time === beleg.time &&
            obj.kassenprojektID === beleg.kassenprojektID &&
            obj.desktopID === beleg.desktopID)
        );

        console.log(items);
        this.$store.commit('kasse/SET_BELEG_ITEMS', JSON.stringify(items));
        // optional: lokalen State synchronisieren
        this.belege = items;
    },
    getArtikel(artikel){
        return this.$props.artikelItems.find(obj=>obj.Id == artikel.Id);
    },
    getArtikelBezeichnung(artikel){
        try{ 
            return this.getArtikel(artikel).bezeichnung;
        } catch(err){
            return '';
        }
    },
    getArtikelPreis(artikel){
        try{
            return this.getArtikel(artikel).preis;
        } catch(err){
            return '';
        }
    },
    getArtikelPfand(artikel){
        return this.pfandItems.find(obj=>obj.Id == artikel.pfandId);
    },
    getArtikelPfandBezeichnung(artikel){
        try{
            return this.getArtikelPfand(artikel).bezeichnung
        } catch(err){
            return '';
        }
    },
    getArtikelPfandPreis(artikel){
        try{
            return this.getArtikelPfand(artikel).preis
        } catch(err){
            return '';
        }
    },
    getPfand(pfand){
        return this.pfandItems.find(obj=>obj.Id == pfand.Id);
    },
    convertPreis(preis){
        try{
        return preis.toFixed(2).toString();
        } catch(err){
            return '';
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
    }
  },
  created() {
    try{
        this.getBelege();
        this.belege = JSON.parse(this.$store.state.kasse.belegItems);
        this.belege = this.belege.filter(obj=>obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
        this.belege = this.belege.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        console.log(this.belege)
    } catch(err){
        this.belege = [];
    }
  }
};
</script>

  
<style lang="scss" scoped>
.belegItem{
    border: var(--border);
    color: var(--ink);
    background-color: var(--items);
    border-radius: 7px;
    padding-left: 30px;
    padding-right: 5px;
    margin-bottom: 0.5rem;
    box-shadow: var(--shadow);
}

.bottom{
    padding-bottom: 1.5rem;
}

.headerLine{
    display: flex;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
}

.helferFrei{
    color: green;
}

.rechteSchrift{
    display: flex;
    justify-content:right;
    gap: 30px;
    align-items: center;
}

.trash{
    width: 3rem;
    height: 3rem;
    font-size: xx-large;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--ink)
}

.bezeichnungen{
    font-weight: bold;
}

.bezeichnungen, .artikelAuswahlCont, .artikelAuswahlPfand, .pfandAuswahl{
    display: flex;
    justify-content: space-between;
    padding-right: 25px;

    div{
        width: 25%;
    }

    .bezeichnung, .pfandBezeichnung{
        text-align: left;
        hyphens: auto;
        overflow-wrap: break-word;
        word-break: normal;
    }

    .preis, .pfandPreis{
        text-align: center;
    }

    .anzahl, .pfandAnzahl{
        text-align: center;
    }

    .preisGesamt, .pfandPreisGesamt{
        text-align: right;
    }
}
</style>
  