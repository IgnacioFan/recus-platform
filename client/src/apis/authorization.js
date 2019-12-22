import { apiHelper } from './../utils/helpers'

export default {
  /* eslint-disable */
  // 帶入需要的參數
  signIn({ account, password }) {
    console.log(account);
    console.log(password);
    // 這裡 return 的會是一個 Promise
    return apiHelper.post('/signin', {
      account,
      password
    })
  },
  signUp({ account, password }) {
    return apiHelper.post('/signup', {
      account,
      phone,
      email,
      password,
      passwordCheck
    })
  },

}

