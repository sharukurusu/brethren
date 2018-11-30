require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var spotify = new Spotify(keys.spotify);
var query = "Shattered Dreams";
test();
function test() {
  spotify.search(
    {
      type: "track",
      query: query
    },
    function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      var artistsArray = [];
      for (i = 0; i < data.tracks.items[0].artists.length; i++) {
        artistsArray.push(data.tracks.items[0].artists[i].name);
      }

      var trackData = [
        "Artist(s): " + artistsArray.join(", "),
        "Song name: " + data.tracks.items[0].name,
        "Link: " + data.tracks.items[0].external_urls.spotify,
        "Album: " + data.tracks.items[0].album.name
      ].join("\n\n");
      console.log(trackData);
    }
  );
}
