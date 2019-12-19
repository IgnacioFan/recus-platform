'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Dishes', 'image', {
      type: Sequelize.STRING,
      default: 'no-image'
    }).then(() => {
      return queryInterface.addColumn('Dishes', 'description', {
        type: Sequelize.TEXT,
        default: 'no-description'
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

