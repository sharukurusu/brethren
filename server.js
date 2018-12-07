require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var socket = require("socket.io");
var db = require("./models");
//Spotify API
var keys = require("./keys.js"),
  Spotify = require("node-spotify-api"),
  spotify = new Spotify(keys.spotify);

var app = express();
var PORT = process.env.PORT || 3000;

var server = app.listen(PORT, function() {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});
//Chatroom essentials

//Socket setup
var io = socket(server);

io.on("connection", function(socket) {
  console.log("user connected", socket.id);

  //Handle chat event
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("trackSearch", function(data) {
    spotify.search({ type: "track", query: data.search }, function(
      err,
      spotifyData
    ) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      console.log(spotifyData);
      io.sockets.emit("trackSearch", spotifyData);
    });
  });
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  server;
});

module.exports = app;
