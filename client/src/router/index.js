import Vue from 'vue'
import VueRouter from 'vue-router'

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
  },
  {
    path: '/members',
    name: 'members',
    component: () =>
      import ('../views/MemberManage.vue')
  },
  {
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
    path: '/manage',
    name: 'manage',
    component: () =>
      import ('../views/Manage.vue')
  }, {
    path: '*',
    name: 'not-found',
    component: () =>
      import ('../views/NotFound.vue')
  }
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  mode: 'history',
  routes
})

export default router