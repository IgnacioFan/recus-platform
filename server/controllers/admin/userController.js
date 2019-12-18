const db = require('../../models')
const User = db.User

const userController = {
  getUsers: (req, res) => {
    return User.findAll().then(users => {
      console.log(users)
      return res.json(users)
    })
  }
}

module.exports = userController