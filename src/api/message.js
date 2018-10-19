import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/message/index',
    method: 'get',
    params: query
  })
}

export function fetchMessage(id) {
  return request({
    url: '/message/detail',
    method: 'get',
    params: { id }
  })
}

export function deleteMessage(id) {
  return request({
    url: '/message/delete',
    method: 'get',
    params: { id }
  })
}
