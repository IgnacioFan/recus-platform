import { apiHelper } from './../utils/helpers'

export default {
  orders: {
    get({ state }) {
      const searchParams = new URLSearchParams({ state })
      return apiHelper.get(`/orders?${searchParams.toString()}`)
    },
    delete(orderId) {
      const searchParams = new URLSearchParams(orderId)
      return apiHelper.delete(`/orders/${searchParams.toString()}`)
    }
  },
  state: {
    put(stateData) {
      return apiHelper.put(`/orders/${stateData.orderId}/${stateData.state}`)
    }
  },
}