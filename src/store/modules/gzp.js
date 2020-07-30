// import storage from 'store'
import { getTodayGzpsList } from '@/api/gzp'
// import store from '@/store'

const gzp = {
  state: {
    // 工作票
    gzpsList: []
  },

  mutations: {
    SET_GZPSLIST: (state, { gzpsList }) => {
      state.gzpsList = gzpsList
    }
  },

  actions: {
    // 获取当日工作票
    GetGzpsList ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.gzpsList.length === 0) {
          getTodayGzpsList().then(response => {
            console.log(response)
            commit('SET_GZPSLIST', { gzpsList: response.result })
            resolve({
              gzpsList: state.gzpsList
            })
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve({
            gzpsList: state.gzpsList
          })
        }
      })
    }
  }
}

export default gzp
