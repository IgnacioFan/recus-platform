process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helper = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const default1 = { account: 'root1', phone: '0900', password: '12345', role: 'admin' }
const default2 = { account: 'root2', phone: '0901', password: '12345', role: 'member' }
const default3 = { account: 'user1', phone: '0902', password: '12345', role: 'member' }

describe('# Admin::Member request', () => {

  context('go to Member-management feature', () => {

    describe('if admin sign in', () => {
      before(async () => {
        this.ensureAuthenticated = sinon.stub(
          helper, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helper, 'getUser'
        ).returns({ id: 1, role: 'admin' })
        await db.User.destroy({ where: {}, force: true, truncate: true })
        await db.User.create(default1)
        await db.User.create(default2)
        await db.User.create(default3)
      })

      it('should get all users', (done) => {
        request(app)
          .get('/api/admin/users')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body).to.have.property('users')
            expect(res.body.users.length).to.be.equal(3)
            return done()
          })
      })

      it('should get a specific user who is not admin', (done) => {
        request(app)
          .get('/api/admin/users/3')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.user)
            expect(res.body).to.have.property('user')
            expect(res.body.user.account).to.be.equal('user1')
            return done()
          })
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, force: true, truncate: true })
      })
    })

  })
})