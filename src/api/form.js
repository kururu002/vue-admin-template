import request from '@/utils/request'

export function submit(data) {
  return request({
    url: 'report/submit',
    method: 'post',
    data
  })
}
