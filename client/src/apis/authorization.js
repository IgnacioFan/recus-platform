import { apiHelper } from './../utils/helpers'

export default {
  signIn({ account, password }) {
    return apiHelper.post('/signin', {
      account,
      password
    })
  },
  signUp(data) {
    return apiHelper.post("/signUp", {
      ...data
    })
  }
}