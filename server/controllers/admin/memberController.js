const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Profile, Order, MemberOrder, Tag, UserPreferred, Dish } = db
const Op = require('sequelize').Op
const moment = require('moment')

const memberController = {
  getMemberPagination: (req, res) => {
    try {
      const { page } = req.query
      let pageNum = (Number(page) < 1 || page === undefined) ? 1 : Number(page)
      const pageLimit = 16

      User.scope('getMemberData').findAndCountAll(
        {
          include: [
            { model: Profile, attributes: ['name'] }
          ],
          attributes: ['phone', 'role', 'isValid', 'id',
            [db.sequelize.literal("(SELECT COUNT(*) FROM Orders WHERE Orders.UserId = User.id)"), 'orders']
          ],
          offset: (pageNum - 1) * pageLimit,
          limit: pageLimit,
          order: [['role', 'ASC']]
        }).then(result => {

          let pages = Math.ceil(result.count / pageLimit)

          //console.log(result.count)
          return res.json({
            users: result.rows,
            currPage: pageNum,
            totalPage: pages
          })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  addMember: (req, res) => {
    try {
      let { account, password, passwordCheck, phone, name, email, avatar } = req.body
      if (passwordCheck !== password) {
        //console.log('輸入兩組不同密碼')
        return res.json({ status: 'error', msg: '輸入兩組不同密碼！' })
      } else {
        User.findOrCreate({
          where: { [Op.or]: [{ account: account }, { phone: phone }] },
          defaults: {
            account: account,
            phone: phone,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }
        }).then(([user, created]) => {
          if (created === false) return res.json({ status: 'success', msg: '已註冊!' })
          else {
            Profile.create({
              name: name,
              email: email,
              avatar: avatar,
              UserId: user.id
            }).then(() => {
              return res.json({ status: 'success', msg: '註冊成功！', user: user })
            })
          }
        })
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getMember: (req, res) => {
    try {
      if (Number(req.params.id) < 1) {
        return res.json({ status: 'error', msg: 'user id is undefined!' })
      }
      // 取出單一會員
      User.scope('getMemberData').findByPk(req.params.id,
        {
          include: [{
            model: Tag, as: 'preferredTags', attributes: ['name'],
            through: { attributes: [] }
          }]
        }).then(user => {
          if (!user) return res.json({ status: 'error', msg: 'no such user!' })
          return res.json({ user: user })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  searchMember: (req, res) => {
    try {
      // 電話不為空值
      if (!req.query.phone) {
        return res.json({ status: 'error', msg: 'phone should not be blank!' })
      }
      // 搜尋單一會員
      User.scope('getMemberData').findUserByPhone(req.query.phone).then(user => {
        if (!user) {
          return res.json({ status: 'error', msg: 'no such user!' })
        }
        return res.json({ user: user })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getMemberOrders: (req, res) => {
    try {
      if (Number(req.params.id) <= 0) {
        return res.json({ status: 'error', msg: 'user id is undefined!' })
      }
      // 取出單一會員
      Order.findAll(
        {
          attributes: ['id', 'amount', 'quantity', 'createdAt'],
          include: [{
            model: Dish, as: 'sumOfDishes', attributes: ['name']
            , through: { attributes: [] }
          }],
          where: { UserId: req.params.id },
          order: [['createdAt', 'DESC']]
        }).then(orders => {
          if (!orders) return res.json({ status: 'error', msg: 'no such user!' })
          // 訂單資料整理
          // orders = orders.map(order => ({
          //   ...order.dataValues,
          //   createdAt: moment(order.createdAt).format('YYYY-MM-DD HH:mm')
          // }))
          return res.json({ orders: orders })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getMemberTags: (req, res) => {
    try {
      if (Number(req.params.id) <= 0) {
        return res.json({ status: 'error', msg: 'user id is undefined!' })
      }
      // 取出單一會員
      User.findByPk(req.params.id,
        {
          attributes: [],
          include: [{ model: Tag, as: 'preferredTags' }]
        }).then(user => {
          if (!user) return res.json({ status: 'error', msg: 'no such user!' })
          return res.json({ tags: user.preferredTags })
        })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  softDeleteUser: (req, res) => {
    try {
      return User.findByPk(req.params.id).then((user) => {
        if (!user) return res.json({ status: 'error', msg: 'user not existed!' })
        if (user.role === 'admin') return res.json({ status: 'error', msg: 'cannot delete!' })
        user.destroy()
        return res.json({ status: 'success', msg: 'successfully deleted!' })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  toggleValid: (req, res) => {
    try {
      return User.findByPk(req.params.id, { attributes: ['isValid', 'id'] }).then((user) => {
        if (!user) return res.json({ status: 'error', msg: 'user not existed!' })
        user.update({ isValid: !user.isValid })
        return res.json({ status: 'success', msg: 'successfully valid changed!', user: user })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  toggleAdmin: (req, res) => {
    try {
      //console.log(req.params)
      return User.findByPk(req.params.id, { attributes: ['role', 'id'] }).then((user) => {
        if (!user) return res.json({ status: 'error', msg: 'user not existed!' })
        let role
        if (user.role === 'member') role = 'admin'
        if (user.role === 'admin') role = 'member'
        user.update({ role: role })
        return res.json({ status: 'success', msg: 'successfully role changed!', user: user })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = memberController