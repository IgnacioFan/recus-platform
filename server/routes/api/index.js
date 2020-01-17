const admin = require('./adminRoute')
const member = require('./memberRoute')
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

const authenticatedMember = (req, res, next) => {
  if (!req.user) return res.status(401).json({ status: 'error', msg: 'permission denied for users' })
  if (req.user.role === 'member') {
    return next()
  } else {
    return res.status(401).json({ status: 'error', msg: '非會員/權限不足！' })
  }
}

const authenticatedAdmin = (req, res, next) => {
  //console.log(req.user)
  if (!req.user) return res.status(401).json({ status: 'error', msg: 'permission denied for users' })
  if (req.user.role === 'admin') {
    return next()
  } else {
    return res.status(401).json({ status: 'error', msg: '非管理者/權限不足！' })
  }
}

module.exports = (app) => {
  //app.use('/api/test', (req, res) => { return res.send('hello!')})
  app.use('/api/', main)
  app.use('/api/member', authenticated, getUser, member)
  app.use('/api/admin', authenticated, getUser, authenticatedAdmin, admin)
}
