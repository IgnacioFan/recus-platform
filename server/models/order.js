'use strict';
const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh_tw')

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    state: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    amount: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    memo: {
      type: DataTypes.STRING,
      defaultValue: 'none'
    },
    isTakingAway: DataTypes.BOOLEAN,
    tableNum: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    UserId: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
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
        orderWithoutMember: {
          where: {
            UserId: { [Op.eq]: 0 }
          }
        },
        todayOrder: {
          where: {
            createdAt: {
              [Op.gte]: moment().startOf('day')//new Date().setHours(0, 0, 0)
              , [Op.lte]: moment().endOf('day')
            }
          }
        },
        weekly: {
          where: {
            createdAt: {
              [Op.gte]: moment().subtract(1, 'weeks').startOf('week')
              , [Op.lte]: moment().subtract(1, 'weeks').endOf('week')
            }
          }
        },
        monthly: {
          where: {
            createdAt: {
              [Op.gte]: moment().subtract(1, 'months').startOf('month')
              , [Op.lte]: moment().subtract(1, 'months').endOf('month')
            }
          }

        },
      },
      timestamps: true,
      paranoid: true
    });
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