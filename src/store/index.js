import Vue from 'vue';
import Vuex from 'vuex';
import ApiService from './apiService';
import PlayService from './playService';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    ApiService,
    PlayService,
  }
});
