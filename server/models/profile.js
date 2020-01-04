'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
      timestamps: false
    });
  Profile.associate = function (models) {
    // associations can be defined here
  };
  return Profile;
};