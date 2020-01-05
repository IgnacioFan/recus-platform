import { apiHelper } from '../../utils/helpers'

export default {
  dishes: {
    get({ categoryId }) {
      const searchParams = new URLSearchParams({ categoryId })
      return apiHelper.get(`/admin/dishes?${searchParams.toString()}`)
    }
  },
  dish: {
    get(orderId) {
      const searchParams = new URLSearchParams(orderId)
      return apiHelper.get(`/admin/dishes?${searchParams.toString()}`)
    },
    post(formData) {
      return apiHelper.post(`/dishes`, formData)
    },
    put({ dishId, formData }) {
      return apiHelper.put(`/admin/dishes/${dishId}`, formData)
    },
    delete(dishId) {
      return apiHelper.delete(`/admin/dishes/${dishId}`)
    }
  }
}