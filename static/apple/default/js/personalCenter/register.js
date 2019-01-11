var register={
    validateUserName:function(userName){
        var data = {};
        if(userName == null || userName == ""){
            data.success=false;
            data.msg=language["apple.dom.msg61"];
            return data;
        }
        if (util.checkMobile(userName) || util.checkEmail(userName)) {
            data.success=true;
            return data;
        } else{
            data.success=false;
            data.msg=language["apple.dom.msg62"];
            return data;
        }
        if(userName.length<6 || userName.length>80){
            data.success=false;
            data.msg=language["apple.dom.msg63"];
            return data;
        }
    },
    validatePassword:function(password,repassword){
        var data = {};
        if(password == null || password == "" || repassword == null || repassword == ""){
            data.success=false;
            data.msg=language["apple.dom.msg64"];
            return data;
        }
        if(password.length<6 || password.length>18){
            data.success=false;
            data.msg=language["apple.dom.msg65"];
            return data;
        }
        var newPwdTips = util.isPassword(password);
        if(newPwdTips != ""){
            data.success=false;
            data.msg=newPwdTips;
            return data;
        }
        var reNewPwdTips = util.isPassword(repassword);
        if(newPwdTips != ""){
            data.success=false;
            data.msg=reNewPwdTips;
            return data;
        }
        if (password != repassword) {
            data.success=false;
            data.msg=language["apple.dom.msg66"];
            return data;
        }
        var passwordLevel = util.passwordLevel(password);
        if (passwordLevel < 2) {
        	data.success=false;
        	data.msg=language["comm.error.tips.19"];
        	return data;
        }
        data.success=true;
        return data;
    },
    validateImageCode:function(imageCode){
    	 var data = {};
    	if (imageCode == "" || imageCode.length != 4) {
            data.success=false;
            data.msg=language["user.operation.tips.info.3"];
            return data;
        }
    	data.success=true;
    	return data;
    },
    register : function(param) {
        var url = "/register.html?random=" + Math.round(Math.random() * 100);
        $.post(url, param, function(data) {
            console.info(data);
            if(data.code == 200){
                setTimeout(function () {
                    // window.location.href ="/";
                    window.location.href = "/n/index.html";
                },500);
            }else{
                sweetAlert('', data.msg,'error');
                $("#imageCode").trigger('click');
            }
        }, "json");
    },

}
$(function(){
    //1.给图像验证码注册点击事件
    $("#imageCode").on("click",function(){
        flushImageCode(this);
    });
    function flushImageCode(img) {
        $(img).attr("src", "/servlet/ValidateImageServlet.html?r=" + Math.round(Math.random() * 100));
    };
    //2.给获取动态验证码（邮箱或者手机）按钮注册点击事件
    $("#checkcode_register").on("click", function() {
        var vb = $(".selected-flag");
        var areacode = vb.attr("title").split("+")[1];
        var userName = $("#userName").val();
        var data = register.validateUserName(userName);
        if(!data.success){
            sweetAlert('', data.msg,"error");
            return;
        }
        var imgcode = $("#J_codetext").val();
        if(userName.indexOf('@') > 0){
            msg.sendRegEmail(userName, imgcode,function(){
                $("#imageCode").click();
            });
        }else{
            msg.sendMsgCode(11, areacode, userName, imgcode);
        }
    });
    //3、设置密码强度
    $("#password").bind('input propertychange',function(){
        // alert('---------');
         //密码为八位及以上并且字母数字特殊字符三项都包括
         var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        
       //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等 
         var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
         var enoughRegex = new RegExp("(?=.{6,})", "g");
         if (strongRegex.test($(this).val())) {
             $('.mmaqdj-process').css('width','100%');
             $('.text-danger').html('高');
         } else if (mediumRegex.test($(this).val())) {
        	 $('.mmaqdj-process').css('width','66%');
             $('.text-danger').html('中');
         } else if (enoughRegex.test($(this).val())) {
        	 $('.mmaqdj-process').css('width','33%');
             $('.text-danger').html('低');
         } else {
        	 $('.mmaqdj-process').css('width','0%');
             $('.text-danger').html('低');
    	 }
         return true;
      });
    //给注册按钮注册点击事件
    $("#registerBtn").on("click",function(){
        var vb = $(".selected-flag");
        var areaCode = vb.attr("title").split("+")[1];
        var userName = $("#userName").val();
        var data = register.validateUserName(userName);
        if(!data.success){
            sweetAlert('', data.msg,"error");
            return;
        }
        var password = $("#password").val();
        var repassword = $("#repassword").val();
        data = register.validatePassword(password,repassword);
        if(!data.success){
            sweetAlert('', data.msg,"error");
            $("#password").val('');
            $("#repassword").val('');
            return;
        }
        var imageCode = $("#J_codetext").val();
        data = register.validateImageCode(imageCode);
        if(!data.success){
            sweetAlert('', data.msg,"error");
            return;
        }
        var param = {
            regName : userName,
            password : password,
            imageCode: imageCode,
            areaCode:areaCode,
            regType:0,//0手机，1邮箱
            vcode:"888888"
        };
        var messageCode = $("#messageCode").val();
        if(userName.indexOf('@') > 0){
            if(!messageCode){
                sweetAlert('请输入邮箱验证码', data.msg,"error");
                return false;
            }
            param.regType = 1;
            param.ecode = messageCode;
        }else{
            param.regType = 0;
            param.pcode = messageCode;
        }
        register.register(param);
    });
})