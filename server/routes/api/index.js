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

router.get('/searchUser', userController.searchUser)
router.get('/categories', categoryController.getCategories)
router.get('/categories/:id', categoryController.getCategory)

router.get('/dishes/:id', dishController.getDish)
router.post('/orders', orderController.postOrders)

module.exports = router