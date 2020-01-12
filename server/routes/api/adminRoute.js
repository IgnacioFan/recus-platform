const router = require('express').Router()
const userController = require('../../controllers/main/userController')
const memberController = require('../../controllers/admin/memberController')
const dishController = require('../../controllers/admin/dishController')
const orderController = require('../../controllers/admin/orderController')
const categoryController = require('../../controllers/admin/categoryController')
const tagController = require('../../controllers/admin/tagController')
const dashboardController = require('../../controllers/admin/dashboardController')
// middleware setup
const { nameValidRules, validate } = require('../../controllers/adminValiator')


// 會員相關API
router.get('/user', userController.getCurrentUser)
router.get('/users', memberController.getUsers) // test route
router.get('/users/:id', memberController.getUser) // test route
router.get('/members', memberController.getMemberPagination)
router.get('/members/search', memberController.searchMember)
router.delete('/members/:id', memberController.deleteUser)
router.put('/members/:id', memberController.toggleAdmin)

// 菜單相關API
router.get('/dishes', dishController.getDishWithCategory)
router.get('/dishes/:id', dishController.getDish)
router.post('/dishes', dishController.addDish)
router.put('/dishes/:id', dishController.updateDish)
router.delete('/dishes/:id', dishController.deleteDish)

// 標籤相關API
router.get('/tags', tagController.getTags)
router.get('/tag', tagController.searchTag)
router.get('/tags/:id', tagController.getTag)
router.post('/tags', nameValidRules(), validate, tagController.addTag)
router.put('/tags/:id', nameValidRules(), validate, tagController.updateTag)
router.delete('/tags/:id', tagController.deleteTag)

// 訂單相關API
router.get('/orders', orderController.getOrders)
router.get('/orders/pendingNums', orderController.getPendingNums)
router.get('/orders/unpaidNums', orderController.getUnpaidNums)
router.get('/orders/:id', orderController.getOrder)
router.post('/orders', orderController.addOrder) //OK
router.put('/orders/:id/prevState', orderController.prevStateOrder) //
router.put('/orders/:id/nextState', orderController.nextStateOrder) //
router.delete('/orders/:id', orderController.removeOrder)

// 分類相關API
router.get('/categories', categoryController.getCategories)
router.get('/categories/:id', categoryController.getCategory)
router.post('/categories', nameValidRules(), validate, categoryController.addCategory)
router.put('/categories/:id', nameValidRules(), validate, categoryController.updateCategory)
router.delete('/categories/:id', categoryController.removeCategory)

// 
router.get('/dashboard', dashboardController.getDashboard)

module.exports = router