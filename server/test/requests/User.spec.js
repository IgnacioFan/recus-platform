process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helper = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const bcrpty = require('bcryptjs')
const default1 = { account: 'root1', phone: '0900', password: bcrpty.hashSync('12345', 10), role: 'admin' }
const default2 = { account: 'user1', phone: '0901', password: bcrpty.hashSync('12345', 10), role: 'member' }


describe('# Admin::User request', () => {

  context('go to SignIn&SignUp feature', () => {

    describe('if someone want to sign up', () => {

      before(async () => {
        await db.User.destroy({ where: {}, force: true, truncate: true })
      })

      it('sign up a new member', (done) => {
        request(app)
          .post('/api/signup')
          .send({
            account: 'root1', phone: '0903', password: '123456', passwordCheck: '123456'
          })
          .expect(200)
          .end((err, res) => {
            expect(res.user)
            expect(res.text).to.include('帳號註冊成功！')
            return done()
          })
      })

      xit('a new member should signin', (done) => {
        request(app)
          .post('/api/signin')
          .send({
            account: '0900', password: '12345'
          })
          .expect(200)
          .end((err, res) => {
            // console.log(res.text)
            // console.log(res.body)
            expect(res.body.msg).to.include('ok')
            expect(res.body).to.have.property('user')
            expect(res.body.user.role).to.be.equal('member')
            return done()
          })
      })

      after(async () => {
        await db.User.destroy({ where: {}, force: true, truncate: true })
      })
    })

    describe('if user not sign in', () => {

      before(async (done) => {
        done()
      })

      it('should get Unauthorized', (done) => {
        request(app)
          .get('/api/admin/users')
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
          .get('/api/admin/users')
          .expect(401)
          .expect({ status: 'error', msg: '不是管理者，權限不足！' }, done)
      })

      after(async () => {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
      })
    })

    describe('admin has signned in', () => {
      before(async () => {
        let testToken
        this.getUser = sinon.stub(
          helper, 'getUser'
        ).returns({ id: 1, role: 'admin' })
        await db.User.destroy({ where: {}, force: true, truncate: true })
        await db.Profile.destroy({ where: {}, truncate: true })
        await db.User.create(default1)
        await db.Profile.create({ name: 'nacho', email: 'nacho@example.com', avatar: '', UserId: 1 })
      })

      it('admin should signin', (done) => {
        request(app)
          .post('/api/signin')
          .send({
            account: '0900', password: '12345'
          })
          .expect(200)
          .end((err, res) => {
            //console.log(res.body)
            expect(res.body.msg).to.include('ok')
            expect(res.body).to.have.property('user')
            expect(res.body.user.role).to.be.equal('admin')
            testToken = res.body.token
            console.log(testToken)
            return done()
          })
      })

      it('should get current user', (done) => {
        request(app)
          .get('/api/admin/user')
          .set('Authorization', `bearer ${testToken}`)
          .expect(200)
          .end((err, res) => {
            // console.log(res.text)
            //console.log(res.body)
            expect(res.body.id).to.be.equal(1)
            expect(res.body.phone).to.be.equal('0900')
            expect(res.body.role).to.be.equal('admin')
            expect(res.body.name).to.be.equal('nacho')
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