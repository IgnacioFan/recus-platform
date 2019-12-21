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
const UserModel = require('../../models/user')

describe('# User Model', function () {
  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('User')

  context('properties', function () {
    ['account', 'phone', 'password', 'name', 'image', 'isAdmin', 'isValid'].forEach(checkPropertyExists(user))
  })

  context('Check associations', function () {
    const Order = 'Order'

    before(function () {
      User.associate({ Order })
    })

    it('defined a hasMany association with Order', function () {
      expect(User.hasMany).to.have.been.calledWith(Order);
    })
  })

  context('User does not exist', function () {
    let data = null

    it('create a new User', function (done) {
      db.User.create({ account: 'aaa', phone: '09111', password: '1234' }).then(function (user) {
        data = user
        done()
      })
    })

    it('read the user', function (done) {
      db.User.findByPk(data.id).then(function (user) {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })

    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })

})