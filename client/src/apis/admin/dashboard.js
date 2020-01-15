import { apiHelper } from '../../utils/helpers'

export default {
  get({ range }) {
    const searchParams = new URLSearchParams({ range })
    return apiHelper.get(`/admin/dashboard?${searchParams.toString()}`)
  }
}