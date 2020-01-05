'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('MemberOrders',
      Array.from({ length: 10 }).map(
        (item) => ({
          UserId: Math.floor(Math.random() * 52) + 1,
          OrderId: Math.floor(Math.random() * 19) + 1
        }))
      , {});
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('MemberOrders', null, {});

  }
};
