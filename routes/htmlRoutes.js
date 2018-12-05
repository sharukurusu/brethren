var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.User.findAll({}).then(function(dbusers) {
      res.render("index", {
        msg: "Welcome!",
        users: dbusers
      });
    });
  });

  // Load user page and pass in an user by id
  app.get("/user/:id", function(req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function(
      dbuser
    ) {
      res.render("user", {
        user: dbuser
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
