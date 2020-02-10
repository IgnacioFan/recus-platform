import Vue from 'vue'
import Vuex from 'vuex'
import adminAuthorizationAPI from '../apis/admin/authorization'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      account: "",
      phone: "",
      role: "",
      name: "",
      avatar: ""
    },
    isAuthenticated: false,
    token: ''
  },
  mutations: {
    setCurrentUser(state, currentUser) {

      state.currentUser = {
          ...state.currentUser,
          // 將 API 取得的 currentUser 覆蓋掉 Vuex state 中的 currentUser
          ...currentUser
        }
        // 將使用者驗證用的 token 儲存在 state 中
      state.token = localStorage.getItem('token')
        // 將使用者的登入狀態改為 true
      state.isAuthenticated = true
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
        // 登出時一並將 state 內的 token 移除
      state.token = ''
      localStorage.removeItem('token')
    }
  },
  actions: {

    async fetchCurrentUser({ commit }) {
      try {
        const { data, statusText } = await adminAuthorizationAPI.getCurrentUser()

        if (statusText !== 'OK') {
          throw new Error(statusText)
        }

        commit('setCurrentUser', {
          id: data.id,
          account: data.account,
          phone: data.phone,
          role: data.role,
          name: data.name,
          avatar: data.avatar
        })
        return true
      } catch (error) {
        // eslint-disable-next-line
        console.error('can not fetch user information')
        commit('revokeAuthentication')
        return false
      }
    }
  },
  getters: {
    controlPanelRouteName: state => {
      if (state.currentUser.role === 'Admin') return 'admin-order'
      if (state.currentUser.role === 'member') return 'member-myorders'
    }
  }
})