process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')
const db = require('../../models')
const CategoryModel = require('../../models/category')

describe('# Category Model', () => {
  const Category = CategoryModel(sequelize, dataTypes)
  const category = new Category()

  checkModelName(Category)('Category')

  context('properties', () => {
    ['name'].forEach(checkPropertyExists(category))
  })

  context('check associations', () => {
    const Dish = 'Dish'

    before(() => {
      Category.associate({ Dish })
    })

    it('defined a hasMany association with Dish', () => {
      expect(Category.hasMany).to.have.been.calledWith(Dish)
    })
  })
})