'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Categories',
      ['New', '夏日氣泡世界', '義式咖啡'].map(
        (item, index) => ({
          id: index + 1,
          name: item
        })
      ), {})

    return queryInterface.bulkInsert('Dishes',
      Array.from({ length: 50 }).map(
        (item) => ({
          name: faker.name.findName(),
          price: faker.commerce.price(),
          image: faker.image.imageUrl(),
          description: faker.lorem.text(),
          option: '{ "sugar": ["no", "30%", "half", "70%", "full"], "ice": ["no", "less", "normal", "more"] }',
          CategoryId: Math.floor(Math.random() * 2) + 1
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Categories', null, {})
    return queryInterface.bulkDelete('Dishes', null, {})
  }
};
