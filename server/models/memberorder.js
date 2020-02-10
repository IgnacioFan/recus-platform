'use strict';
module.exports = (sequelize, DataTypes) => {
  const MemberOrder = sequelize.define('MemberOrder', {
    UserId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER
  }, {
      timestamps: false
    });
  MemberOrder.associate = function (models) {
    MemberOrder.belongsTo(models.User)
    MemberOrder.belongsTo(models.Order)
  };
  return MemberOrder;
};