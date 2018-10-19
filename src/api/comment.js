import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/message/comments',
    method: 'get',
    params: query
  })
}

export function deleteMessage(id) {
  return request({
    url: '/message/delete-comment',
    method: 'get',
    params: { id }
  })
}
