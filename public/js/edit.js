$(document).ready(function() {
    var $profileWidget = $("#profileWidget")
    var $username = $("#user-title").attr("data-username")
    var $bioInput = $("#bio-input"),
        $picInput = $("#pic-input"),
        $albumInput = $("#album-input"),
        $submitBtn = $("#edit-submit"),
        genreString = [],
        albumId;

    $submitBtn.on("click", function (event){
        event.preventDefault();
    
        $.get("/api/spotify", {
            search: $albumInput.val().trim()
        }).then(function(response){
            albumId = response
            console.log(albumId)
            afterSpotify()
        })
    })

    function afterSpotify(){
        $(".genre-choice").each(function() {
                // console.log($(this).val())
            var genre = $(this).val()
            console.log(genre.toString())
            if ($(this).is(":checked") === true){
                console.log("check")
                genreString.push(genre.toString())
            }
        })
        console.log(genreString)
        var update = {
            username: $username,
            bio: $bioInput.val().trim(),
            genres: genreString.toString(),
            album: albumId.toString(),
            pic: $picInput.val().trim()
        }
        console.log(update)
        updateUser(update)
    }

        function updateUser(update) {
            $.ajax({
            method: "PUT",
            url: "/api/edit",
            data: update
            })
            .then(function() {
                $.get("/api/users/" + $username)
                .then(function(data){
                    console.log(data)
                    updateWidgetAlbum(data)
                    $bio.text("Bio: " + data.bio)

                })
            });
        }
        function updateWidgetAlbum(data) {
            console.log("Album: " + data.album)
            var iframe = $("<iframe>");
            iframe.attr("src", "https://open.spotify.com/embed/album/" + data.album);
            iframe.attr("frameborder", "0");
            iframe.attr("allowtransparency", "true");
            iframe.attr("allow", "encrypted-media");
            $profileWidget.html(iframe);
        }
        
})