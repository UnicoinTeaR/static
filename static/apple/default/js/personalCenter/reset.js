var reset = {
    resetPassSubmit : function() {
        var regu = /^[0-9]{6}$/;
        var re = new RegExp(regu);
        var totpCode = 0;
        var phoneCode = 0;
        var newPassword = $("#_reset_password");
        var newPassword2 = $("#_reset_password2");
        var findType = $("#_find_type");

        var pwd = util.trim(newPassword.val());
        var msg = util.isPassword(newPassword.val());
        if (msg != "") {
            sweetAlert('',msg,"error");
            newPassword.val("");
            return;
        }
        if (newPassword.val() != newPassword2.val()) {
            sweetAlert('',language["user.operation.tips.info.5"],"error");
            newPassword2.val("");
            return;
        }

        var url = "";
        if ("email" == findType.val()) {
            // url = "/validate/reset_password_by_email.html?random=" + Math.round(Math.random() * 100);
            url = "/validate/reset_password_by_phone.html?random=" + Math.round(Math.random() * 100);
        } else if ("phone" == findType.val()) {
            url = "/validate/reset_password_by_phone.html?random=" + Math.round(Math.random() * 100);
        }
        var param = {
            totpCode : totpCode,
            phoneCode : phoneCode,
            newPassword : newPassword.val(),
            newPassword2 : newPassword2.val(),
            fid : $("#_fid").val(),
            ev_id : $("#_ev_id").val(),
            newuuid : $("#_newuuid").val()
        };
        $.post(url, param, function(data) {
            if (data.code == 200) {
                $("#resetPwdDiv").hide();
                $("#scuuessDiv").show();
            } else {
                sweetAlert('',data.msg,"error");
            }
        },"json");
    }
}
$(function(){
    // 注册提交按钮点击事件
    $("#_reset_submit").on("click", function() {
        reset.resetPassSubmit();
    });
})
