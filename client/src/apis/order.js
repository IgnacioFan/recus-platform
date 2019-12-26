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
  },
  user: {
    get({ phone }) {
      const searchParams = new URLSearchParams({ phone })
      return apiHelper.get(`/searchUser?${searchParams.toString()}`)
    }
  },
  list: {
    post({ dishes, UserId, tableNum, isTakingAway, memo, quantity, amount }) {
      return apiHelper.post(`/orders`, { dishes, UserId, tableNum, isTakingAway, memo, quantity, amount })
    }
  }
}