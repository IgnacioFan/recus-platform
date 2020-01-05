const router = require('express').Router()

// const helper = require('../../_helpers')

const memberController = require('../../controllers/admin/memberController')
const dishController = require('../../controllers/admin/dishController')
const orderController = require('../../controllers/admin/orderController')
const categoryController = require('../../controllers/admin/categoryController')
const tagController = require('../../controllers/admin/tagController')

// middleware setup


// multer setup


// 使用者相關API
router.get('/current_user', memberController.getCurrentUser)
router.get('/users', memberController.getUsers)
router.get('/users/:id', memberController.getUser)
router.get('/members', memberController.getUsersPag)
router.get('/members/search', memberController.searchMember)
router.delete('/members/:id', memberController.deleteUser)
router.put('/members/admin/:id', memberController.toggleAdmin)

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
router.post('/tags', tagController.addTag)
router.put('/tags/:id', tagController.updateTag)
router.delete('/tags/:id', tagController.deleteTag)

// 訂單相關API
router.get('/orders', orderController.getOrders)
router.get('/orders/pendingNums', orderController.getPendingNums)
router.get('/orders/unpaidNums', orderController.getUnpaidNums)
router.get('/orders/:id', orderController.getOrder)
router.post('/orders', orderController.postOrders)
router.put('/orders/:id/prevState', orderController.prevStateOrder)
router.put('/orders/:id/nextState', orderController.nextStateOrder)
router.delete('/orders/:id', orderController.removeOrder)

// 分類相關API
router.get('/categories', categoryController.getCategories)
router.get('/categories/:id', categoryController.getCategory)
router.post('/categories', categoryController.addCategory)
router.put('/categories/:id', categoryController.updateCategory)
router.delete('/categories/:id', categoryController.removeCategory)

module.exports = router