import { apiHelper } from '../../utils/helpers'
import store from '../../store'

export default {
  signIn({ account, password }) {
    return apiHelper.post('/signin', {
      account,
      password
    })
  },
  signUp(data) {
    return apiHelper.post('/signup', {
      ...data
    })
  },
  getCurrentUser() {
    return apiHelper.get(`/${store.state.currentUser.role}/user`)
  }
}