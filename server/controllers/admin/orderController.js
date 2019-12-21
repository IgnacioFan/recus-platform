const db = require('../../models')
const Order = db.Order
const DishCombination = db.DishCombination

const orderController = {
  postOrders: (req, res) => {
    if (req.body.dishes.length === 0) {
      return res.json({ status: 'error', msg: 'please, choose one dish at least' })
    }
    let quantity = 0
    let amount = 0
    let dishCombo = []
    req.body.dishes.forEach(dish => {
      quantity = quantity + dish.quantity
      amount = amount + dish.price * dish.quantity
      dishCombo.push({ DishId: dish.id, quantity: dish.quantity })
    })
    return Order.create({
      quantiy: quantity,
      amount: amount,
      state: req.body.state,
      memo: req.body.memo,
      tableNum: req.body.tableNum,
      isTakingAway: req.body.isTakingAway,
      UserId: req.body.UserId != null ? req.body.UserId : null
    }).then(order => {
      dishCombo.forEach(item => {
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