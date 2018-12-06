var socket = io.connect("http://localhost:3000");

//Query Dom

var $message = $("#message"),
  $handle = $("#handle"),
  $btn = $("#send"),
  $output = $("#output"),
  $feedback = $("#feedback");

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
