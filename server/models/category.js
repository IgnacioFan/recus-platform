'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {
      indexes: [
        { unique: true, fields: ['name'] }
      ],
      timestamps: false
    });
  Category.associate = function (models) {
    Category.hasMany(models.Dish)
  };
  return Category;
};