<template>
    <div ref="wrapper" :style="cssVars">
      <highcharts ref="hc" :options="chartOptions"></highcharts>
    </div>
</template>

<script>
import Highcharts from "highcharts";
import { Chart } from "highcharts-vue";

// Lokale Einstellungen setzen
Highcharts.setOptions({
  lang: {
    decimalPoint: ",",
    thousandsSep: "."
  }
});

export default {
  components: {
    Highcharts: Chart
  },
  props: {
    kassenProjekt: {},
    dataAPI: [],
    gesamt: String,
    darkMode: Boolean
  },
  data() {
    return {
      total: 0,
      columnData: [],
      chartOptions: {
        chart: { type: "column", backgroundColor: "transparent" },
        title: { text: "" },
        xAxis: { categories: [] },
        yAxis: { title: { text: "" } },
        series: [],
      },
    };
  },
  watch: {
    dataAPI: {
      handler(){
        this.prepareChart();
      },
      immediate: true
    }
  },
  computed: {
    cssVars() {
     if(!this.$props.darkMode){
        return {
          '--chart-bg': '#ffffff',
          '--chart-ink': '#222',
          '--chart-grid-line': '#e1e1e1',
        };
      } else{
        return {
          '--chart-bg': '#161616',
          '--chart-ink': '#ffffff',
          '--chart-grid-line': '#ffffff'
        };
      }
    },
  },
  methods: {
    prepareChart() {
      // ensure DOM updated so getComputedStyle(this.$refs.wrapper) works
      this.$nextTick(() => {
        const opts = this.getColumnChartData();
        console.log(opts.yAxis.gridLineColor);
        // set chartOptions so highcharts-vue mounts/updates safely
        this.chartOptions = opts;

        // optional: if chart instance exists, update only background (guarded)
        this.$nextTick(() => {
          if (this.$refs.hc && this.$refs.hc.chart) {
            this.$refs.hc.chart.update({ chart: { backgroundColor: opts.chart.backgroundColor } }, true, true);
          }
        });
      });
    },
    getTotal(){
      try{
        return this.total.toFixed(2).toString();
      } catch(err){
        return "0.00";
      }
    },
    getColumnChartData() {
      this.processData();
      
      const el = this.$refs.wrapper || document.documentElement;
      const styles = getComputedStyle(el);
      let bg = styles.getPropertyValue("--chart-bg").trim();
      let ink = styles.getPropertyValue("--chart-ink").trim();
      let gridLine = styles.getPropertyValue("--chart-grid-line").trim();
      if (!bg) bg = getComputedStyle(document.documentElement).getPropertyValue("--chart-bg").trim() || "transparent";

      return {
        chart: { type: "column", backgroundColor: bg },
        title: { 
          text: "Verkauft ("+this.getTotal() + " €)",
          style: {
            color: ink
          }
         },
        xAxis: {
          categories: this.columnData.map(d => d.name),
          labels: {
            style: {
              color: ink
            },
          }
        },
        yAxis: { 
          title: { 
            text: "Anzahl",
            style: {
              color: ink
            }
          },
          labels: {
            style: {
              color: ink
            },
          },
          gridLineColor: gridLine
        },
        tooltip: {
          useHTML: true,
          formatter: function () {
            return `<b>${this.point.name}</b><br>Anzahl: ${this.y} <br>Gewinn: ${this.point.money}€`;
          }
        },
        legend: {
          itemStyle: {
            color: ink,
          }
        },
        series: [
          { 
            name: "Verkauft", 
            style: {
              color: ink
            },
            data: this.columnData, 
            colorByPoint: true 
          }
        ]
      };
    },

    processData() {
        
      this.columnData = [];
      this.total = 0;
      if (!this.dataAPI || this.dataAPI.length === 0) return;

      this.dataAPI.sort((a,b)=>Number(b.anzahlVerkauft) - Number(a.anzahlVerkauft)).forEach(element => {

        const preis = Number(String(element.preis).replace(",", "."));
        const anzahl = Number(element.anzahlVerkauft);

          if(anzahl > 0){

          const totalMoney = preis * anzahl;

          this.total += totalMoney;

          this.columnData.push({
            name: element.bezeichnung,
            y: anzahl,
            money: totalMoney.toFixed(2)
          });
        }
      });
    },

    formatNumber(amount) {
      return amount.toFixed(2);
    }
  },
};
</script>

  
<style lang="scss" scoped>
  .highcharts-title {
    font-size: x-large !important;
  }
  .highcharts-label {
    font-size: x-large !important;
  }
</style>
  