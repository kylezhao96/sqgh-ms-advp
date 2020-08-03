import request from '@/utils/request'

const api = {
  gzp: '/api/gzp',
  gzps: '/api/gzps',
  gzpstoday: '/api/gzps/today',
  firms: '/api/firms',
  newgzpid: '/api/gzp/id/new',
  newgzp: '/api/gzp/new'
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

export function getFirmList (parameter) {
  return request({
    url: api.firms,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getNewGzpId () {
  return request({
    url: api.newgzpid,
    method: 'get'
  })
}

export function submitNewGzp (parameter) {
  return request({
    url: api.newgzp,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
