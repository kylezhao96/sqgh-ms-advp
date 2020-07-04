// import storage from 'store'
import { getCdfsList, getCdfsListByTimeRange } from '@/api/cdf'
// import store from '@/store'

const cdf = {
  state: {
    // 更新日期
    updateDate: '',
    // 发电量
    dataList: [],
    // 完成率
    yearRate: 0,
    monthRate: 0,
    planRate: 0
  },

  mutations: {
    SET_UPDATEDATE: (state, date) => {
      state.updateDate = date
    },
    SET_DATA: (state, { dataList }) => {
      state.dataList = dataList
    },
    SET_RATE: (state, { yearRate, monthRate, planRate }) => {
      state.yearRate = yearRate
      state.monthRate = monthRate
      state.planRate = planRate
    }
  },

  actions: {
    // 获取分析信息
    GetMiniChartData ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.dataList.length === 0) {
          getCdfsList(7).then(response => {
            console.log(response)
            const result = response.result
            const list = response.result.cdfs
            // 数据更新日期
            // commit('SET_UPDATEDATE', list[0].date)
            // 数据
            const dataList = list
            commit('SET_DATA', { dataList: dataList })
            // 完成率
            const yearRate = Number((result.year_rate * 100).toFixed(2))
            const monthRate = (result.month_rate * 100).toFixed(2)
            const planRate = result.plan_rate * 100
            commit('SET_RATE', { yearRate: yearRate, monthRate: monthRate, planRate: planRate })
            resolve({
              dataList: state.dataList,
              yearRate: state.yearRate,
              monthRate: state.monthRate,
              planRate: state.planRate
            })
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve({
            dataList: state.dataList,
            yearRate: state.yearRate,
            monthRate: state.monthRate,
            planRate: state.planRate
          })
        }
      })
    },
    // 获取 Bar 图数据
    GetBarData ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        getCdfsListByTimeRange(params).then(response => {
          console.log(response)
          resolve(response.result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default cdf
