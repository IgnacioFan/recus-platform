const db = require('../../models')
const moment = require('moment')
const { Order, DishCombination, Tag, Dish, User, Profile } = db

const dashboardController = {

  getDashboard: async (req, res) => {
    try {
      if (!req.query.range) return res.json({ status: 'error', msg: 'undefined!' })

      let hotTags = {}
      let hotProducts = {}
      let hotMembers = {}
      //let hotCombo = {}
      dishes = await DishCombination.scope(req.query.range).findAll(
        {
          attributes: ['DishId', 'OrderId'], include: [{
            model: Dish, attributes: ['name'],
            include: [{ model: Tag, as: 'hasTags', attributes: ['id', 'name'] }]
          }]
        })
      users = await Order.scope('orderWithMember', req.query.range).findAll(
        {
          attributes: ['UserId'],
          include: [{
            model: User, attributes: ['id'], where: { role: 'member' },
            include: [{ model: Profile, attributes: ['name'] }]
          }]
        })

      //console.log(users)
      for (let product of dishes) {
        // 計算熱門商品
        if (!hotProducts[product.DishId]) {
          hotProducts[product.DishId] = {
            id: product.DishId,
            name: product.Dish.name,
            count: 1
          }
        }
        else {
          hotProducts[product.DishId].count++
        }

        for (let tag of product.Dish.hasTags) {
          // 計算熱門標籤
          if (!hotTags[tag.id]) {
            hotTags[tag.id] = {
              id: tag.id,
              name: tag.name,
              count: 1
            }
          }
          else {
            hotTags[tag.id].count++
          }
        }
      }

      for (let user of users) {
        // 計算購買數前五名的會員
        if (!hotMembers[user.UserId]) {
          hotMembers[user.UserId] = {
            id: user.UserId,
            //phone: user.User.phone,
            name: user.User.Profile.name,
            count: 1
          }
        }
        else {
          hotMembers[user.UserId].count++
        }
      }

      // 篩選與排序前五名的熱門商品
      hotProducts = Object.values(hotProducts).sort((a, b) => (b.count - a.count)).slice(0, 5)
      // 篩選與排序前五名的熱門標籤
      hotTags = Object.values(hotTags).sort((a, b) => (b.count - a.count)).slice(0, 5)
      // 篩選與排序購買數前五名的會員
      hotMembers = Object.values(hotMembers).sort((a, b) => (b.count - a.count)).slice(0, 5)

      return res.json({ hotProducts: hotProducts, hotTags: hotTags, hotMembers: hotMembers, data: users, data2: dishes })

    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getLineChart: async (req, res) => {
    try {
      let days = {} // 取得天數組
      let pChart = {} // 取得產品成長的成長分析, p 是product的簡寫
      let tChart = {}

      products = await DishCombination.scope(req.query.range).findAll(
        {
          where: { DishId: req.query.id },
          attributes: ['DishId', 'OrderId', 'createdAt'],
          include: [{
            model: Dish, attributes: ['name'],
            //include: [{ model: Tag, as: 'hasTags', attributes: ['id', 'name'] }]
          }]
        })

      // 計算前七天內產品成長的折線圖
      for (let product of products) {
        let createdAt = moment(product.createdAt).format("MM-DD")
        // 計算天數組
        if (!days[createdAt]) days[createdAt] = 1
        // 沒有產品的key
        if (!pChart[product.Dish.name]) {
          pChart[product.Dish.name] = {
            [createdAt]: {
              count: 1
            }
          }
        } else {
          // 已有產品的key
          if (!(createdAt in pChart[product.Dish.name])) {
            pChart[product.Dish.name][createdAt] = {
              count: 1
            }
          }
          else {
            pChart[product.Dish.name][createdAt].count++
          }
        }
        // 計算前七天內標籤成長的的折線圖
        // for (let item of product.Dish.hasTags) {
        //   if (!tChart[item.name]) {
        //     tChart[item.name] = {
        //       [createdAt]: {
        //         //id: item.id,
        //         //name: item.name,
        //         count: 1
        //       }
        //     }
        //   } else {
        //     if (!(createdAt in tChart[item.name])) {
        //       tChart[item.name][createdAt] = {
        //         //id: item.id,
        //         //name: item.name,
        //         count: 1
        //       }
        //     } else {
        //       tChart[item.name][createdAt].count++
        //     }
        //   }
        // }
      }
      // 使各產品之中天數的組數一致
      Object.values(pChart).forEach(product => {
        Object.keys(days).map(day => {
          if (!(day in product)) {
            product[day] = {
              count: 0
            }
          }
        })
      })

      // 使各標籤之中天數的組數一致
      // Object.values(tChart).forEach(tag => {
      //   Object.keys(days).map(day => {
      //     if (!(day in tag)) {
      //       tag[day] = {
      //         count: 0
      //       }
      //     }
      //   })
      // })

      return res.json({ days: Object.keys(days), pChart: pChart, products: products })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = dashboardController