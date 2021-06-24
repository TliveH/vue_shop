import {request} from './request'

//订单列表的请求
export function getOrderList(queryInfo) {
  return request({
    url: 'orders',
    method: 'get',
    params: {
      query: queryInfo.query,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize
    }
  }).catch(err => err)
}

//物流信息的请求
export function getProgressById(user_id) {
  return request({
    url: `/kuaidi/${user_id}`,
    method: 'get'
  }).catch(err => err)
}

//
export function orderStateChanged(order_id,orderList) {
  return request({
    url: `orders/${order_id}`,
    method: 'put',
    data: {
      is_send: orderList[order_id].is_send,
      order_pay: orderList[order_id].order_pay,
      order_price: orderList[order_id].order_price,
      order_number: orderList[order_id].order_number,
      pay_status: orderList[order_id].pay_status
    }
  }).catch(err => err)
}