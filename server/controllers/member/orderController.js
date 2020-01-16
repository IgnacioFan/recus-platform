// const helper = require('../../_helpers')
const db = require('../../models')
const { Order, Dish } = db

const orderController = {
  getMyOrders: (req, res) => {
    try {
      Order.findAll({
        attributes: ['id', 'amount', 'quantity', 'isTakingAway', 'state', 'createdAt'],
        include: [{ model: Dish, as: 'sumOfDishes', attributes: ['name', 'price'] }],
        where: { UserId: req.user.id },
        order: [['createdAt', 'DESC']]
      }).then(orders => {
        //console.log(orders)
        if (!orders) return res.status.json({ status: 'error', msg: '查無資料!' })
        return res.json({ orders: orders })
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = orderController