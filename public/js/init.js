(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

var faceid = $.getUrlParam("face");
var searchid = $.getUrlParam("search");
var code = $.getUrlParam("code");
var name = $.getUrlParam("name");
(function($) {
    AV.initialize("z06ful0pwqno0smjaf31sfqgsnmecr7fc3cpqhb9vxiqilvm", "qxvgd6ye1gl99jpkinor71mhbc77m9plwzoi4hrwdiy4j9rd");
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);
$(function() {
    if (faceid != null) {
        console.log(faceid);
        var faceparam = {
            face_id: faceid,
            api_key: YOUR_API_KEY,
            api_secret: YOUR_API_SECRET
        }
        $.ajax({
            url: getFaceUrl + $.param(faceparam),
            type: 'get',
            success: function(data) {
                console.log(data.face_info[0].url);
                $('#faceImg').attr("src", data.face_info[0].url);
            },
            error: function() {
                alert("...");
            }
        });
    }

    if (searchid != null) {
        var searchparam = {
            face_id: searchid,
            api_key: YOUR_API_KEY,
            api_secret: YOUR_API_SECRET
        }
        $.ajax({
            url: getFaceUrl + $.param(searchparam),
            type: 'get',
            success: function(data) {
                console.log(data.face_info[0].url);
                $('#searchImg').attr("src", data.face_info[0].url);
            },
            error: function() {
                alert("......");
            }
        });
    }

    if (code != null) {
        $('.codename').html(code);
        $('#text1').html(text[code][0]);
        $('#text2').html(text[code][1]);
        $('#text3').html(text[code][2]);
    } else {
        $('.codename').html("C++");
    }

    if (name != null) {
        $('#coder').html(name);
        $('#coder').attr("href", "https://github.com/" + name);
    } else {
        $('#coder').html('liudangyi');
        $('#coder').attr("href", "https://github.com/liudangyi");
    }
});
$(function() {
    var UserImage = AV.Object.extend("UserImage");
    $("#imageForm").on('submit', function(e) {
        e.preventDefault();
        progressJs().setOptions({
            overlayMode: true,
            theme: 'blueOverlay'
        }).start().autoIncrease(10, 500);
        var userImage = new UserImage();
        var image = new AV.File($('#img')[0].files[0].name, $('#img')[0].files[0]);
        userImage.set("image", image);
        userImage.save();
        image.save().then(function() {
            progressJs().set(200);
            var detectParams = {
                api_secret: YOUR_API_SECRET,
                api_key: YOUR_API_KEY,
                url: userImage.get("image").url(),
            };
            var detect = $.ajax({
                url: detectUrl + $.param(detectParams),
                type: 'POST',
                contentType: false,
                processData: false,
                success: function(data) {
                    progressJs().set(300);
                    console.log(data);
                    var key_face_id = data.face[0].face_id;
                    console.log('FACESET' + FACESET);
                    var searchParams = {
                        api_secret: YOUR_API_SECRET,
                        api_key: YOUR_API_KEY,
                        key_face_id: key_face_id,
                        faceset_name: FACESET
                    };

                    var search = $.ajax({
                        url: searchUrl + $.param(searchParams),
                        type: 'get',
                        success: function(data) {
                            progressJs().set(400);
                            console.log(data);
                            var faceid = data.candidate[0].face_id;
                            var tagarray = data.candidate[0].tag.split(":");
                            var tagname = tagarray[1].split(",")[0];
                            var tagcode = tagarray[2].split("}")[0];
                            userImage.set("faceID", faceid);
                            userImage.save();
                            progressJs().end();

                            var newParams = {
                                face: key_face_id,
                                search: faceid,
                                code: tagcode,
                                name: tagname
                            }

                            window.location.href = "index.html?" + $.param(newParams);

                        },
                        error: function() {
                            //alert("ooops!!!");
                        }
                    });
                },
                error: function() {
                    //alert("ops!!!");
                }
            });
        }, function(error) {
            // Upload error
        });
    });
    $("#img").on('change', function(e) {
        $("#imageForm").submit();
    })
});