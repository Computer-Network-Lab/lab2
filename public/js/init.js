(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready

})(jQuery); // end of jQuery name space

AV.initialize("z06ful0pwqno0smjaf31sfqgsnmecr7fc3cpqhb9vxiqilvm", "qxvgd6ye1gl99jpkinor71mhbc77m9plwzoi4hrwdiy4j9rd");
$.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var faceid = $.getUrlParam("face");
var searchid = $.getUrlParam("search");
var code = $.getUrlParam("code");
var name = $.getUrlParam("name");
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
            trycount: 0,
            retryLimit: 3,
            success: function(data) {
                console.log(data.face_info[0].url);
                $('#faceImg').attr("src", data.face_info[0].url);
            },
            error: function(xhr, textStatus, errorThrown) {
                if (textStatus == 'timeout') {
                    this.trycount++;
                    if (this.trycount <= this.retryLimit) {
                        $.ajax(this);
                        return;
                    }
                    return;
                }
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
            trycount: 0,
            retryLimit: 3,
            success: function(data) {
                console.log(data.face_info[0].url);
                $('#searchImg').attr("src", data.face_info[0].url);
            },
            error: function(xhr, textStatus, errorThrown) {
                if (textStatus == 'timeout') {
                    this.trycount++;
                    if (this.trycount <= this.retryLimit) {
                        $.ajax(this);
                        return;
                    }
                    return;
                }
            }
        });
    }

    if (code != null) {
        $('.codename').html(code);
        document.title += code;
        $('#text1').html(text[code][0]);
        $('#text2').html(text[code][1]);
        $('#text3').html(text[code][2]);
    } else {
        document.title += code;
        $('.codename').html("C++");
    }

    if (name != null) {
        $('#coder').html(name);
        $('#coder').attr("href", "https://github.com/" + name);
        $('#coderImg').attr("href", "https://github.com/" + name);
    } else {
        $('#coder').html('null');
        $('#coder').attr("href", "https://github.com/null");
        $('#coderImg').attr("href", "https://github.com/null");
    }
});
$(function() {
    var UserImage = AV.Object.extend("UserImage");
    $("#imageForm").on('submit', function(e) {
        e.preventDefault();
        progressJs().setOptions({
            overlayMode: true,
            theme: 'blueOverlay'
        }).start().autoIncrease(5, 500);
        var userImage = new UserImage();
        var image = new AV.File($('#img')[0].files[0].name, $('#img')[0].files[0]);
        userImage.set("image", image);
        userImage.save();
        image.save().then(function() {
            progressJs().set(40);
            var detectParams = {
                api_secret: YOUR_API_SECRET,
                api_key: YOUR_API_KEY,
                url: userImage.get("image").thumbnailURL(500, 500),
            };
            var detect = $.ajax({
                url: detectUrl + $.param(detectParams),
                type: 'POST',
                contentType: false,
                processData: false,
                success: function(data) {
                    progressJs().set(60);
                    if (data.face.length <= 0) {
                        progressJs().end();
                        setTimeout(function(){Materialize.toast('No face recognized.', 2000);}, 500);
                        return;
                    }
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
                            progressJs().set(80);
                            if (data.candidate.length > 0) {
                                var faceid = data.candidate[0].face_id;
                                var tagarray = data.candidate[0].tag.split("\"");
                                var tagname = tagarray[1];
                                var tagcode = tagarray[3];
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
                            } else {
                                progressJs().end();
                                setTimeout(function(){Materialize.toast('No face matched', 4000);}, 500);
                                return;
                            }

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