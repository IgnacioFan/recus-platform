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
const TagModel = require('../../models/tag')

describe('# Tag Model', function () {
  const Tag = TagModel(sequelize, dataTypes)
  const tag = new Tag()

  checkModelName(Tag)('Tag')

  context('properties', () => {
    ['name'].forEach(checkPropertyExists(tag))
  })

  context('check associations', function () {
    const Dish = 'Dish'
    const DishAttachment = 'DishAttachment'

    before(() => {
      Tag.associate({ Dish, DishAttachment })
    })

    it("defined a belongsToMany association with Dish through DishCombination as 'hasDishes'", () => {
      expect(Tag.belongsToMany).to.have.been.calledWith(Dish, {
        through: DishAttachment,
        foreignKey: 'TagId',
        as: 'hasDishes'
      })
    })
  })
})