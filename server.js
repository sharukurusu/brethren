require("dotenv").config();
// Requiring necessary npm packages
var express = require("express");
var app = express();
var exphbs = require("express-handlebars");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
//Spotify API
var keys = require("./keys.js"),
  Spotify = require("node-spotify-api"),
  spotify = new Spotify(keys.spotify);
// Chat
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
// For image uploads
var multer = require("multer");
var upload = multer({ dest: "./uploads" });

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

//  Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Chat
io.sockets.on("connection", function(socket) {
  var connectedChatUsers = [];

  socket.on("new user", function(data) {
    socket.username = data;
    connectedChatUsers.push(socket.username);
    io.sockets.emit("connected users", connectedChatUsers);
  });

  socket.on("send message", function(data) {
    io.sockets.emit("new message", data);
  });

  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("trackSearch", function(data) {
    spotify.search(
      { type: "track", market: "US", query: data.search },
      function(err, spotifyData) {
        if (err) {
          return console.log("Error occurred: " + err);
        }
        io.sockets.emit("trackSearch", spotifyData.tracks.items[0].album.id);
      }
    );
  });
  socket.on("artistSearch", function(data) {
    spotify.search(
      { type: "artist", market: "US", query: data.search },
      function(err, spotifyData) {
        if (err) {
          return console.log("Error occurred: " + err);
        }
        io.sockets.emit("artistSearch", spotifyData.artists.items[0].id);
      }
    );
  });
  socket.on("disconnect", function(data) {
    connectedChatUsers.splice(connectedChatUsers.indexOf(socket.username), 1);
    io.sockets.emit("connected users", connectedChatUsers);
  });
});

// Requiring our routes
require("./routes/htmlRoutes.js")(app);
require("./routes/apiRoutes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  server.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", 
      PORT,
      PORT
    );
  });
});
