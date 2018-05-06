import Vue from 'vue';
import Vuex from 'vuex';
import ApiServer from './apiService'

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    ApiServer,
  }
});