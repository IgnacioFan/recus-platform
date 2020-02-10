'use strict';
const Op = require('sequelize').Op
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const UserPreferred = sequelize.define('UserPreferred', {
    TagId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
      scopes: {
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
      }
    });
  UserPreferred.associate = function (models) {
    UserPreferred.belongsTo(models.Tag)
  };
  return UserPreferred;
};