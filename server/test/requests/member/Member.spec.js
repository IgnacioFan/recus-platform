process.env.NODE_ENV = 'test'

var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../../app')

var helper = require('../../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../../models')
//const moment = require('moment')
var tk = require('timekeeper')
const nowTime = new Date()
// const time1 = moment(nowTime, "YYYY-M-D H:m").subtract(1, 'days').toDate() //moment().subtract(1, 'days')
// const time2 = moment(nowTime, "YYYY-M-D H:m").subtract(2, 'days').toDate()

const member = { account: 'user1', phone: '0912345667', password: '12345', role: 'member', isValid: true }
const profile = { name: 'ryu', email: 'ryu@example.com', UserId: 1 }
const tags = [{ name: "義式" }, { name: "手沖" }, { name: "淺焙" }, { name: "new" }, { name: "肯亞" }, { name: "微酸" }]

describe('# Member::Member Request', () => {

  context('if member sign in', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helper, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helper, 'getUser'
      ).returns({ id: 1, role: 'member', isValid: true })
    })

    it('should pass the test', (done) => {
      request(app)
        .get('/api/member/test')
        .expect(200)
        .expect({ status: 'success', msg: '路徑測試！' }, done)
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })

  context('go to My Profile Page', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helper, 'ensureAuthenticated'
      ).returns(true)
      this.getUser = sinon.stub(
        helper, 'getUser'
      ).returns({ id: 1, role: 'member', isValid: true })
      tk.freeze(nowTime)

      await db.User.create(member)
      await db.Profile.create(profile)
      for (let item of tags) {
        tag = await db.Tag.create(item)
        if (tag.id < 3) {
          await db.UserPreferred.create({ TagId: tag.id, UserId: 1 })
        }
      }
    })

    it("should get the user1's profile", (done) => {
      request(app)
        .get('/api/member/profile')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          // console.log(res.body.user.preferredTags)
          expect(res.body.user.account).to.be.equal('user1')
          expect(res.body.user.Profile.name).to.be.equal('ryu')
          expect(res.body.user.preferredTags.length).to.be.equal(2)
          return done()
        })
    })

    it("should update the user1's profile", (done) => {
      request(app)
        .put('/api/member/profile')
        .send({ account: 'user1', phone: '0912345667', name: 'nacho', email: 'nacho@example.com', tags: [{ id: 2 }, { id: 3 }, { id: 4 }] })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          // console.log(res.body)
          expect(res.body.msg).to.be.equal('更新成功!')
          return done()
        })
    })

    it("should search some tags", (done) => {
      request(app)
        .get('/api/member/tag?name=ne')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          // console.log(res.body)
          expect(res.body[0].id).to.be.equal(4)
          expect(res.body[0].name).to.be.equal('new')
          return done()
        })
    })

    it("should get all tags", (done) => {
      request(app)
        .get('/api/member/tags')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          // console.log(res.body)
          expect(res.body.length).to.be.equal(6)
          return done()
        })
    })

    it("check user1's profile again", (done) => {
      request(app)
        .get('/api/member/profile')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          // console.log(res.body.user.preferredTags)
          expect(res.body.user.account).to.be.equal('user1')
          expect(res.body.user.Profile.name).to.be.equal('nacho')
          expect(res.body.user.preferredTags.length).to.be.equal(3)
          return done()
        })
    })

    after(async () => {
      this.ensureAuthenticated.restore()
      this.getUser.restore()
      tk.reset()
      await db.User.destroy({ where: {}, force: true, truncate: true })
      await db.Profile.destroy({ where: {}, truncate: true })
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.UserPreferred.destroy({ where: {}, truncate: true })
    })
  })
})