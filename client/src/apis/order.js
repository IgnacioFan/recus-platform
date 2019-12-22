import { apiHelper } from './../utils/helpers'

export default {
  categories: {
    get() {
      return apiHelper.get('/categories')
    }
  },
  dishes: {
    get({ categoryId }) {
      const searchParams = new URLSearchParams({ categoryId })
      return apiHelper.get(`/dishes?${searchParams.toString()}`)
    }
  }
}