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

    // 計算總額與數量
    req.body.dishes.forEach(dish => {
      quantity = quantity + dish.quantity
      amount = amount + dish.price * dish.quantity
      comboDishes.push({ DishId: dish.id, quantity: dish.quantity })
    })
    // 驗證總額
    if (Number(req.body.amount) !== amount) {
      return res.json({ status: 'error', msg: '總額不符' })
    }
    // 驗證內用需要輸入桌號
    if (req.body.isTakingAway === 0) {
      if (req.body.tableNum === null) {
        return res.json({ status: 'error', msg: '內用請輸入桌號' })
      }
    }
    // 新增訂單
    return Order.create({
      quantiy: quantity,
      amount: amount,
      memo: req.body.memo,
      tableNum: req.body.tableNum,
      isTakingAway: req.body.isTakingAway,
      UserId: req.body.UserId != null ? req.body.UserId : null
    }).then(order => {
      // 新增菜單組合
      comboDishes.forEach(item => {
        DishCombination.create({
          OrderId: order.id,
          DishId: item.DishId,
          quantity: item.quantity
        })
      })
      return res.json(order)
    })
  },

  // 顯示當日所有訂單
  getOrders: (req, res) => {
    if (!req.query.state) return res.json({ status: 'error', msg: '沒有取得狀態' })
    let state = ""
    // 尚未製作
    if (req.query.state === 'pending') {
      state = 'pending'
    } // 製作中
    else if (req.query.state === 'making') {
      state = 'making'
    } // 尚未結帳
    else if (req.query.state === 'unpaid') {
      state = 'unpaid'
    } // 已結帳的訂單
    else if (req.query.state === 'paid') {
      state = 'paid'
    } // 錯誤狀態
    else {
      if (!req.query.state) return res.json({ status: 'error', msg: '查無資料' })
    }

    if (state !== '') {
      return Order.scope('todayOrder').findAll({ where: { state: state } }).then(orders => {
        return res.json(orders)
      })
    } else {
      return res.json({ status: 'error', msg: '404' })
    }
  },

  // 顯示單筆訂單
  getOrder: (req, res) => {
    return Order.scope('todayOrder').findByPk(req.params.id).then(order => {
      if (!order) return res.json({ status: 'error', msg: '查無資料' })
      return res.json(order)
    })
  },

  // 改變訂單的狀態
  changeStateOrder: (req, res) => {
    if (!req.query.state) return res.json({ status: 'error', msg: '沒有取得狀態' })

    return Order.findByPk(req.params.id).then(order => {
      order.update()
    })
  },

  // 修改訂單
  updateOrder: (req, res) => {

  }

  // 刪除訂單(弱刪除)
}

module.exports = orderController