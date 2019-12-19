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
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};