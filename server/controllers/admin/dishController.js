const db = require('../../models')
const { Dish, DishAttachment, Category } = db
//const Category = db.Category


const dishController = {

  // 取得某分類的所有品項
  getDishWithCategory: (req, res) => {
    // if categoryId is 1,2,3,4
    if (Number(req.query.categoryId) <= 0) {
      return res.json({ status: 'error', msg: 'undefined category id' })
    }

    let whereQuery = {
      CategoryId: req.query.categoryId
    }

    return Dish.findAll({ where: whereQuery }).then(dishes => {
      return res.json({ dishes: dishes })
    })
  },

  // 取得單筆菜單的品項
  getDish: (req, res) => {
    if (Number(req.params.categoryId) <= 0) {
      return res.json({ status: 'error', msg: 'undefined dish id' })
    }

    return Dish.findByPk(req.params.id,
      { include: [Category, { model: db.Tag, as: 'hasTags' }] }).then(dish => {
        return res.json({ dish: dish })
      })
  },

  // postDish 新增一筆品項
  addDish: (req, res) => {
    if (!req.body.name && !req.body.price)
      return res.json({ status: 'error', msg: 'dish name and price cannot be blank' })

    if (!req.body.CategoryId)
      return res.json({ status: 'error', msg: 'category cannot be blank' })

    if (Number(req.body.price) < 0)
      return res.json({ status: 'error', msg: 'price can not be negative' })

    // if (req.body.option && typeof (req.body.option) !== 'array')
    //   return res.json({ status: 'error', msg: 'option is wrong format' })

    let dishObj = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      // option: req.body.option,
      description: req.body.description,
      CategoryId: req.body.CategoryId
    }

    Dish.create(dishObj).then(dish => {
      //console.log(dish)
      tags = []
      if (req.body.tags) {
        req.body.tags.forEach(tag => {
          DishAttachment.create({ TagId: tag.id, DishId: dish.id })
          tags.push({ TagId: tag.id, DishId: dish.id })
        })
      }

      return res.json({ status: 'success', msg: '成功新增菜單!', dish: dish, tags: tags })
    })

  },

  // updateDish 更新某筆品項
  updateDish: (req, res) => {
    let dishObj = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      // option: req.body.option,
      description: req.body.description,
      CategoryId: req.body.CategoryId
    }

    Dish.findByPk(req.params.id).then(dish => {
      if (req.body.removeTags) {
        req.body.removeTags.map(id => {
          DishAttachment.destroy({ where: { DishId: dish.id, TagId: id } })
        })
      }
      dish.update(dishObj).then(dish => {
        return res.json({ status: 'success', msg: '成功更新菜單!', dish: dish })
      }).catch(err => {
        return res.status(404).json({ status: 'error', msg: '更新失敗!' })
      })
    })
  },

  // deleteDish 刪除某筆品項
  deleteDish: (req, res) => {
    Dish.findByPk(req.params.id).then(dish => {
      DishAttachment.findAll({ where: { DishId: dish.id } }).then(tags => {
        tags.forEach(tag => {
          tag.destroy()
        })
        dish.destroy()
        //console.log(`成功刪除${dish.name}！`)
        return res.json({ status: 'success', msg: `成功刪除${dish.name}！` })
      })
    }).catch(err => {
      return res.status(404).json({ status: 'error', msg: '未能成功刪除' })
    })
  }
}

module.exports = dishController