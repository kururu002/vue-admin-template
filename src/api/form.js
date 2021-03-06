import request from '@/utils/request'

export function submit(data) {
  return request({
    url: 'report',
    method: 'post',
    data
  })
}
export function upload(data) {
  return request({
    url: 'file/upload',
    method: 'post',
    data
  })
}
export function imageList(queryString) {
  return request({
    url: 'docker',
    method: 'get',
    params: { queryString }
  })
}
