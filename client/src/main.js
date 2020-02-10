import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/application.css'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { VueMasonryPlugin } from 'vue-masonry';

Vue.use(VueMasonryPlugin)
Vue.use(VueSweetalert2);
Vue.config.productionTip = false

new Vue({
  router,
  VueSweetalert2,
  VueMasonryPlugin,
  store,
  render: h => h(App)
}).$mount('#app')