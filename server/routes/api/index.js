const express = require('express')
const router = express.Router()

// 引入JWT需要的middleware
const passport = require('../../config/passport')
//const authenticated = passport.authenticate('jwt', { session: false })
const helper = require('../../_helpers')

const userController = require('../../controllers/admin/userController')
const dishController = require('../../controllers/admin/dishController')
const orderController = require('../../controllers/admin/orderController')
const categoryController = require('../../controllers/admin/categoryController')
const tagController = require('../../controllers/admin/tagController')

const authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated()) {
    //passport.authenticate('jwt', { session: false })
    return next()
  }
  //return res.status(401).json({ status: 'error', message: 'permission denied' })
  return passport.authenticate('jwt', { session: false })(req, res, next)
  //return next
}

// const authenticatedAdmin = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     if (req.user.role === 'Admin') { return next() }
//     return res.redirect('/')
//   }
//   res.redirect('/signin')
// }

const getUser = (req, res, next) => {
  req.user = helper.getUser(req)
  return next()
}

const authenticatedAdmin = (req, res, next) => {
  if (!req.user) return res.json({ status: 'error', message: 'permission denied for users' })
  if (req.user.isAdmin !== true)
    return res.status(401).json({ status: 'error', message: 'admin permission denied' })
  return next()
}

// test router
router.get('/', authenticated, (req, res) => {
  console.log(req.user)
  res.json({ username: req.user })
})

// 登入/登出
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)


router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getUser)
router.get('/members', userController.getUsersPag)
router.delete('/members/:id', userController.deleteUser)
router.put('/members/admin/:id', userController.toggleAdmin)

// 管理員點餐功能
router.get('/searchUser', userController.searchUser)
router.get('/members/search', userController.searchPhone)


router.get('/categories', authenticated, categoryController.getCategories)

router.post('/orders', orderController.postOrders)

// 管理員訂單功能
//router.get('/orders')
router.get('/categories/:id', categoryController.getCategory)


// 菜單相關API
router.get('/dishes', authenticated, getUser, authenticatedAdmin, dishController.getDish)
router.post('/dishes', authenticated, getUser, authenticatedAdmin, dishController.addDish)
router.put('/dishes/:id', authenticated, getUser, authenticatedAdmin, dishController.updateDish)
router.delete('/dishes/:id', authenticated, getUser, authenticatedAdmin, dishController.deleteDish)

// 分類相關API

// 標籤相關API
router.get('/tags', authenticated, getUser, authenticatedAdmin, tagController.getTags)
router.get('/tags/:id', authenticated, getUser, authenticatedAdmin, tagController.getTag)
router.post('/tags', authenticated, getUser, authenticatedAdmin, tagController.addTag)
router.put('/tags/:id', authenticated, getUser, authenticatedAdmin, tagController.updateTag)
router.delete('/tags/:id', authenticated, getUser, authenticatedAdmin, tagController.deleteTag)

// 訂單相關API
router.get('/orders', orderController.getOrders)
router.get('/orders/pendingNums', orderController.getPendingNums)
router.get('/orders/unpaidNums', orderController.getUnpaidNums)
router.get('/orders/:id', orderController.getOrder)
router.put('/orders/:id/prevState', orderController.prevStateOrder)
router.put('/orders/:id/nextState', orderController.nextStateOrder)
router.delete('/orders/:id', orderController.removeOrder)

// 
router.post('/categories', categoryController.addCategory)
router.put('/categories/:id', categoryController.updateCategory)
router.delete('/categories/:id', categoryController.removeCategory)


module.exports = router