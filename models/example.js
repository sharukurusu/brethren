module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    securityQuestion: DataTypes.STRING,
    bio: DataTypes.TEXT,
    picture: DataTypes.BLOB("long")
  });
  return User;
};
