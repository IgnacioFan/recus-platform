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

describe('# User Model', () => {
  before((done) => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('User')

  context('properties', () => {
    ['account', 'phone', 'password', 'role', 'isValid'].forEach(checkPropertyExists(user))
  })

  context('Check associations', () => {

    const Tag = 'Tag'
    const Profile = 'Profile'
    const MemberOrder = 'MemberOrder'
    const UserPreferred = 'UserPreferred'

    before(function () {
      User.associate({ Profile })
      User.associate({ MemberOrder })
      User.associate({ Tag, UserPreferred })
    })

    it('defined a hasOne association with Profile', () => {
      expect(User.hasOne).to.have.been.calledWith(Profile);
    })

    it('defined a hasMany association with MemberOrder', () => {
      expect(User.hasMany).to.have.been.calledWith(MemberOrder);
    })

    it("defined a belongsToMany association with Tag through UserPreferred as 'preferredTags'", () => {
      expect(User.belongsToMany).to.have.been.calledWith(Tag, {
        through: UserPreferred,
        foreignKey: 'UserId',
        as: 'preferredTags',
        hooks: true,
        onDelete: 'cascade'
      })
    })
  })

  context('CRUD', () => {
    let data = null

    it('create a new User', (done) => {
      db.User.create({ account: 'aaa', phone: '09111', password: '1234' }).then(function (user) {
        data = user
        done()
      })
    })

    it('read the user', (done) => {
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

    it('soft delete, the user exist', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id, { paranoid: false }).then((user) => {
          expect(user.deletedAt).to.be.not.equal(null)
          done()
        })
      })
    })

    it('forced delete, the user is removed', (done) => {
      db.User.destroy({ where: { id: data.id }, force: true }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })

})