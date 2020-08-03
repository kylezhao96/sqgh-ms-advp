// import storage from 'store'
import { getTodayGzpsList, submitNewGzp } from '@/api/gzp'
// import store from '@/store'

const gzp = {
  state: {
    // 工作票
    gzpsList: [],
    gzpForm: {
      terminalWt: '停机',
      terminalPower: '不停电',
      type: '维护',
      position: '整机',
      group: '检修班组',
      members: []
    }
  },

  mutations: {
    SET_GZPSLIST: (state, { gzpsList }) => {
      state.gzpsList = gzpsList
    },
    SET_GZPFORM: (state, { gzpForm }) => {
      state.gzpForm = gzpForm
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
    },
    // 保存工作票表单
    SaveGzpForm ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        commit('SET_GZPFORM', { gzpForm: params })
      })
    },
    // 获取工作票表单
    GetGzpform ({ state }) {
      return new Promise((resolve, reject) => {
        resolve(state.gzpForm)
      })
    },
    // 提交表单
    SubmitGzpForm ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        commit('SET_GZPFORM', { gzpForm: params })
        submitNewGzp(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default gzp
