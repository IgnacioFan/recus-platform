process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../../app')

var helper = require('../../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../../models')
const bcrpty = require('bcryptjs')
const user1 = { account: 'root', phone: '0900', password: bcrpty.hashSync('12345', 10), role: 'admin' }
const profile1 = { name: 'nacho', email: 'nacho@example.com', avatar: null, UserId: 1 }
var testToken = ''


describe('# Admin::User request', () => {

  context('go to SignIn&SignUp feature', () => {

    context('if someone want to sign up', () => {

      before(async () => {
      })

      it('sign up a new member', (done) => {
        request(app)
          .post('/api/signup')
          .send({
            account: 'root', phone: '0903', password: '123456', passwordCheck: '123456',
            name: 'nacho', email: 'nacho@example.com', avatar: null
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            expect(res.body.msg).to.include('註冊成功!')
            // expect(res.body.user.account).to.include('root')
            // expect(res.body.user.phone).to.include('0903')
            return done()
          })
      })

      it('a new member should signin', (done) => {
        request(app)
          .post('/api/signin')
          .send({
            username: 'root', password: '123456'
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            expect(res.body.msg).to.include('ok')
            expect(res.body).to.have.property('user')
            expect(res.body.user.role).to.be.equal('member')
            return done()
          })
      })

      it('if not sign in, will get unauthorized', (done) => {
        request(app)
          .get('/api/member/test')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.text).to.include('Unauthorized')
            return done()
          })
      })

      after(async () => {
        await db.User.destroy({ where: {}, force: true, truncate: true })
        await db.Profile.destroy({ where: {}, truncate: true })
      })
    })

    context('if member sign in', () => {
      before(async () => {
        this.ensureAuthenticated = sinon.stub(
          helper, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helper, 'getUser'
        ).returns({ id: 1, role: 'member', isValid: true })
      })

      it('should access member feature', (done) => {
        request(app)
          .get('/api/member/test')
          .expect(200)
          .expect({ status: 'success', msg: '路徑測試！' }, done)
      })

      it('try to access admin feature', (done) => {
        request(app)
          .get('/api/admin/users')
          .expect(401)
          .expect({ status: 'error', msg: 'not allow!' }, done)
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
      })
    })

    context('admin has signned in', () => {
      before(async () => {
        this.getUser = sinon.stub(
          helper, 'getUser'
        ).returns({ id: 1, role: 'admin' })
        await db.User.destroy({ where: {}, force: true, truncate: true })
        await db.Profile.destroy({ where: {}, truncate: true })
        await db.User.create(user1)
        await db.Profile.create(profile1)
      })

      it('admin should signin', (done) => {
        request(app)
          .post('/api/signin')
          .send({
            username: '0900', password: '12345'
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body.token)
            expect(res.body.msg).to.include('ok')
            expect(res.body).to.have.property('user')
            expect(res.body.user.role).to.be.equal('admin')
            expect(res.body.token).to.be.not.null
            testToken = res.body.token
            return done()
          })
      })

      it('should get current user', (done) => {
        request(app)
          .get('/api/user')
          .set('Authorization', `bearer ${testToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            // expect(res.body.id).to.be.equal(1)
            expect(res.body.phone).to.be.equal('0900')
            expect(res.body.role).to.be.equal('admin')
            expect(res.body.name).to.be.equal('nacho')
            expect(res.body.avatar).to.be.null
            return done()
          })
      })

      xit('should change password', (done) => {
        request(app)
          .post('/api/password/change')
          .set('Authorization', `bearer ${testToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // console.log(res.body)
            // expect(res.body.id).to.be.equal(1)
            expect(res.body.phone).to.be.equal('0900')
            expect(res.body.role).to.be.equal('admin')
            expect(res.body.name).to.be.equal('nacho')
            expect(res.body.avatar).to.be.null
            return done()
          })
      })

      after(async () => {
        this.getUser.restore()
        await db.User.destroy({ where: {}, force: true, truncate: true })
        await db.Profile.destroy({ where: {}, truncate: true })
      })
    })
  })
})