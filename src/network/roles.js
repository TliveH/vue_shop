import {request} from './request'

//获取角色列表的请求
export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get'
  }).catch(err => err)
}

//删除权限的请求
export function removeRightById(role, rightId) {
  return request({
    url: `roles/${role.id}/rights/${rightId}`,
    method: 'delete'
  }).catch(err => err)
}

//获取所有权限树形结构的请求
export function showSetRightDialog() {
  return request({
    url: 'rights/tree',
    method: 'get'
  }).catch(err => err)
}

//分配权限的请求
export function allotRights(roleId,idStr) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data:{
      rids:idStr
    }
  }).catch(err => err)
}