const db = require('../../models')
const Dish = db.Dish
const Category = db.Category


const dishController = {
  getDish: (req, res) => {
    // if categoryId is 1,2,3,4
    if (Number(req.query.categoryId) <= 0) {
      return
    }

    let whereQuery = {}
    categoryId = Number(req.query.categoryId)
    whereQuery['CategoryId'] = categoryId

    return Dish.findAll({ where: whereQuery }).then(dishes => {

      return res.json(dishes)
    })
  }
}

module.exports = dishController