'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('UserPreferreds',
      Array.from({ length: 50 }).map(
        (item) => ({
          TagId: Math.floor(Math.random() * 19) + 1,
          UserId: Math.floor(Math.random() * 52) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      , {});

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('UserPreferreds', null, {});

  }
};
