import { apiHelper } from '../../utils/helpers'

export default {
  getPieChart({ range }) {
    const searchParams = new URLSearchParams({ range })
    return apiHelper.get(`/admin/dashboard?${searchParams.toString()}`)
  },
  getLineChart({ id }) {
    const searchParams = new URLSearchParams({ id })
    return apiHelper.get(`/admin/dashboard/lineChart?${searchParams.toString()}`)
  }
}