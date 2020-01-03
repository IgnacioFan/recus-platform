'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Dishes', 'UserId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Dishes', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
  }
};
