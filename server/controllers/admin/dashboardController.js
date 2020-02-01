const db = require('../../models')
const moment = require('moment')
// moment.locale('zh_tw')
const { Order, DishCombination, Tag, Dish, User, Profile, UserPreferred } = db
const sequelize = require('sequelize')

// 使天數的組數一致
function timeAxis(range, Chart) {
  Object.values(Chart).forEach(item => {
    range.map(time => {
      if (!(time in item)) {
        item[time] = {
          count: 0
        }
      }
    })
  })
}

const dashboardController = {

  getBasicInfo: async (req, res) => {
    try {
      totalMembers = await User.scope('excludedAdmin').count()
      memWithTags = await UserPreferred.findAll({
        attributes: ['UserId'],
        group: ['UserId']
      })
      // todayOrders = await Order.scope('todayOrder').count({where: {state: 'paid'}})
      // memWithOrder = await Order.scope('orderWithMember').count({where: {state: 'paid'}})
      memWithoutOrder = await Order.scope('orderWithoutMember').count({ where: { state: 'paid' } })
      totalOrder = await Order.count()
      // console.log(memberWithTags)
      return res.json({
        memWithTags: !memWithTags ? 0 : memWithTags.length, totalMembers: totalMembers,
        memWithoutOrder: memWithoutOrder, totalOrder: totalOrder
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getPieChart: async (req, res) => {
    try {
      if (!req.query.range) return res.json({ status: 'error', msg: 'undefined!' })

      let hotTags = {}
      let hotProducts = {}
      let hotMembers = {}

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
      Products = Object.values(hotProducts).sort((a, b) => (b.count - a.count))
      hotProducts = Products.slice(0, 5)
      otherProducts = Products.length > 5 ? Products.length - 5 : 0
      // 篩選與排序前五名的熱門標籤
      Tags = Object.values(hotTags).sort((a, b) => (b.count - a.count))
      hotTags = Tags.slice(0, 5)
      otherTags = Tags.length > 5 ? Tags.length - 5 : 0
      // 篩選與排序購買數前五名的會員
      Members = Object.values(hotMembers).sort((a, b) => (b.count - a.count))
      hotMembers = Members.slice(0, 5)
      otherMembers = Members.length > 5 ? Members.length - 5 : 0

      return res.json({
        hotProducts: hotProducts, otherProducts: otherProducts, products: Products.length,
        hotTags: hotTags, otherTags: otherTags, tags: Tags.length,
        hotMembers: hotMembers, otherMembers: otherMembers, members: Members.length
      })

    } catch (error) {
      return res.status(500).json({ status: 'error', msg: error })
    }
  },

  getLineChart: async (req, res) => {
    try {
      let days = {} // 取得天數組
      // let week = []
      let range = []
      let pChart = {} // 取得dish的成長趨勢, p 是product的簡寫
      let uChart = {} // 取得會員拜訪次數的成長趨勢, u 是user的簡寫
      let tChart = {} // 取得標籤被會員加入的成長趨勢, t 是tag的簡寫

      // 取出過去時間範圍內，dishCombo與相關欄位
      if (req.query.type === 'product') {
        if (req.query.range === 'weekly') {
          products = await DishCombination.scope(req.query.range).findAll(
            {
              where: { DishId: req.query.id },
              attributes: [
                'DishId', 'createdAt',
                [sequelize.literal("(SELECT name FROM Dishes WHERE Dishes.id = DishCombination.DishId)"), 'name']
              ]
            })
        }
        if (req.query.range === 'monthly') {
          products = await DishCombination.scope(req.query.range).findAll(
            {
              where: { DishId: req.query.id },
              attributes: [
                [sequelize.fn('YEARWEEK', sequelize.col('createdAt')), 'week'],
                [sequelize.fn('COUNT', sequelize.col('DishId')), 'dishNum'],
                [sequelize.literal("(SELECT name FROM Dishes WHERE Dishes.id = DishCombination.DishId)"), 'name']
              ],
              group: ['week', 'DishId'],
            })
        }

        // 計算前一週dish成長的折線圖
        if (req.query.range === 'weekly') {
          // 計算天數組
          for (let i = 1; i <= 7; i++) {
            range.push(moment(new Date()).subtract(1, 'weeks').day(i).format("MM-DD"))
          }

          for (let product of products) {
            let createdAt = moment(product.dataValues.createdAt).format("MM-DD")

            // (初始化)沒有這個dish的key, create a new obj
            if (!pChart[product.dataValues.name]) {
              pChart[product.dataValues.name] = {
                [createdAt]: {
                  count: 1
                }
              }
            } else {
              // 發現一個新dish的key, create a new obj
              if (!(createdAt in pChart[product.dataValues.name])) {
                pChart[product.dataValues.name][createdAt] = {
                  count: 1
                }
              }
              else { // 重複的key,增加原本的數量
                pChart[product.dataValues.name][createdAt].count++
              }
            }
          }
        }

        // 計算前一個月dish成長的折線圖
        if (req.query.range === 'monthly') {
          // 計算天數組
          for (let i = 1; i <= 31; i += 7) {
            range.push(moment(new Date()).subtract(1, 'months').startOf('weeks').day(3).add(i - 1, 'days').format("YYYY-MM-DD"))
          }
          // console.log(range)
          for (let product of products) {
            let week = moment(product.dataValues.week, "ggggww").day(3).format("YYYY-MM-DD")
            // console.log(week)
            // 計算週數組
            if (!days[week]) days[week] = 1
            // (初始化)沒有這個dish的key, create a new obj
            if (!pChart[product.dataValues.name]) {
              pChart[product.dataValues.name] = {
                [week]: {
                  count: product.dataValues.dishNum
                }
              }
            } else {
              // 發現一個新dish的key, create a new obj
              if (!(week in pChart[product.dataValues.name])) {
                pChart[product.dataValues.name][week] = {
                  count: product.dataValues.dishNum
                }
              }
            }
          }
        }
        // 整理時間週，使每組的天數一致
        timeAxis(range, pChart)

        return res.json({ range: range, pChart: pChart })
      }

      // 會員拜訪次數的成長分析
      if (req.query.type === 'user') {
        if (req.query.range === 'weekly') {
          users = await Order.scope('orderWithMember', req.query.range).findAll(
            {
              where: { UserId: req.query.id },
              attributes: [
                'UserId', 'createdAt',
                [sequelize.literal("(SELECT name FROM Profiles WHERE Profiles.UserId = Order.UserId)"), 'name']
              ]
            })
        }
        if (req.query.range === 'monthly') {
          users = await Order.scope(req.query.range).findAll(
            {
              where: { UserId: req.query.id },
              attributes: [
                [sequelize.fn('YEARWEEK', sequelize.col('createdAt')), 'week'],
                [sequelize.fn('COUNT', sequelize.col('UserId')), 'userNum'],
                [sequelize.literal("(SELECT name FROM Profiles WHERE Profiles.UserId = Order.UserId)"), 'name']
              ],
              group: ['week', 'UserId'],
            })
        }

        // 計算前七天內會員拜訪次數成長的折線圖
        if (req.query.range === 'weekly') {
          // 計算天數組
          for (let i = 1; i <= 7; i++) {
            range.push(moment(new Date()).subtract(1, 'weeks').day(i).format("MM-DD"))
          }

          for (let user of users) {
            let createdAt = moment(user.dataValues.createdAt).format("MM-DD")
            // 沒有會員的key
            if (!uChart[user.dataValues.name]) {
              uChart[user.dataValues.name] = {
                [createdAt]: {
                  count: 1
                }
              }
            } else {
              // 已有會員的key
              if (!(createdAt in uChart[user.dataValues.name])) {
                uChart[user.dataValues.name][createdAt] = {
                  count: 1
                }
              }
              else {
                uChart[user.dataValues.name][createdAt].count++
              }
            }
          }
        }
        if (req.query.range === 'monthly') {
          // 計算天數組
          for (let i = 1; i <= 31; i += 7) {
            range.push(moment(new Date()).subtract(1, 'months').startOf('weeks').day(3).add(i - 1, 'days').format("YYYY-MM-DD"))
          }

          for (let user of users) {
            let week = moment(user.dataValues.week, "ggggww").day(3).format("YYYY-MM-DD")
            // 計算週數組
            if (!days[week]) days[week] = 1
            // (初始化)沒有這個user的key, create a new obj
            if (!uChart[user.dataValues.name]) {
              uChart[user.dataValues.name] = {
                [week]: {
                  count: user.dataValues.userNum
                }
              }
            } else {
              // 發現一個新user的key, create a new obj
              if (!(week in uChart[user.dataValues.name])) {
                uChart[user.dataValues.name][week] = {
                  count: user.dataValues.userNum
                }
              }
            }
          }
        }

        // 使各會員之天數的組數一致
        timeAxis(range, uChart)

        return res.json({ range: range, uChart: uChart })
      }

      // 被收藏標籤的成長分析
      if (req.query.type === 'tag') {
        if (req.query.range === 'weekly') {
          tags = await UserPreferred.scope(req.query.range).findAll(
            {
              where: { TagId: req.query.id },
              attributes: [
                'createdAt',
                [sequelize.literal("(SELECT name FROM Tags WHERE Tags.id = UserPreferred.TagId)"), 'name']
              ]
            })
        }
        if (req.query.range === 'monthly') {
          tags = await UserPreferred.scope(req.query.range).findAll(
            {
              where: { TagId: req.query.id },
              attributes: [
                [sequelize.fn('YEARWEEK', sequelize.col('createdAt')), 'week'],
                [sequelize.fn('COUNT', sequelize.col('TagId')), 'tagNum'],
                [sequelize.literal("(SELECT name FROM Tags WHERE Tags.id = UserPreferred.TagId)"), 'name']
              ],
              group: ['week', 'TagId'],
            })
        }

        // 計算前七天內被收藏標籤成長的折線圖
        if (req.query.range === 'weekly') {
          // 計算天數組
          for (let i = 1; i <= 7; i++) {
            range.push(moment(new Date()).subtract(1, 'weeks').day(i).format("MM-DD"))
          }
          for (let tag of tags) {
            let createdAt = moment(tag.dataValues.createdAt).format("MM-DD")
            // 計算天數組
            if (!days[createdAt]) days[createdAt] = 1
            // 沒有標籤的key
            if (!tChart[tag.dataValues.name]) {
              tChart[tag.dataValues.name] = {
                [createdAt]: {
                  count: 1
                }
              }
            } else {
              // 已有標籤的key
              if (!(createdAt in tChart[tag.dataValues.name])) {
                tChart[tag.dataValues.name][createdAt] = {
                  count: 1
                }
              }
              else {
                tChart[tag.dataValues.name][createdAt].count++
              }
            }
          }
        }
        if (req.query.range === 'monthly') {
          // 計算天數組
          for (let i = 1; i <= 31; i += 7) {
            range.push(moment(new Date()).subtract(1, 'months').startOf('weeks').day(3).add(i - 1, 'days').format("YYYY-MM-DD"))
          }

          for (let tag of tags) {
            let week = moment(tag.dataValues.week, "ggggww").day(3).format("YYYY-MM-DD")

            // 計算週數組
            if (!days[week]) days[week] = 1
            // (初始化)沒有這個tag的key, create a new obj
            if (!tChart[tag.dataValues.name]) {
              tChart[tag.dataValues.name] = {
                [week]: {
                  count: tag.dataValues.tagNum
                }
              }
            } else {
              // 發現一個新tag的key, create a new obj
              if (!(week in tChart[tag.dataValues.name])) {
                tChart[tag.dataValues.name][week] = {
                  count: tag.dataValues.tagNum
                }
              }
            }
          }
        }
        // 整理時間週，使每組的天數一致
        timeAxis(range, tChart)

        return res.json({ range: range, tChart: tChart })
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', msg: 'not found!' })
    }
  }
}

module.exports = dashboardController