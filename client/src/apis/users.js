import { apiHelper } from './../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getCurrentUser() {
    return apiHelper.get(`/get_current_user`)
  },

  getMembers({ page }) {
    const searchParams = new URLSearchParams({ page })
    return apiHelper.get(`/members?${searchParams.toString()}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },

  deleteUser({ userId }) {
    return apiHelper.delete(`/members/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },

  toggleAdmin({ userId }) {
    return apiHelper.put(`/members/admin/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}