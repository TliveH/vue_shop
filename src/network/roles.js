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
export function allotRights(roleId, idStr) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids: idStr
    }
  }).catch(err => err)
}

//添加角色的请求
export function addRole(addRoleForm) {
  return request({
    url: 'roles',
    method: 'post',
    data: {
      roleName: addRoleForm.roleName,
      roleDesc: addRoleForm.roleDesc
    }
  }).catch(err => err)
}

export function showEditRoleDialog(id) {
  return request({
    url: `roles/${id}`,
    method: 'get'
  }).catch(err => err)
}

//修改角色的请求
export function editRoleInfo(editRoleForm) {
  return request({
    url: `roles/${editRoleForm.roleId}`,
    method: 'put',
    data: {
      roleName: editRoleForm.roleName,
      roleDesc: editRoleForm.roleDesc
    }
  }).catch(err => err)
}

//删除角色的请求
export function removeRoleById(roleId) {
  return request({
    url: `roles/${roleId}`,
    method: 'delete'
  }).catch(err => err)
}