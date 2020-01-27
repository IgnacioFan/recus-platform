// const helper = require('../../_helpers')
const db = require('../../models')
const { Order, Dish, DishCombination, Category, Tag } = db

const orderController = {
  addOrder: async (req, res) => {
    try {
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

      // 新增訂單
      order = await Order.create({
        quantity: req.body.quantity,
        amount: req.body.amount,
        memo: req.body.memo,
        tableNum: req.body.tableNum,
        isTakingAway: req.body.isTakingAway,
        UserId: req.user.id
      })

      // 新增菜單組合
      for (let i = 0; i < comboDishes.length; i++) {
        await DishCombination.create({
          OrderId: order.id,
          DishId: comboDishes[i].DishId,
          perQuantity: comboDishes[i].quantity,
          perAmount: comboDishes[i].amount
        })
      }
      return res.json({ status: 'success', msg: '訂單新增成功!', order: order })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

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
  },

  // 取得某分類的所有品項
  getDishesAndCategories: async (req, res) => {
    try {
      if (Number(req.query.categoryId) < 1) {
        return res.json({ status: 'error', msg: 'undefined category id' })
      }
      categories = await Category.findAll()
      dishes = await Dish.findAll({
        where: { CategoryId: req.query.categoryId },
        attributes: ['id', 'name', 'price', 'image', 'description'],
        include: [{ model: Tag, as: 'hasTags', attributes: ['name'] }]
      })
      return res.json({ categories: categories, dishes: dishes })

    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },
}

module.exports = orderController