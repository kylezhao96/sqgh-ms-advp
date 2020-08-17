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
      members: [],
      statistics: [],
      safeMs_in: [{
        txt: '出车前检查行车车辆安全',
        id: 1
      }],
      safeMs_out: [
        {
          txt: '作业人员正确佩戴个人劳动防护用品。',
          id: 1
        },
        {
          txt: '就地进行打到停机维护状态。',
          id: 2
        }]
    },
    statistics: [
      {
        task: '齿轮箱散热点击更换',
        num: 24,
        id: 1
      },
      {
        task: '第三季度巡视',
        num: 40,
        id: 2
      }]
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
