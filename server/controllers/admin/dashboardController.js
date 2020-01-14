const db = require('../../models')
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
            model: User, attributes: ['phone'], where: { role: 'member' },
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
        // 計算熱門標籤
        if (!hotMembers[user.UserId]) {
          hotMembers[user.UserId] = {
            id: user.UserId,
            phone: user.User.phone,
            name: user.User.Profile.name,
            count: 1
          }
        }
        else {
          hotMembers[user.UserId].count++
        }
      }

      // 篩選前五名的熱門商品
      hotProducts = Object.values(hotProducts).sort((a, b) => (b.count - a.count)).slice(0, 5)
      // 篩選前五名的熱門標籤
      hotTags = Object.values(hotTags).sort((a, b) => (b.count - a.count)).slice(0, 5)
      // 篩選購買數前五名的會員
      hotMembers = Object.values(hotMembers).sort((a, b) => (b.count - a.count)).slice(0, 5)

      return res.json({ hotProducts: hotProducts, hotTags: hotTags, hotMembers: hotMembers, data: users })

    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  }
}

module.exports = dashboardController