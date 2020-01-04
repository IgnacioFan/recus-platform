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
const default2 = { account: 'user1', phone: '0901', password: '12345', role: 'member' }


describe('# Admin::User request', () => {

  context('go to Order feature', () => {

    xdescribe('if someone want to sign up', () => {

      // before((done) => {
      //   done
      // })

      it('should get all users', (done) => {
        request(app)
          .get('/api/users')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.users)
            expect(res.body).to.have.property('users')
            expect(res.body.users.length).to.be.equal(2)
            expect(res.body.users[0].account).to.be.equal('root1')
            expect(res.body.users[1].account).to.be.equal('user1')
            return done()
          })
      })

      // after(async () => {
      //   this.ensureAuthenticated.restore()
      //   this.getUser.restore()
      //   await db.User.destroy({ where: {}, force: true, truncate: true })
      // })
    })

    describe('if user not sign in', () => {

      before(async (done) => {
        done()
      })

      it('should get Unauthorized', (done) => {
        request(app)
          .get('/api/users')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err)
            res.text.should.include('Unauthorized')
            return done()
          })
      })
    })

    describe('if member sign in', () => {
      before(async () => {
        this.ensureAuthenticated = sinon.stub(
          helper, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helper, 'getUser'
        ).returns({ id: 1, role: 'member' })
      })

      it('should get error message', (done) => {
        request(app)
          .get('/api/users')
          .expect(401)
          .expect({ status: 'error', msg: 'admin permission denied' }, done)
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
      })
    })

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
      })

      it('should get all users', (done) => {
        request(app)
          .get('/api/users')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.users)
            expect(res.body).to.have.property('users')
            expect(res.body.users.length).to.be.equal(2)
            expect(res.body.users[0].account).to.be.equal('root1')
            expect(res.body.users[1].account).to.be.equal('user1')
            return done()
          })
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await db.User.destroy({ where: {}, force: true, truncate: true })
      })
    })

    xdescribe('if admin sign out', () => {

      before(async () => {
        this.ensureAuthenticated = sinon.stub(
          helper, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helper, 'getUser'
        ).returns({ id: 1, role: 'admin' })
        await db.User.destroy({ where: {}, force: true, truncate: true })
      })

      xit('should get all users', (done) => {
        request(app)
          .get('/api/users')
          .expect(200)
          .end((err, res) => {
            //console.log(res.body.users)
            expect(res.body).to.have.property('users')
            expect(res.body.users.length).to.be.equal(2)
            expect(res.body.users[0].account).to.be.equal('root1')
            expect(res.body.users[1].account).to.be.equal('user1')
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