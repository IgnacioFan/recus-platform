import { apiHelper } from '../../utils/helpers'

export default {
  getMembers({ page }) {
    const searchParams = new URLSearchParams({ page })
    return apiHelper.get(`/admin/members?${searchParams.toString()}`)
  },
  searchMember({ phone }) {
    const searchParams = new URLSearchParams({ phone })
    return apiHelper.get(`/admin/members/search?${searchParams.toString()}`)
  },
  toggleAdmin({ userId }) {
    return apiHelper.put(`/admin/members/admin/${userId}`)
  },
  deleteMember({ userId }) {
    return apiHelper.delete(`/admin/members/${userId}`)
  }
}