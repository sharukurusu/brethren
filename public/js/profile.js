$(document).ready(function() {
    var $username = $("#user-title").attr("data-username")
    var $bio = $("#bio")
    var $proPic = $("#proPic")
    var $editSubmit = $("#edit-submit")
    var $profileWidget = $("#profileWidget")
    var $username = $("#user-title").attr("data-username")
    var $bioInput = $("#bio-input"),
        $picInput = $("#pic-input"),
        $albumInput = $("#album-input"),
        $submitBtn = $("#edit-submit"),
        genreString = [],
        albumId;
    var $favs = $("#favs")    
    
    function renderGenres(genreString){
        $favs.empty()
        var genreArray = genreString.split(",")
        console.log(genreArray)
        genreArray.forEach(function(genre){
            var genreBlock = $("<a href='/chat' id='" + genre + "'>" + genre + "</a>")
            $favs.append(genreBlock)
        })
    }

    $.get("/api/users/" + $username)
    .then(function(data){
        renderGenres(data.favorites)
    })


    $editSubmit.on("click", function(event){
            event.preventDefault();
        
            $.get("/api/spotify", {
                search: $albumInput.val().trim()
            }).then(function(response){
                afterSpotify(response)
            })
        })
    
    function afterSpotify(response){
        var albumId = response
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
                $proPic.attr("src", data.imagePath)
                renderGenres(data.favorites)
            })
        });
    }
    function updateWidgetAlbum(data) {
        console.log("Album: " + data.favoriteAlbum)
        var iframe = $("<iframe>");
        iframe.attr("src", "https://open.spotify.com/embed/album/" + data.favoriteAlbum);
        iframe.attr("frameborder", "0");
        iframe.attr("allowtransparency", "true");
        iframe.attr("allow", "encrypted-media");
        $profileWidget.html(iframe);
    }
            
})

    // $editBtn.on("click", function(){
    //     window.location.href = "/edit";
    // })
    // $editBioSubmit.on("click", function(event){
    //     event.preventDefault()
    //     var newBio = $editBioText.val().trim()
    //     $editBioText.val("")

    //     $.ajax({
    //         method: "PUT",
    //         url: "/api/bio",
    //         data: {username: $username, bio: newBio}
    //     }).then(function(){
    //         $.get("/api/users/" + $username)
    //         .then(function(data){
    //             $bio.text("Bio: " + data.bio)
    //         })
    //     })
    // })

