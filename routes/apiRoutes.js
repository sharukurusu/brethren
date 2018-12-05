var db = require("../models");

module.exports = function(app) {
  // Get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({}).then(function(dbusers) {
        // res.render("index", {
        //     msg: "Rendered again!",
        //     users: dbusers
        // });
        res.json(dbusers);
    });
});

  // Create a new user
  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(dbuser) {
        // res.render("index", {
        //     msg: "Rendered again!",
        //     users: dbuser
        // });
      res.json(dbuser);
    });
  });

  // Delete an user by id
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbuser) {
        // res.render("index", {
        //     msg: "Rendered again!",
        //     users: dbuser
        // });
      res.json(dbuser);
    });
  });
};
