import Vue from 'vue';
import App from './App.vue';
import '@/assets/css/tailwind.css';
import router from '@/router';
import { dollarFilyer, percentFilter } from '@/filters';

Vue.filter('dollar', dollarFilyer);
Vue.filter('percent', percentFilter);
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
