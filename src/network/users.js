import {request} from './request'

export function getUserList(queryInfo) {
  return request({
    url: 'users',
    method: 'get',
    params: {
      query: queryInfo.query,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize
    }
  }).catch(err => err)
}

export function userStateChanged(userInfo) {
  return request({
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: 'put'
  }).catch(err => err)
}

//添加用户
export function addUser(addForm) {
  return request({
    url: 'users',
    method: 'post',
    data: {
      username: addForm.username,
      password: addForm.password,
      email: addForm.email,
      mobile: addForm.mobile
    }
  }).catch(err => err)
}

export function showEditDialog(id) {
  return request({
    url: `users/${id}`,
    method: 'get'
  }).catch(err => err)
}

//修改用户的请求
export function editUserInfo(editForm) {
  return request({
    url: `users/${editForm.id}`,
    method: 'put',
    data: {
      email: editForm.email,
      mobile: editForm.mobile
    }
  }).catch(err => err)
}

//删除用户的请求
export function removeUserById(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  }).catch(err => err)
}

//分配角色的请求
export function saveRoleInfo(userInfo, selectRoleId) {
  return request({
    url: `users/${userInfo.id}/role`,
    method: 'put',
    data: {
      rid: selectRoleId
    }
  }).catch(err => err)
}