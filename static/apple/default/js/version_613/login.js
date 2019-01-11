var login = {
    login: function () {
        var url = "/login.html?random=" + Math.round(Math.random() * 100);
        var uName = $("#login-account").val();
        var pWord = $("#login-password").val();
        var rememberme = $("#login-remember").val();
        var phoneCode = $("#loginphone-msgcode").val();
        var mailCode = $("#loginphone-msgcode").val();
        var type = 0;//0：手机登录，1:邮箱登录(需要判断uName的类型来修改type的值)
        if (uName.indexOf('@') > 0) {
            type = 1;
        }
        if (!uName) {
            sweetAlert('', language["apple.dom.msg61"], 'error');
            return;
        }
        if (!pWord) {
            sweetAlert('', language["comm.error.tips.17"], 'error');
            return;
        }
        if (phoneCode == "") {
            phoneCode = 0;
            mailCode = 0;
        }
        var areacode = 0;
        var param = {
            loginName: uName,
            password: pWord,
            type: type,
            rememberme: rememberme,
            phoneCode: phoneCode,
            mailCode: mailCode,
            areacode: areacode
        };
        $.ajax({
            url: url,
            data: param,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.msg == '成功') {
                    window.location.href = "/n/index.html";
                    if ($("#login-remember").is(":checked")) {
                        $.cookie("user-name", $("#login-account").val());
                    } else {
                        $.cookie("user-name", "");
                    }
                } else {
                    $.cookie("user-name", "");
                    if (data.code == -1004) {
                        $("#validateLoginCodeDiv").show();
                        sweetAlert('', data.msg, 'error');
                    } else {
                        $("#validateLoginCodeDiv").hide();
                        sweetAlert('', data.msg, 'error');
                    }
                }
            }
        })
    },
    getLoginCheckCode: function () {
        var loginName = $("#login-account").val();
        if (!loginName) {
            sweetAlert('', language["apple.dom.msg61"], 'error');
            return;
        }
        var imageCode = $("#loginphone-imgcode").val();
        if (imageCode == "" || imageCode.length != 4) {
            sweetAlert('', language["apple.dom.msg75"], 'error');
            return;
        }
        if (loginName.indexOf('@') > 0) {
            msg.sendcodemy(1, loginName, imageCode);
        } else {
            msg.sendMsgCode(18, 0, loginName, imageCode);
        }
    },
    getLoginCheckCode: function () {
        var loginName = $("#login-account").val();
        if (!loginName) {
            sweetAlert('', language["apple.dom.msg61"], 'error');
            return;
        }
        var imageCode = $("#loginphone-imgcode").val();
        if (imageCode == "" || imageCode.length != 4) {
            sweetAlert('', language["apple.dom.msg75"], 'error');
            return;
        }
        if (loginName.indexOf('@') > 0) {
            msg.sendcodemy(1, loginName, imageCode);
        } else {
            msg.sendMsgCode(18, 0, loginName, imageCode);
        }
    },
    rememberUserName: function (t) {
        var checked = $(t).is(":checked");
        $("#login-remember").prop("checked", checked);
        if (checked) {
            $.cookie("user-name", $("#login-account").val());
        } else {
            $.cookie("user-name", "");
        }
    }
}
$(function () {
    //初始化图片验证码
    $("#LoginImageCode").on("click", function () {
        flushImageCode($(this));
    });

    function flushImageCode(img) {
        $(img).attr("src", "/servlet/ValidateImageServlet.html?r=" + Math.round(Math.random() * 100));
    };
    $("#loginphone-new-sendmessage").on("click", function () {
        login.getLoginCheckCode();
    });
    //绑定回车
    $("#login-form").keydown(function (event) {
        if (event.keyCode == 13) {
            login.login();
        }
    });
    var checked = !!$.cookie("user-name");
    $("#login-remember").prop("checked", checked);
    $("#login-account").val($.cookie("user-name"));
    $("#login-remember").on('click', function () {
        login.rememberUserName(this);
    });
})