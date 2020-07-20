import request from '@/utils/request'

const api = {
  gzp: '/api/gzp',
  gzps: '/api/gzps',
  gzpstoday: '/api/gzps/today'
}

export default api

export function getGzpsList (days) {
  return request({
    url: api.gzps + '/' + days,
    method: 'get'
  })
}

export function getTodayGzpsList () {
  return request({
    url: api.gzpstoday,
    method: 'get'
  })
}
