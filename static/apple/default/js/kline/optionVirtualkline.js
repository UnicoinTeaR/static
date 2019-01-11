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

var kline = {
    /*求数组最大值*/
    tradeType: 0,
    currentPage: 1,
    currentType: 0,
    currentCoinName: null,
    isCoinTab: true,
    rightCoinName: $("#rightCoinName").val(),
    buysell_obj: {
        canbuy: 0,        //可买
        cansell: 0       //可卖
    },
    leftcur: "",
    rightcur: "",
    search_max: function (arr) {
        return Math.max.apply(null, arr);
    },
    canbuyuse: 0,
    canselluse: 0,
    currentCoinTabName: '',
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
    /*获取用户排名*/
    userInfo: function () {
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            console.info("===================== test =====================");
            console.info(language["apple.dom.msg97"]);
            console.info(language["apple.dom.msg12"]);
            console.info("===================== test =====================");
            kline.showLoginWinwow(language["apple.dom.msg97"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        $.ajax({
            type: "get",
            url: "/v/getVirtualOptionUser.html",
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
            },
            success: function (data) {
                var code = data.code;
                if(404 == code){
                    //说明用户没有注册虚拟钱包
                    // window.location.href = "/n/virtualApply.html";
                    //kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
                }
                if(401 == code){
                    //用户失效，请重新登录
                    kline.showLoginWinwow(language["apple.dom.msg97"], "/user/login.html", language["apple.dom.msg12"]);
                    return;
                }
                if(200 == code){
                    kline.createUserDom(data);
                }
                if(500 == code){
                    kline.showLoginWinwow(language["comm.error.tips.121"], "", language["comm.error.tips.121"]);
                    return;
                }
            }
        })
    },
    /*获取用户排名*/
    userInfoTask: function () {
        //每2秒刷新一次
        window.setInterval(function () {
            kline.userInfo();
        }, 2000);
    },
    createUserInfo: function () {
        $.ajax({
            type: "get",
            url: "/v/virtualOptionUser.html",
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
            },
            success: function (data) {
            }
        })
    },
    //创建用户信息
    createUserDom: function (data) {
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        var user= data.data;
        if(!user.franking) {
            $("#p_rank").html("暂无排名");
        }else{
            $("#p_rank").html(user.franking);
        }

        if(/^-0\.(0)\d*$/.test(_util.numFormat(user.ftotalBalance, 4))){
            $("#p_tb").html(0.000);
        }else{
            $("#p_tb").html(_util.numFormat(user.ftotalBalance, 4));
        }

        if(/^-0\.(0)\d*$/.test(_util.numFormat(user.ftotalYieldRate, 4))){
            $("#p_tyr").html(0.000);
        }else{
            $("#p_tyr").html(_util.numFormat(user.ftotalYieldRate, 4));
        }

        if(/^-0\.(0)\d*$/.test(_util.numFormat(user.fdayYield, 4))){
            $("#p_dy").html(0.000);
        }else{
            $("#p_dy").html(_util.numFormat(user.fdayYield, 4));
        }

        if(/^-0\.(0)\d*$/.test(_util.numFormat(user.fmouthYieldRate, 4))){
            $("#p_myr").html(0.000);
        }else{
            $("#p_myr").html(_util.numFormat(user.fmouthYieldRate, 4));
        }

        if(/^-0\.(0)\d*$/.test(_util.numFormat(user.fyearYieldRate, 4))){
            $("#p_yyr").html(0.000);
        }else{
            $("#p_yyr").html(_util.numFormat(user.fyearYieldRate, 4));
        }

        $("#p_period").html(user.fperiod);
        if(user.flastUpdateTime[3] <10){
            user.flastUpdateTime[3] = "0" + user.flastUpdateTime[3];
        }
        if(user.flastUpdateTime[4]<10){
            user.flastUpdateTime[4] = "0" + user.flastUpdateTime[4];
        }
        if(user.flastUpdateTime[5]<10){
            user.flastUpdateTime[5] = "0" + user.flastUpdateTime[5];
        }
        if(typeof(user.flastUpdateTime[3]) == "undefined"){
            user.flastUpdateTime[3] = "00";
        }
        if(typeof(user.flastUpdateTime[4]) == "undefined"){
            user.flastUpdateTime[4] = "00";
        }
        if(typeof(user.flastUpdateTime[5]) == "undefined"){
            user.flastUpdateTime[5] = "00";
        }
        $("#p_lastUpdateTime").html(user.flastUpdateTime[0]+"年"+user.flastUpdateTime[1]+"月"+user.flastUpdateTime[2] +"日"
            +user.flastUpdateTime[3]+"时"+user.flastUpdateTime[4]+"分"+user.flastUpdateTime[5]+"秒");
    },
    getDepthDom: function (item, widthRatio) {
        var dom = []
        var total = item.price * item.amount;
        total = common.sliceDemical2(total)
        total = total.toString().slice(0, 6)
        dom.push('<span class="prices">')
        dom.push(common.retainDemical(item.price, 0))
        dom.push('.' + '<g>' + common.sliceDemical(item.price).slice(0, 8) + '</g>');
        dom.push('</span>');

        dom.push('<span class="amount">')
        dom.push(common.retainDemical(item.amount, 0));
        dom.push('<g>' + common.sliceDemical2(item.amount) + '</g>')
        dom.push('</span>');

        // dom.push('<span class="usd">');
        // dom.push(common.retainDemical(item.price*item.amount,0));
        // dom.push('<g>'+total+'</g>');
        // dom.push('</span>')
        dom.push('<span class="depth">');
        dom.push('<i style="width:' + widthRatio + '%"></i>');
        dom.push('</span>');
        dom.push('<input type="hidden" class="ev-price" value="' + item.price + '"/>');
        dom.push('<input type="hidden" class="ev-amount" value="' + item.amount + '"/>');
        dom.push('<input type="hidden" class="ev-volume" value="' + common.retainDemical(item.price * item.amount, 7) + '"/>');
        return dom.join('');
    },
    getDishHandsDom: function (index, isbuy) {
        if (isbuy) {
            $("#buy-dish-hands").append("<li>" + language["apple.dom.msg9"] + " " + (index * 1 + 1) + "</li>");
        } else {
            $("#sell-dish-hands").append("<li>" + language["apple.dom.msg10"] + " " + (index * 1 + 1) + "</li>");
        }
    },
    /**
     *删除深度数据节点
     * @param data 深度数据
     * @param isSell 是否卖单数据（true:卖单深度，false:买单深度）
     */
    delDepthDom: function (data, isSell) {
        var bcolor = "#f56310";//卖单颜色
        var sellDiv = $(".depthsellDiv");//卖单
        var needRemoveClass = "sellneedRemove";
        if (!isSell) {
            bcolor = "#4caf50";
            sellDiv = $(".depthbuyDiv");
            needRemoveClass = "buyneedRemove";
        }
        for (var j = 0; j < sellDiv.length; j++) {
            var tempDiv = $(sellDiv[j]);
            var isDel = true;
            var tt = sellDiv[j];
            var findPrice = tempDiv.attr("data-price");
            for (var n = data.length - 1; n >= 0; n--) {
                if (findPrice * 1 == data[n].price * 1) {
                    isDel = false;
                    break;
                }
            }
            if (isDel) {
                tempDiv.css({"background-color": bcolor});
                tempDiv.addClass(needRemoveClass);
                tempDiv.animate({
                    height: '0px',
                    backgroundColor: "#fff"
                }, 1000);
                tempDiv.text("")
            }
        }
        //执行删除
        setTimeout(function () {
            for (var a = 0; a < $("." + needRemoveClass).length; a++) {
                //$("."+needRemoveClass)[a].remove();
                util.removeElement($("." + needRemoveClass)[a]);
            }
        }, 1000)
    },
    insertAndModiDepthDom: function (data, isSell, maxAmountSell) {
        var bcolor = "#f56310";//卖单颜色
        var sellDiv = $(".depthsellDiv");//卖单
        var flagClass = "depthsellDiv";
        var allClass = "depthsell depthsellDiv";
        var appendParent = $(".askTable");
        if (!isSell) {
            bcolor = "#4caf50";
            flagClass = "depthbuyDiv";
            allClass = "depthbuy depthbuyDiv";
            sellDiv = $(".depthbuyDiv");
            appendParent = $(".bidTable");
        }
        var needAppendDiv = [];
        for (var i = data.length - 1; i >= 0; i--) {
            var item = data[i];
            var isAppend = true;
            var isModi = false;
            var needModiDiv;
            for (var w = 0; w < sellDiv.length; w++) {
                //查找价格，如果相等，则修改，否则做插入操作
                if ($(sellDiv[w]).attr("data-price") * 1 == item.price * 1) {
                    isAppend = false;
                    if ($(sellDiv[w]).attr("data-amount") * 1 != item.amount * 1) {
                        isModi = true;
                        needModiDiv = $(sellDiv[w]);
                    }
                    break;
                }
            }
            if (isAppend) {
                var tempDiv = $("." + flagClass);
                var appendDiv = null;
                for (var k = tempDiv.length - 1; k >= 0; k--) {
                    //查找离当前价格最近的一个价格dom节点
                    var appendPrice = $(tempDiv[k]).attr("data-price");
                    if (appendPrice * 1 > item.price * 1) {
                        appendDiv = tempDiv[k];
                        break;
                    }
                }
                var amount_w = (item.amount / maxAmountSell) * 100;
                var appendDom = kline.getDepthDom(item, amount_w);
                var div
                if (isSell) {
                    div = $('<div style="background-color: ' + bcolor + ';height: 0px;" class="' + allClass + '" data-price="' + item.price + '" class="row asks-row"></div>');
                    div.addClass('row');
                    div.addClass('asks-row');
                } else {
                    div = $('<div style="background-color: ' + bcolor + ';height: 0px;" class="' + allClass + '" data-price="' + item.price + '" class="row bids-row"></div>');
                    div.addClass('row');
                    div.addClass('bids-row');
                }

                div.css({"opacity": 0});
                div.html(appendDom);
                if (appendDiv != null) {
                    $(appendDiv).after(div);
                } else {
                    if ($("." + flagClass).length != 0) {
                        $("." + flagClass).first().before(div);
                    } else {
                        appendParent.append(div);
                    }
                }
                needAppendDiv.push(div);
            }
            if (isModi) {
                //修改节点数据
                needModiDiv.find(".amount").text('');
                needModiDiv.find(".amount").html(common.retainDemical(item.amount, 0) + '<g>' + common.sliceDemical2(item.amount) + '</g>')
                needModiDiv.attr("data-amount", item.amount);
                var total = item.price * item.amount;
                total = common.sliceDemical2(total);
                total = total.toString().slice(0, 6);
                needModiDiv.find(".usd").html(common.retainDemical(item.price * item.amount, 0) + '<g>' + total + '</g>');
                var dealprice = item.price * item.amount;
                var str = dealprice.toString()
                var index = str.indexOf('.');
                var dealprice = str.slice(0, index + 9);
                var amount_w = (item.amount / maxAmountSell) * 100;
                needModiDiv.find(".depth").children().eq(0).animate({"width": amount_w + "%"}, 1000, "linear");
            }
        }
        //执行新增节点动画
        setTimeout(function () {
            for (var a = 0; a < needAppendDiv.length; a++) {
                needAppendDiv[a].animate({
                    opacity: 1,
                    height: '18px',
                    backgroundColor: "rgb(32, 34, 39)"
                }, 1000);
            }
        }, 1000)
    },
    getDepth: function () {
        if (WSUtil.isConnected()) {
            kline.connectDepthWebSocket();
            return;
        }
        $.ajax({
            type: 'get',
            url: "/v/getDepthAndSuccessData.html?" + Math.round(Math.random() * 100),
            dataType: 'json',
            data: {
                symbol: $("#fcode").val()      //变量替换  $("#fcode").val()
            },
            success: function (data) {
                if (data.success) {
                    kline.handleDepthAndSuccessData(data.data.buys, data.data.sells, data.data.trades);
                    kline.handleLastKlineData(data)
                }
            }
        })
        //2秒钟跑一次
        setTimeout(kline.getDepth, 2000);
    },
    connectDepthWebSocket: function () {
        WSUtil.sendMsg(kline.getRealDepthParam());
    },
    getRealDepthParam: function () {
        return {
            event: 'addChannel',
            channel: 'virtual_real_depth',
            exchangeTypeCode: $("#fcode").val(),
            buysellcount: 100,
            successcount: 100,
            mergeType: '0.00000001',
            token: $.getCookie('token')
        };
    },
    /*处理深度和最新成交数据*/
    handleDepthAndSuccessData: function (buys, sells, trades) {
        /*买*/
        var amount_obj = kline.amounArr(buys, sells);

        /*买的最大数量*/
        var maxAmountBuy = kline.search_max(amount_obj.buyAmount);

        /*卖的最大数量*/
        var maxAmountSell = kline.search_max(amount_obj.sellAmount);

        /*清空买的dish-hands*/
        $("#buy-dish-hands").empty();
        $.each(buys, function (index, item) {
            kline.getDishHandsDom(index, true);
        });

        /*卖*/
        /*清空卖的dish-hands*/
        $("#sell-dish-hands").empty();
        for (var i = sells.length - 1; i >= 0; i--) {
            kline.getDishHandsDom(i, false);
        }
        ;

        /*最新成交*/
        kline.newdeal(trades)

        /*买渲染*/
        //1.查找修改和插入数据节点
        kline.insertAndModiDepthDom(buys, false, maxAmountBuy);
        //2.查找需要删除的节点
        kline.delDepthDom(buys, false);

        /*卖渲染*/
        //1.查找修改删插入数据节点
        kline.insertAndModiDepthDom(sells, true, maxAmountSell);
        //2.查找需要删除的节点
        kline.delDepthDom(sells, true);

        /*最佳买价*/
        if (sells[0] && $('#buy-price').val() == '' && !$('#buy-price').hasClass('.placeholder')) {
            $('#buy-price').val(sells[0].price);
        }

        /*最佳卖价*/
        if (buys[0] && $('#sell-price').val() == '' && !$('#sell-price').hasClass('.placeholder')) {
            $('#sell-price').val(buys[0].price);
        }

        /*点击买*/
        $(".bids-row").each(function (index) {
            $(this).click(function () {
                if (kline.isLogin() == 'false') {
                    kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
                    return
                }
                /*清除掉买的框*/
                $("#buy-amount").val('');

                /*点击绑定index索引*/
                $(this).attr("dataindex", index);

                /*买卖价格框的值为 当前点击的 .price 的text*/
                $("#buy-price").val(_util.numFormat($(this).children(".ev-price").val(), 8));
                $("#sell-price").val(_util.numFormat($(this).children(".ev-price").val(), 8));

                /*统计数量*/
                var amount = 0
                for (var i = 0; i < $(".bids-row").length; i++) {
                    if ($(this).attr("dataindex") >= i) {
                        amount += $(".bids-row").eq(i).find(".amount").text() * 1000;
                    }
                }
                amount = amount / 1000;
                if (amount < kline['canselluse']) {
                    $("#sell-amount").val(_util.numFormat(amount, 3))
                } else {
                    $("#sell-amount").val(_util.numFormat(kline['canselluse'], 3))
                }
                kline.sellamount();
            })
        })

        /*点击卖*/
        $(".asks-row").each(function (index) {
            $(this).click(function () {
                if (kline.isLogin() == 'false') {
                    kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
                    return
                }
                /*清除掉买的框*/
                $("#sell-amount").val('');

                /*点击绑定index索引*/
                $(this).attr("dataindex", index);

                /*买卖价格框的值为 当前点击的 .price 的text*/
                $("#buy-price").val(_util.numFormat($(this).children(".ev-price").val(), 8));
                $("#sell-price").val(_util.numFormat($(this).children(".ev-price").val(), 8));

                /*统计数量*/
                var amount = 0
                for (var i = $(".asks-row").length; i >= 0; i--) {
                    if ($(this).attr("dataindex") <= i) {
                        amount += $(".asks-row").eq(i).find(".amount").text() * 1000;
                    }
                }
                amount = amount / 1000;
                if (amount < kline['canbuyuse']) {
                    $("#buy-amount").val(common.retainDemical(amount, 4))
                } else {
                    $("#buy-amount").val(kline['canbuyuse'])
                }
                kline.buyamountinput();
            })
        })
        kline.kineHeight();
    },
    newdeal: function (trades) {
        /*日期  买卖数量*/
        var successtradeTr = $(".successtrade");
        var i = 1;
        var tbody = $("#klinedeal_list");
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
                var tr = $("<ul class='newdeal-tr successtrade' data-time='" + item.time + "' data-amount='" + item.amount + "' data-price='" + item.price + "'></ul>");
                if (item.en_type == "ask") {
                    $(tr).addClass('initasktr')
                } else {
                    $(tr).addClass('initbidstr')
                }
                var dom = kline.getDateDom(item);
                tr.html(dom);
                if (!successtradeTr.length > 0) {
                    tbody.append(tr);
                } else {
                    tbody.prepend(tr);
                }
                tr.animate({
                    height: '18px',
                    backgroundColor: "rgb(32, 34, 39)"
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
    /*最新成交DOM*/
    getDateDom: function (item) {
        var dom_date = []
        dom_date.push('<li class="tm">' + item.time + '</li>');
        dom_date.push('<li class="vl">');
        dom_date.push(common.retainDemical(item.amount, 0))
        dom_date.push('<g>' + common.sliceDemical2(item.amount) + '</g>');
        dom_date.push('</li>');
        if (item.en_type == 'ask') {
            dom_date.push('<li class="pr-red')
        } else {
            dom_date.push('<li class="pr-green')
        }
        dom_date.push('">' + _util.numFormat(item.price, 8) + '</li>');
        var newDealDom = dom_date.join("");
        return newDealDom
    },
    createEntrustDom: function (data) {
        if (kline.currentType == 0) {
            data = data.currentEntrust;
        } else {
            data = data.historyEntrust;
        }
        var dom = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                var dateStr;
                try {
                    if (!isNaN(d.fcreatetime)) {
                        d.fcreatetime = d.fcreatetime * 1;
                        dateStr = new Date(d.fcreatetime).format('yyyy-MM-dd hh:mm:ss');
                    } else {
                        dateStr = d.fcreatetime;
                    }
                } catch (e) {

                }
                dom.push('<tr role="row" class="odd">');
                dom.push('<td class="f-left">' + dateStr + '</td>');
                dom.push('<td class="f-left">' + d.ftype_s + '</td>');
                dom.push('<td class="f-center">' + _util.numFormat(d.fprize, 8) + '</td>');
                if (kline.currentType == 0) {
                    dom.push('<td class="f-center">' + d.fcount + ' / ' + d.okCount + '</td>');
                } else {
                    dom.push('<td class="f-center">' + d.fcount + ' / ' + common.retainDemical(d.fcount - d.fleftcount, 4) + '</td>');
                }
                dom.push('<td class="f-right">' + _util.numFormat(d.famount, 8) + '</td>');
                dom.push('<td class="f-right">' + d.fsuccessamount_s + '</td>');
                dom.push('<td class="f-right">' + d.ffees_s + '</td>');
                dom.push('<td class="f-center">' + d.fstatus_s + '</td>');
                if (kline.currentType == 0) {
                    dom.push('<td class="f-right"><a class="cancelTrade" data-id=' + d.fid + '>撤单</a></td>');
                }
                dom.push('</tr>');
            }
        }
        if (kline.currentType == 0) {
            $("#current-entrusts").html(dom.join(''));
            $("#current-entrusts").show();
            $("#history-entrusts").hide();
        } else {
            $("#history-entrusts").html(dom.join(''));
            $("#current-entrusts").hide();
            $("#history-entrusts").show();
        }
    },
    getEntrustData: function () {
        if (WSUtil.isConnected()) {
            kline.connectEntrustWebSocket();
            return;
        }

        var userId = $("#userId").val();
        if (!userId) {
            return;
        }
        var param = {};
        param.symbol = $("#fcode").val();   //
        param.tradeType = -1;//（-1：全部委托单，0：买入单，1：卖出单）
        param.type = kline.currentType;//（0：当前，1：历史）
        param.currentPage = kline.currentPage;
        param.pageSize = 3;
        $.ajax({
            type: 'get',
            url: "/v/getCurrentEntrust.html",
            dataType: 'json',
            data: param,
            success: function (data) {
                if (data.success) {
                    kline.handleEntrustData(data);
                }
            }
        })
        //2秒钟跑一次，获取委单数据信息
        setTimeout(kline.getEntrustData, 2000);
    },
    /**
     * 处理委单数据
     * @param data
     */
    handleEntrustData: function (data) {
        kline.createEntrustDom(data.data);
        common.getPageDom(kline.currentPage, data.data.totalPages, "pageUl", kline.getgetEntrustDataByType);
    },
    getgetEntrustDataByType: function (page) {
        kline.currentPage = page;
        kline.getEntrustData();
    },
    connectEntrustWebSocket: function () {
        var param = kline.getEntrustParam();
        if (!param) return;
        WSUtil.sendMsg(param);
    },
    getEntrustParam: function () {
        var userId = $("#userId").val();
        if (!userId) {
            return;
        }
        return {
            event: 'addChannel',
            channel: 'virtual_entrust',
            symbol: $("#fcode").val(),
            type: kline.currentType,
            tradeType: -1,
            ftype: -1,
            currentPage: kline.currentPage,
            pageSize: 5,
            token: $.getCookie('token')
        };
    },
    //撤单
    cancelTrade: function (id) {
        $.ajax({
            type: 'get',
            url: "/v/trade/cny_cancel.html",
            dataType: 'json',
            data: {id: id},
            success: function (data) {
                sweetAlert('', language["apple.dom.msg13"], 'success');
                kline.getEntrustData();
            }
        })
    },
    //撤销全部订单
    cancelAllEntrust: function (type) {
        $.ajax({
            type: 'post',
            url: "/v/trade/cancel_batch_entrust.html",
            dataType: 'json',
            data: {type: type, symbol: $("#fcode").val()},//
            success: function (data) {
                if (data.code == "200") {
                    sweetAlert('', language["apple.dom.msg13"], 'success');
                } else {
                    sweetAlert('', data.msg, 'error');
                }
                kline.currentPage = 1;
                kline.currentType = 0;
                kline.getEntrustData();
            }
        })
    },
    /*买卖*/
    saveCoinTrade: function (tradePrice, tradeAmount) {
        var limited = 0;
        var symbol = $("#fcode").val();

        var url = "";
        var param = null;
        var isopen = $("#isopen").val();
        var tradePwd = "";
        if ($("#pay-pwd-input").length > 0) {
            tradePwd = util.trim($("#pay-pwd-input").val());
        }
        tradePwd = (isopen == "false") ? "" : tradePwd;
        if (kline.tradeType == 0) {
            url = "/v/trade/cny_buy.html";
            param = {
                tradeAmount: tradeAmount,
                tradeCnyPrice: tradePrice,
                tradePwd: tradePwd,
                symbol: symbol,
                limited: limited
            }
        } else {
            url = "/v/trade/cny_sell.html";
            param = {
                tradeAmount: tradeAmount,
                tradeCnyPrice: tradePrice,
                tradePwd: tradePwd,
                symbol: symbol,
                limited: limited
            }
        }
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
                    $('#Login-password-Trade').modal('hide');
                    $("#buy-amount").val('');
                    $("#sell-amount").val('');
                } else {
                    sweetAlert('', data.msg, 'error');
                }

                if (data.code == -2) {
                    $("#isopen").val($("#oldIsopen").val());
                    kline.showInputTradePwdWindow();
                }

            }
        })
    },
    /*创建K线市场面板DOM*/
    createMarketDom: function (data) {
        var dom = [];
        $.each(data.data, function (index, item) {
            dom.push('<div class="market-info box">');
            if (item.selfId) {
                dom.push('<div data-id=' + item.selfId + ' class="selfTempClass"><span class="icon iconfont icon-shoucang ryhot"></span></div>');
            } else {
                dom.push('<div data-id=' + item.id + ' class="loveIcon"><span class="icon iconfont icon-shoucang"></span></div>');
            }
            dom.push('<div class="price-w">');
            dom.push('<div class="price-info"><div class="price-col sell-col on"><div class="marketname">')
            dom.push('<span class="in-coin">' + item.name + '</span>');
            dom.push('</div></div></div>');
            dom.push('<div class="price-now">')
            dom.push('<div><span class="unit">¥</span><span class="int">' + common.retainDemical(item.p_new, 0) + '</span><span class="decimal">.' + common.sliceDemical(item.p_new) + '</span></div>');
            dom.push('</div>')
            dom.push('<div class="price-right">')
            dom.push('<div class="price-range">');
            if (item.is_increase) {
                dom.push('<span class="up">' + item.rose + '%</span>')
            } else {
                dom.push('<span class="down">' + item.rose + '%</span>')
            }
            dom.push('</div>');
            dom.push('<div class="trading-volume"><span>' + item.vol + '</span></div>');
            dom.push('</div></div></div>');
        })
        $('.trade-tab').html(dom.join(''))
    },
    /*市场交易*/
    tradeInfo: function () {
        $.ajax({
            type: "get",
            url: "/n/getAllExchangeType.html?" + Math.round(Math.random() * 100),
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    var dom = [];
                    dom.push('<a class="selfchoice kmarket-tab" id="defaultStart"><span class="icon iconfont icon-shoucang ng-binding"></span>' + language["apple.dom.msg16"] + '</a>');

                    $.each(data.data, function (index, item) {
                        if (kline.currentCoinTabName != "") {
                            if (kline.currentCoinTabName == item.name) {
                                dom.push('<a class="kmarket-tab on" data-index=' + (index + 1) + ' data-name=' + item.name + '>' + item.name + '</a>')
                            } else {
                                dom.push('<a class="kmarket-tab" data-index=' + (index + 1) + ' data-name=' + item.name + '>' + item.name + '</a>')
                            }
                        } else {
                            if (index == 0) {
                                kline.currentCoinTabName = item.name;
                                dom.push('<a class="kmarket-tab on" data-index=' + (index + 1) + ' data-name=' + item.name + '>' + item.name + '</a>')
                            } else {
                                dom.push('<a class="kmarket-tab" data-index=' + (index + 1) + ' data-name=' + item.name + '>' + item.name + '</a>')
                            }
                        }


                    })
                    $("#kline-market").html(dom.join(''))
                }
            }
        });
    },
    /*获取市场交易对信息*/
    marketInfo: function (coin) {
        kline.currentCoinName = coin;
        $.ajax({
            type: "post",
            url: "/v/getAllLastKlineByCoinName.html",
            dataType: 'json',
            data: {
                coinName: coin
            },
            success: function (data) {
                if (data.success) {
                    kline.createMarketDom(data)
                }
            }
        })
    },
    changeCur: function (obj) {
        var index = $(obj).data().index;
        var name = $(obj).data().name;
        $(obj).addClass('on').siblings().removeClass('on')
        kline.marketInfo(name)
    },
    /**保存用户自选交易对*/
    selfExchangeType: function (id, isDelete) {
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        var url = "/v/saveSelfExchangeType.html";
        if (isDelete) {
            url = "/v/removeSelfExchangetype.html";
        }
        $.ajax({
            type: 'get',
            url: url,
            dataType: 'json',
            data: {
                id: id
            },
            success: function (data) {
                if (data.success && isDelete) {
                }
                if (kline.isCoinTab) {
                    kline.marketInfo(kline.currentCoinName);
                } else {
                    $("#defaultStart").click();
                }
            }
        })
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
    validateTradeNums: function (price, num, type) {
        if (price == "" || price == 0) {
            sweetAlert('', language["apple.dom.msg18"], "error");
            return false;
        }
        if (num == "" || num <= 0) {
            sweetAlert('', language["apple.dom.msg19"], "error");
            return false;
        }
        return true;
    },
    /*买卖*/
    buysell: function (priceobj, amiuntobj) {
        //1.判断是否登录
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }

        //2.验证数据有效性
        var price = priceobj.val();
        var num = amiuntobj.val();
        var flag = kline.validateTradeNums(price, num, 0);
        if (!flag) {
            return;
        }
        //3.判断是否设置了资金密码
        flag = kline.isSetTradePwd();
        if (flag == 'true') {
            kline.showLoginWinwow(language["apple.dom.msg20"], "/n/personalCenter.html?showradeWindow=true", language["apple.dom.msg21"]);
            return
        }
        //4.判断是否需要输入资金密码
        flag = kline.isNeedTradePwd();
        if (flag) {
            kline.showInputTradePwdWindow();
        } else {
            //5.提交请求
            kline.saveCoinTrade(price, num);
        }
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
    showInputTradePwdWindow: function () {
        $('#Login-password-Trade').modal('show');
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
                sweetAlert('', language["user.operation.tips.info.13"], 'success');
                $("#oldpaypasswdinterval").val(interval)
                if (interval == -1) {
                    $(".tradepass_interval_desc").html(language["apple.dom.msg22"] + " ");
                } else if (interval == 0) {
                    $(".tradepass_interval_desc").html(language["apple.dom.msg23"] + " ");
                } else {
                    $(".tradepass_interval_desc").html(language["apple.dom.msg24"] + interval + language["apple.dom.msg25"] + " ");
                }
                window.location.href = window.location.href;
            } else {
                sweetAlert('', result.msg, 'error');
            }
        }, "json");
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
    pnewColor: function (item) {
        if (item.is_increase) {
            $("#kline-nowPrice").removeClass('ryhot').addClass('green')
        } else {
            $("#kline-nowPrice").removeClass('green').addClass('ryhot')
        }
    },
    initScroll: function (id, value, min, max, step, cb) {
        if (isNaN(value) || value <= 0) {
            value = 0;
        }
        $("#" + id).slider({
            range: "min",
            value: value,
            min: min,
            max: max,
            step: step,
            slide: function (event, ui) {
                cb.call(null, ui.value);
            }
        });
        $('#' + id).find('.ui-slider-handle').css('left', value * 100 / max + "%");
        $('#' + id).find('.ui-slider-range').css("width", value * 100 / max + "%")
    },
    buyscrollcb: function (value) {
        if ($("#buy-price").val() == "") {
            return;
        }
        if ($("#buy-price").val() * 0.001 > kline.canbuyuse) {
            $("#buy-volume").text(0);
            $("#buy-amount").val(0);
        } else {
            var answer = value / $("#buy-price").val();
            $("#buy-amount").val(_util.numFormat(answer, 3));
            $("#buy-volume").text(_util.numFormat($("#buy-amount").val() * $("#buy-price").val(), 8));
        }
    },
    sellscrollcb: function (value) {
        if ($("#sell-price").val() == "") {
            return;
        }
        $("#sell-amount").val(value);
        $("#sell-volume").text(_util.numFormat(value * $("#sell-price").val(), 8));
    },
    /*处理最新行情数据*/
    handleLastKlineData: function (data) {
        kline.buysell_obj = {
            canbuy: data.data.canbuy,        //可买
            cansell: data.data.cansell       //可卖
        };
        var value = $("#tradedistrct").text();  //获取当前交易对
        var index = $("#tradedistrct").text().indexOf("/")
        kline.leftcur = $("#tradedistrct").text().slice(1, index);
        kline.rightcur = $("#tradedistrct").text().slice(index + 1, $("#tradedistrct").text().length - 1)

        //买入卖出的地方如果是期权的话就隐藏掉中文，因为会使买入卖出按钮移到下方去
        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        if(reg.test(kline.leftcur) || reg.test(kline.rightcur)){
            $("#buyNameHide").text("");
            $("#tradedistrct").text("");
        }

        /*获取可买可卖*/
        $("#canbuy").text(language["apple.dom.msg69"] +"：" + kline.buysell_obj.canbuy + " " + kline.leftcur);
        $("#cansell").text(language["apple.dom.msg70"] +"：" + kline.buysell_obj.cansell + " " + kline.rightcur);

        var item = data.data;

        /*可用*/
        kline.canbuyuse = _util.numFormat(item.rightotal, 8);
        kline.canselluse = _util.numFormat(item.lefttotal, 8);

        $("#canbuyuse").text(language["apple.dom.msg71"] +"：" + kline.canbuyuse + " " + kline.rightcur);
        $("#canselluse").text(language["apple.dom.msg71"] +"：" + kline.canselluse + " " + kline.leftcur);

        kline.initScroll('buy-slider', $("#buy-volume").text(), 0, kline.canbuyuse, 0.001, kline.buyscrollcb);
        kline.initScroll('sell-slider', $("#sell-amount").val(), 0, kline.canselluse, 0.001, kline.sellscrollcb);
        /*获取当前盘口价*/
        if (kline.isLogin() == 'false') {
            kline.pnewColor(item);
            $(".p_new").text(_util.removeLastZero(_util.numFormat(item.p_new, 8)))
            $(".p_new_usd").hide();
            $(".p_new_cny").hide();
        } else {
            kline.pnewColor(item);
            $(".p_new").text(_util.removeLastZero(_util.numFormat(item.p_new, 8)));
            $(".p_new_usd").hide();
            $(".p_new_cny").hide();
            return false;
            //todo
            if ($(".f-usd").hasClass("active")) {
                $.each(common.iscoinRate, function (index, evitem) {
                    if (evitem.fshortname == kline.rightcur.slice(1)) {
                        kline.pnewColor(item);
                        $(".p_new").text(function (index, oldvalue) {
                            $(this).text(_util.numFormat(item.p_new * evitem.usd, 8))
                        })
                    }
                })
                $(".p_new_usd").show();
                $(".p_new_cny").hide();
                $('.p_new_cur').text('USD')
                $(".showCur").text('USD');
                common.prev_showCur = 'USD'
            } else if ($(".f-cny").hasClass("active")) {
                $.each(common.iscoinRate, function (index, evitem) {
                    if (evitem.fshortname == kline.rightcur.slice(1)) {
                        kline.pnewColor(item);
                        $(".p_new").text(function (index, oldvalue) {
                            $(this).text(_util.numFormat(item.p_new * evitem.cny, 8))
                        })
                    }
                })
                $(".p_new_cny").show();
                $(".p_new_usd").hide();
                $('.p_new_cur').text('CNY')
                common.prev_showCur = 'CNY'
            } else {
                $.each(common.iscoinRate, function (index, evitem) {
                    if (evitem.fshortname == kline.rightcur.slice(1)) {
                        kline.pnewColor(item);
                        $(".p_new").text(function (index, oldvalue) {
                            $(this).text(_util.numFormat(item.p_new * evitem.btc, 8))
                        })
                    }
                })
                $(".p_new_usd").hide();
                $(".p_new_cny").hide();
                $('.p_new_cur').text('BTC')
                common.prev_showCur = 'BTC'
            }
        }
    },
    buyscrollchange: function (amount) {
        $('#buy-slider').find('.ui-slider-handle').css('left', amount.val() * 100 / kline.canbuyuse + "%");
        $('#buy-slider').find('.ui-slider-range').css("width", amount.val() * 100 / kline.canbuyuse + "%");
    },
    sellscrollchange: function (amount) {
        $('#sell-slider').find('.ui-slider-handle').css('left', amount.val() * 100 / kline.canselluse + "%");
        $('#sell-slider').find('.ui-slider-range').css("width", amount.val() * 100 / kline.canselluse + "%")
    },
    buyinput: function () {
        var price = $("#buy-price");
        var amount = $("#buy-amount");
        var volume
        /*1.判断amount  price 是否都存在*/
        if (price.val() && amount.val()) {
            if (price.val() * amount.val() != price.val() * amount.val()) {
                volume = 0;
                kline.buyscrollchange(amount);
                return;
            }
            volume = _util.numFormat(price.val() * amount.val(), 8)
            if (volume < kline.canbuyuse * 1) {
                kline.buyscrollchange(amount);
            } else {
                amount.val(_util.numFormat(kline.canbuyuse / price.val(), 3));
                volume = _util.numFormat(amount.val() * price.val(), 8);
                kline.buyscrollchange(amount);
            }
            $("#buy-volume").html(volume);
        } else {
            volume.text(0);
            kline.buyscrollchange(amount);
            return;
        }
    },
    buyamountinput: function () {
        var price = $("#buy-price");
        var amount = $("#buy-amount");
        var volume

        //判断相乘是否为NAN
        if (price.val() * amount.val() != price.val() * amount.val()) {
            volume = 0;
            kline.buyscrollchange(amount);
            return
        }

        /*如果与价格框相乘大于了可用*/
        if (price.val() * amount.val() > kline.canbuyuse) {
            amount.val(_util.numFormat(kline.canbuyuse / price.val(), 3));
            volume = _util.numFormat(amount.val() * price.val(), 8);
            kline.buyscrollchange(amount);
        } else {
            volume = _util.numFormat(amount.val() * price.val(), 8)
            kline.buyscrollchange(amount);
        }
        $("#buy-volume").html(volume);
    },
    sellinput: function () {
        var price = $("#sell-price");
        var amount = $("#sell-amount");
        var volume
        if (price.val() && amount.val()) {
            //判断相乘是否为NAN
            if (price.val() * amount.val() != price.val() * amount.val()) {
                volume = 0
                return
            } else if (price.val() * 1 > 10000000000) {
                return
            }
            /*计算成交额*/
            volume = _util.numFormat(price.val() * amount.val(), 8);
            kline.sellscrollchange(amount);
        } else {
            volume = 0
        }
        $("#sell-volume").html(volume);
    },
    sellamount: function () {
        var price = $("#sell-price");
        var amount = $("#sell-amount");
        var volume
        if (price.val() && amount.val()) {
            //判断相乘是否为NAN
            if (price.val() * amount.val() != price.val() * amount.val()) {
                volume = 0;
            } else {
                volume = _util.numFormat(price.val() * amount.val(), 8)
            }
            /*计算滚动条*/
            kline.sellscrollchange(amount)
            if (amount.val() * 1 > kline.canselluse * 1) {
                /*卖出数量为可用*/
                amount.val(_util.numFormat(kline.canselluse, 3));
                /*重新计算成交额*/
                volume = _util.numFormat(price.val() * amount.val(), 8);
                /*滚动条*/
                kline.sellscrollchange(amount)
            }
        } else {
            volume = 0;
        }
        $("#sell-volume").html(volume);
    },
    /*获取交易 初始化当前交易价格数量单位*/
    initKlineTradeing: function () {
        var tradedistrct = $("#tradedistrct").text()
        var index = tradedistrct.indexOf("/")
        var leftCur = tradedistrct.slice(0, index)
        var rightCur = tradedistrct.slice(index + 1)

        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        if(reg.test(rightCur) || reg.test(leftCur)){
            $("#time_amount").text(language["apple.dom.msg27"]);
        }else{
            $("#time_amount").text(language["apple.dom.msg27"]  + leftCur + ")");
        }

        $("#klineth-price").text(language["apple.dom.msg26"] + "(" + rightCur);
        $("#time_price").text(language["apple.dom.msg93"] + "(" + rightCur)
        $("#klineth-amount").text(language["apple.dom.msg27"] + leftCur + ")");
        /*$("#time_amount").text(language["apple.dom.msg27"] + leftCur + ")");*/
    },
    kineHeight: function () {
        $(".stock-data-top").css("height", ($(".stock-data").outerHeight() - 285) + "px");
        $('.orderTitle-asks-bids').css("height", ($(".stock-data-top").height() - 30) + "px");
        $('#asks').css("height", ($('.orderTitle-asks-bids').height()) / 2 + "px");
        $('#bids').css("height", ($('.orderTitle-asks-bids').height()) / 2 + "px");
    },
    getSymbolWallets: function () {
        function getUrlparm(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2]; return null;
        }
        var symbol = getUrlparm('symbol');

        //获取相关钱包信息。（在不存在该钱包的时候自动为用户创建钱包）
        $.ajax({
            type: 'get',
            url: "/v/getUserSymbolWallets.html?symbol="+symbol,
            dataType: 'json',
            async: false,
            success: function (data) {
                // 用户钱包信息获取成功
                // 暂时没有数据需要被渲染
            },
            error: function(data){

            }
        })

    },
    getIsOptionExchangeType: function () {
        function getUrlparm(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2]; return null;
        }
        var symbol = getUrlparm('symbol');

        //获取相关钱包信息。（在不存在该钱包的时候自动为用户创建钱包）
        $.ajax({
            type: 'get',
            url: "/v/getIsOptionExchangeType.html?symbol="+symbol,
            dataType: 'json',
            async: false,
            success: function (data) {
                if(200 == data.code){
                    if(data.data.ftype == 1){
                    $("#qiquanBuy").append('<a id="AqiquanBuy" href="/n/optionVirtualIssueOrRedeem.html?symbol='+symbol+'"><b>'+language["apple.dom.msg107"]+'</b></a>');
                    // $("#qiquanSell").append('<a id="AqiquanSell" href="/info/noticelist.html?id='+data.data.fid+'" ><b>合约说明</b></a>');
                    // $("#chongzhi").append('<a id="AheyueHelp" href="/n/recharge.html?coinid='+data.data.frightcoinid+'" ><b>充值</b></a>');
                    }
                }
            },
            error: function(data){

            }
        })

    }
}


$(function () {
    kline.createUserInfo();
    kline.kineHeight();
    /*页面加载执行*/
    kline.getSymbolWallets();
    kline.getIsOptionExchangeType();
    /*深度*/
    kline.userInfoTask();
    kline.tradeInfo();


    /*初始化K线交易*/
    kline.initKlineTradeing()

    //2秒钟拉取一次委单数据和深度数据
    window.setInterval(function () {
        kline.tradeInfo();
    }, 2000);
    /*深度买卖切换*/
    $(".depth_check").click(function () {
        var depth_check = document.querySelector(".depth_check");
        if (depth_check && depth_check.checked) {
            $("#orderbook").addClass("show-depth").removeClass('hide-depth')
        } else {
            $("#orderbook").addClass("hide-depth").removeClass('show-depth')
        }
    })


    //自选市场hover事件
    $(".market-info.box").hover(function () {
        $(this).addClass('active');
    }, function () {
        $(this).removeClass('active');
    })


    /*委托切换*/
    $('.entrust').children().children('h3').each(function (index) {
        $(this).click(function () {
            $(this).addClass('select').siblings().removeClass('select');
            if (index == 0) {
                $("#current-EntrustsTable").show();
                $("#history-EntrustsTable").hide();
            } else {
                $("#current-EntrustsTable").hide();
                $("#history-EntrustsTable").show();
            }
        })
    })


    /*输入框限制位数 以及价格判断*/
    $('#buy-price').on('input', function () {
        //$(this).val(common.retainDemical($(this).val(),9));
        if (common.retainDemical($(this).val(), 9) == "") {
            $(this).addClass('.placeholder');
        } else {
            $(this).val(common.retainDemical(util.trim($(this).val()), 9));
            $(this).removeClass('.placeholder');
        }
        common.judgeform($(this));
        kline.buyinput();
    });
    $('#sell-price').on('input', function () {
        if (common.retainDemical($(this).val(), 9) == "") {
            $(this).addClass('.placeholder');
        } else {
            $(this).val(common.retainDemical(util.trim($(this).val()), 9));
            $(this).removeClass('.placeholder');
        }
        common.judgeform($(this));
        kline.sellinput()
    });
    $('#buy-amount').on('input', function () {
        $(this).val(common.retainDemical($(this).val(), 4));
        common.judgeform($(this));
        kline.buyamountinput()
    });
    $('#sell-amount').on('input', function () {
        $(this).val(common.retainDemical($(this).val(), 4));
        common.judgeform($(this));
        kline.sellamount()
    });


    /*k线 买卖*/
    $("#buy-btn").click(function () {
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        kline.tradeType = 0;
        kline.buysell($("#buy-price"), $("#buy-amount"))
    })
    $("#sell-btn").click(function () {
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        kline.tradeType = 1;
        kline.buysell($("#sell-price"), $("#sell-amount"));
    })


    /*price 增减事件*/
    $("#buy-add").click(function () {
        common.addReducePrice($('#buy-price'), true)
    })
    $("#buy-reduce").click(function () {
        common.addReducePrice($('#buy-price'), false)
    })

    $("#sell-add").click(function () {
        common.addReducePrice($('#sell-price'), true)
    })
    $("#sell-reduce").click(function () {
        common.addReducePrice($('#sell-price'), false)
    })


    //修改资金密码按钮点击事件
    $("#tradeModifyCode-submit").on("click", function () {
        kline.saveTradeModifyCode();
    });

    //输入资金密码后点击事件
    $("#editloginpass-submit").on("click", function () {
        var price, num
        if (kline.tradeType == 0) {
            price = $("#buy-price").val();
            num = $("#buy-amount").val();
        } else {
            price = $("#sell-price").val();
            num = $("#sell-amount").val();
        }
        kline.saveCoinTrade(price, num);
    });


    /*K线委托单*/

    //绑定当前委托和历史委托点击事件
    $("#current-btn").click(function () {
        kline.currentPage = 1;
        kline.currentType = 0;
        kline.getEntrustData();
    })
    $("#history-btn").click(function () {
        kline.currentPage = 1;
        kline.currentType = 1;
        kline.getEntrustData();
    })

    //注册撤销全部委单点击事件
    $(".cancelAllEntrust").click(function () {
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        var type = $(this).data().type;
        if (!type) {
            swal({
                    title: language["apple.dom.msg28"],
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: language["apple.dom.msg29"] + " ",
                    closeOnConfirm: false
                },
                function () {
                    kline.cancelAllEntrust(type);
                });
        } else {
            swal({
                    title: language["apple.dom.msg84"],
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: language["apple.dom.msg29"] + " ",
                    closeOnConfirm: false
                },
                function () {
                    kline.cancelAllEntrust(type);
                });
        }

    })

    //注册撤单事件
    $("#current-EntrustsTable").on("click", '.cancelTrade', function () {
        var id = $(this).data().id;
        kline.cancelTrade(id);
    });


    /*k线币种·切换*/
    /*注册币种tab切换*/
    kline.marketInfo(kline.rightCoinName);
    kline.marketInfo('btc');

    $("#kline-market").on("click", '.kmarket-tab', function () {
        var index = $(this).data().index;
        if (index > 0) {
            kline.isCoinTab = true;
            kline.changeCur(this);
            kline.currentCoinTabName = $(this).data().name;
        } else {
            kline.isCoinTab = false;
        }
    });

    //注册事件
    $("#trade-tab").on("click", '.loveIcon', function () {
        var id = $(this).data().id;
        kline.selfExchangeType(id, false);
    });

    //注册删除自选交易对事件
    $("#trade-tab").on("click", '.selfTempClass', function () {
        var id = $(this).data().id;
        kline.selfExchangeType(id, true);

    });

    //注册自选交易对事件

    $("#kline-market").on("click", "#defaultStart", function () {
        var isLogin = kline.isLogin();
        if (isLogin == 'false') {
            kline.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        $(".kmarket-tab").removeClass('on');
        $(this).addClass('on');
        $.ajax({
            type: 'get',
            url: "/n/getUserAllSelfExchangetype.html",
            dataType: 'json',
            async: false,
            success: function (data) {
                kline.createMarketDom(data);
            }
        })
    })


    /*btc usd cny 折合*/
    var discounTtimer = null
    $("#show-discount").hover(function () {
        clearTimeout(discounTtimer)
        $("#kline-discountmenu").show(100)
    }, function () {
        clearTimeout(discounTtimer)
        discounTtimer = setTimeout(function () {
            $("#kline-discountmenu").hide(100)
        }, 300)
    })
    $("#kline-discountmenu").hover(function () {
        clearTimeout(discounTtimer)
        $(this).show(100)
    }, function () {
        clearTimeout(discounTtimer)
        $(this).hide(100)
    })


    /*kiline usd cny btc 切换*/
    /*资产价值切换*/
    $(".f-usd").click(function () {
        $('#finance-nums').html('<em>' + _util.numFormat(common.allfinance.usd, 8) + ' USD</em>');
        $("#kline-discountmenu").hide();
        $(".f-usd").addClass('active')
        $(".f-cny").removeClass('active')
        $(".f-btc").removeClass('active')
        if (common.prev_showCur == 'CNY') {
            $(".p_new").text(function (index, oldvalue) {
                $(this).text(_util.numFormat(oldvalue / common.allfinance.usdtToCnyRate, 8))
            })
        } else if (common.prev_showCur == 'BTC') {
            $(".p_new").text(function (index, oldvalue) {
                $(this).text(_util.numFormat(oldvalue * common.allfinance.btcToUsdtRate, 8))
            })
        }
        $(".p_new_usd").show();
        $(".p_new_cny").hide();
        $('.p_new_cur').text('USD')
        $(".showCur").text('USD');
        common.prev_showCur = 'USD'

    })
    $(".f-cny").click(function () {
        $('#finance-nums').html('<em>' + _util.numFormat(common.allfinance.cny, 8) + ' CNY</em>');
        $(".showCur").text('CNY');
        $("#kline-discountmenu").hide();
        $(".f-usd").removeClass('active')
        $(".f-cny").addClass('active')
        $(".f-btc").removeClass('active')
        if (common.prev_showCur == 'USD') {
            $(".p_new").text(function (index, oldvalue) {
                $(this).text(_util.numFormat(oldvalue * common.allfinance.usdtToCnyRate, 8))
            })
        } else if (common.prev_showCur == 'BTC') {
            $(".p_new").text(function (index, oldvalue) {
                $(this).text(_util.numFormat((oldvalue * common.allfinance.btcToUsdtRate) * common.allfinance.usdtToCnyRate, 8))
            })
        }
        $(".p_new_cny").show();
        $(".p_new_usd").hide();
        $('.p_new_cur').text('CNY')
        common.prev_showCur = 'CNY'
    })
    $(".f-btc").click(function () {
        $('#finance-nums').html('<em>' + _util.numFormat(common.allfinance.btc, 8) + ' BTC<em>');
        $(".f-usd").removeClass('active')
        $(".f-cny").removeClass('active')
        $(".f-btc").addClass('active')
        $("#kline-discountmenu").hide();
        $(".showCur").text('BTC');
        if (common.prev_showCur == 'CNY') {
            $(".p_new").text(function (index, oldvalue) {
                $(this).text(_util.numFormat(oldvalue / (common.allfinance.usdtToCnyRate * common.allfinance.btcToUsdtRate), 8))
            })
        } else if (common.prev_showCur == 'USD') {
            $(".p_new").text(function (index, oldvalue) {
                $(this).text(_util.numFormat(oldvalue / common.allfinance.btcToUsdtRate, 8))
            })
        }
        $(".p_new_usd").hide();
        $(".p_new_cny").hide();
        $('.p_new_cur').text('BTC')
        common.prev_showCur = 'BTC'
    })
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
    //绑定获取短信验证码按钮事件(修改密码规则)
    $("#tradeModifyCode-sendmessage").on("click", function () {
        msg.sendMsgCode($(this).attr('msgtype'));
    });
    //绑定获取邮箱验证码按钮事件
    $("#tradeModifyCode-sendEmailMessage").on("click", function () {
        msg.sendcodemy($(this).attr("msgtype"), $("#femail").val(), null);
    });
    //websocket注册监听器
    //1.注册深度和最近成交的websocket事件
    WSUtil.registerListener(kline.getRealDepthParam().channel, function (status, res) {
        if (status) {
            //console.info('websocket接入,获取深度，行情，最近成交数据');
            res ? kline.handleDepthAndSuccessData(res.data.buys, res.data.sells, res.data.trades) : kline.getDepth();
            res ? kline.handleLastKlineData(res) : kline.getDepth();
        } else {
            //ajax方式获取数据
            console.info('非websocket接入,获取深度，行情，最近成交数据');
            kline.getDepth();
        }
    });
    //websocket注册监听器
    var entrustParam = kline.getEntrustParam();
    if (entrustParam) {
        WSUtil.registerListener(entrustParam.channel, function (status, res) {
            if (status) {
                if (res) {
                    //格式化数据，兼容老的接口
                    var data = {};
                    data.data = {};
                    if (res.data) {
                        data.data.currentEntrust = res.data.Goingfentrusts;
                        data.data.historyEntrust = res.data.Cancelfentrusts;
                        data.data.totalPages = res.data.GoingfentrustsPages;
                        //console.info('websocket接入，获取委单数据');
                        kline.handleEntrustData(data);
                    }
                } else {
                    kline.connectEntrustWebSocket();
                }
            } else {
                //ajax方式获取数据
                console.info('非websocket接入，获取委单数据');
                kline.getEntrustData();
            }
        });
    }
})
$(".stock-data-top").css("height", ($(".stock-data").outerHeight() - 285) + "px");