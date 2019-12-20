'use strict';
module.exports = (sequelize, DataTypes) => {
  const DishCombination = sequelize.define('DishCombination', {
    quantity: DataTypes.INTEGER,
    DishId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER
  }, {
      timestamps: false
    });
  DishCombination.associate = function (models) {
    // associations can be defined here
  };
  return DishCombination;
};