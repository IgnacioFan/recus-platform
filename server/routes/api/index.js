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

const authMember = (req, res, next) => {
  if (!req.user) return res.json({ status: 'error', msg: 'permission denied' })
  if (req.user.role === 'member' && req.user.isValid === true) return next()
  return res.status(401).json({ status: 'error', msg: 'not allow!' })
}

const authAdmin = (req, res, next) => {
  //console.log(req.user)
  if (!req.user) return res.status(401).json({ status: 'error', msg: 'permission denied' })
  if (req.user.role === 'admin') return next()
  return res.status(401).json({ status: 'error', msg: 'not allow!' })
}

module.exports = (app) => {
  //app.use('/api/test', (req, res) => { return res.send('hello!')})
  app.use('/api/', main)
  app.use('/api/member', authenticated, getUser, member)
  app.use('/api/admin', authenticated, getUser, authAdmin, admin)
}
