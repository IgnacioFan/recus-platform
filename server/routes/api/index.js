const express = require('express')
const router = express.Router()

const userController = require('../../controllers/admin/userController')

// test router
router.get('/', (req, res) => {
  res.send('hello')
})

router.get('/users', userController.getUsers)

module.exports = router