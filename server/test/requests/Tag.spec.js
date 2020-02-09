process.env.NODE_ENV = 'test'

var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helper = require('../../_helpers');
var chai = require('chai')
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const menu = [
  { name: '黑框美式', price: 60, CategoryId: 1 },
  { name: '花神', price: 100, CategoryId: 2 }
]
const tags = ["義式", "手沖", "果酸"]
const userPreferred = [{ UserId: 1, TagId: 3 }, { UserId: 2, TagId: 3 }, { UserId: 2, TagId: 3 }]
const dishAttachment = [{ DishId: 1, TagId: 1 }, { DishId: 2, TagId: 2 }, { DishId: 2, TagId: 3 }]


describe('# Admin::Dish Request', () => {
  context('go to Dish-Management feature', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helper, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helper, 'getUser'
      ).returns({ id: 1, role: 'admin' })

      for (let i = 0; i < tags.length; i++) {
        await db.Tag.create({ name: tags[i] })
      }
      for (let i = 0; i < menu.length; i++) {
        await db.Dish.create({ name: menu[i].name, price: menu[i].price, CategoryId: menu[i].CategoryId })
      }
      for (let i = 0; i < dishAttachment.length; i++) {
        await db.DishAttachment.create({ DishId: dishAttachment[i].DishId, TagId: dishAttachment[i].TagId })
      }
      for (let i = 0; i < userPreferred.length; i++) {
        await db.UserPreferred.create({ UserId: userPreferred[i].UserId, TagId: userPreferred[i].TagId })
      }
    })

    it('should get tags with dish numbers', (done) => {
      request(app)
        .get('/api/admin/tags')
        .expect(200)
        .end((err, res) => {
          //console.log(res.body)
          res.status.should.be.eql(200);
          expect(res.body.tags).to.be.a('array')
          expect(res.body.tags[0].nums).to.be.equal(1)
          expect(res.body.tags[1].nums).to.be.equal(1)
          expect(res.body.tags[2].nums).to.be.equal(1)
          done();
        });
    })


    it('should post a new tag', (done) => {
      request(app)
        .post('/api/admin/tags')
        .send('name=微酸')
        .expect(200)
        .end((err, res) => {
          res.text.should.include('微酸');
          done();
        });
    })

    it('if post the same name of tag', (done) => {
      request(app)
        .post('/api/admin/tags')
        .send('name=微酸')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.text.should.include('標籤已建立!')
          done();
        });
    })

    it('if update a null name of tag', (done) => {
      request(app)
        .put('/api/admin/tags/4')
        .send('name=')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          res.text.should.include('名稱不可空白!')
          done()
        })
    })

    it('should update a new name of tag', (done) => {
      request(app)
        .put('/api/admin/tags/4')
        .send('name=微酸2.0')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.tag.name).to.be.equal('微酸2.0')
          done()
        })
    })

    it('should delete tag 4', (done) => {
      request(app)
        .delete('/api/admin/tags/3')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          //console.log(res.body.tag)
          expect(res.body.msg).to.be.equal('已刪除果酸!')
          done();
        });
    })

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.Tag.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      await db.DishAttachment.destroy({ where: {}, truncate: true })
      await db.UserPreferred.destroy({ where: {}, truncate: true })
    })
  })
})