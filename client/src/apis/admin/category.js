import { apiHelper } from '../../utils/helpers'

export default {
  categories: {
    get() {
      return apiHelper.get('/admin/categories')
    }
  },
  category: {
    get() {
      return apiHelper.get(`/admin/categories`)
    },
    post(name) {
      return apiHelper.post(`/admin/categories`, name)
    },
    put({ categoryId, name }) {
      return apiHelper.put(`/admin/categories/${categoryId}`, { name })
    },
    delete(TagId) {
      return apiHelper.delete(`/admin/categories/${TagId}`)
    }
  }
}