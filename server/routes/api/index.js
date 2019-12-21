const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

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

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)


module.exports = router