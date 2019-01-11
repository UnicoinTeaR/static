var forgetPassword={
    findType:0,
    findPassPhone : function() {
        var phone = $("#_phone_box_phone").val();
        var certType = $("#_phone_box_certType").val();
        var certNo = $("#_phone_box_certNo").val();
        var imgcode = $("#_phone_box_imgCode").val();
        var msgcode = $("#_phone_box_smsCode").val();

        if (phone == "" || !util.checkMobile(phone)) {
            sweetAlert('',language["user.operation.tips.info.1"],"error");
            return;
        }
        if (msgcode == "" || !/^[0-9]{6}$/.test(msgcode)) {
            sweetAlert('',language["user.operation.tips.info.1"],"error");
            return;
        }
        if (imgcode == "" || imgcode.length != 4) {
            sweetAlert('',language["user.operation.tips.info.3"],"error");
            return;
        }
    	if (!util.checkCertNo(certType,certNo)) {
    		sweetAlert('',language["comm.error.tips.119"],"error");
            return;
        }

        var url = "/validate/find_passwd_by_phone.html?random=" + Math.round(Math.random() * 100);
        var param = {
            phone : phone,
            msgcode : msgcode,
            idcard : certType,
            idcardno : certNo,
            imgcode : imgcode
        };
        $.post(url, param, function(data) {
            console.info(data);
            if(data.code == 200){
               window.location.href = "/validate/reset_pass.html";
            }else{
                sweetAlert('',data.msg,"error");
            }
        },"json");
    },
    resetSuccessBox : function(display){
        if (display) {
            // 显示手机找回密码框
            $("#_reset_password_success_box").addClass("display_block");
            $(".lineLeft").addClass("greenColor");
            $(".round").addClass("greenColor");
            $(".lineRight").addClass("greenColor");
        } else {
            // 隐藏手机找回密码框
            $("#_reset_password_success_box").removeClass("display_block");
        }
    },
    findPassEmail : function(btnele) {
        var email = $("#_email_box_email").val();
        var idcard = $("#_phone_box_certType").val();
        var idcardno = $("#_phone_box_certNo").val();
        var imgcode = $("#_phone_box_imgCode").val();

        var msgcode = $("#_phone_box_smsCode").val();

        if (email == "" || !util.checkEmail(email)) {
            sweetAlert('',language["user.operation.tips.info.6"],"error");
            return;
        }
        if (msgcode == "" || !/^[0-9]{6}$/.test(msgcode)) {
            sweetAlert('',language["user.operation.tips.info.1"],"error");
            return;
        }
        if (imgcode == "" || imgcode.length != 4) {
            sweetAlert('',language["user.operation.tips.info.3"],"error");
            return;
        }

        var url = "/validate/send_findbackmailByCheckCode.html?random=" + Math.round(Math.random() * 100);
        var param = {
            email : email,
            msgcode : msgcode,
            idcard : idcard,
            idcardno : idcardno,
            imgcode : imgcode
        };
        $.post(url, param, function(data) {
        	console.info(data);
            if(data.code == 200){
                window.location.href = "/validate/reset_pass.html";
                // sweetAlert('',language["apple.dom.msg30"],'success');
            } else {
                sweetAlert('',data.msg,"error");
            }
        },"json");
    }
}
$(function(){

	$("#email_search").click(function(){
        $("#phoneName").hide();
		$("#emailName").show();
        $("#email_search_div").show();
        $("#phone_search_div").hide();
        $(".form-control-input").val('');
        forgetPassword.findType = 1;
        // $("#_phone_box_sendSmsCode_div").hide();
	})
	$("#phone_search").click(function(){
        $("#emailName").hide();
        $("#phoneName").show();
        $("#phone_search_div").show();
        $("#email_search_div").hide();
        $(".form-control-input").val('');
        forgetPassword.findType = 0;
        // $("#_phone_box_sendSmsCode_div").show();
	})

	//注册图片验证码点击事件
    $("#_img_code2").on("click",function(){
        flushImageCode(this);
    });
    function flushImageCode(img) {
        $(img).attr("src", "/servlet/ValidateImageServlet.html?r=" + Math.round(Math.random() * 100));
    };
	//给获取手机验证码按钮注册点击事件
    $("#_phone_box_sendSmsCode").on("click", function() {
        if(forgetPassword.findType == 0){
            var phone = $("#_phone_box_phone").val();
            if (!util.checkMobile(phone)) {
                sweetAlert('',language["comm.error.tips.10"],'error');
                return;
            }
            var areacode = "0";
            var imgcode = $("#_phone_box_imgCode").val();
            msg.sendMsgCode(9, 0, phone, imgcode);//发送手机验证码
		}else{
            var email = $("#_email_box_email").val();
            if (!util.checkEmail(email)) {
                sweetAlert('',language["comm.error.tips.13"],'error');
                return;
            }
            var areacode = "0";
            var imgcode = $("#_phone_box_imgCode").val();
            msg.sendMailCode(2,email, imgcode);//发送邮箱验证码
		}
    });
    //注册下一步点击事件(手机)
    $("#_phone_box_submit").on("click",function(){
        forgetPassword.findPassPhone();
    });
    //注册下一步点击事件(邮箱)
    $("#_email_box_submit").on("click",function(){
        forgetPassword.findPassEmail();
    });
})