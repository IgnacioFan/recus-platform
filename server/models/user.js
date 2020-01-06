'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    isValid: DataTypes.BOOLEAN,
  }, {
      defaultScope: {
        attributes: ['id', 'account', 'phone', 'role']
      },
      scopes: {
        'excludedAdmin': {
          where: { 'role': 'member' }
        },
        'getMemberData': {
          attributes: ['id', 'account', 'phone', 'role']
        }
      },
      //deletedAt: 'destroyTime',
      timestamps: true,
      paranoid: true
    });
  User.associate = function (models) {
    User.findUserByPhone = (value) => {
      return models.User.findOne(
        { where: { 'phone': value }, include: [models.Profile] }
      )
    }
    User.hasOne(models.Profile)
    User.hasMany(models.MemberOrder)
    User.belongsToMany(models.Order, {
      through: models.MemberOrder,
      foreignKey: 'UserId',
      as: 'hasManyOrders',
    })
    User.belongsToMany(models.Tag, {
      through: models.UserPreferred,
      foreignKey: 'UserId',
      as: 'preferredTags',
      hooks: true,
      onDelete: 'cascade'
    })
  };
  return User;
};