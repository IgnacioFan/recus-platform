process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helper = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const admin = { account: 'root1', phone: '0900', password: '12345', role: 'admin' }
const member1 = { account: 'user1', phone: '0901', password: '12345', role: 'member' }
const member2 = { account: 'user2', phone: '0902', password: '12345', role: 'member' }
const profi1 = { name: 'ryu', email: 'ryu@example.com', UserId: 2 }
const profi2 = { name: 'yoshi', email: 'yoshi@example.com', UserId: 3 }

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
        await db.Profile.destroy({ where: {}, truncate: true })
        await db.User.create(admin)
        await db.User.create(member1)
        await db.User.create(member2)
        await db.Profile.create(profi1)
        await db.Profile.create(profi2)
        await db.MemberOrder.create({ UserId: 2, OrderId: 1 })
        await db.MemberOrder.create({ UserId: 2, OrderId: 2 })
        await db.MemberOrder.create({ UserId: 3, OrderId: 3 })
        await db.MemberOrder.create({ UserId: 3, OrderId: 4 })
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
            expect(res.body.user.account).to.be.equal('user2')
            return done()
          })
      })

      it('should search a specific user who is not admin', (done) => {
        request(app)
          .get('/api/admin/members/search?phone=0902')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.user)
            expect(res.body).to.have.property('user')
            expect(res.body.user.account).to.be.equal('user2')
            expect(res.body.user.Profile.name).to.be.equal('yoshi')
            return done()
          })
      })

      it('should get user pagination', (done) => {
        request(app)
          .get('/api/admin/members?page=1')
          .expect(200)
          .end((err, res) => {
            // console.log(res.body.users)
            // console.log(res.body.users[0].MemberOrders.length)
            expect(res.body).to.have.property('users')
            expect(res.body.users[0].account).to.be.equal('user1')
            expect(res.body.users[0].MemberOrders.length).to.be.equal(2)
            expect(res.body.users[0].MemberOrders[0].OrderId).to.be.equal(1)
            expect(res.body.users[1].account).to.be.equal('user2')
            expect(res.body.users[1].MemberOrders.length).to.be.equal(2)
            expect(res.body.users[1].MemberOrders[1].OrderId).to.be.equal(4)
            return done()
          })
      })

      it('should delete member 3', (done) => {
        request(app)
          .delete('/api/admin/members/3')
          .expect(200)
          .end((err, res) => {
            console.log(res.text)
            expect(res.text).to.be.include('successfully deleted!')
            return done()
          })
      })

      it('should change role of member 2 to admin', (done) => {
        request(app)
          .put('/api/admin/members/2')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body.user.role).to.be.equal('admin')
            expect(res.body.msg).to.be.equal('role changed!')
            return done()
          })
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, force: true, truncate: true })
        await db.Profile.destroy({ where: {}, truncate: true })
      })
    })

  })
})