$(document).ready(function() {
  console.log("location.pathname", window.location.pathname);
  var path = window.location.pathname;
  var pathString = path.toString();
  console.log(pathString);
  var userForPage = pathString.slice(9);
  console.log(userForPage);

  $.get("/api/users/" + userForPage).then(function(data) {
    console.log(data);
    $(".member-name").text(data.username);
  });
});
