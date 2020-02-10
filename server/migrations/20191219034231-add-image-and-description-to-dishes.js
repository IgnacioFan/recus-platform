'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Dishes', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'none'
    }).then(() => {
      return queryInterface.addColumn('Dishes', 'description', {
        type: Sequelize.TEXT,
        defaultValue: 'none'
      });
    })

  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Dishes', 'image')
      .then(function () {
        return queryInterface.removeColumn('Dishes', 'description');
      });
  }
};

