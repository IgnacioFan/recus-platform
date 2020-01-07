const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Profile, Order, MemberOrder } = db
const Op = require('sequelize').Op

// // Json Web Token
// const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// // 
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

const memberController = {
  getUsers: (req, res) => {
    return User.findAll().then(users => {
      //console.log(users)
      return res.json({ users: users })
    })
  },

  getUser: (req, res) => {
    if (Number(req.params.id) <= 0) {
      return res.json({ status: 'error', msg: 'user id is undefined!' })
    }
    // 取出單一會員，且排除管理者
    User.scope('excludedAdmin', 'getMemberData').findByPk(req.params.id).then(user => {
      if (user == null) {
        return res.json({ status: 'error', msg: 'no such user!' })
      }
      //console.log('user', user)
      return res.json({ user: user })
    })
  },

  searchMember: (req, res) => {
    // 電話不為空值
    if (!req.query.phone) {
      return res.json({ status: 'error', msg: 'phone should not be blank!' })
    }
    // 搜尋單一會員，且排除管理者
    User.scope('excludedAdmin', 'getMemberData').findUserByPhone(req.query.phone).then(user => {
      if (!user) {
        return res.json({ status: 'error', msg: 'no such user!' })
      }
      return res.json({ user: user })
    })
  },

  getMemberPagination: (req, res) => {
    if (!req.query.page || Number(req.query.page) < 1)
      return res.json({ status: 'error', msg: 'page number is undifined!' })

    const pageLimit = 10
    let offset = (req.query.page - 1) * pageLimit

    User.scope('excludedAdmin', 'getMemberData').findAndCountAll(
      { include: [MemberOrder], offset: offset, limit: pageLimit })
      .then(user => {
        return res.json({
          users: user.rows,
          currentPage: Number(req.query.page) || 1,
          totalPage: Math.ceil(user.count / pageLimit)
        })
      })
  },

  deleteUser: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      if (!user) return res.json({ status: 'success', msg: 'user not existed!' })
      user.destroy()
      return res.json({ status: 'success', msg: 'successfully deleted!' })

    })
  },

  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      user.update({ role: 'admin' })
      return res.json({ status: 'success', msg: 'role changed!', user: user })
    })
  }
}

module.exports = memberController