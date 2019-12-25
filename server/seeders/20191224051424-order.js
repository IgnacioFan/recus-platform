'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Orders',
      Array.from({ length: 10 }).map((item) => ({
        amount: (Math.floor(Math.random() * 9 + 1) * 10),
        quantity: Math.floor(Math.random() * 3 + 1),
        isTakingAway: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })), {});

    return queryInterface.bulkInsert('Orders',
      Array.from({ length: 10 }).map((item) => ({
        amount: (Math.floor(Math.random() * 9 + 1) * 10),
        quantity: Math.floor(Math.random() * 3 + 1),
        isTakingAway: false,
        tableNum: Math.floor(Math.random() * 7 + 1),
        UserId: Math.floor(Math.random() * 3 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Orders', null, {})
  }
};
