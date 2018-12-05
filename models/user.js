module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, validate: { isEmail: true } },
    password: DataTypes.STRING,
    securityQuestion: DataTypes.STRING,
    bio: DataTypes.TEXT,
    favorites: DataTypes.TEXT,
    picture: DataTypes.BLOB("long")
  });
  return User;
};
