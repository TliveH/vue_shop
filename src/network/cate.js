import {request} from './request'

//商品分类列表的请求
export function getCateList(queryInfo) {
  return request({
    url: 'categories',
    method: 'get',
    params: {
      type: queryInfo.type,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize
    }
  }).catch(err => err)
}

//添加分类的请求
export function addCate(addCateForm) {
  return request({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid: addCateForm.cat_pid,
      cat_name: addCateForm.cat_name,
      cat_level: addCateForm.cat_level
    }
  }).catch(err => err)
}

export function showEditDialog(cat_id) {
  return request({
    url: `categories/${cat_id}`,
    method: 'get'
  }).catch(err => err)
}

//修改分类的请求
export function editCateInfo(editCateForm) {
  return request({
    url: `categories/${editCateForm.cat_id}`,
    method: 'put',
    data: {
      cat_name: editCateForm.cat_name
    }
  }).catch(err => err)
}

//删除分类的请求
export function removeCateById(cat_id) {
  return request({
    url: `categories/${cat_id}`,
    method: 'delete'
  }).catch(err => err)
}