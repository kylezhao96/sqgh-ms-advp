import request from '@/utils/request'

const api = {
  cdf: '/api/cdf',
  cdfs: '/api/cdfs',
  cdfsDays: '/api/cdfs/days/',
  cdfsTimeRange: '/api/cdfs/timerange'
}

export default api

export function getCdfsList (days, parameter) {
  return request({
    url: api.cdfsDays + days,
    method: 'get',
    params: parameter
  })
}

export function getCdfsListByTimeRange (parameter) {
  return request({
    url: api.cdfsTimeRange,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
