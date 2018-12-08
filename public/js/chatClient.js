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
  var $trackBtn = $("#trackSend");
  var $artistBtn = $("#artistSend");

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

  $trackBtn.on("click", function(event) {
    if ($trackSearch.val() === "") {
      return false;
    }
    event.preventDefault();
    socket.emit("trackSearch", {
      search: $trackSearch.val()
    });
  });
  $artistBtn.on("click", function(event) {
    event.preventDefault();
    socket.emit("artistSearch", {
      search: $artistSearch.val()
    });
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
    $chat.append(
      "<p><strong>" + data.username + ": </strong>" + data.message + "<br></p>"
    );
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
    iframe.attr("width", "300");
    iframe.attr("height", "380");
    iframe.attr("frameborder", "0");
    iframe.attr("allowtransparency", "true");
    iframe.attr("allow", "encrypted-media");
    $widget.html(iframe);
    console.log(data);
  });
  socket.on("artistSearch", function(data) {
    var iframe = $("<iframe>");
    iframe.attr("src", "https://open.spotify.com/embed/artist/" + data);
    iframe.attr("width", "300");
    iframe.attr("height", "380");
    iframe.attr("frameborder", "0");
    iframe.attr("allowtransparency", "true");
    iframe.attr("allow", "encrypted-media");
    $widget.html(iframe);
    console.log(data);
  });
});
