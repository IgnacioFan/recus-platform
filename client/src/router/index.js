import Vue from 'vue'
import VueRouter from 'vue-router'
const credit = JSON.parse(localStorage.getItem('credit'));

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'root',
  redirect: '/signin'
}, {
  path: '/signin',
  name: 'sign-in',
  component: () =>
    import('../views/SignIn.vue')
}, {
  path: '/signup',
  name: 'sign-up',
  component: () =>
    import('../views/SignUp.vue')
}, {
  path: '/order',
  name: 'Order',
  component: () =>
    import('../views/Order.vue')
},
{
  path: '/members',
  name: 'members',
  component: () => import('../views/MemberManage.vue')
},
{
  path: '/members/search',
  name: 'memberseach',
  component: () => import('../views/MemberManage.vue')
}, {
  path: '*',
  name: 'not-found',
  component: () =>
    import('../views/NotFound.vue')
}]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  mode: 'history',
  routes
})


router.beforeEach(async (to, from, next) => {
  if (!credit && to.name !== 'SignIn' && to.name !== 'SignUp') {
    next('/signin');
    return;
  }

  if (credit) {
    if (to.name === 'SignIn' || to.name === 'Signup') {
      next('/not-found');
      return;
    }
  }

  if (credit && credit.user.isAdmin === false) {
    if (to.path.includes('/admin')) {
      next('/404');
      return;
    }
  }

  next();
})
export default router