'use strict';
module.exports = (sequelize, DataTypes) => {
  const DishAttachment = sequelize.define('DishAttachment', {
    TagId: DataTypes.INTEGER,
    DishId: DataTypes.INTEGER
  }, {
      timestamps: false
    });
  DishAttachment.associate = function (models) {

  };
  return DishAttachment;
};