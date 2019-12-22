const express = require('express')
const router = express.Router()

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

// 管理員點餐功能
router.get('/searchUser', userController.searchUser)
router.get('/categories', categoryController.getCategories)
router.get('/dishes', dishController.getDish)
router.post('/orders', orderController.postOrders)

// 管理員訂單功能
//router.get('/orders')
router.get('/categories/:id', categoryController.getCategory)



module.exports = router