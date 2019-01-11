Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
var trade = {
    tradeType: 0,
    askScrollBox_h: $("#askScrollBox").height(),
    bidScrollBox_h: $("#bidScrollBox").height(),
    isclinch: 0,
    pswlimit: 2,
    leftcur: '',
    right: "",
    //获取委单数据
    currentPage: 1,
    currentType: 0,
    /*保存用户可买可卖*/
    buysell_obj: {
        canbuy: 0,
        cansell: 0
    },
    /*委托单切换按钮开关*/
    issueTabOnoff: true,
    maxIssueNumber:0,
    maxRedeemNumber:0,
    canbuyuse: 0,
    canselluse: 0,
    currentCoinName: null,
    isCoinTab: true,
    rightCoinName: $("#rightCoinName").val(),
    demical: '0.00000001',
    /*折合*/
    type: 0,
    currentCoinTabName: "",
    // 保存几位小数
    retainDemical: function (val, few) {
        var str = val.toString();
        var index = str.indexOf('.');
        if (index != -1) {
            var newstr = str.slice(0, index + few);
            return newstr
        } else {
            return val
        }
    },
    /*判断输入是否有误*/
    judgeform: function (obj) {
        obj.keyup(function (e) {
            var con = e.keyCode;
            var str = $(this).val();
            var arr_point = [];
            var end_point = false;
            var hasother = false;
            for (var i = 0; i < str.length; i++) {
                if (str[i] == ".") {
                    arr_point.push(i);
                } else if (str[i] == "。") {
                    end_point = true;
                } else if (isNaN(str[i])) {
                    hasother = true;
                }
            }
            if (hasother || arr_point.length > 1 || end_point) {
                str = "";

            } else if (str[0] == ".") {
                str = "";

            } else if (str[0] == 0 && str[1] != "." && str[1] != null) {
                str = "";

            }
            $(this).val(str);
        })
    },
    /*求数组最大值*/
    search_max: function (arr) {
        return Math.max.apply(null, arr);
    },
    amounArr: function (buydata, selldata) {
        var amount_buyarr = [];
        var amount_sellarr = [];
        $.each(buydata, function (index, item) {
            amount_buyarr.push(item.amount);
        });
        $.each(selldata, function (index, item) {
            amount_sellarr.push(item.amount)
        });
        var obj = {
            buyAmount: amount_buyarr,
            sellAmount: amount_sellarr
        }
        return obj
    },
    /*获取期权钱包信息*/
    initOptionWallet: function () {
        $.ajax({
            type: 'post',
            url: "/v/option/getOptionWalletExchangeBySymbol?" + Math.round(Math.random() * 100),
            dataType: 'json',
            data: {
                symbol: $("#fcode").val(),
            },
            success: function (data) {
                if (data.code==200) {
                    //处理数据
                    trade.handleOptionWallet(data);
                }
            }
        })
    },
    getDishHandsDom: function (index, isbuy) {
        if (isbuy) {
            $("#buy-dish-hands").append("<li class='green'>" + language["apple.dom.msg9"] + (index * 1 + 1) + "</li>");
        } else {
            $("#sell-dish-hands").append("<li class='ryhot'>" + language["apple.dom.msg10"]+ (index * 1 + 1) + "</li>");
        }
    },
    /**
     * 处理期权钱包
     */

    handleOptionWallet: function (data) {
    	
    	//生成期权钱包数据
        	var optionWalletItem = data.data.optionsWallet;
        	var objectWalletItem = data.data.objectWallet;
        	var chargeWalletItem = data.data.chargeUnitWallet;
        	var total = optionWalletItem.ftotal + optionWalletItem.ffrozen + optionWalletItem.flock;
        	var optionItem = data.data.option;
        	var optionsType = optionItem.optionsType;
            var rate = optionItem.rate;
            var chargeUnitPercent = optionItem.chargeUnitPercent;
            var price = optionItem.price;
            
//            if (total == 0) {
//                option_dom.push('<div class="tr zeroTr">');
//            } else {
//                option_dom.push('<div class="tr">');
//            }
            
            /*币种*/
            $("#p_options").text(optionWalletItem.fshortname);
            /*总数*/
            $("#p_totalcoin").text(common.retainDemical(optionWalletItem.ftotal + optionWalletItem.ffrozen + optionWalletItem.flock, 9));
            /*发行总量*/
            $("#p_redeemtotal").text(common.retainDemical(optionWalletItem.fredeemable, 9));
            /*可赎回量 取可用和发行总量中小的一个*/
            if(optionWalletItem.fredeemable<optionWalletItem.ftotal){
            	$("#p_redeemable").text(common.retainDemical(optionWalletItem.fredeemable, 9));
            	trade.maxRedeemNumber = optionWalletItem.fredeemable;
            }else{
            	$("#p_redeemable").text(common.retainDemical(optionWalletItem.ftotal, 9));
            	trade.maxRedeemNumber = optionWalletItem.ftotal;
            }
            /*可用*/
            $("#p_useamount").text(common.retainDemical(optionWalletItem.ftotal, 9));
            /*冻结*/
            $("#p_freeze").text(common.retainDemical(optionWalletItem.ffrozen, 9));
            
            if(optionsType=="call"){
            	/*抵押币名称*/
            	$("#objectCoinName").text(language["apple.dom.msg71"]+objectWalletItem.fshortname+":"+objectWalletItem.ftotal);
            	//最大发行数量计算公式 如BTC看涨期权，BTC数量*rate*chargeUnitPercent/100,如BTC看跌期权，USDT数量*rate*chargeUnitPercent/100/price
                trade.maxIssueNumber = Math.floor(objectWalletItem.ftotal*rate*chargeUnitPercent/100);
            }else{
            	$("#objectCoinName").text(language["apple.dom.msg71"]+chargeWalletItem.fshortname+":"+chargeWalletItem.ftotal);
            	trade.maxIssueNumber = Math.floor(chargeWalletItem.ftotal*rate*chargeUnitPercent/100/price);
            }
            $("#canIssueNumber").text(language["apple.dom.msg104"]+":"+trade.maxIssueNumber);
            
            var rightCoinWalletItem = data.data.fUserVirtualWallet_right;
            
            

    },
    issueinput: function () {
        var amount = $("#issue-number");

        //判断相乘是否为NAN
        if ( !amount.val()) {
        	$("#issue-number").val("");
            return
        }
        if(amount.val()<1||amount.val()>10000||amount.val()>trade.maxIssueNumber){
        	$("#issue-number").val("");
            return
        }

    },
    redeeminput: function () {
        var amount = $("#redeem-number");

        //判断相乘是否为NAN
        if ( !amount.val()) {
        	$("#redeem-number").val("");
            return
        }
        if(amount.val()<1||amount.val()>10000||amount.val()>trade.maxRedeemNumber){
        	$("#redeem-number").val("");
            return
        }

    },
    sellinput: function () {
        var price = $("#sell-price");
        var amount = $("#sell-amount");
        var volume = $("#sell-volume");
        if (price.val() && amount.val()) {
            //判断相乘是否为NAN
            if (price.val() * amount.val() != price.val() * amount.val()) {
                volume.text(0);
                return
            } else if (price.val() * 1 > 10000000000) {
                return
            }
            /*计算成交额*/
            volume.text(_util.numFormat(price.val() * amount.val(), 8));
            /*滚动条*/
            trade.sellscrollchange(amount);
        } else {
            volume.text(0);
            $('#sell-slider').find('.ui-slider-handle').css('left', 0);
            $('#sell-slider').find('.ui-slider-range').css("width", 0);
        }
    },
    sellamount: function () {
        var price = $("#sell-price");
        var amount = $("#sell-amount");
        var volume = $("#sell-volume");
        if (price.val() && amount.val()) {
            //判断相乘是否为NAN
            if (price.val() * amount.val() != price.val() * amount.val()) {
                volume.text(0);
            } else {
                volume.text(_util.numFormat(price.val() * amount.val(), 8));
            }
            /*计算滚动条*/
            trade.sellscrollchange(amount)
            if (amount.val() * 1 > trade.canselluse * 1) {
                /*卖出数量为可用*/
                amount.val(_util.numFormat(trade.canselluse, 3));
                /*重新计算成交额*/
                volume.text(_util.numFormat(price.val() * amount.val(), 8));
                /*滚动条*/
                trade.sellscrollchange(amount)
            }
        } else {
            $("#sell-volume").text(0);
            $('#sell-slider').find('.ui-slider-handle').css('left', 0);
            $('#sell-slider').find('.ui-slider-range').css("width", 0)
        }
    },

    /*最新成交*/
    newDeal: function (trades) {
        var successtradeTr = $(".successtrade");
        var i = 1;
        var tbody = $("#newdeal-wrapper");
        $.each(trades, function (index, item) {
            var needappend = true;
            for (var j = 0; j < successtradeTr.length; j++) {
                firstTime = $(successtradeTr[j]).data().time;
                firstAmount = $(successtradeTr[j]).data().amount;
                firstPrice = $(successtradeTr[j]).data().price;
                if (item.time == firstTime && item.amount == firstAmount && item.price == firstPrice) {
                    needappend = false;
                    break;
                }
            }
            if (needappend) {
                var tr = $("<div class='newdeal-tr successtrade' data-time='" + item.time + "' data-amount='" + item.amount + "' data-price='" + _util.numFormat(item.price, 8) + "'></div>");
                if (item.en_type == "ask") {
                    $(tr).addClass('asktr')
                } else {
                    $(tr).addClass('bidstr')
                }
                var dom = trade.getSuccessDataTdDom(item);
                tr.html(dom);
                if (!successtradeTr.length > 0) {
                    tbody.append(tr);
                } else {
                    tbody.prepend(tr);
                }
                tr.animate({
                    height: '24px',
                    backgroundColor: "#fff"
                }, 1000, function () {
                    //移除最后一条数据
                    if (successtradeTr.length >= 100) {
                        //$(successtradeTr[successtradeTr.length-i]).remove();
                        util.removeElement($(successtradeTr[successtradeTr.length - i]));
                        i++;
                    }
                });
            }
        })
    },
    getSuccessDataTdDom: function (item) {
        var dom = [];
        dom.push('<span class="deal-price');
        if (item.en_type == "ask") {
            dom.push(' green">')
        } else {
            dom.push(' ryhot">')
        }
        dom.push(_util.numFormat(item.price, 8));
        dom.push('</span>');
        dom.push('<span class="deal-amount f-center">');
        dom.push(item.amount);
        dom.push('</span>');
        dom.push('<span class="deal-time f-right">');
        dom.push(item.time);
        dom.push('</span>');
        return dom.join('');
    },
    getEntrustData: function () {
            trade.issueTabOnoff = true;
        if (WSUtil.isConnected()) {
            trade.connectEntrustWebSocket();
            return;
        }
        var userId = $("#userId").val();
        if (!userId) {
            return;
        }
        var param = {};
        param.exchangeId = $("#exchangeTypeId").val();
//        param.tradeType = -1;//（-1：全部委托单，0：买入单，1：卖出单）
        if(trade.currentType==0){//（0：发行，1：赎回）
        	param.type = "issue";
        }else{
        	param.type = "redeem";
        }
        
        param.pageNum = trade.currentPage;
        param.pageSize = 10;
        $.ajax({
            type: 'get',
//            url: "/n/getCurrentEntrust.html",
            url: "/v/option/getIssueOrRedeem.html",
            dataType: 'json',
            data: param,
            success: function (data) {
            	if (data.code) {
	            	if (data.code == "200") {
	                    trade.handleEntrustData(data);
	                }
            	}
            }
        })
        //2秒钟跑一次，获取委单数据信息
        setTimeout(trade.getEntrustData, 200000);
    },
    /**
     * 处理委单数据
     * @param data
     */
    handleEntrustData: function (data) {
    	var dom = [];
        if (!data.data || !data.data.total || !data.data.pageSize) {
            return;
        }
        
        trade.createEntrustDom(data.data);
        common.getPageDom(trade.currentPage, Math.ceil(data.data.total/data.data.pageSize), "pageUl", trade.getgetEntrustDataByType);
        trade.issueTabOnoff = true;
    },
    getgetEntrustDataByType: function (page) {
        trade.currentPage = page;
        trade.getEntrustData();
    },
    //根据委单数据创建委单数据dom节点
    createEntrustDom: function (data) {
        data = data.entrustHistoryListDTO;
        if (!data) {
            return;
        }
        var dom = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var dateStr;
            try {
                if (!isNaN(d.flastupdattime)) {
                    d.flastupdattime = d.flastupdattime * 1;
                    dateStr = new Date(d.flastupdattime).format('yyyy-MM-dd hh:mm:ss');
                } else {
                    dateStr = d.flastupdattime[0]+"-"+d.flastupdattime[1]+"-"+d.flastupdattime[2]+" "+d.flastupdattime[3]+":"+d.flastupdattime[4]+":"+d.flastupdattime[5];
                }
            } catch (e) {

            }

            dom.push('<tr role="row" class="odd">');
            dom.push('<td class="f-left">' + dateStr + '</td>');
            dom.push('<td class="f-left">' + d.ftypeName + '</td>');
            dom.push('<td class="f-center">' + d.fleftcoinName + '</td>');
            dom.push('<td class="f-center">' + d.fcount  + '</td>');
            dom.push('<td class="f-right">' + d.fobjectName + '</td>');
            dom.push('<td class="f-right">' + d.famount + '</td>');
//            if (trade.currentType == 0) {
//                dom.push('<td class="f-right"><a class="cancelTrade" data-id=' + d.fid + '>撤单</a></td>');
//            }
            dom.push('</tr>');
        }
        if (trade.currentType == 0) {
            $("#issueEntrusts").html(dom.join(''));
        } else {
            $("#redeemEntrusts").html(dom.join(''));
        }
        
    },

    //撤销全部订单
    cancelAllEntrust: function (type) {
        $.ajax({
            type: 'post',
            url: "/trade/cancel_batch_entrust.html",
            dataType: 'json',
            data: {type: type, symbol: $("#fcode").val()},
            success: function (data) {
                if (data.code) {
                    if (data.code == "200") {
                        sweetAlert('', language["apple.dom.msg13"], 'success');
                    } else {
                        sweetAlert('', data.msg, 'error');
                    }
                    trade.currentPage = 1;
                    trade.currentType = 0;
                    trade.getEntrustData();
                }
            }
        })
    },
    changeCur: function (obj) {
        var index = $(obj).data().index;
        var name = $(obj).data().name;
        trade.marketInfo(name);
        $(".clickf-fr").removeClass('active');
        $("#defaultStart").removeClass('active');
        $(obj).addClass('active');
    },
    showvalidation: function () {
        $('#validation').show();
        trade.pswlimit = 1
    },
    hidevalidation: function () {
        $('#validation').hide();
        trade.pswlimit = 2
    },
    showSetpsw: function (tradeType) {
        $('#Fund-password').modal({})
    },
    showLoginWinwow: function (content, url, sureText) {
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
    validateTradeNums: function (price, type) {
        if (price == "" || price == 0) {
            sweetAlert('', language["apple.dom.msg18"], "error");
            return false;
        }
        return true;
    },
    isSetTradePwd: function () {
        var tradePassword = $("#tradePassword").val();
        return tradePassword;
    },
    isNeedTradePwd: function () {
        $("#pay-pwd-input").val("");
        var isopen = $("#isopen").val();//-1不需要输入，0一直需要输入，1间隔时间内需要输入
        if ((isopen == "0" || isopen == "1")) {
            return true;
        } else {
            return false;
        }
    },
    showInputTradePwdWindow: function () {
        $('#Login-password-Trade').modal('show');
    },
    showSetTradePwdWindow: function () {
        $('#Login-password-Trade').modal('hide');
        $('#Fund-password-Trade').modal('show');
    },
    saveTradeModifyCode: function () {
        var phoneCode = $("#tradeModifyCode-msgcode").val();
        var totpCode = $("#tradeModifyCode-google_code").val();
        var mailCode = $("#tradeModifyCode-emailcode").val();
        var interval = $('input:radio[name="paypasswdintervalradio"]:checked').val();
        var old = $("#oldpaypasswdinterval").val();
        if (interval == old) {
            sweetAlert('', language["user.operation.tips.info.14"], 'error');
            return false;
        }
        if ((old == 0 && interval != 0) || (old == 2 && interval == -1)) {
            if ($(".tradeModifyCode_message_code").length > 0) {
                if (phoneCode.indexOf(" ") > -1 || phoneCode.length != 6 || !/^[0-9]{6}$/.test(phoneCode)) {
                    sweetAlert('', language["comm.error.tips.66"], 'error');
                    return false;
                }
            }

            if ($(".tradeModifyCode_email_code").length > 0) {
                if (!/^[0-9]{6}$/.test(mailCode)) {
                    sweetAlert('', language["comm.error.new.tips.1"], 'error');
                    return false;
                }
            }

            if ($("#tradeModifyCode-google_code").length > 0) {
                if (totpCode.indexOf(" ") > -1 || totpCode.length != 6 || !/^[0-9]{6}$/.test(totpCode)) {
                    sweetAlert('', language["comm.error.tips.98"], 'error');
                    return false;
                }
            }
        }

        var url = "/user/update_UserPayPasswd.html?random=" + Math.round(Math.random() * 100);
        var param = {
            phoneCode: phoneCode,
            totpCode: totpCode,
            interval: interval,
            mailCode: mailCode
        };
        $.post(url, param, function (result) {
            if (result.code == 200) {
                if (interval <= 0) {
                    $("#isopen").val(interval);
                } else {
                    $("#isopen").val(1);
                }
                sweetAlert('', language["user.operation.tips.info.13"], 'success');
                $("#oldpaypasswdinterval").val(interval);
                $("#paypasswdintervalradio" + interval).attr("checked", "checked");
                $("#paypasswdintervalradio" + old).removeAttr("checked");
                $('#Fund-password-Trade').modal('hide');
                $('#Login-password-Trade').modal('show');
            } else {
                sweetAlert('', result.msg, 'error');
            }
        }, "json");
    },
    saveOptionTrade: function (optionNumber) {
        var exchangeId = $("#exchangeTypeId").val();
        var url = "";
        var param = null;
        var tradePwd = "";
        var isopen = $("#isopen").val();//-1不需要输入，0一直需要输入，1间隔时间内需要输入
        if ($("#pay-pwd-input").length > 0) {
            tradePwd = util.trim($("#pay-pwd-input").val());
        }
        tradePwd = (isopen == "false") ? "" : tradePwd;
        if (trade.tradeType == 0) {
            url = "/v/option/issueOrRedeem.html";
            param = {
            	exchangeId: exchangeId,
            	optionNumber: optionNumber,
                type: "issue",
                tradePwd: tradePwd
            }
        } else {
            url = "/v/option/issueOrRedeem.html";
            param = {
                optionNumber: optionNumber,
                tradePwd: tradePwd,
                exchangeId: exchangeId,
                type: "redeem"
            }
        }


        /*$("#sell-vomume").text(_util.numFormat($("#sell-price").val('')*$("#sell-amount").val(''),8))
        $("#buy-vomume").text(_util.numFormat($("#buy-price").val('')*$("#buy-amount").val(''),8))*/
        $.ajax({
            url: url,
            data: param,
            dataType: "json",
            type: "post",
            success: function (data) {
                if (data.code == 200) {
                    if (isopen != "0") {
                        $("#isopen").val("-1");//-1不需要输入，0一直需要输入，1间隔时间内需要输入
                    }
                    sweetAlert('', data.msg, 'success');
                    if (trade.tradeType == 0) {
                        $("#buy-amount").val('');
                        $("#buy-volume").text(0)
                    } else {
                        $("#sell-amount").val('');
                        $("#sell-volume").text(0)
                    }
                    $('#Login-password-Trade').modal('hide');
                    //发行赎回成功以后重新加载期权钱包信息
                    trade.initOptionWallet();
                } else {
                    sweetAlert('', data.msg, 'error');
                }
                if (data.code == -2) {
                    $("#isopen").val($("#oldIsopen").val());
                    trade.showInputTradePwdWindow();
                }
            }
        })
    },
    issueRedeem: function (priceobj) {
        //1.判断是否登录
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        //2.验证数据有效性
        var price = priceobj.val();
        var flag = trade.validateTradeNums(price, 0);
        if (!flag) {
            return;
        }
        if(trade.isNeedTradePwd()){
        	 $('#Login-password-Trade').modal('show');
        }else{
        	  //5.提交请求
            trade.saveOptionTrade(price);
        }
          
    },
    depthClick: function (obj, objclass, amountobj, volume, emptyamount, cantrade, type) {
        obj.each(function (index) {
            $(this).click(function () {
                if (trade.isLogin() == 'false') {
                    amountobj.val('');
                    trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
                    return
                }
                emptyamount.val('');
                $(this).attr('dataindex', index);
                var that = $(this);
                $('.sell-price').val(that.find(objclass).text());
                $('.buy-price').val(that.find(objclass).text());
                var amount = 0;
                if (type == 0) {
                    for (var i = 0; i < obj.length; i++) {
                        if ($(this).attr('dataindex') >= i) {
                            amount += obj.eq(i).find(".depthamount").text() * 1000
                        }
                    }
                    amount = amount / 1000;
                    if (amount < trade.canselluse) {
                        amountobj.val(common.retainDemical(amount, 4))
                    } else {
                        amountobj.val(_util.numFormat(trade.canselluse, 3))
                    }
                    volume.text(_util.numFormat(amountobj.val() * $('.sell-price').val(), 8));
                    $('#sell-slider').find('.ui-slider-handle').css('left', amountobj.val() * 100 / trade.canselluse + "%");
                    $('#sell-slider').find('.ui-slider-range').css("width", amountobj.val() * 100 / trade.canselluse + "%");
                } else {
                    for (var i = obj.length; i >= 0; i--) {
                        if ($(this).attr('dataindex') <= i) {
                            amount += obj.eq(i).find(".depthamount").text() * 1000
                        }
                    }
                    amount = amount / 1000;
                    if (common.retainDemical(amount * $("#buy-price").val(), 8) < trade[cantrade] * 1) {
                        amountobj.val(common.retainDemical(amount, 4))
                    } else {
                        var result = _util.numFormat(trade[cantrade] / $("#buy-price").val(), 4)
                        result = common.retainDemical(result, 4)
                        amountobj.val(result)
                    }
                    volume.text(_util.numFormat(amountobj.val() * $('.buy-price').val(), 8));

                    $('#buy-slider').find('.ui-slider-handle').css('left', volume.text() * 100 / trade.canbuyuse + "%");
                    $('#buy-slider').find('.ui-slider-range').css("width", volume.text() * 100 / trade.canbuyuse + "%")
                }
            })
        })
    },
    /*资产价值切换*/
    changeFinanceValue: function (usdclass, cnyclass, btcclass) {
        if (trade.type == 0) {
            $('#finance-nums').html('<em>' + common.retainDemical(common.allfinance.cny, 4) + ' CNY</em>');
            $('.showCur').text("CNY");
            $("#tradeshowcur").text("CNY")
            $(".drop-box").hide();
            cnyclass.addClass("active");
            usdclass.removeClass("active")
            btcclass.removeClass("active")
            $("#cur-logo").text("￥");
            $("#cur-name").text('');
            var nowCur = trade.rightcur.slice(1)
            $.each(common.iscoinRate, function (index, item) {
                if (item.fshortname == nowCur) {
                    $("#discount-val").text(common.retainDemical($("#buy-price").val() * item.cny, 4))
                }
            })
        } else if (trade.type == 1) {
            $('#finance-nums').html('<em>' + common.retainDemical(common.allfinance.usd, 4) + ' USD</em>');
            $('.showCur').text("USD");
            $("#tradeshowcur").text("USD")
            $(".drop-box").hide();
            usdclass.addClass("active");
            cnyclass.removeClass("active");
            btcclass.removeClass("active");
            $("#cur-logo").text("$");
            $("#cur-name").text('');
            var nowCur = trade.rightcur.slice(1)
            $.each(common.iscoinRate, function (index, item) {
                if (item.fshortname == nowCur) {
                    $("#discount-val").text(common.retainDemical($("#buy-price").val() * item.usd, 4))
                }
            })
        } else if (trade.type == 2) {
            $('#finance-nums').html('<em>' + _util.numFormat(common.allfinance.btc, 8) + ' BTC</em>');
            $('.showCur').text("BTC");
            $("#tradeshowcur").text("BTC")
            $(".drop-box").hide();
            btcclass.addClass("active")
            cnyclass.removeClass("active")
            usdclass.removeClass("active")
            $("#cur-logo").text("");
            $("#cur-name").text('BTC');
            var nowCur = trade.rightcur.slice(1)
            $.each(common.iscoinRate, function (index, item) {
                if (item.fshortname == nowCur) {
                    $("#discount-val").text(_util.numFormat($("#buy-price").val() * item.btc, 8))
                }
            })
        }
    },
    connectDepthWebSocket: function () {
        WSUtil.sendMsg(trade.getRealDepthParam());
    },
    getRealDepthParam: function () {
        return {
            event: 'addChannel',
            channel: 'real_depth',
            exchangeTypeCode: $("#fcode").val(),
            buysellcount: 100,
            successcount: 100,
            mergeType: trade.demical,
            token: $.getCookie('token')
        };
    },
    connectEntrustWebSocket: function () {
        var param = trade.getEntrustParam();
        if (!param) return;
        WSUtil.sendMsg(param);
    },
    getEntrustParam: function () {
        var login = $("#login");
        if (login.val() == "false") {
            return;
        }
        var type;
        if(trade.currentType==0){//（0：发行，1：赎回）
        	type = "issue";
        }else{
        	type = "redeem";
        }
        return {
            event: 'addChannel',
            channel: 'virtual_optionIssueOrRedeem',
            symbol: $("#fcode").val(),
            type: type,
            currentPage: trade.currentPage,
            pageSize: 10,
            token: $.getCookie('token')
        };
    }
}
/*----------------------------------------------------------------------------------以上是trade对象----------------------------------------*/

$(function () {
    /*发行*/
    $("#issue-btn").on('click', function () {
        if ($("#userId").val() == "") {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return
        }
        trade.tradeType = 0;
        
        trade.issueRedeem($("#issue-number"));
    });
    //赎回
    $("#redeem-btn").on('click', function () {
        if ($("#userId").val() == "") {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return
        }
        trade.tradeType = 1;
        trade.issueRedeem($("#redeem-number"));
    })


    /*判断输入是否有误  先判断是否输入有误，再进行计算*/
    /*注册买入价格框输入事件*/
    /*输入框限制位数*/
//    $('.buy-price').on('input', function () {
//        trade.judgeform($(".buy-price"), $("#buy-volume"));
//        if (trade.retainDemical($(this).val(), 9) == "") {
//            $(this).addClass('.placeholder');
//        } else {
//            $(this).val(trade.retainDemical(util.trim($(this).val()), 9));
//            $(this).removeClass('.placeholder');
//        }
//        trade.buyinput();
//    });
    $('.issue-number').on('input', function () {
        trade.judgeform($(".issue-number"));
        trade.issueinput();
    });
    
    $('.redeem-number').on('input', function () {
        trade.judgeform($(".redeem-number"));
        trade.redeeminput();
    });
//    $('.sell-price').on('input', function () {
//        trade.judgeform($(".sell-price"), $("#sell-volume"));
//        if (trade.retainDemical($(this).val(), 9) == "") {
//            $(this).addClass('.placeholder');
//        } else {
//            $(this).val(trade.retainDemical(util.trim($(this).val()), 9));
//            $(this).removeClass('.placeholder');
//        }
//        trade.sellinput();
//    });
//    $('.sell-amount').on('input', function () {
//        trade.judgeform($(".sell-amount"), $("#sell-volume"));
//        $(this).val(trade.retainDemical($(this).val(), 4));
//        trade.sellamount();
//    });


    /*获取所有交易区和所有交易对信息    左上角tab*/

    /*深度与最新成交-------------------------------------------------*/

    //初始化调用深度和最近成交和行情数据
    trade.initOptionWallet();
//    $(".buy-price-add").click(function () {
//        common.addReducePrice($(".buy-price"), true)
//    });
//    $(".buy-price-reduce").click(function () {
//        common.addReducePrice($(".buy-price"), false)
//    });
//
//
//    $(".sell-price-add").click(function () {
//        common.addReducePrice($(".sell-price"), true)
//    })
//    $(".sell-price-reduce").click(function () {
//        common.addReducePrice($(".sell-price"), false)
//    });





    //绑定期权发行和期权赎回点击事件
    //点击切换选中样式
    $("#issueTab").click(function () {
        if (trade.issueTabOnoff) {
            trade.issueTabOnoff = false;
            $(this).addClass("ryhot");
            $("#redeemTab").removeClass("ryhot");
            $("#redeemTab1").removeClass("ryhot");
            $("#issueTab1").addClass("ryhot");
            $("#redeemEntrustsTable").hide();
            $("#redeemCont").hide();
            $("#redeemTab1").hide();
            $("#issueEntrustsTable").show();
            $("#issueCont").show();
            $("#issueTab1").show();
            trade.currentType = 0;
            trade.currentPage = 1;
            trade.getEntrustData();
        }
    })
    $("#redeemTab").click(function () {
        if (trade.issueTabOnoff) {
            trade.issueTabOnoff = false;
            $(this).addClass("ryhot");
            $("#issueTab").removeClass("ryhot");
            $("#issueTab1").removeClass("ryhot");
            $("#redeemTab1").addClass("ryhot");
            $("#redeemEntrustsTable").show();
            $("#redeemCont").show();
            $("#redeemTab1").show();
            $("#issueEntrustsTable").hide();
            $("#issueCont").hide();
            $("#issueTab1").hide();
            trade.currentType = 1;
            trade.currentPage = 1;
            trade.getEntrustData();
        }
    })


    /*买卖判断*/
    /*页面加载初始化滚动条*/

    //注册修改资金密码规则事件
    $('input:radio[name="paypasswdintervalradio"]').change(function () {
        var old = $("#oldpaypasswdinterval").val();
        var now = $(this).val();
        if (old == 0 && now != 0) {
            $(".modify_code_need_code").show();
        } else if (old == 2 && now == -1) {
            $(".modify_code_need_code").show();
        } else if (old == -1 && now != -1) {
            $(".modify_code_need_code").hide();
        } else {
            $(".modify_code_need_code").hide();
        }
    });
    //修改资金密码按钮点击事件
    $("#tradeModifyCode-submit").on("click", function () {
        trade.saveTradeModifyCode();
    });
    //绑定获取短信验证码按钮事件
    $("#tradeModifyCode-sendmessage").on("click", function () {
        msg.sendMsgCode($(this).attr('msgtype'));
    });
    //绑定获取邮箱验证码按钮事件
    $("#tradeModifyCode-sendEmailMessage").on("click", function () {
        msg.sendcodemy($(this).attr("msgtype"), $("#femail").val(), null);
    });
    //输入资金密码后点击事件
    $("#editloginpass-submit").on("click", function () {
        var price
        if (trade.tradeType == 0) {
            price = $("#issue-number").val();
        } else {
        	price = $("#redeem-number").val();
        }
        trade.saveOptionTrade(price);
    });
    //注册跳转冲提页面按钮事件
    $("#topersonalCenterA").on("click", function () {
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        window.location.href = "/n/recharge.html?coinid=" + $("#fcode").val();
    })
    $("#topersonalCenterB").on("click", function () {
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        window.location.href = "/n/withdrawals.html?coinid=" + $("#fcode").val();
    })


    //websocket注册监听器
    //1.注册深度和最近成交的websocket事件
//    WSUtil.registerListener(trade.getRealDepthParam().channel, function (status, res) {
//        if (status) {
//            //console.info('websocket接入,获取深度，行情，最近成交数据');
//            trade.initOptionWallet();
//        } else {
//            //ajax方式获取数据
//            //console.info('非websocket接入,获取深度，行情，最近成交数据');
//            trade.initOptionWallet();
//        }
//    });
    //websocket注册监听器
    var entrustParam = trade.getEntrustParam();
    if (entrustParam) {
        WSUtil.registerListener(entrustParam.channel, function (status, res) {
            if (status) {
                if (res) {
                    //格式化数据，兼容老的接口
                    var data = {};
                    data.data = {};
                    if (res.data) {
                        data.data.entrustHistoryListDTO = res.data.data.entrustHistoryListDTO;
                        data.data.pageNum = res.data.data.pageNum;
                        //console.info('websocket接入，获取委单数据');
                        data.data.total = res.data.data.total;
                        data.data.pageSize = res.data.data.pageSize;
                        trade.handleEntrustData(data);
                    }
                } else {
                    trade.connectEntrustWebSocket();
                }
            } else {
                //ajax方式获取数据
                //console.info('非websocket接入，获取委单数据');
                trade.getEntrustData();
            }
        });
    }

})

