'use strict';
const Op = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    state: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    memo: DataTypes.STRING,
    isTakingAway: DataTypes.BOOLEAN,
    tableNum: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
      defaultScope: {
        //where: { deleted_at: null }
        //paranoid: false
      },
      scopes: {
        orderWithMember: {
          where: {
            UserId: { [Op.gt]: 0 }
          }
        },
        todayOrder: {
          where: {
            createdAt: {
              [Op.gte]: new Date().setHours(0, 0, 0)
              , [Op.lte]: new Date()
            }
          }
        }
      },
      timestamps: true,
      paranoid: true
    });
  Order.associate = function (models) {
    Order.belongsTo(models.User)
    Order.hasMany(models.MemberOrder)
    Order.belongsToMany(models.Dish, {
      through: models.DishCombination,
      foreignKey: 'OrderId',
      as: 'sumOfDishes',
      hooks: true,
      onDelete: 'cascade'
    })
  };
  return Order;
};