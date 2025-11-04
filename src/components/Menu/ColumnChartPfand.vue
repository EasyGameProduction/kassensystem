<template>
    <div>
      <highcharts :options="chartOptions"></highcharts>
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
    gesamt: String
  },
  data() {
    return {
      total: 0,
      columnData: [],
      chartOptions: null
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
  methods: {
    prepareChart(){
      this.chartOptions = this.getColumnChartData();
    },
    getColumnChartData() {
        console.log(this.$props.dataAPI);
      this.processData();
      return {
        chart: {
          type: "column"
        },
        title: {
          text: "Fehlender Pfand ("+this.$props.gesamt+" €)"
        },
        xAxis: {
          categories: this.columnData.map(item => item.name),
          title: {
            text: "Pfand"
          }
        },
        yAxis: {
          title: {
            text: "Anzahl fehlend"
          }
        },
        tooltip: {
          useHTML: true,
          formatter: function () {
            return `<b>${this.point.name}</b><br>Anzahl: ${this.y} <br>Preis: ${this.point.money}€`;
          }
        },
        series: [
          {
            name: "Fehlende Pfand",
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

      this.dataAPI.forEach(element => {
        const totalMoney = +(element.preis) * +(element.anzahl);
        this.total += totalMoney;

        // Column Chart Data
        this.columnData.push({
          name: element.bezeichnung,
          y: +(element.anzahl),
          money: this.formatNumber(totalMoney)
        });
      });

      this.total = this.formatNumber(this.total);
    },

    formatNumber(amount) {
      return amount.toFixed(2);
    }
  }
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
  