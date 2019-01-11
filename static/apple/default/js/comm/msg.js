var msg={
    msgtype : 1,
    sendMsgCode:function (type, areaCode, phone, imgcode) {
        if (typeof (phone) == 'undefined') {
            phone = 0;
            areaCode = 0;
        } else {
            if (!util.checkMobile(phone)) {
                sweetAlert('',language["comm.error.tips.10"],'error');
                return;
            }
            if (type != "5"&&type!="4" && (typeof (imgcode) == 'undefined' || imgcode == "")) {
                sweetAlert('',language["comm.error.tips.28"],'error');
                return;
            }
        }
        var url = "/user/send_sms_for_registre.html?random=" + Math.round(Math.random() * 100);
        $.post(url, {
            type : type,
            msgtype : this.msgtype,
            areaCode : areaCode,
            phone : phone,
            vcode : imgcode
        }, function(data) {
            if (data.code < 0) {
                if (type == "5"||type == "2") {
                    sweetAlert('',data.msg, "error");
                } else {
                    sweetAlert('', data.msg,'error');
                }
            } else if (data.code >= 0) {
                sweetAlert('', language["apple.dom.msg2"],'success');
            }
        }, "json");
    },
    sendcodemy : function(type,address, imgcode) {
        var msgtype = 1;
        if (typeof (address) == 'undefined') {
            address = 0;
        } else {
            if (type == "5" && !util.checkEmail(address)) {
                sweetAlert('',language["comm.error.tips.13"], "error");
                return;
            } else if (!util.checkEmail(address)) {
                sweetAlert('', language["comm.error.tips.13"],'error');
                return;
            }
        }
        var url = "/user/send_email_my.html?random=" + Math.round(Math.random() * 100);
        var msgtype = this.msgtype;
        if (type == "5" || type == "17") {
            msgtype = 0;
        }
        $.post(url, {
            type : type,
            msgtype : msgtype,
            address : address,
            vcode : imgcode
        }, function(data) {
            if (data.code < 0) {
                if (type == "5")
                    sweetAlert('',data.msg,'success');
                else
                    sweetAlert('', data.msg,'error');
            } else if (data.code >= 0) {
                sweetAlert('',language["apple.dom.msg2"],'success');
            }
        }, "json");
    },
    // 9找回密码
    sendMailCode:function(type,address,imgcode,call){
        var url = "/user/send_reg_email?random=" + Math.round(Math.random() * 100);
        $.post(url, {
            type : type,
            msgtype : 1,
            address : address,
            vcode : imgcode
        }, function(data) {
            if(data.code == 200){
                sweetAlert('',language["apple.dom.msg3"],'success');
            }else{
                sweetAlert('',data.msg,'error');
            }
        }, "json");
    },
    sendRegEmail:function(address,imgcode,call){
        var url = "/user/send_reg_email?random=" + Math.round(Math.random() * 100);
        $.post(url, {
            type : 3,
            msgtype : 1,
            address : address,
            vcode : imgcode
        }, function(data) {
            if(data.code == 200){
                sweetAlert('',language["apple.dom.msg3"],'success');
            }else{
                sweetAlert('',data.msg,'error');
            }
        }, "json");
    },
}