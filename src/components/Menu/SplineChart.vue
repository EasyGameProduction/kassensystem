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
    belegItems: Array, // JSON-String mit Belegdaten
    darkMode: Boolean,
    selectedDesktop: Object
  },
  data() {
    return {
      splineData: [], // [timestamp, rechnungsbetrag]
      chartOptions: {
        chart: { type: "spline", backgroundColor: "transparent" },
        title: { text: "" },
        xAxis: { type: "datetime", categories: [] },
        yAxis: { title: { text: "" } },
        series: [],
      },
      rechnungsbetrag: 0.00,
      letztesDatum: ''
    };
  },
  watch: {
    belegItems: {
      handler() {
        this.prepareSplineChart();
      },
      immediate: true
    },
    selectedDesktop: {
      handler() {
        this.prepareSplineChart();
      },
      immediate: true
    }
  },
  computed: {
    cssVars() {
      if (!this.darkMode) {
        return {
          '--chart-bg': '#ffffff',
          '--chart-ink': '#222',
          '--chart-line': '#004eff',
          '--chart-grid-line': '#e1e1e1',
        };
      } else {
        return {
          '--chart-bg': '#161616',
          '--chart-ink': '#ffffff',
          '--chart-line': '#004eff',
          '--chart-grid-line': '#ffffff'
        };
      }
    },
  },
  methods: {
    prepareSplineChart() {
      this.$nextTick(() => {
        const opts = this.getSplineChartData();
        this.chartOptions = opts;

        // optional: Chart existiert schon → nur background updaten
        this.$nextTick(() => {
          if (this.$refs.hc && this.$refs.hc.chart) {
            this.$refs.hc.chart.update({ chart: { backgroundColor: opts.chart.backgroundColor } }, true, true);
          }
        });
      });
    },
    getRechnungsbetrag(){
        try{
            return this.rechnungsbetrag.toFixed(2).toString();
        } catch(err){
            return this.rechnungsbetrag;
        }
    },
    getSplineChartData() {
      this.processSplineData();

      const el = this.$refs.wrapper || document.documentElement;
      const styles = getComputedStyle(el);
      const bg = styles.getPropertyValue("--chart-bg").trim() || "transparent";
      const ink = styles.getPropertyValue("--chart-ink").trim();
      const line = styles.getPropertyValue("--chart-line").trim();
      const gridLine = styles.getPropertyValue("--chart-grid-line").trim();
        const vm = this;
      return {
        chart: {
          type: 'spline',
          backgroundColor: bg,
          borderRadius: '13px'
        },
        title: {
          text: 'Gesamtumsatz über Zeit (' + this.getRechnungsbetrag() + ' €)',
          style: { color: ink }
        },
        xAxis: {
            type: 'datetime',
            labels: { style: { color: ink }, formatter() {
                /*if(vm.letztesDatum !== Highcharts.dateFormat('%d.%m.%Y', this.value)){
                    vm.letztesDatum = Highcharts.dateFormat('%d.%m.%Y', this.value);
                    return Highcharts.dateFormat('%d.%m.%Y', this.value);
                } else{*/
                    return '';
                /*}
            */}},
            gridLineColor: gridLine
        },
        yAxis: {
          title: { text: 'Gesamtumsatz (€)', style: { color: ink } },
          labels: { style: { color: ink } },
          gridLineColor: gridLine
        },
        legend: {
          itemStyle: { color: ink }
        },
        tooltip: {
            formatter() {
                return `<b>${Highcharts.dateFormat('%d.%m.%Y %H:%M', this.x)}</b><br>Konto: ${this.y.toFixed(2)} €`;
            }
        },
        series: [
          {
            name: 'Umsatz',
            data: this.splineData,
            color: line,
            point:{
                events: {
                    click: function(){
                        vm.onPointClick(this)
                    }
                }
            }
          }
        ]
      };
    },
    onPointClick(obj){
        this.$emit('openBeleg',this.$props.belegItems.find(o=>o.time == obj.x));
    },

    processSplineData() {
        this.splineData = [];

        try {
            const items = this.belegItems
            .filter(item => !item.helferFrei)
            .sort((a, b) => new Date(a.time) - new Date(b.time)); // nach Zeit sortieren

            let runningTotal = 0;
            this.splineData = items.map(item => {
            const timestamp = new Date(item.time).getTime(); // ms
            runningTotal += parseFloat(item.rechnungsbetrag);
            this.rechnungsbetrag = runningTotal;
            return [timestamp, runningTotal];
            });

            console.log("SplineData Punkte:", this.splineData.length, this.splineData);
        } catch (e) {
            console.error("Fehler beim Parsen von belegItems:", e);
        }
    },
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
