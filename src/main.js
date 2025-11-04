import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Highcharts from 'highcharts';
import Charts from 'highcharts-vue';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Highcharts);
app.use(Charts);

app.mount('#app');
