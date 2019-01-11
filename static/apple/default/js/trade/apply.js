var apply = {

    virtualRegister: function () {

        //检验用户是否登陆
        var isLogin = apply.isLogin();
        if (isLogin == 'false') {
            apply.showWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }

        //检验token是否还生效
        var token = $.getCookie('token');

        if (!token) {
            apply.showWinwow(language["apple.dom.msg94"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }

        var url = "/n/virtualUser.html";

        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token",token);
            },
            success: function (data) {
                console.info(data);
                if (data.code == 200){
                    apply.showWinwow(language["apple.dom.msg95"], "/n/virtual.html", language["apple.dom.msg96"]);
                } else if (data.code == 500){
                    apply.showWinwow(language["apple.dom.msg98"], "/n/virtual.html", language["apple.dom.msg96"]);
                } else {
                    swal( "服务器异常！建议稍后尝试...", data.msg);
                }
            }
        })

    },
    showWinwow: function (content, url, sureText) {
        swal({
                title: "",
                text: content,
                type: "warning",
                showCancelButton: true,
                confirmButtonText: sureText,
                cancelButtonText: language["apple.dom.msg17"],
                closeOnConfirm: false
            },
            function () {
                window.location.href = url;
            });
    },
    isLogin: function () {
        var isLogin = $("#login").val();
        return isLogin;
    },
}

