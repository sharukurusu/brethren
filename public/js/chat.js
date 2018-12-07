var socket = io.connect("http://localhost:3000");

//Query Dom

var $message = $("#message"),
  $handle = $("#handle"),
  $btn = $("#send"),
  $output = $("#output"),
  $feedback = $("#feedback"),
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

$message.on("keypress", function() {
  socket.emit("typing", $handle.val());
});

$trackBtn.on("click", function(event) {
  if ($trackSearch.val() === "") {
    return false;
  }
  console.log($trackSearch.val());
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
  console.log(data);
});
