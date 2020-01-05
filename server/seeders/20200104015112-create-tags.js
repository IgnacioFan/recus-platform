'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tags',
      Array.from({ length: 20 }).map(
        (item) => ({
          name: faker.random.words()
        })
      ), {})

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Tags', null, {});

  }
};
