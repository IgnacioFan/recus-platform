import { apiHelper } from '../../utils/helpers'

export default {
  get() {
    return apiHelper.get(`/admin/profile`)
  },
  put(formData) {
    return apiHelper.put(`/admin/profile`, formData)
  }
}