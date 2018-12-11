var $bioInput = $("#bio-input"),
    $picInput = $("#pic-input"),
    $albumInput = $("#album-input"),
    $submitBtn = $("#edit-submit"),
    genreString = [],
    albumId = "";

    
    $submitBtn.on("click", function (event){
        event.preventDefault();
        if($albumInput.val() !== ""){
            var albumSearched = {
                search: $albumInput.val().trim()
            }
            $.ajax({
                method: "POST",
                url: "/api/spotify",
                data: albumSearched
              }).then(function(response){
                albumId = response
                console.log(albumId)
                afterSpotify()
            })
        } else {
            afterSpotify()
        }
        
       
        // updateUser(update)

    })

    function afterSpotify(){
        $(".genre-choice").each(
            function(){
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
            window.location.href = "/members";
          });
      }