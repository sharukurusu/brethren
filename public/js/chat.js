var socket = io.connect("http://localhost:3000");

//Query Dom

var $message = $("#message"),
  $handle = $("#handle"),
  $btn = $("#send"),
  $output = $("#output"),
  $feedback = $("#feedback"),
  $widget = $("#widget"),
  $trackSearch = $("#track-search"),
  $artistSearch = $("#artist-search"),
  $trackBtn = $("#trackSend"),
  $artistBtn = $("#artistSend");
//Emit events

$btn.on("click", function(event) {
  event.preventDefault();
  socket.emit("chat", {
    message: $message.val(),
    handle: $handle.val()
  });
  $message.val("");
});

$message.on("keyup", function() {
  if ($handle.val() === "") {
    return false;
  }
  socket.emit("typing", $handle.val());
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

//Listen for events

socket.on("chat", function(data) {
  $("#" + data.handle).remove();
  $output.append("<p><strong>" + data.handle + ": </strong>" + data.message);
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
