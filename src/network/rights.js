import {request} from './request'

//获取权限列表的请求
export function getRightList() {
  return request({
    url: 'rights/list',
    method: 'get'
  }).catch(err => err)
}