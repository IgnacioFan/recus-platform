import { apiHelper } from './../utils/helpers'

export default {
  categories: {
    get() {
      return apiHelper.get('/categories')
    }
  },
  getDish({ page, categoryId }) {
    const searchParams = new URLSearchParams({ page, categoryId })
    return apiHelper.get(`/order?${searchParams.toString()}`)
  }
}