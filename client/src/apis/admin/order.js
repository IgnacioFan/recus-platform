import { apiHelper } from '../../utils/helpers'

export default {
  orders: {
    get({ state }) {
      const searchParams = new URLSearchParams({ state })
      return apiHelper.get(`/admin/orders?${searchParams.toString()}`)
    },
    pendingNums() {
      return apiHelper.get(`/admin/orders/pendingNums`)
    },
    unpaidNums() {
      return apiHelper.get(`/admin/orders/unpaidNums`)
    },
    delete(orderId) {
      const searchParams = new URLSearchParams(orderId)
      return apiHelper.delete(`/admin/orders/${searchParams.toString()}`)
    }
  },
  state: {
    put(stateData) {
      return apiHelper.put(`/admin/orders/${stateData.orderId}/${stateData.state}`)
    }
  },
  list: {
    post({ dishes, UserId, tableNum, isTakingAway, memo, quantity, amount }) {
      return apiHelper.post(`/admin/orders`, { dishes, UserId, tableNum, isTakingAway, memo, quantity, amount })
    }
  }
}