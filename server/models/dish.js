'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    option: DataTypes.JSON
  }, {});
  Dish.associate = function(models) {
    // associations can be defined here
  };
  return Dish;
};