import request from '@/utils/request'

const api = {
  user: '/api/user',
  users: '/api/users'
}

export default api

export function getUsersList (parameter) {
  return request({
    url: api.users,
    method: 'post',
    data: parameter
  })
}
