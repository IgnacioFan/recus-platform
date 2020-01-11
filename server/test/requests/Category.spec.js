process.env.NODE_ENV = 'test'

var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')

var helper = require('../../_helpers');
var chai = require('chai')
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const categories = ['義式', '手沖']
const menu = [
  { name: '黑框美式', price: 60, CategoryId: 1 },
  { name: '卡布奇諾', price: 80, CategoryId: 1 },
  { name: '花神', price: 100, CategoryId: 2 },
  { name: '牧童', price: 100, CategoryId: 2 },
]

describe('# Admin::Category Request', () => {
  context('go to Dish-Management feature', () => {

    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helper, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helper, 'getUser'
      ).returns({ id: 1, role: 'admin' })
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
      for (let i = 0; i < categories.length; i++) {
        await db.Category.create({ name: categories[i] })
      }
      for (let i = 0; i < menu.length; i++) {
        await db.Dish.create({ name: menu[i].name, price: menu[i].price, CategoryId: menu[i].CategoryId })
      }
    })

    it('should get categories with dish numbers', (done) => {
      request(app)
        .get('/api/admin/categories')
        .expect(200)
        .end((err, res) => {
          //console.log(res.body.categories)
          expect(res.body.categories).to.be.a('array')
          expect(res.body.categories[0].name).to.be.equal('義式')
          expect(res.body.categories[0].nums).to.be.equal(2)
          expect(res.body.categories[1].name).to.be.equal('手沖')
          expect(res.body.categories[1].nums).to.be.equal(2)
          done();
        });
    })


    it('should post a new category', (done) => {
      request(app)
        .post('/api/admin/categories')
        .send('name=冰滴')
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.text.should.include('冰滴');
          done();
        });
    })

    it('if post a null name of category', (done) => {
      request(app)
        .post('/api/admin/categories')
        .send('name=')
        .end(function (err, res) {
          if (err) return done(err);
          //console.log(res.text)
          res.status.should.be.eql(422);
          res.text.should.include('請輸入名稱!')
          done();
        });
    })

    it('if post the same name of category', (done) => {
      request(app)
        .post('/api/admin/categories')
        .send('name=冰滴')
        .end(function (err, res) {
          if (err) return done(err);
          //console.log(res.body)
          res.status.should.be.eql(200);
          res.text.should.include('分類已建立!')
          done();
        });
    })

    it('should update a new name of category', (done) => {
      request(app)
        .put('/api/admin/categories/3')
        .send('name=冰滴2.0')
        .end(function (err, res) {
          if (err) return done(err);
          res.status.should.be.eql(200);
          res.text.should.include('冰滴2.0')
          done()
        })
    })

    it('if update the same name of category', (done) => {
      request(app)
        .put('/api/admin/categories/3')
        .send('name=冰滴2.0')
        .end(function (err, res) {
          if (err) return done(err)
          //console.log(res.body)
          res.status.should.be.eql(200)
          res.text.should.include('分類已建立!')
          done()
        })
    })

    it('should delete category 3', (done) => {
      request(app)
        .delete('/api/admin/categories/3')
        .end(function (err, res) {
          if (err) return done(err)
          //console.log(res.body)
          res.status.should.be.eql(200)
          res.body.should.be.a('object')
          res.text.should.include('成功移除冰滴2.0')
          done();
        });
    })

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.Category.destroy({ where: {}, truncate: true })
      await db.Dish.destroy({ where: {}, truncate: true })
    })
  })
})