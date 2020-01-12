'use strict';
module.exports = (sequelize, DataTypes) => {
  const DishCombination = sequelize.define('DishCombination', {
    perQuantity: DataTypes.INTEGER,
    perAmount: DataTypes.INTEGER,
    perOption: DataTypes.STRING,
    DishId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER
  }, {
      //deletedAt: 'destroyTime',
      //paranoid: true
    });
  DishCombination.associate = function (models) {
    // DishCombination.belongsTo(models.Dish)
    // DishCombination.belongsTo(models.Order)
  };
  return DishCombination;
};