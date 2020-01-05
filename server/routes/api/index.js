const admin = require('./adminRoute')
const main = require('./mainRoute')

// 引入JWT需要的middleware
const passport = require('../../config/passport')
const helper = require('../../_helpers')

const authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated()) {
    return next()
  }
  return passport.authenticate('jwt', { session: false })(req, res, next)
}

const getUser = (req, res, next) => {
  req.user = helper.getUser(req)
  return next()
}

const authenticatedAdmin = (req, res, next) => {
  //console.log(req.user)
  if (!req.user) return res.status(401).json({ status: 'error', msg: 'permission denied for users' })
  if (req.user.role === 'admin') {
    return next()
  } else {
    return res.status(401).json({ status: 'error', msg: 'admin permission denied' })
  }
}

module.exports = (app) => {
  app.use('/api/', main)
  app.use('/api/admin', authenticated, getUser, authenticatedAdmin, admin)
}
