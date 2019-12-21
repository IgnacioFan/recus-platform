'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    state: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    memo: DataTypes.STRING,
    isTakingAway: DataTypes.BOOLEAN,
    tableNum: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Order.associate = function (models) {
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Dish, {
      through: models.DishCombination,
      foreignKey: 'OrderId',
      as: 'sumOfDishes'
    })
  };
  return Order;
};