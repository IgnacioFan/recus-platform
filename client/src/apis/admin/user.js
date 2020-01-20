import { apiHelper } from '../../utils/helpers'

export default {
  user: {
    get({ phone }) {
      const searchParams = new URLSearchParams({ phone })
      return apiHelper.get(`/admin/members/search?${searchParams.toString()}`)
    },
    delete({ userId }) {
      return apiHelper.delete(`/admin/members/${userId}`)
    }
  }
}