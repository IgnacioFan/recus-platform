const router = require('express').Router()

// 使用者相關API
const testController = require('../../controllers/member/testController')
const userController = require('../../controllers/main/userController')

router.get('/test', testController.testRoute)
router.get('/user', userController.getCurrentUser)

module.exports = router