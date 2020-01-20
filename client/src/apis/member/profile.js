import { apiHelper } from '../../utils/helpers'

export default {
  get() {
    return apiHelper.get(`/member/profile`)
  },
  put(formData) {
    return apiHelper.put(`/member/profile`, formData)
  }
}