import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import cdf from './modules/cdf'
import gzp from './modules/gzp'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    cdf,
    gzp,
    permission
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
