import {request} from './request'

//获取商品列表的请求
export function getGoodsList(queryInfo) {
  return request({
    url: 'goods',
    method: 'get',
    params: {
      query: queryInfo.query,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize
    }
  }).catch(err => err)
}

//删除商品的请求
export function removeById(id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  }).catch(err => err)
}

//添加商品的请求
export function addProduct(form) {
  return request({
    url: 'goods',
    method: 'post',
    data: {
      goods_name: form.goods_name,
      goods_cat: form.goods_cat,
      goods_price: form.goods_price,
      goods_number: form.goods_number,
      goods_weight: form.goods_weight,
      goods_introduce: form.goods_introduce,
      pics: form.pics,
      attrs: form.attrs,
    }
  }).catch(err => err)
}