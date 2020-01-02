import Vue from 'vue'
import VueRouter from 'vue-router'
//import store from '../store'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'root',
  redirect: '/signin'
}, {
  path: '/signin',
  name: 'sign-in',
  component: () =>
    import ('../views/SignIn.vue')
}, {
  path: '/signup',
  name: 'sign-up',
  component: () =>
    import ('../views/SignUp.vue')
}, {
  path: '/order',
  name: 'order',
  component: () =>
    import ('../views/Order.vue')
}, {
  path: '/members',
  name: 'members',
  component: () =>
    import ('../views/MemberManage.vue')
}, {
  path: '/members/search',
  name: 'memberseach',
  component: () =>
    import ('../views/MemberManage.vue')
}, {
  path: '/orders',
  name: 'day-orders',
  component: () =>
    import ('../views/DayOrders.vue')
}, {
  path: '/manage/dishes',
  name: 'manage-dishes',
  component: () =>
    import ('../views/Manage.vue')
}, {
  path: '/manage/categories',
  name: 'manage-categories',
  component: () =>
    import ('../views/AdminCategories.vue')
}, {
  path: '/manage/tages',
  name: 'manage-tages',
  component: () =>
    import ('../views/AdminTags.vue')
}, {
  path: '/dish/new',
  name: 'admin-dish-new',
  component: () =>
    import ('../views/AdminDishNew.vue')
}, {
  path: '/dish/:id/edit',
  name: 'admin-dish-edit',
  component: () =>
    import ('../views/AdminDishEdit.vue')
}, {
  path: '*',
  name: 'not-found',
  component: () =>
    import ('../views/NotFound.vue')
}]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  mode: 'history',
  routes
})

// router.beforeEach(async(to, from, next) => {
//   const tokenInLocalStorage = localStorage.getItem('token')
//   const tokenInStore = store.state.token
//   let isAuthenticated = store.state.isAuthenticated

//   // 比較 localStorage 和 store 中的 token 是否一樣
//   if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
//     isAuthenticated = await store.dispatch('fetchCurrentUser')
//   }

//   // 如果 token 無效則轉址到登入頁
//   if (!isAuthenticated && to.name !== 'sign-in') {
//     next('/signin')
//     return
//   }

//   // 如果 token 有效則轉址到餐聽首頁
//   if (isAuthenticated && to.name === 'sign-in') {
//     next('/order')
//     return
//   }

//   next()
// })


export default router