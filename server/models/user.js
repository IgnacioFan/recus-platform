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
      scopes: {
        'excludedAdmin': {
          where: { 'role': 'member' }
        }
      },
      //deletedAt: 'destroyTime',
      timestamps: true,
      paranoid: true
    });
  User.associate = function (models) {
    User.hasOne(models.Profile)
    User.hasMany(models.MemberOrder)
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