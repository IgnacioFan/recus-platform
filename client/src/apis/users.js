import { apiHelper } from './../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getMembers({ page }) {
    const searchParams = new URLSearchParams({ page })
    return apiHelper.get(`/members?${searchParams.toString()}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },

  deleteUser({ userId }) {
    // eslint-disable-next-line
    console.log("/members/${userId}", userId);
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