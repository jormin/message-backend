import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/index',
    method: 'get',
    params: query
  })
}

export function fetchuser(id) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: { id }
  })
}

export function changeStatus(id, userStatus) {
  return request({
    url: '/user/changeStatus',
    method: 'get',
    params: { id, userStatus }
  })
}
