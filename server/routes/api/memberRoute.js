const router = require('express').Router()

// 使用者相關API
const memberController = require('../../controllers/member/memberController')
const orderController = require('../../controllers/member/orderController')
const userController = require('../../controllers/main/userController')

const { profileValidRules, validate } = require('../../middlewares/validator')


router.get('/user', userController.getCurrentUser)

// 會員個人相關API
router.get('/test', memberController.testRoute)
router.get('/profile', memberController.getProfile)
router.put('/profile', profileValidRules(), validate, memberController.updateProfile)
// router.post('/mypreferred', memberController.addMyPreferred)
// router.delete('/mypreferred', memberController.removeMyPreferred)
router.get('/tag', memberController.searchTag)
router.get('/tags', memberController.getTags)

// 會員訂單相關API
router.get('/orders/today', orderController.getTodayOrder)
router.get('/orders', orderController.getMyOrders)
router.post('/orders', orderController.addOrder)

// 取得分類與訂單相關API
router.get('/menu', orderController.getDishesAndCategories)

module.exports = router