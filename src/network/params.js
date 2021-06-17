import {request} from './request'

//参数列表的请求
export function getParamsList(cateId, activeName) {
  return request({
    url: `categories/${cateId}/attributes`,
    method: 'get',
    params: {
      sel: activeName
    }
  }).catch(err => err)
}

//添加参数的请求
export function addParams(cateId, addForm, activeName) {
  return request({
    url: `categories/${cateId}/attributes`,
    method: 'post',
    data: {
      attr_name: addForm.attr_name,
      attr_sel: activeName
    }
  }).catch(err => err)
}

//通过id获取参数信息
export function showEditDialog(attr_id, cateId, activeName) {
  return request({
    url: `categories/${attr_id}/attributes/${cateId}`,
    method: 'get',
    params: {
      attr_sel: activeName
    }
  }).catch(err => err)
}

//修改参数的请求
export function editParams(cateId, editForm, activeName) {
  return request({
    url: `categories/${cateId}/attributes/${editForm.attr_id}`,
    method: 'put',
    data: {
      attr_name: editForm.attr_name,
      attr_sel: activeName
    }
  }).catch(err => err)
}

//删除参数的请求
export function removeParams(cateId,attr_id) {
  return request({
    url: `categories/${cateId}/attributes/${attr_id}`,
    method: 'delete'
  }).catch(err => err)
}

export function editParam(cateId,row) {
return request({
  url: `categories/${cateId}/attributes/${row.attr_id}`,
  method: 'put',
  data: {
    attr_name: row.attr_name,
    attr_sel: row.attr_sel,
    attr_vals:row.attr_vals.join(' ')
  }
}).catch(err => err)
}