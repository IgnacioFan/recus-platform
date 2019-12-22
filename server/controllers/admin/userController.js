const db = require('../../models')
const User = db.User

const userController = {
  getUsers: (req, res) => {
    return User.findAll().then(users => {
      //console.log(users)
      return res.json(users)
    })
  },

  getUser: (req, res) => {
    if (Number(req.params.id) <= 0) {
      return res.json({ status: 'error', msg: 'No such user!' })
    }
    User.findByPk(req.params.id).then(user => {
      if (user == null) {
        return res.res.json({ status: 'error', msg: 'No such user!' })
      }
      console.log('user', user)
      return res.json(user)
    })
  },

  searchUser: (req, res) => {
    if (!req.query.phone) {
      return res.json({ status: 'error', msg: '請輸入電話!' })
    }
    User.findOne({ where: { phone: req.query.phone } }).then(user => {
      if (!user) {
        return res.json({ status: 'error', msg: '找不到會員!' })
      }
      return res.json(user)
    })
  }
}

module.exports = userController