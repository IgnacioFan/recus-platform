import { apiHelper } from '../../utils/helpers'

export default {
  post() {
    return apiHelper.post(`/member/mypreferred`)
  },
  delete() {
    return apiHelper.delete(`/member/mypreferred`)
  }
}