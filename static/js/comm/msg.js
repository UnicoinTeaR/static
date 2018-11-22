var msg = {
	secs : 121,
	msgtype : 1,
	senCheckCode:[],
	sendMsgCode : function(type, tipElement_id, button_id, areaCode, phone, imgcode) {
		var that = this;
		var tipElement = document.getElementById(tipElement_id);
		var button = document.getElementById(button_id);
		if (typeof (phone) == 'undefined') {
			phone = 0;
			areaCode = 0;
		} else {
			if (!util.checkMobile(phone)) {
				util.showerrortips(tipElement_id, language["comm.error.tips.10"]);
				return;
			}
			if (type != "4"&&type != "5" && (typeof (imgcode) == 'undefined' || imgcode == "")) {
				util.showerrortips(tipElement_id, language["comm.error.tips.28"]);
				return;
			}
		}
		/*$("#" + button_id).addClass("disabled");*/
		var url = "/user/send_sms_for_registre.html?random=" + Math.round(Math.random() * 100);
		$.post(url, {
			type : type,
			msgtype : this.msgtype,
			areaCode : areaCode,
			phone : phone,
			vcode : imgcode
		}, function(data) {
			console.log(data);
			if (data.code < 0) {
				if (type == "5"||type == "2") {
					util.tipAlert(data.msg, "error");
				} else {
					util.showerrortips(tipElement_id, data.msg);
				}
				
			} else if (data.code >= 0) {
				util.hideerrortips(tipElement_id);
				button.disabled = true;
				for (var num = 1; num <= that.secs; num++) {
                    var s=window.setTimeout("msg.updateNumber(" + num + ",'" + button_id + "',2)", num * 1000);
                    msg.senCheckCode.push(s);
				}
			}
		}, "json");
	},
	cleanSenCheckCode:function () {
			for(var key in msg.senCheckCode){
				if(key && msg.senCheckCode[key]){
                	clearTimeout(msg.senCheckCode[key]);
					delete msg.senCheckCode[key];
				}
		}
    },
	updateNumber : function(num, button_id, isVoice) {
		var button = document.getElementById(button_id);
		if (num == this.secs) {
			button.innerHTML = language["comm.error.tips.33"];
			$("#" + button_id).removeClass("color_gray");
			$("#" + button_id).addClass("color_blue");
			$("#" + button_id).attr("disabled",false);
		} else {
			var printnr = this.secs - num;
			button.innerHTML = language["comm.error.tips.32"].format(printnr);
			$("#" + button_id).addClass("color_gray");
		}
	}
};
var email = {
	secs : 121,
	msgtype : 1,
	sendcode : function(type, tipElement_id, button_id, address, imgcode) {
		var that = this;
		var tipElement = document.getElementById(tipElement_id);
		var button = document.getElementById(button_id);
		if (typeof (address) == 'undefined') {
			address = 0;
		} else {
			if (!util.checkEmail(address)) {
				util.showerrortips(tipElement_id, language["comm.error.tips.13"]);
				return;
			}
		}
		var msgtype=1;
		if(type==0 || type==18){
			msgtype = 0;
		}
		var url = "/user/send_reg_email.html?random=" + Math.round(Math.random() * 100);
		$.post(url, {
			type : type,
			msgtype : msgtype,
			address : address,
			vcode : imgcode
		}, function(data) {
			if (data.code < 0) {
				util.showerrortips(tipElement_id, data.msg);
			} else if (data.code >= 0) {
				util.hideerrortips(tipElement_id);
				button.disabled = true;
				for (var num = 1; num <= that.secs; num++) {
					window.setTimeout("email.updateNumber(" + num + ",'" + button_id + "',2)", num * 1000);
				}
			}
		}, "json");
	},
	sendcodemy : function(type, tipElement_id, button_id, address, imgcode) {
		var that = this;
		var tipElement = document.getElementById(tipElement_id);
		var button = document.getElementById(button_id);
		if (typeof (address) == 'undefined') {
			address = 0;
		} else {
            if (type == "5" && !util.checkEmail(address)) {
				util.tipAlert(language["comm.error.tips.13"], "error");
				return;
			} else if (!util.checkEmail(address)) {
				util.showerrortips(tipElement_id, language["comm.error.tips.13"]);
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
					util.tipAlert(data.msg);
				else
					util.showerrortips(tipElement_id, data.msg);
			} else if (data.code >= 0) {
				util.hideerrortips(tipElement_id);
				button.disabled = true;
				$("#" + button_id).addClass("disabled");
				for (var num = 1; num <= that.secs; num++) {
				 	window.setTimeout("email.updateNumber(" + num + ",'" + button_id + "',2)", num * 1000);
				}
			}
		}, "json");
	},
	updateNumber : function(num, button_id, isVoice) {
		var button = document.getElementById(button_id);
		if (num == this.secs) {
			button.innerHTML = language["comm.error.tips.33"];
			button.disabled = false;
			$("#" + button_id).removeClass("disabled");
			$("#" + button_id).removeClass("color_gray");
			$("#" + button_id).addClass("color_blue");
		} else {
			var printnr = this.secs - num;
			button.innerHTML = language["comm.error.tips.32"].format(printnr);
			$("#" + button_id).addClass("color_gray");
		}
	},
	updateNumberRe : function(secs,num, button_id, str) {
		var button = document.getElementById(button_id);
		if (num == secs) {
			button.innerHTML = str;
			button.disabled = false;
			$("#" + button_id).removeClass("disabled");
			$("#" + button_id).removeClass("color_gray");
			$("#" + button_id).addClass("color_blue");
		} else {
			var printnr = secs - num;
			button.innerHTML = language["comm.error.tips.32"].format(printnr);
			$("#" + button_id).addClass("color_gray");
		}
	}
};