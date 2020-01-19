import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const authentication = {
  isAdmin(to, from, next) {
    const currentUser = store.state.currentUser
    if (currentUser && currentUser.role !== "admin") {
      next({ name: 'admin-not-found' })
      return
    }
    next()
  },
  isMember(to, from, next) {
    const currentUser = store.state.currentUser
      // redirect to 404 if user is not an Member
    if (currentUser && currentUser.role !== 'member') {
      next({ name: 'admin-not-found' })
      return
    }
    next()
  }
}


const routes = [
  // ====================  Member  ====================
  {
    path: '/member/myorders',
    name: 'member-myorders',
    component: () =>
      import ('../views/member/MemberMyOrders.vue'),
    beforeEnter: authentication.isMember
  },

  // ====================  Admin  ====================
  {
    path: '/',
    name: 'root',
    redirect: '/admin/signin'
  }, {
    path: '/admin/signin',
    name: 'admin-sign-in',
    component: () =>
      import ('../views/admin/AdminSignIn.vue')
  }, {
    path: '/admin/signup',
    name: 'admin-sign-up',
    component: () =>
      import ('../views/admin/AdminSignUp.vue')
  }, {
    path: '/admin/order',
    name: 'admin-order',
    component: () =>
      import ('../views/admin/AdminOrder.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/order/index',
    name: 'admin-order-index',
    component: () =>
      import ('../views/admin/AdminOrderIndex.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/manage/members',
    name: 'admin-manage-members',
    component: () =>
      import ('../views/admin/AdminManageMember.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/dayorders',
    name: 'admin-day-orders',
    component: () =>
      import ('../views/admin/AdminDayOrders.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/manage/meal',
    name: 'admin-manage-meal',
    component: () =>
      import ('../views/admin/AdminManageMeal.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/manage/categories',
    name: 'admin-manage-categories',
    component: () =>
      import ('../views/admin/AdminManageCategories.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/manage/tages',
    name: 'admin-manage-tages',
    component: () =>
      import ('../views/admin/AdminManageTags.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/dish/:id/edit',
    name: 'admin-dish-edit',
    component: () =>
      import ('../views/admin/AdminDishEdit.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/dish/new',
    name: 'admin-dish-new',
    component: () =>
      import ('../views/admin/AdminDishNew.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '/admin/manage/dashboard',
    name: 'admin-dash-board',
    component: () =>
      import ('../views/admin/AdminDashBoard.vue'),
    beforeEnter: authentication.isAdmin
  }, {
    path: '*',
    name: 'admin-not-found',
    component: () =>
      import ('../views/admin/AdminNotFound.vue')
  }
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  mode: 'history',
  routes
})

router.beforeEach(async(to, from, next) => {
  const tokenInLocalStorage = localStorage.getItem('token')
  const tokenInStore = store.state.token
  let isAuthenticated = store.state.isAuthenticated

  // 比較 localStorage 和 store 中的 token 是否一樣
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticated = await store.dispatch('fetchCurrentUser')
  }

  // 對於不需要驗證 token 的頁面
  const pathsWithoutAuthentication = ['admin-sign-up']
  if (pathsWithoutAuthentication.includes(to.name)) {
    next()
    return
  }

  // 如果 token 無效則轉址到登入頁
  if (!isAuthenticated && to.name !== 'admin-sign-in') {
    next('/admin/signin')
    return
  }

  // 如果 token 有效則轉址到點餐頁面
  if (isAuthenticated && to.name === 'admin-sign-in') {
    next('/admin/order')
    return
  }

  next()
})

export default router