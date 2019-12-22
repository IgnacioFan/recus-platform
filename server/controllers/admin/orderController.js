const db = require('../../models')
const Order = db.Order
const DishCombination = db.DishCombination

const orderController = {
  postOrders: (req, res) => {
    if (req.body.dishes.length === 0) {
      return res.json({ status: 'error', msg: '請輸入至少一樣菜單' })
    }
    let quantity = 0
    let amount = 0
    let comboDishes = []
    req.body.dishes.forEach(dish => {
      quantity = quantity + dish.quantity
      amount = amount + dish.price * dish.quantity
      comboDishes.push({ DishId: dish.id, quantity: dish.quantity })
    })
    if (Number(req.body.amount) !== amount) {
      return res.json({ status: 'error', msg: '總額不符' })
    }
    if (req.body.isTakingAway === 0) {
      if (req.body.tableNum === null) {
        return res.json({ status: 'error', msg: '內用請輸入桌號' })
      }
    }
    return Order.create({
      quantiy: quantity,
      amount: amount,
      memo: req.body.memo,
      tableNum: req.body.tableNum,
      isTakingAway: req.body.isTakingAway,
      UserId: req.body.UserId != null ? req.body.UserId : null
    }).then(order => {
      comboDishes.forEach(item => {
        DishCombination.create({
          OrderId: order.id,
          DishId: item.DishId,
          quantity: item.quantity
        })
      })
      return res.json(order)
    })
  }
}

module.exports = orderController