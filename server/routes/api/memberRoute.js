const router = require('express').Router()

// 使用者相關API
const memberController = require('../../controllers/member/memberController')
const orderController = require('../../controllers/member/orderController')
const userController = require('../../controllers/main/userController')

router.get('/user', userController.getCurrentUser)

// 會員個人相關API
router.get('/test', memberController.testRoute)
router.get('/profile', memberController.getProfile)
router.put('/profile', memberController.updateProfile)
router.post('/mypreferred', memberController.addMyPreferred)
router.delete('/mypreferred', memberController.removeMyPreferred)

// 會員訂單相關API
router.get('/orders', orderController.getMyOrders)
router.post('/orders', orderController.addOrder)

// 取得分類與訂單相關API
router.get('/categories', orderController.getCategories)
router.get('/dishes', orderController.getDishWithCategory)

module.exports = router