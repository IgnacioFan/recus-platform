const router = require('express').Router()

// 使用者相關API
const testController = require('../../controllers/member/testController')
const orderController = require('../../controllers/member/orderController')
const userController = require('../../controllers/main/userController')

router.get('/test', testController.testRoute)
router.get('/user', userController.getCurrentUser)

router.get('/orders', orderController.getMyOrders)

module.exports = router