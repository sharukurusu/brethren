var socket = io.connect("http://localhost:3000");

//Query Dom

var message = $("#message"),
  handle = $("#handle"),
  btn = $("#send"),
  output = $("#output");

//Emit events

btn.on("click", function() {
  socket.emit("chat", {
    message: message.val(),
    handle: handle.val()
  });
});

//Listen for events

socket.on("chat", function(data) {
  output.append("<p><strong>" + data.handle + ": </strong>" + data.message);
});
