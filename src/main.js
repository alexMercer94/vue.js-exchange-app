import Vue from 'vue';
import App from './App.vue';
import '@/assets/css/tailwind.css';
import router from '@/router';
import { dollarFilyer, percentFilter } from '@/filters';
import Chartick from 'vue-chartkick';
import { VueSpinners } from '@saeris/vue-spinners';
import Chart from 'chart.js';

Vue.filter('dollar', dollarFilyer);
Vue.filter('percent', percentFilter);
Vue.use(VueSpinners);
Vue.use(Chartick.use(Chart));
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
