$(document).ready(function() {

    
    var $editBtn = $("#edit-profile")
    var $username = $("#user-title").attr("data-username")
    var $bio = $("#bio")

    $editBtn.on("click", function(){
        window.location.href = "/edit";
    })
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
});
