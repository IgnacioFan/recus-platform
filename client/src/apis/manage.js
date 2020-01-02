import { apiHelper } from './../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  dish: {
    get(orderId) {
      const searchParams = new URLSearchParams(orderId)
      return apiHelper.get(`/dishes?${searchParams.toString()}`)
    },
    post(formData) {
      return apiHelper.post(`/dishes`, formData)
    },
    put({ dishId, formData }) {
      return apiHelper.put(`/dishes/${dishId}`, formData)
    },
    delete(dishId) {
      return apiHelper.delete(`/dishes/${dishId}`)
    }
  },
  category: {
    get() {
      return apiHelper.get(`/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    post(name) {
      return apiHelper.post(`/categories`, name)
    },
    put({ categoryId, name }) {
      return apiHelper.put(`/categories/${categoryId}`, { name })
    },
    delete(TagId) {
      return apiHelper.delete(`/categories/${TagId}`)
    }
  },
  tag: {
    get() {
      return apiHelper.get(`/tags`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    post(name) {
      return apiHelper.post(`/tags`, name)
    },
    put({ categoryId, name }) {
      return apiHelper.put(`/tags/${categoryId}`, { name })
    },
    delete(TagId) {
      return apiHelper.delete(`/tags/${TagId}`)
    }
  }
}