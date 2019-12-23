'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {
      timestamps: false
    });
  Tag.associate = function (models) {
    Tag.belongsToMany(models.Dish, {
      through: models.DishAttachment,
      foreignKey: 'TagId',
      as: 'hasDishes'
    })
  };
  return Tag;
};