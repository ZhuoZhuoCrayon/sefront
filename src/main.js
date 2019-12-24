import Vue from 'vue';
import './plugins/axios';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
