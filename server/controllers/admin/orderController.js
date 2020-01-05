const db = require('../../models')
const events = require('events')
const stateMachine = new events.EventEmitter()
const Order = db.Order
const DishCombination = db.DishCombination

stateMachine.on('prev', (order) => {
  let prevState
  if (order.state === 'pending') return
  if (order.state === 'making') prevState = 'pending'
  if (order.state === 'unpaid') prevState = 'making'
  if (order.state === 'paid') prevState = 'unpaid'
  order.update({ state: prevState })
})

stateMachine.on('next', (order) => {
  let nextState
  if (order.state === 'pending') nextState = 'making'
  if (order.state === 'making') nextState = 'unpaid'
  if (order.state === 'unpaid') nextState = 'paid'
  if (order.state === 'paid') return
  order.update({ state: nextState })
})


const orderController = {
  addOrder: (req, res) => {
    //console.log(req.body)
    // console.log(typeof req.body.dishes)
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
        comboDishes.push({ DishId: dish.id, quantity: dish.quantity, amount: dish.price * dish.quantity })
      })
      // 驗證總額
    if (Number(req.body.amount) !== amount) {
      return res.json({ status: 'error', msg: '總額不符' })
    }
    // 驗證總數
    if (Number(req.body.quantity) !== quantity) {
      return res.json({ status: 'error', msg: '數量不符' })
    }
    // 驗證內用需要輸入桌號
    if (req.body.isTakingAway === 0) {
      if (req.body.tableNum === null) {
        return res.json({ status: 'error', msg: '內用請輸入桌號' })
      }
    }
    console.log(comboDishes)
      // 新增訂單
    return Order.create({
      quantity: req.body.quantity,
      amount: req.body.amount,
      memo: req.body.memo,
      tableNum: req.body.tableNum,
      isTakingAway: req.body.isTakingAway,
      UserId: req.body.UserId !== "" ? req.body.UserId : null
    }).then(order => {
      // 新增菜單組合
      comboDishes.forEach(item => {
        DishCombination.create({
          OrderId: order.id,
          DishId: item.DishId,
          perQuantity: item.quantity,
          perAmount: item.amount
        })
      })
      console.log(order)
      return res.json({ order: order })
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
      return Order.scope('todayOrder').findAll({
        include: [{ model: db.Dish, attributes: ['name'], as: 'sumOfDishes', through: { attributes: ['quantity'] } }],
        where: { state: state }
      }).then(orders => {

        return res.json({ orders: orders })
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

  // 訂單狀態往後
  prevStateOrder: (req, res) => {
    Order.findByPk(req.params.id).then(order => {
      stateMachine.emit('prev', order)
      return res.json(order)
    })
  },

  // 訂單狀態往前
  nextStateOrder: (req, res) => {
    Order.findByPk(req.params.id).then(order => {
      stateMachine.emit('next', order)
      return res.json(order)
    })
  },

  // 刪除訂單(弱刪除)
  removeOrder: (req, res) => {
    Order.findByPk(req.params.id).then(order => {
      order.destroy()
      return res.json({ status: 'success', msg: '成功刪除了此訂單' })
    })
  },

  getPendingNums: (req, res) => {
    Order.scope('todayOrder').count({ where: { state: 'pending' } }).then((nums => {
      return res.json(nums)
    }))
  },

  getUnpaidNums: (req, res) => {
    Order.scope('todayOrder').count({ where: { state: 'unpaid' } }).then((nums => {
      return res.json(nums)
    }))
  }


}

module.exports = orderController