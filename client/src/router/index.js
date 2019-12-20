import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'root',
  redirect: '/order'
}, {
  path: '/order',
  name: 'Order',
  component: () =>
    import ('../views/Order.vue')
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

export default router