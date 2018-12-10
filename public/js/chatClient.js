$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    username = data.username;
    socket.emit("new user", username);
  });
  var origin = window.location.origin;
  var socket = io.connect(origin);
  var $messageBox = $("#message");
  var $feedback = $("#feedback");
  var $send = $("#send");
  var $chat = $("#chat");
  var $users = $("#users");
  var $widget = $("#widget");
  var $trackSearch = $("#track-search");
  var $artistSearch = $("#artist-search");
  var $spotifySubmit = $("#spotify-search");


  $send.on("click", function(event) {
    event.preventDefault();
    var chatMsg = { username: username, message: $messageBox.val() };
    socket.emit("send message", chatMsg);
    $messageBox.val("");
  });

  $messageBox.on("keypress", function() {
    if ($messageBox.val() !== "") {
      socket.emit("typing", username);
    }
  });

  $spotifySubmit.on("click", function(event) {
    event.preventDefault();
    if ($trackSearch.val() === "" && $artistSearch.val() === "") {
      return false;
    } else if ($trackSearch.val() !== "" && $artistSearch.val() === "") {
        socket.emit("trackSearch", {
            search: $trackSearch.val()
        });
    } else if ($trackSearch.val() === "" && $artistSearch.val() !== "") {
        socket.emit("artistSearch", {
            search: $artistSearch.val()
        });
    }   else { return false } 
  });


  socket.on("connected users", function(data) {
    $users.empty();
    data.forEach(function(name) {
      var userCard = $("<a>");
      userCard.attr("href", "/members/" + name);
      userCard.text(name);
      userCard.append($("<br>"));
      $users.append(userCard);
    });
  });
  socket.on("new message", function(data) {
      var messageCard = $("<a>");
      messageCard.attr("href", "/members/" + data.username);
      messageCard.text(data.username + ": " + data.message);
      messageCard.append("<br>")
      $chat.append(messageCard)
  });

  socket.on("typing", function(data) {
    if ($("#" + data).length === 0) {
      $feedback.append(
        "<p id='" + data + "'><em>" + data + " is typing a message...</em></p>"
      );
    }
  });

  socket.on("trackSearch", function(data) {
    var iframe = $("<iframe>");
    iframe.attr("src", "https://open.spotify.com/embed/album/" + data);
    iframe.attr("width", "100%");
    iframe.attr("height", "300");
    iframe.attr("frameborder", "0");
    iframe.attr("allowtransparency", "true");
    iframe.attr("allow", "encrypted-media");
    $widget.html(iframe);
    console.log(data);
  });
  socket.on("artistSearch", function(data) {
    var iframe = $("<iframe>");
    iframe.attr("src", "https://open.spotify.com/embed/artist/" + data);
    iframe.attr("width", "100%");
    iframe.attr("height", "300");
    iframe.attr("frameborder", "0");
    iframe.attr("allowtransparency", "true");
    iframe.attr("allow", "encrypted-media");
    $widget.html(iframe);
    console.log(data);
  });
});
