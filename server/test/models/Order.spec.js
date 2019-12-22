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
const OrderModel = require('../../models/order')

describe('# Order Model', function () {
  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()

  checkModelName(Order)('Order')

  context('properties', () => {
    ['tableNum', 'memo', 'amount', 'quantity', 'state', 'isTakingAway', 'UserId'].forEach(checkPropertyExists(order))
  })

  context('check associations', function () {
    
  })
})