import { apiHelper } from './../utils/helpers'

export default {
  dish: {
    get(orderId) {
      const searchParams = new URLSearchParams(orderId)
      return apiHelper.get(`/orders?${searchParams.toString()}`)
    },
    put(orderId) {
      const searchParams = new URLSearchParams(orderId)
      return apiHelper.get(`/orders?${searchParams.toString()}`)
    },
    delete(orderId) {
      const searchParams = new URLSearchParams(orderId)
      return apiHelper.delete(`/orders/${searchParams.toString()}`)
    }
  }
}