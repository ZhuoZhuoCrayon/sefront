import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: sessionStorage.getItem('userId'),
    userIsAdmin: sessionStorage.getItem('isAdmin'),
    cusLevel: sessionStorage.getItem('cusLevel'),
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
      sessionStorage.setItem('userId', id);
    },
    setUserIsAdmin(state, isAdmin) {
      state.userIsAdmin = isAdmin;
      sessionStorage.setItem('isAdmin', isAdmin);
    },
    setCusLevel(state, cusLevel) {
      state.cusLevel = cusLevel;
      sessionStorage.setItem('cusLevel', cusLevel);
    },
  },
  getters: {
    getUserId(state) {
      return state.userId === 'null' ? null : state.userId;
    },
    getUserIsAdmin(state) {
      return state.userIsAdmin;
    },
    getCusLevel(state) {
      return state.cusLevel;
    },
  },
});
