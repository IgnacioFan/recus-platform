'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'member'
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
      defaultScope: {

      },
      scopes: {
        'excludedAdmin': {
          where: { 'role': 'member' }
        },
        'getMemberData': {
          attributes: ['id', 'account', 'phone', 'role', 'isValid']
        }
      },
      timestamps: true,
      paranoid: true
    });
  User.associate = function (models) {
    User.searchIsAccount = (value) => {
      return models.User.findOne(
        { attributes: ['account'], where: { 'account': value } }
      )
    }
    User.searchIsPhone = (value) => {
      return models.User.findOne(
        { attributes: ['phone'], where: { 'phone': value } }
      )
    }
    User.findUserByPhone = (value) => {
      return models.User.findOne(
        { where: { 'phone': value }, include: [models.Profile] }
      )
    }
    User.hasOne(models.Profile, { hooks: true, onDelete: 'cascade' })
    User.hasMany(models.Order, { hooks: true, onDelete: 'cascade' })
    User.belongsToMany(models.Tag, {
      through: models.UserPreferred,
      foreignKey: 'UserId',
      as: 'preferredTags'
    })
  };
  return User;
};