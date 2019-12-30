const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const helpers = require('../../_helpers')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    console.log(req.user)
    //if (req.user.isAdmin === true) { return next() }
    return next()
    //return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// const authenticated = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     return next()
//   }
//   res.redirect('/signin')
// }
// const authenticatedAdmin = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     if (req.user.role === 'Admin') { return next() }
//     return res.redirect('/')
//   }
//   res.redirect('/signin')
// }

const userController = require('../../controllers/admin/userController')
const dishController = require('../../controllers/admin/dishController')
const orderController = require('../../controllers/admin/orderController')
const categoryController = require('../../controllers/admin/categoryController')


// test router
router.get('/', (req, res) => {
  res.send('hello')
})

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
router.get('/dishes', dishController.getDish)
router.post('/dishes', authenticatedAdmin, dishController.addDish)
router.put('/dishes/:id', authenticatedAdmin, dishController.updateDish)
router.delete('/dishes/:id', authenticatedAdmin, dishController.deleteDish)


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

// 登入/登出
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)



module.exports = router