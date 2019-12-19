const express = require('express')
const router = express.Router()

const userController = require('../../controllers/admin/userController')
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

module.exports = router