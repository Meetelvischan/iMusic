// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueLazyLoad from 'vue-lazyload';
import App from './App';
import router from './router/router';
import store from './store';
import VueAwesomeSwiper from 'vue-awesome-swiper';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueLazyLoad, {
  error: require('./assets/images/error.svg'),
  loading: require('./assets/images/loading.svg'),
  attempt: 1,
});
Vue.use(VueAwesomeSwiper);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
  // components: { App },
  // template: '<App/>',
});
