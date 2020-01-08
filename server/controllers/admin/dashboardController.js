const db = require('../../models')
const { Order, DishCombination, Tag, Dish } = db

const dashboardController = {
  getDashboard: (req, res) => {
    //return res.send('Hello')
    let hotTags = {}
    let hotProducts = {}
    //let hotCombo = {}
    return DishCombination.findAll(
      {
        attributes: ['DishId', 'OrderId'], include: [{
          model: Dish, attributes: ['name'],
          include: [{ model: Tag, as: 'hasTags', attributes: ['id', 'name'] }]
        }]
      })
      .then(dishes => {
        for (let product of dishes) {
          // 計算熱門商品
          if (!hotProducts[product.DishId]) {
            hotProducts[product.DishId] = {
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
                name: tag.name,
                count: 1
              }
            }
            else {
              hotTags[tag.id].count++
            }
          }
        }
        //data 先預留
        return res.json({ data: dishes, hotProducts: hotProducts, hotTags: hotTags })
      })
  }
}

module.exports = dashboardController