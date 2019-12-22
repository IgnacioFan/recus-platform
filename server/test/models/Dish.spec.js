process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
  checkUniqueIndex
} = require('sequelize-test-helpers')
const db = require('../../models')
const DishModel = require('../../models/dish')

describe('# Dish Model', () => {
  const Dish = DishModel(sequelize, dataTypes)
  const dish = new Dish()

  checkModelName(Dish)('Dish')

  context('properties', () => {
    ['name', 'price', 'image', 'description', 'option', 'CategoryId'].forEach(checkPropertyExists(dish))
  })

  context('indexes', () => {
    ['name'].forEach(checkUniqueIndex(dish))
  })

  context('check associations', function () {
    const Category = 'Category'
    const Tag = 'Tag'
    const Order = 'Order'
    const DishAttachment = 'DishAttachment'
    const DishCombination = 'DishCombination'

    before(() => {
      Dish.associate({ Category })
      Dish.associate({ Tag })
      Dish.associate({ Order })
    })

    it('defined a belongsTo association with Category', () => {
      expect(Dish.belongsTo).to.have.been.calledWith(Category)
    })

    xit("defined a hasMany association with Tag through DishAttachment as 'hasTags'", () => {
      expect(Dish.belongsToMany).to.have.been.calledWith(Tag, {
        through: DishAttachment,
        as: 'hasTags'
      })
    })

    xit("defined a belongsToMany association with Order through DishCombination as 'sumOfOrder'", () => {
      expect(Dish.belongsToMany).to.have.been.calledWith(Order, {
        through: DishCombination,
        as: 'sumOfOrder'
      })
    })
  })
})