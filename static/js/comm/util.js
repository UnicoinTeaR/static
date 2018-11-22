window._autoIndexmarket = window._autoIndexmarket || "0";
window._autoGetfinancial = window._autoGetfinancial || "0";
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] != undefined) {
                var reg = new RegExp("({[" + i + "]})", "g");
                result = result.replace(reg, arguments[i]);
            }
        }
    }
    return result;
};
//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
var util = util || {};
var _util = {
    ltrim: function (s) {
        return this.baseTrim(/^\s*/, s);
    },
    rtrim: function (s) {
        return this.baseTrim(/\s*$/, s);
    },
    trim: function (s) {
        return this.rtrim(this.ltrim(s));
    },
    baseTrim: function (reg, s) {
        try {
            return s.replace(reg, "");
        } catch (e) {
            console.error(e);
            return s;
        }
    },
    dateTrans: function (dateStr) {// 2017-04-09 23:59:59
        return new Date(dateStr.substr(0, 4), dateStr.substr(5, 2) / 1 - 1, dateStr.substr(8, 2), dateStr.substr(11, 2), dateStr.substr(14, 2), dateStr.substr(17, 2));
    },
    dateFormat: function (time, type) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        if (type && type == "1")
            return year + "-" + month + "-" + date;
        else if (type && type == "2")
            return hour + ":" + minute + ":" + second;
        else
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    checkStrong: function (sValue) {
        var modes = 0;
        // 正则表达式验证符合要求的
        if (sValue.length < 6)
            return modes;
        if (/\d/.test(sValue))
            modes++; // 数字
        if (/[a-z]/.test(sValue))
            modes++; // 小写
        if (/[A-Z]/.test(sValue))
            modes++; // 大写
        if (/\W/.test(sValue))
            modes++; // 特殊字符
        // 逻辑处理
        switch (modes) {
            case 1:
                return 1;
                break;
            case 2:
                return 2;
            case 3:
                return 2;
            case 4:
                return sValue.length < 10 ? 2 : 3;
                break;
        }
    },
    checkPassWord: function (pass) {
        filter = /^[a-zA-Z0-9\u0391-\uFFE5]{2,20}/;
        if (!filter.test(this.trim(pass))) {
            return false;
        } else {
            return true;
        }
    },
    checkNumber: function (num) {
        filter = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;
        if (!filter.test(this.trim(num))) {
            return false;
        } else {
            return true;
        }
    },
    checkNumberInt: function (num) {
        filter = /^-?([1-9][0-9]*|0)$/;
        if (!filter.test(this.trim(num))) {
            return false;
        } else {
            return true;
        }
    },
    checkEmail: function (email) {
        filter = /^([a-zA-Z0-9_\-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test(this.trim(email))) {
            return false;
        } else {
            return true;
        }
    },
    checkMobile: function (mobile) {
        //filter = "^\d{n}$";
//        var reg = new RegExp("^[0-9]*$");
        if(mobile.substring(0,1) == "1"){
            //说明是中国地区的
            var reg =  /^1[3|4|5|8|7][0-9]\d{8}$/;
            // /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
            // /^1[3|4|5|8|7][0-9]\d{8}$/;
            if (!reg.test(this.trim(mobile))) {
                return false;
            } else {
                return true;
            }
        }else{
            return true;
        }

    },
    checkCertNo: function (certType,certNo) {
    	//filter = "^\d{n}$";
    	var regsfz = new RegExp("^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$");
    	var reghz = new RegExp("^[a-zA-Z0-9]{3,21}$");
    	// /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
    	// /^1[3|4|5|8|7][0-9]\d{8}$/;
    	if(certNo == ""){
    		return true;
    	}
    	if (certType=="1" && !regsfz.test(this.trim(certNo))) {
    		return false;
    	} else if(certType=="2" && !reghz.test(this.trim(certNo))) {
    		return false;
    	} else{
    		return true;
    	}
    },
    callbackEnter: function (callfun) {
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                return callfun();
            }
        };
    },
    numCut: function (money, digit) {
        var left = money.toString().split(".")[0], right = money.toString().split(".")[1];
        if (right) {
            if (right.length > 3) {
                right = right.substring(0, digit);
                return (left + "." + right) * 1.0;
            }
            if (right * 1 != 0) {
                right = right.substring(0, digit);
                return (left + "." + right) * 1.0;
            }

            return money;
        } else {
            return money;
        }
    },
    numFormat: function (money, digit) {
        if (typeof (digit) == 'undefined') {
            digit = 4;
        }
        if (isNaN(money)) {
            money = 0;
        }
        money = new Number(money).toFixed(digit + 1);
        if (money != null && money.toString().split(".") != null && money.toString().split(".")[1] != null) {
            var end = money.toString().split(".")[1];
            if (end.length > digit) {
                end = end.substring(0, digit);
            } else if (end.length < digit) {
                var len = end.length;
                for (var i = 0; i < digit - len; i++) {
                    end += "0";
                }
            }
            money = money.toString().split(".")[0] + "." + end;
        } else {
            if (!money) {
                money = "0";
            }
            money = money.toString() + ".";
            for (var i = 0; i < digit; i++) {
                money += "0";
            }
        }
        if (digit == 0) {
            money = money.substring(0, money.length - 1);
        }
        return money;
    },
    //
    accAdd: function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (util.accMul(arg1, m) + util.accMul(arg2, m)) / m;
    },
    accSub: function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (util.accMul(arg1, m) - util.accMul(arg2, m)) / m;
    },
    accMul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }
        var bg = Number(s1.replace(".", "")) * Number(s2.replace(".", ""));
        var pow = Math.pow(10, m);
        return (bg / pow).toFixed(10);
    },
    accDiv: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    },
    addition: function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (util.multiplication(arg1, m) + util.multiplication(arg2, m)) / m;
    },
    subtraction: function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (util.accMul(arg1, m) - util.accMul(arg2, m)) / m;
    },
    multiplication: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    division: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    },
    formatNum1: function (value) {
        var intReg = new RegExp("^\\d+$");
        var floatReg = new RegExp("^(-?\\d+)(\\.\\d+)?$");
        var tmpValue = parseFloat(value);
        if (intReg.test(tmpValue)) {
            return tmpValue + '.00';
        } else if (floatReg.test(tmpValue)) {
            return tmpValue;
        } else {
            return '0.00';
        }
    },

    showconfirm: function (value, options) {
        var defaults = {
            title: "友情提示",
            oktxt: "确定",
            notxt: "取消",
            html: false,
            noshow: false,
            okbtn: function () {
                $('#confirmTips').modal('hide');
                return;
            },
            nobtn: function () {
                $('#confirmTips').modal('hide');
                return;
            }
        };
        var confirmsettings;
        if (typeof (options) == "undefined") {
            confirmsettings = $.extend({}, defaults, defaults);
        } else {
            confirmsettings = $.extend({}, defaults, options);
        }

        var alertHTML = '<div id="confirmTips" class="modal fade" tabindex="-1">';
        alertHTML += '<div class="modal-dialog modal-sm">';
        alertHTML += '<div class="modal-content">';
        alertHTML += '<div class="modal-header">';
        alertHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>';
        alertHTML += '<h4 class="modal-title text-danger">' + confirmsettings.title + '</h4>';
        alertHTML += '</div>';
        alertHTML += '<div class="modal-body text-danger">';
        if (confirmsettings.html) {
            alertHTML += value;
        } else {
            alertHTML += '<h6>' + value + '</h6>';
        }

        alertHTML += '</div>';
        alertHTML += '<div class="modal-footer">';
        alertHTML += '<button id="okbtn" type="button" class="btn btn-primary">' + confirmsettings.oktxt + '</button>';
        if (confirmsettings.noshow) {
            alertHTML += '<button id="nobtn" type="button" class="btn btn-default" onclick="settings.nobtn">'
                + confirmsettings.notxt + '</button>';
        }
        alertHTML += '</div>';
        alertHTML += '</div>';
        alertHTML += '</div>';
        alertHTML += '</div>';
        $('body').append(alertHTML);
        $("#okbtn", "#confirmTips").click(function () {
            confirmsettings.okbtn();
        });
        $("#nobtn", "#confirmTips").click(function () {
            try {
                confirmsettings.nobtn();
            } catch (e) {
            }
        });
        $('#confirmTips').on('hidden.bs.modal', function () {
            $('.modal-backdrop').remove();
            $('#confirmTips').remove();
            confirmsettings = {};
        });
        centerModals();
        $('#confirmTips').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
        return;
    },
    showerrortips: function (id, value, options) {
        if (id == "" && value != "") {
            var defaults = {
                title: "友情提示",
                oktxt: "确定",
                notxt: "取消",
                html: false,
                noshow: false,
                okbtn: function () {
                    $('#alertTips').modal('hide');
                    return;
                },
                nobtn: function () {
                    $('#alertTips').modal('hide');
                    return;
                }
            };
            var settings;
            if (typeof (options) == "undefined") {
                settings = $.extend({}, defaults, defaults);
            } else {
                settings = $.extend({}, defaults, options);
            }

            var alertHTML = '<div id="alertTips" class="modal fade" tabindex="-1">';
            alertHTML += '<div class="modal-dialog modal-sm" style="width:600px;">';
            alertHTML += '<div class="modal-content">';
            alertHTML += '<div class="modal-header">';
            alertHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>';
            alertHTML += '<h4 class="modal-title text-danger">' + settings.title + '</h4>';
            alertHTML += '</div>';
            alertHTML += '<div class="modal-body text-danger">';
            if (settings.html) {
                alertHTML += value;
            } else {
                alertHTML += '<h6>' + value + '</h6>';
            }

            alertHTML += '</div>';
            alertHTML += '<div class="modal-footer">';
            alertHTML += '<button id="okbtn" type="button" class="btn btn-primary">' + settings.oktxt + '</button>';
            if (settings.noshow) {
                alertHTML += '<button id="nobtn" type="button" class="btn btn-default" onclick="settings.nobtn">'
                    + settings.notxt + '</button>';
            }
            alertHTML += '</div>';
            alertHTML += '</div>';
            alertHTML += '</div>';
            alertHTML += '</div>';
            $('body').append(alertHTML);
            $("#okbtn", "#alertTips").click(function () {
                settings.okbtn();
            });
            $("#nobtn", "#alertTips").click(function () {
                try {
                    settings.nobtn();
                } catch (e) {
                }
            });
            $('#alertTips').on('hidden.bs.modal', function () {
                $('.modal-backdrop').remove();
                $('#alertTips').remove();
                settings = {};
            });
            centerModals();
            $('#alertTips').modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
            return;
        }
        if (value != "") {
            $("#" + id).html(value);
        } else {
            $("#" + id).html("");
        }
        centerModals();
    },
    hideerrortips: function (id, isall) {
        if (isall) {
            $("span.errortips").html("");
        } else {
            $("#" + id).html("");
        }
    },
    getCursortPosition: function (ctrl) {
        var CaretPos = 0; // IE Support
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    },
    goIngKeypress: function (ele, event, decimal) {
        if (typeof (decimal) == 'undefined') {
            decimal = 4;
        }
        var keyCode = event.keyCode ? event.keyCode : event.which;
        // 删除减直接返回true
        if (keyCode == 8) {
            event.returnValue = true;
        } else if (decimal == 0 && keyCode == 46) {
            event.returnValue = false;
        } else if (((keyCode < 48 && keyCode != 46) || keyCode > 57)) {
            event.returnValue = false;
        } else if (ele.value.indexOf(".") > 0 && keyCode == 46) {
            event.returnValue = false;
        } else if (this.getCursortPosition(ele) > 0 && ele.value[0] == 0 && keyCode != 46 && ele.value.length < 2) {
            event.returnValue = false;
        } else if (ele.value.length <= 0 && keyCode == 46) {
            event.returnValue = false;
        } else if (this.getCursortPosition(ele) <= 0 && keyCode == 46) {
            event.returnValue = false;
        } else if (this.getCursortPosition(ele) > ele.value.indexOf(".") && ele.value.indexOf(".") >= 0
            && (ele.value.length - ele.value.indexOf(".")) > decimal) {
            ele.value = ele.value.substring(0, ele.value.indexOf(".") + decimal);
        } else if (ele.value.length >= 16) {
            event.returnValue = false;
        } else {
            event.returnValue = true;
        }
        return event.returnValue;
    },
    recordTab: function (ele) {
        var type = ele.data().type;
        var title = "";
        var value = ele.data().value;
        if (value == 0) {
            value = 1;
            title = language["comm.error.tips.47"] + "&nbsp;+";
            $("#recordbody" + type).hide();
        } else {
            value = 0;
            title = language["comm.error.tips.48"] + "&nbsp;-";
            $("#recordbody" + type).show();
        }
        ele.data().value = value;
        ele.html(title);
    },
    isPassword: function (pwd) {
        var desc = "";
        var c = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[\\S]{6,}$");
        //var c = new RegExp("(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}");
        if (pwd == "") {
            desc = language["comm.error.tips.17"];
        } else if (pwd.length < 6) {
            desc = language["comm.error.tips.3"];
        } else if (pwd.length > 16) {
            desc = language["comm.error.tips.18"];
        } else if (!c.test(pwd)) {
            desc = language["comm.error.tips.19"];
        }
        return desc;
    },
    passwordLevel : function (password) {
        var Modes = 0;
        for (i = 0; i < password.length; i++) {
            Modes |= CharMode(password.charCodeAt(i));
        }
        return bitTotal(Modes);
     
        //CharMode函数
        function CharMode(iN) {
            if (iN >= 48 && iN <= 57)//数字
                return 1;
            if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90)) //大小写
                return 2;
            else
                return 4; //特殊字符
        }
     
        //bitTotal函数
        function bitTotal(num) {
            modes = 0;
            for (i = 0; i < 4; i++) {
                if (num & 1) modes++;
                num >>>= 1;
            }
            return modes;
        }
    },
    lrFixFooter: function (obj) {
        var footer = $(obj), doc = $(document);
        if (footer.length < 1) {
            return;
        }

        function fixFooter() {
            if (doc.height() - 4 <= $(window).height()) {
                footer.css({
                    width: "100%",
                    position: "absolute",
                    left: 0,
                    bottom: 0
                });
            } else {
                footer.css({
                    position: "static"
                });
            }
        }

        fixFooter();
        $(window).on('resize.footer', function () {
            fixFooter();
        });
        $(window).on('scroll.footer', function () {
            fixFooter();
        });
    },
    getWallet: function () {
        if ($('.navRight .userCenter').length < 1) {
            $.post("/headerMenu.html?random=" + Math.round(Math.random() * 100), {}, function (data) {
                $('#bannerConter').html($('<div>').html(data).find('#bannerConter').html());
                var _mouseover = function () {
                    if ($(".userCenter .topUserInfo").css("display") == 'none') {
                        util.getFinancial();
                    }
                    $(".userCenter .topUserInfo").show();
                };
                $(".userCenter").on("mouseover", _mouseover).on("mouseleave", function () {
                    $(".userCenter .topUserInfo").hide();
                });
                $("#fnickname_userCenter").hide().show(600);
                $(".goUserOut").on("click", function () {
                    window.location.href = "/user/logout.html";
                });
            }, "html");
        }
        var url = "/user/myWallets.html?random=" + Math.round(Math.random() * 100);
        /**
         $.post(url, {}, function(data) {
			if (data.code < 0) {
				util.showerrortips("login-errortips", data.msg);
				$("#login-password").val("");
			} else if($('.grossAssetWattet').length > 0) {
				if (data.data.fuserVirtualwallets) {
					$('.grossAssetWattet').empty();
					$('#list-wallet').tmpl({
						wallets : data.data.fuserVirtualwallets
					}).appendTo($('.grossAssetWattet'));
					$(".bannerText_right_content ul,.bannerText_right_title").hide();
					$(".bannerText_right_content_wallet").show();
					$(".loginname").html(data.data.loginname);
					$(".grossAsset").html(util.numFormat(data.data.grossAsset, 2) + " CNYT");
				}
				if (data.data.loginname) {
					$("#fnickname_userCenter span:eq(0)").html(
							'<a href="/user/security.html" style="color:#07abc8;"><i class="usericon"></i>'
									+ data.data.nickname + '</a>');
					$("#fnickname_userCenter").show();
				}
				login.fixedCss();
			}
		}, "json");
         */
    },
    tipAlert: function (content, tipType, time, shade, callback) {
        time = time || 2000;
        tipType = tipType || "success";
        shade = shade || "inline-block";
        var sec = util.accDiv(time, 1000);
        console.log(sec);
        $("body .tip_alert").each(function () {// 防止刪除个人中心的一些弹框
            if (!$(this).attr("id")) {
                $("body .tip_alert").remove();
            }
        });
        var str = '<div class="tip_alert"> <div class="tip_message"><i class="tip_close success"></i><div class="tip_info">'
            + '<span class="tip_message_icon '
            + tipType
            + '"></span><span>'
            + content
            + '</span><span><i class="sec" style="font-style:normal;">'
            + sec
            + '</i>s'
            + language["comm.tips.message.1"]
            + '</span></div></div><div class="tip_shade" style="display:'
            + shade
            + '"></div></div>';
        $(str).appendTo("body");
        var secid = window.setInterval(function () {
            sec--;
            if (sec <= 0) {
                window.clearInterval(secid);
                $('body .tip_alert').hide();
                if (callback) {
                    callback();
                }
            }
            $("body .tip_alert .sec").html(sec);
        }, 1000);
        $("body .tip_alert").on("click", function () {
            $('body .tip_alert').hide();
            if (callback) {
                callback();
            }
        });
    },
    tipConfirm: function (content, okText, noText, callbackOK, callbackNo, shade) {

        shade = shade || "inline-block";
        $("body .tip_alert").remove();
        var str = '<div class="tip_alert">	<div class="tip_message" style="min-height: 170px;"><i class="tip_close success"></i><div class="tip_info"><div class="alertContent" style="padding-bottom: 15px;position: relative;">'
            + '<div class="listContPage  clearfix" style="margin-top:0px; margin-bottom: 20px; margin-left:0px;">'
            + '<span id="delete-tip-text-id" class="spanTextSec" style="margin-top:8px;margin-left: 0px; text-align: center;line-height: 38px;width: 100%; display: block">'
            + content
            + '</span>'
            + '</div><div class="btnPage listContPage" style="margin:0 auto;">	<div class="btnTow clearfix">'
            + '<div id="ok-delete-btn-id" class="btnPage1 fl" style="cursor: pointer;width: 30%;margin-left: 15%;">'
            + okText
            + '</div>'
            + '<div id="cancel-delete-btn-id" class="btnPage2 fr" style="cursor: pointer;width: 30%;margin-right: 15%;">'
            + noText + '</div>' + '</div></div></div></div></div><div class="tip_shade"></div></div>';
        $(str).appendTo("body");
        $("body .tip_alert").on("click", function () {
            $('body .tip_alert').hide();
            if (callbackNo) {
                callbackNo();
            }
        });
        $("body .tip_alert #ok-delete-btn-id").on("click", function () {
            $('body .tip_alert').hide();
            if (callbackOK) {
                callbackOK();
            }
        });
        $("body .tip_alert #cancel-delete-btn-id").on("click", function () {
            $('body .tip_alert').hide();
            if (callbackNo) {
                callbackNo();
            }
        });
    },
    tipConfirm_noclose: function (content, okText, noText, callbackOK, callbackNo, shade) {

        shade = shade || "inline-block";
        $("body .tip_alert").remove();
        var str = '<div class="tip_alert">	<div class="tip_message" style="min-height: 170px;"><i class="tip_close success" style="display:none;"></i><div class="tip_info" style="margin-top: 35px;"><div class="alertContent" style="padding-bottom: 15px;position: relative;">'
            + '<div class="listContPage  clearfix" style="margin-top:0px; margin-bottom: 20px; margin-left:0px;">'
            + '<span id="delete-tip-text-id" class="spanTextSec" style="margin-top:8px;margin-left: 0px; text-align: center;line-height: 38px;width: 100%; display: block">'
            + content
            + '</span>'
            + '</div><div class="btnPage listContPage" style="margin:0 auto;">	<div class="btnTow clearfix">'
            + '<div id="ok-delete-btn-id" class="btnPage1 fl" style="cursor: pointer;width: 30%;margin-left: 15%;">'
            + okText
            + '</div>'
            + '<div id="cancel-delete-btn-id" class="btnPage2 fr" style="cursor: pointer;width: 30%;margin-right: 15%;">'
            + noText + '</div>' + '</div></div></div></div></div><div class="tip_shade"></div></div>';
        $(str).appendTo("body");
        $("body .tip_alert").on("click", function () {
            $('body .tip_alert').hide();
            if (callbackNo) {
                callbackNo();
            }
        });
        $("body .tip_alert #ok-delete-btn-id").on("click", function () {
            if (callbackOK) {
                callbackOK();
            }
            $('body .tip_alert').hide();
        });
        $("body .tip_alert #cancel-delete-btn-id").on("click", function () {
            if (callbackNo) {
                callbackNo();
            }
            $('body .tip_alert').hide();
        });
    },
    tipLoading: function (message, staticurl) {
        if (!message) {
            message = '页面加载中，请等待...';
        }
        console.log(staticurl);
        if (staticurl) {
            staticurl = 'static';
        }
        var _PageHeight = document.documentElement.clientHeight, _PageWidth = document.documentElement.clientWidth;
        // 计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
        var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
            _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2
                : 0;
        // 在页面未加载完毕之前显示的loading Html自定义内容
        var _LoadingHtml = '<div id="loadingDiv" style="position:fixed;left:0;width:100%;height:'
            + _PageHeight
            + 'px;top:0;background:rgba(255,255,255,0.3);filter:alpha(opacity=50);z-index:10000;">'
            + '<div style="position: absolute; cursor1: wait; left: '
            + _LoadingLeft
            + 'px; top:'
            + _LoadingTop
            + 'px; width: auto; height: 50px; line-height: 50px; padding-left: 50px; padding-right: 5px; background: #fff url(' + staticurl + '/front/img/loading.gif) no-repeat scroll 5px 10px; border: 2px solid #95B8E7; color: #696969; font-family:\'Microsoft YaHei\';">'
            + message + '</div></div>';
        // 呈现loading效果
        $('body').append(_LoadingHtml);
    },
    closeLoading: function () {
        $("#loadingDiv").remove();
    },
    getFinancial: function () {
        if (window._autoGetfinancial == "1" || (window.parent && window.parent._autoGetfinancial == "1")) {
            return;
        }
        jQuery.post("/real/getfinancial", null, function (data) {
            if (data.leveritem) {
                if (data.leveritem.score)
                    $(".topUserInfo .userscore").html(language["comm.tips.top.info.1"] + "：" + data.leveritem.score);
                if (data.leveritem.uid)
                    $(".topUserInfo .useruid").html("UID:" + data.leveritem.uid);
                if (data.leveritem.loginname)
                    $(".topUserInfo .userloginname").html(data.leveritem.loginname);
                if (data.leveritem.total)
                    $(".topUserInfo .userfinancialTotal span").css("color", "#f49e28").html(
                        util.numFormat(data.leveritem.total, 2) + " CNYT");
            }
            if (data.fuserVirtualwallets) {
                var str = "";
                var wallet;
                for (var i = 0; i < data.fuserVirtualwallets.length; i++) {
                    wallet = data.fuserVirtualwallets[i];
//					if (wallet && wallet.fshortname && wallet.fshortname != "SWC" && wallet.fshortname != "LTC"&& wallet.fshortname != "ZEC") {
                    if (wallet && wallet.fshortname && wallet.fshortname != "SWC") {
                        if (wallet.fshortname == "CNYT") {
                            str += '<ul><li>' + wallet.fshortname + '</li><li style="color:#f49e28;">'
                                + util.numFormat(wallet.ftotals, 2) + '</li><li>' + util.numFormat(wallet.ffrozens, 2)
                                + '</li></ul>';
                        } else {
                            var frozen = util.numFormat(wallet.ffrozens * 1.0 + wallet.flock || 0, 8);
                            str += '<ul><li>' + wallet.fshortname + '</li><li style="color:#f49e28;">'
                                + util.numFormat(wallet.ftotals, 8) + '</li><li>' + frozen + '</li></ul>';
                        }
                    }
                }
                if (str != "") {
                    $(".userfinancial_detail div").html(str);
                }
            }
            /*
             * if (data.win_btc_new) { var oldm = $(".win_btc").html(); if
             * (data.win_btc_new && (data.win_btc_new == "--" ||
             * parseFloat(data.win_btc_new) <= 0)) { $(".win_btc").html("--"); }
             * else { $(".win_btc").html("฿" + data.win_btc_new); } if
             * (data.is_increase) {
             * $(".win_btc").next().removeClass("greenJtSy").addClass("RedConSy"); }
             * else {
             * $(".win_btc").next().removeClass("RedConSy").addClass("greenJtSy"); } }
             */
            if (data.height) {
                var oldh = $(".etc_height").html();
                if (data.height && oldh != undefined && oldh != "" && parseFloat(oldh) > data.height) {
                    $(".etc_height").next().removeClass("RedConSy").addClass("greenJtSy");
                } else {
                    $(".etc_height").next().removeClass("greenJtSy").addClass("RedConSy");
                }
                $(".etc_height").html(data.height);
            }
            if (data.hash_rate) {
                var oldr = $(".etc_hash_rate").html();
                if (data.hash_rate && oldr != undefined && oldr != "" && parseFloat(oldr) > data.hash_rate) {
                    $(".etc_hash_rate").next().removeClass("RedConSy");
                    $(".etc_hash_rate").next().addClass("greenJtSy");
                } else {
                    $(".etc_hash_rate").next().removeClass("greenJtSy");
                    $(".etc_hash_rate").next().addClass("RedConSy");
                }
                $(".etc_hash_rate").html(data.hash_rate);
            }

            var oldy = $(".etc_yest").html();
            if (data.etc_yest && oldy != undefined && oldy != "" && parseFloat(oldy) > data.etc_yest) {
                $(".etc_yest").next().removeClass("RedConSy").addClass("greenJtSy");
            } else {
                $(".etc_yest").next().removeClass("greenJtSy").addClass("RedConSy");
            }
            $(".etc_yest").html(util.numFormat(data.etc_yest, 2));

        }, "json");
    },
    getHeader: function () {
        if (window._autoIndexmarket == "1" || (window.parent && window.parent._autoIndexmarket == "1")) {
            return;
        }
        $.ajax({
            url: "/real/indexmarket?random=" + Math.round(Math.random() * 100),
            type: "GET",
            contentType: 'application/json',
            success: function (data) {
                if (data.data != null) {
                    var m_m = function (m_dui, mdui) {
                        if (m_dui) {
                            if ($("." + mdui) && $("." + mdui).prev() && $("." + mdui).prev().html()) {
                                $("." + mdui).prev().html($("." + mdui).prev().html().replace(' / ', '/'));
                            }
                            if (!m_dui) {
                                $("." + mdui).html("0.00000000");
                            } else if (!m_dui.price) {
                                $("." + mdui).html("0.00000000");
                            } else {
                                $("." + mdui).html(" " + (mdui.indexOf('cny') == -1 ? m_dui.price : util.numFormat(m_dui.price, 2)));
                            }

                            if (m_dui.is_increase) {
                                $("." + mdui).removeClass("colorGreen");
                                $("." + mdui).addClass("colorRed");
                                $("." + mdui).next().removeClass("greenJtSy").addClass("RedConSy");
                                $('#H_ltcLastPrice').removeClass("text-second");
                                $('#H_ltcLastPrice').parent().next().next().removeClass("greenJtSy").addClass("RedConSy").removeClass("greenJtSy_index").addClass("RedConSy_index");
                            } else {
                                $("." + mdui).removeClass("colorRed");
                                $("." + mdui).addClass("colorGreen");
                                $("." + mdui).next().removeClass("RedConSy").addClass("greenJtSy");
                                $('#H_ltcLastPrice').addClass("text-second");
                                $('#H_ltcLastPrice').parent().next().next().removeClass("RedConSy").addClass("greenJtSy").removeClass("RedConSy_index").addClass("greenJtSy_index");
                            }

                            if (!m_dui.rose || (m_dui.rose && m_dui.rose / 1 >= 0)) {
                                $("." + mdui).parent().find(".trade_rose_reduce").hide();
                                $("." + mdui).parent().find(".trade_rose_add").html(m_dui.rose ? "+" + m_dui.rose + "%" : "+0.00%").show();
                            } else {
                                $("." + mdui).parent().find(".trade_rose_add").hide();
                                $("." + mdui).parent().find(".trade_rose_reduce").html(m_dui.rose ? m_dui.rose + "%" : "+0.00%").show();
                            }
                            $('#H_ltcLastPrice').html(m_dui.price).parent().parent().find('.hss').html('¥' + m_dui.p_new_to_cnyt + '/$' + (m_dui.p_new_to_usdt || '0.00'));
                        } else {
                            $("." + mdui).html("0.00000000");
                        }
                    }

                    for (var key in data.data) {
                        m_m(data.data[key], key);
                    }

                    // m_m(data,'win_btc');
                    // m_m(data,'etc_btc');
                    // m_m(data,'etc_eth');
                    // m_m(data,'dwc_btc');
                    // m_m(data,'dash_btc');
                    // m_m(data,'sc_btc');
                    // m_m(data,'dcr_btc');
                    // m_m(data,'xmr_btc');
                    // m_m(data,'game_btc');
                    // m_m(data,'brw_etc');
                    // m_m(data,'btc_cnyt');
                    // m_m(data,'btm_cnyt');
                    // m_m(data,'btm_btc');
                    // m_m(data,'dwc_cny');
                    // m_m(data,'dwc_cnyt');
                    // m_m(data,'bts_btc');
                    // m_m(data,'etc_cnyt');
                    // m_m(data,'sc_cnyt');
                    // m_m(data,'dcr_cnyt');
                    // m_m(data,'bts_cnyt');

                    if (data.data.zec_btc) {
                        var zec_btc = data.data.zec_btc;
                        if ($(".zec_btc") && $(".zec_btc").prev() && $(".zec_btc").prev().html()) {
                            $(".zec_btc").prev().html($(".zec_btc").prev().html().replace(' / ', '/'));
                        }
                        if (!zec_btc) {
                            $(".zec_btc").html("--");
                        } else if (!zec_btc.price) {
                            $(".zec_btc").html("--");
                        } else {
                            $(".zec_btc").html(" " + zec_btc.price);
                        }

                        if (zec_btc.is_increase) {
                            $(".zec_btc").next().removeClass("greenJtSy").addClass("RedConSy");
                        } else {
                            $(".zec_btc").next().removeClass("RedConSy").addClass("greenJtSy");
                        }

                        if (!zec_btc.rose || (zec_btc.rose && zec_btc.rose / 1 >= 0)) {
                            $(".zec_btc").parent().find(".trade_rose_reduce").hide();
                            $(".zec_btc").parent().find(".trade_rose_add").html(
                                zec_btc.rose ? "+" + zec_btc.rose + "%" : "+0.00%").show();
                        } else {
                            $(".zec_btc").parent().find(".trade_rose_add").hide();
                            $(".zec_btc").parent().find(".trade_rose_reduce").html(
                                zec_btc.rose ? zec_btc.rose + "%" : "+0.00%").show();
                        }
                    } else {
                        $(".zec_btc").html("--");
                    }

                    if (data.data.ltc_btc) {
                        var ltc_btc = data.data.ltc_btc;
                        if ($(".ltc_btc") && $(".ltc_btc").prev() && $(".ltc_btc").prev().html()) {
                            $(".ltc_btc").prev().html($(".ltc_btc").prev().html().replace(' / ', '/'));
                        }
                        if (!ltc_btc) {
                            $(".ltc_btc").html("--");
                        } else if (!ltc_btc.price) {
                            $(".ltc_btc").html("--");
                        } else {
                            $(".ltc_btc").html(" " + ltc_btc.price);
                        }

                        if (ltc_btc.is_increase) {
                            $(".ltc_btc").next().removeClass("greenJtSy").addClass("RedConSy");
                        } else {
                            $(".ltc_btc").next().removeClass("RedConSy").addClass("greenJtSy");
                        }

                        if (!ltc_btc.rose || (ltc_btc.rose && ltc_btc.rose / 1 >= 0)) {
                            $(".ltc_btc").parent().find(".trade_rose_reduce").hide();
                            $(".ltc_btc").parent().find(".trade_rose_add").html(
                                ltc_btc.rose ? "+" + ltc_btc.rose + "%" : "+0.00%").show();
                        } else {
                            $(".ltc_btc").parent().find(".trade_rose_add").hide();
                            $(".ltc_btc").parent().find(".trade_rose_reduce").html(
                                ltc_btc.rose ? ltc_btc.rose + "%" : "+0.00%").show();
                        }
                    } else {
                        $(".ltc_btc").html("--");
                    }
                } else {

                }
            },
            error: function (data) {
            }
        });
    },

    getPageDom: function (currentPage, total, id, cb) {
        var dom = [];
        currentPage = parseInt(currentPage);
        dom.push('<li data-index=1><a><</a></li>');
        if (currentPage == 1) {
            dom.push('<li class="active" data-index=1><a>1</a></li>');
        } else {
            dom.push('<li data-index=1><a>1</a></li>');
        }
        if (currentPage == 2) {
            dom.push('<li class="active" data-index=2><a>2</a></li>');
        } else if (total >= 2) {
            dom.push('<li data-index=2><a>2</a></li>');
        }
        if (currentPage >= 7) {
            dom.push('<li><a>...</a></li>');
        }
        // 前三页
        var begin = currentPage - 3;
        begin = begin <= 2 ? 3 : begin;
        for (var i = begin; i < currentPage; i++) {
            dom.push('<li data-index=' + i + '><a>' + i + '</a></li>');
        }
        if (currentPage != 1 && currentPage != 2) {
            dom.push('<li class="active" data-index=' + currentPage + '><a>' + currentPage + '</a></li>');
        }
        // 后三页
        begin = currentPage + 1;
        begin = begin <= 2 ? 3 : begin;
        var end = currentPage + 4;
        if (currentPage < 6) {
            var tInt = 6 - currentPage;
            end = end + ((tInt > 3 ? 3 : tInt));
        }
        for (var i = begin; i < end && i <= total; i++) {
            dom.push('<li data-index=' + i + '><a>' + i + '</a></li>');
        }
        if (total - currentPage > 6) {
            dom.push('<li><a>...</a></li>');
        }
        if (total >= 11 && total - currentPage > 4) {
            dom.push('<li data-index=' + total + '><a>' + total + '</a></li>');
        }
        dom.push('<li data-index=' + total + '><a>></a></li>');
        $("#" + id).off("click", "li");
        $("#" + id).on("click", "li", function () {
            var page = $(this).attr("data-index");
            if (page == currentPage) return;
            cb.call(null, page);
        });
        $("#" + id).html(dom.join(''));
    },
    getPageDom1: function (currentPage, total, id, cb) {
        var dom = [];
        currentPage = parseInt(currentPage);
        dom.push('<li data-index=1><</li>');
        if (currentPage == 1) {
            dom.push('<li class="active" data-index=1>1</li>');
        } else {
            dom.push('<li data-index=1>1</li>');
        }
        if (currentPage == 2) {
            dom.push('<li class="active" data-index=2>2</li>');
        } else if (total >= 2) {
            dom.push('<li data-index=2>2</li>');
        }
        if (currentPage >= 7) {
            dom.push('<li>...</li>');
        }
        // 前三页
        var begin = currentPage - 3;
        begin = begin <= 2 ? 3 : begin;
        for (var i = begin; i < currentPage; i++) {
            dom.push('<li data-index=' + i + '>' + i + '</li>');
        }
        if (currentPage != 1 && currentPage != 2) {
            dom.push('<li class="active" data-index=' + currentPage + '>' + currentPage + '</li>');
        }
        // 后三页
        begin = currentPage + 1;
        begin = begin <= 2 ? 3 : begin;
        var end = currentPage + 4;
        if (currentPage < 6) {
            var tInt = 6 - currentPage;
            end = end + ((tInt > 3 ? 3 : tInt));
        }
        for (var i = begin; i < end && i <= total; i++) {
            dom.push('<li data-index=' + i + '>' + i + '</li>');
        }
        if (total - currentPage > 6) {
            dom.push('<li>...</li>');
        }
        if (total >= 11 && total - currentPage > 4) {
            dom.push('<li data-index=' + total + '>' + total + '</li>');
        }
        dom.push('<li data-index=' + total + '>></li>');
        $("#" + id).off("click", "li");
        $("#" + id).on("click", "li", function () {
            var page = $(this).attr("data-index");
            if (page == currentPage) return;
            cb.call(null, page);
        });
        $("#" + id).html(dom.join(''));
    },
    hasDot: function (num) {
        if (!isNaN(num)) {
            return ((num + '').indexOf('.') != -1) ? true : false;
        }
        return false;
    },
    removeLastZero :function(num){
    	if(num && num.indexOf('.') != -1){
	    	var numOpposite = num.split("").reverse().join("");
	    	var numSub = numOpposite.substring(0,4).replace(/\b(0+)/gi,"");
	    	var returnNum =  (numSub + numOpposite.substr(4)).split("").reverse().join("");
	    	return returnNum;
    	}
    	return num;
    },
    //自定义加法运算
    addNum : function (num1, num2) {
    	 var sq1,sq2,m;
    	 try {
    	  sq1 = num1.toString().split(".")[1].length;
    	 }
    	 catch (e) {
    	  sq1 = 0;
    	 }
    	 try {
    	  sq2 = num2.toString().split(".")[1].length;
    	 }
    	 catch (e) {
    	  sq2 = 0;
    	 }
    	 m = Math.pow(10,Math.max(sq1, sq2));
    	 return (num1 * m + num2 * m) / m;
	},
	removeElement: function(_element){
        var _parentElement = _element.parentNode;
        if(_parentElement){
               _parentElement.removeChild(_element);
        }
	}
};
if (util && util.globalurl) {
    _util.globalurl = util.globalurl;
    _util.virtualCoinTypeConfirm = util.virtualCoinTypeConfirm;
    _util.virtualCoinTypeUrl = util.virtualCoinTypeUrl;
    _util.fixedNum = util.fixedNum;
}
window.util = _util;
