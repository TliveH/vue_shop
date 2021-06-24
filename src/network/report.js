import {request} from './request'

//折线图数据的请求
export function getBrokeLine() {
  return request({
    url: 'reports/type/1',
    method: 'get'
  }).catch(err => err)
}