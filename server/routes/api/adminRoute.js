const router = require('express').Router()
const userController = require('../../controllers/main/userController')
const memberController = require('../../controllers/admin/memberController')
const dishController = require('../../controllers/admin/dishController')
const orderController = require('../../controllers/admin/orderController')
const categoryController = require('../../controllers/admin/categoryController')
const tagController = require('../../controllers/admin/tagController')
const dashboardController = require('../../controllers/admin/dashboardController')
// middleware setup
const { nameValidRules, dishValidRules, validate } = require('../../controllers/adminValiator')

const { realtime } = require('../../config/socket')

// 會員相關API
// router.get('/user', userController.getCurrentUser)
router.get('/members', realtime, memberController.getMemberPagination)
router.get('/members/:id/orders', realtime, memberController.getMemberOrders)
router.get('/members/:id/tags', realtime, memberController.getMemberTags)
router.get('/members/search', memberController.searchMember)
router.get('/members/:id', memberController.getMember)
router.post('/members', memberController.addMember)
router.put('/members/:id/isvalid', memberController.toggleValid)
router.put('/members/:id/isAdmin', memberController.toggleAdmin)
router.delete('/members/:id', memberController.softDeleteUser)

// 菜單相關API
router.get('/dishes', realtime, dishController.getDishWithCategory)
router.get('/dishes/:id', dishController.getDish)
router.post('/dishes', dishValidRules(), validate, dishController.addDish)
router.put('/dishes/:id', dishValidRules(), validate, dishController.updateDish)
router.delete('/dishes/:id', dishController.removeDish)

// 標籤相關API
router.get('/tags', realtime, tagController.getTags)
router.get('/tag', tagController.searchTag)
router.get('/tags/:id', tagController.getTag)
router.post('/tags', nameValidRules(), validate, tagController.addTag)
router.put('/tags/:id', nameValidRules(), validate, tagController.updateTag)
router.delete('/tags/:id', tagController.removeTag)

// 訂單相關API
router.get('/orders', realtime, orderController.getOrders)
router.get('/orders/pendingNums', orderController.getPendingNums)
router.get('/orders/unpaidNums', orderController.getUnpaidNums)
router.get('/orders/:id', orderController.getOrder)
router.post('/orders', orderController.addOrder) //OK
router.put('/orders/:id/prevState', orderController.prevStateOrder) //
router.put('/orders/:id/nextState', orderController.nextStateOrder) //
router.delete('/orders/:id', orderController.removeOrder)

// 分類相關API
router.get('/categories', realtime, categoryController.getCategories)
router.get('/categories/:id', categoryController.getCategory)
router.post('/categories', nameValidRules(), validate, categoryController.addCategory)
router.put('/categories/:id', nameValidRules(), validate, categoryController.updateCategory)
router.delete('/categories/:id', categoryController.removeCategory)

// 儀表板相關API
router.get('/dashboard', dashboardController.getBasicInfo)
router.get('/dashboard/pieChart', dashboardController.getPieChart)
router.get('/dashboard/lineChart', dashboardController.getLineChart)

module.exports = router