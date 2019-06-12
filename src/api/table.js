import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
export function getResult(reportId) {
  return request({
    url: '/report',
    method: 'get',
    params: { reportId }
  })
}
