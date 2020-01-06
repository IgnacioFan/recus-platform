import { apiHelper } from '../../utils/helpers'

export default {
  tag: {
    search(name) {
      const searchParams = new URLSearchParams(name)
      return apiHelper.get(`/admin/tag?${searchParams.toString()}`)
    },
    get() {
      return apiHelper.get(`/admin/tags`)
    },
    post(name) {
      return apiHelper.post(`/admin/tags`, name)
    },
    put({ categoryId, name }) {
      return apiHelper.put(`/admin/tags/${categoryId}`, { name })
    },
    delete(TagId) {
      return apiHelper.delete(`/admin/tags/${TagId}`)
    }
  }
}