<template>
    <div v-if="this.$props.darkMode">
        <SplineChart :belegItems="this.belegItems":style="cssVars" :darkMode="this.$props.darkMode" :cssVars="cssVars" @openBeleg="this.openBeleg" :selectedDesktop="this.$props.selectedDesktop"/>
        <br>
        <ColumnChart :dataAPI="this.verkaufteArtikel" :gesamt="this.getGesamt()" :style="cssVars" :darkMode="this.$props.darkMode" :cssVars="cssVars"/>
        <br>
        <ColumnChartPfand :dataAPI="this.fehlenderPfand" :gesamt="this.getGesamtPfand()" :style="cssVars" :darkMode="this.$props.darkMode" :cssVars="cssVars"/>  
    </div>
    <div v-if="!this.$props.darkMode">
        <SplineChart :belegItems="this.belegItems":style="cssVars" :darkMode="this.$props.darkMode" :cssVars="cssVars" @openBeleg="this.openBeleg" :selectedDesktop="this.$props.selectedDesktop"/>
        <br>
        <ColumnChart :dataAPI="this.verkaufteArtikel" :gesamt="this.getGesamt()" :style="cssVars" :darkMode="this.$props.darkMode" :cssVars="cssVars"/>
        <br>
        <ColumnChartPfand :dataAPI="this.fehlenderPfand" :gesamt="this.getGesamtPfand()" :style="cssVars" :darkMode="this.$props.darkMode" :cssVars="cssVars"/>
    </div>
</template>

<script>
import ColumnChart from './ColumnChart.vue';
import { mapState } from 'vuex';
import ColumnChartPfand from './ColumnChartPfand.vue';
import SplineChart from './SplineChart.vue';

export default {
  name: "Adminkonsole",
  components: {
    ColumnChart,
    ColumnChartPfand,
    SplineChart
  },
  props: {
    artikel: Array,
    pfand: Array,
    selectedKassenprojekt: Object,
    selectedDesktop: Object,
    darkMode: Boolean,
  },
  data() {
    return {
        verkaufteArtikel: [],
        gesamt: 0,
        verkaufterPfand: [],
        bekommenerPfand: [],
        fehlenderGesamt: 0,
        fehlenderPfand: [],
        belegItems: []
    };
  },
  computed: {
    ...mapState('kasse', ['belegItems']),
    cssVars() {
      return {
        
      };
    },
  },
  methods: {
    createVerkaufteArtikel(){
        let belege = JSON.parse(this.$store.state.kasse.belegItems);
        this.verkaufteArtikel = JSON.parse(JSON.stringify(this.$props.artikel));

        this.verkaufterPfand = JSON.parse(JSON.stringify(this.$props.pfand));
        this.bekommenerPfand = JSON.parse(JSON.stringify(this.$props.pfand));

        /*this.$props.pfand.forEach(pfand=>{
            let verk = pfand;
            let bekom = pfand;
            this.verkaufterPfand.push(verk);
            this.bekommenerPfand.push(bekom);
        })*/

        try{
        belege = belege.filter(bel => bel.kassenprojektID == this.$props.selectedKassenprojekt.Id && bel.desktopID == this.$props.selectedDesktop.Id && bel.helferfrei != true);
        } catch(err){
            return;
        }
        belege.forEach(beleg=>{
            beleg.artikelAuswahl.forEach(bel => {
                let index = this.verkaufteArtikel.findIndex(art => art.kassenprojektID == this.$props.selectedKassenprojekt.Id && art.desktopID == this.$props.selectedDesktop.Id && art.Id == bel.Id);
                if(index >= 0){
                    if(this.verkaufteArtikel[index].anzahlVerkauft == undefined || this.verkaufteArtikel[index].anzahlVerkauft == false){
                        this.verkaufteArtikel[index].anzahlVerkauft = 0;
                    }
                    this.verkaufteArtikel[index].anzahlVerkauft+= bel.anzahl;
                    this.gesamt += bel.anzahl * this.verkaufteArtikel[index].preis;

                    if(this.verkaufteArtikel[index].pfandId >= 0){
                        let index2 = this.verkaufterPfand.findIndex(pfand => pfand.kassenprojektID == this.$props.selectedKassenprojekt.Id && pfand.desktopID == this.$props.selectedDesktop.Id && pfand.Id == bel.pfandId);
                        if(index2 >= 0){
                            if(this.verkaufterPfand[index2].anzahl == undefined || this.verkaufterPfand[index2].anzahl == false){
                                this.verkaufterPfand[index2].anzahl = 0;
                            }
                            this.verkaufterPfand[index2].anzahl += bel.anzahl;
                        }
                    }
                }
            });
            beleg.pfandAuswahl.forEach(bel => {
                let index = this.bekommenerPfand.findIndex(pfand => pfand.kassenprojektID == this.$props.selectedKassenprojekt.Id && pfand.desktopID == this.$props.selectedDesktop.Id && pfand.Id == bel.Id);
                if(index >= 0){
                    if(this.bekommenerPfand[index].anzahl == undefined || this.bekommenerPfand[index].anzahl == false){
                        this.bekommenerPfand[index].anzahl = 0;
                    }
                    this.bekommenerPfand[index].anzahl+=bel.anzahl;
                }
            })
        })

        this.fehlenderPfand = this.getFehlendePfand();
    },
    getGesamt(){
        return this.gesamt.toFixed(2).toString();
    },
    getGesamtPfand(){
        return this.fehlenderGesamt.toFixed(2).toString();
    },
    getFehlendePfand(){
        let fehlenderPfand = new Array();
        this.verkaufterPfand.forEach(pf=>{
            let index = this.bekommenerPfand.findIndex(pfand => pfand.kassenprojektID == this.$props.selectedKassenprojekt.Id && pfand.desktopID == this.$props.selectedDesktop.Id && pfand.Id == pf.Id);
                if(index >= 0){
                if(this.bekommenerPfand[index].anzahl != undefined && this.bekommenerPfand[index].anzahl != false){
                    this.bekommenerPfand[index].anzahl = +pf.anzahl - +this.bekommenerPfand[index].anzahl;
                    if(this.bekommenerPfand[index].anzahl >= 0){
                        this.fehlenderGesamt+=this.bekommenerPfand[index].anzahl*this.bekommenerPfand[index].preis;

                        let bekommenerPfandTemp = JSON.parse(JSON.stringify(this.bekommenerPfand));
                        fehlenderPfand.push(bekommenerPfandTemp[index]);
                    }
                } else{
                    this.bekommenerPfand[index].anzahl = +pf.anzahl;
                    if(this.bekommenerPfand[index].anzahl >= 0){
                        this.fehlenderGesamt+=this.bekommenerPfand[index].anzahl*this.bekommenerPfand[index].preis;

                        let bekommenerPfandTemp2 = JSON.parse(JSON.stringify(this.bekommenerPfand));
                        fehlenderPfand.push(bekommenerPfandTemp2[index]);
                    }
                }
            }
        })
        console.log(fehlenderPfand);
        return fehlenderPfand;
    },
    openBeleg(beleg){
        this.$emit('openBeleg', beleg);
    },
    setBelegItems(){
        try{
            this.belegItems = JSON.parse(this.$store.state.kasse.belegItems);
            this.belegItems = this.belegItems.filter(obj=>obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
            console.log(this.belegItems);
        } catch(err){
            this.belegItems = [];
        }
    }
  },
  created(){
    this.gesamt = 0;
    this.fehlenderGesamt = 0;
    this.verkaufteArtikel = [];
    this.verkaufterPfand = [];
    this.bekommenerPfand = [];
    this.fehlenderPfand = [];
    this.createVerkaufteArtikel();
    this.setBelegItems();
  },
  watch: {
    artikel(){
        this.gesamt = 0;
        this.verkaufteArtikel = [];
        this.verkaufterPfand = [];
        this.bekommenerPfand = [];
        this.fehlenderPfand = [];
        this.gesamt = 0;
        this.fehlenderGesamt = 0;
        this.createVerkaufteArtikel();
        this.setBelegItems();
    },
    pfand(){
        this.gesamt = 0;
        this.verkaufteArtikel = [];
        this.verkaufterPfand = [];
        this.bekommenerPfand = [];
        this.fehlenderPfand = [];
        this.gesamt = 0;
        this.fehlenderGesamt = 0;
        this.createVerkaufteArtikel();
        this.setBelegItems();
    },
    belegItems: {
        handler(newVal, oldVal){
            try{
                let newBelege = JSON.parse(newVal);
                newBelege = newBelege.filter(obj=>obj.kassenprojektID == this.$props.selectedKassenprojekt.Id && obj.desktopID == this.$props.selectedDesktop.Id);
                if(newBelege != this.belege){
                    this.setBelegItems();
                }
            } catch(err){

            }
        },
        deep: true
    }
  },
};
</script>