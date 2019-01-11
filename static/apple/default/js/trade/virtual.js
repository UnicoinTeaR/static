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
var vartualEntrustBuylist =[];
var vartualEntrustSelllist =[];
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
    currentTabOnoff: true,
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
    judgeform: function (obj, volume) {
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
                volume.text(0)
                str = "";

            } else if (str[0] == ".") {
                volume.text(0)
                str = "";

            } else if (str[0] == 0 && str[1] != "." && str[1] != null) {
                volume.text(0)
                str = "";

            }
            $(this).val(str);
        })
    },
    createMarketDom: function (data) {
        var dom = [];
        $.each(data.data, function (index, item) {
            dom.push('<ul>');
            if (item.selfId) {
                dom.push('<li data-id=' + item.selfId + ' class="selfTempClass"><span class="icon iconfont icon-shoucang ryhot"></span></li>');
            } else {
                dom.push('<li data-id=' + item.id + ' class="loveIcon"><span class="icon iconfont icon-shoucang"></span></li>');
            }
            dom.push('<li class="ng-binding">');
            dom.push('<a href="/n/virtual.html?symbol=' + item.code + '">' + item.name + '</a>');
            dom.push('</li>');
            dom.push('<li class="ng-binding">' + item.p_new + '</li>');
            dom.push('<li class="ng-scope clinchvol">');
            dom.push('<span class="ng-binding ng-scope ');
            if (trade.isclinch == 1) {  //成交量
                if (item.is_increase) {
                    dom.push('ryhot" style="display:none">');
                } else {
                    dom.push('green" style="display:none">');
                }
                dom.push(item.rose + "%");
                dom.push('</span>');
                dom.push('<span class="ng-binding ng-scope">' + item.vol + '</span>');
            } else {
                if (item.is_increase) {
                    dom.push('ryhot">');
                } else {
                    dom.push('green">');
                }
                dom.push(item.rose + "%");
                dom.push('</span>');
                dom.push('<span class="ng-binding ng-scope" style="display:none">' + item.vol + '</span>');
            }
            ;
            dom.push('</li>');
            dom.push('</ul>');
        });
        $('#market-con').html(dom.join(''));
    },
    //创建用户信息
    createUserDom: function (data) {
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        var user= data.data;
        $("#p_rank").html(user.franking);
        $("#p_tb").html(_util.numFormat(user.ftotalBalance, 4));
        $("#p_tyr").html(_util.numFormat(user.ftotalYieldRate, 4));
        $("#p_dy").html(_util.numFormat(user.fdayYield, 4));
        $("#p_myr").html(_util.numFormat(user.fmouthYieldRate, 4));
        $("#p_yyr").html(_util.numFormat(user.fyearYieldRate, 4));
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
        //获取币种信息
        var value = $("#nowCur").text();  //获取当前交易对
        var index = $("#nowCur").text().indexOf("/")
        //左边的币种，可买
        var leftcur = $("#nowCur").text().slice(0, index).slice(0);
        //右边的币种，可卖
        var rightcur = $("#nowCur").text().slice(index + 1).slice(1);
        var canbuyuse = "";
        var canselluse="";
            for(var i = 0;i<data.data.wallets.length;i++){
            if(data.data.wallets[i].fshortName.toLowerCase() == rightcur.toLowerCase().trim()){
                canbuyuse = data.data.wallets[i].ftotal;
                $("#canbuyuseVirtaul").text(language["apple.dom.msg71"] + "： " + data.data.wallets[i].ftotal + " " + rightcur);
            }
            if(data.data.wallets[i].fshortName.toLowerCase() == leftcur.toLowerCase().trim()){
                canselluse = data.data.wallets[i].ftotal;
                $("#canselluseVirtaul").text(language["apple.dom.msg71"] + "： " + data.data.wallets[i].ftotal + " " + leftcur);
            }
            //生成进度
            trade.canbuyusevirtual = _util.numFormat(canbuyuse, 8);
            trade.cansellusevirtual = _util.numFormat(canselluse, 8);
            trade.initScroll('buy-slider', $("#buy-volume").text(), 0, trade.canbuyusevirtual, 0.001, trade.buyscrollcb);
            trade.initScroll('sell-slider', $("#sell-amount").val(), 0, trade.cansellusevirtual, 0.001, trade.sellscrollcb);
        }
    },
    depthRender1: function (item, widthRatio, isSell) {
        var dom = [];
        if (isSell) {
            dom.push('<span class="ryhot  "></span>');
        } else {
            dom.push('<span class="green  " ></span>');
        }
        if (isSell) {
            dom.push('<span class="ryhot depthprice sellprice">');
        } else {
            dom.push('<span class="green depthprice buyprice">');
        }
        dom.push('<span class="f-left">' + item.price + '</span>')
        dom.push('</span>');
        dom.push('<span class="f-right depthamount" style="margin-left: 30px;">');
        dom.push('<span>');
        dom.push(item.amount);
        dom.push('</span>');
        dom.push('</span>');
//        dom.push('<span class="f-right depthvolume">');
//        dom.push('<span>');
//        var dealprice=item.price*item.amount;
//        var str=dealprice.toString()
//        var index=str.indexOf('.');
//        var dealprice=str.slice(0,index+9);
//        dom.push(dealprice);
//        dom.push('</span>');
//        dom.push('<span class="zhuzhuang" style="width:'+widthRatio+'px">');
//        dom.push('</span>');
//        dom.push('</span>');
        return dom.join('');
    },
    /*深度渲染*/
    depthRender: function (item, dom, isask, widthRatio) {
        if (isask) {
            dom.push('<div class="depthsell" data-price="' + item.price + '" data-amount="' + item.amount + '">');
        } else {
            dom.push('<div class="depthbuy">');
        }

        if (isask) {
            dom.push('<span class="">卖' + item.index + '</span>');
            dom.push('<span class="ryhot depthprice sellprice">');
        } else {
            dom.push('<span class="">买' + item.index + '</span>');
            dom.push('<span class="green depthprice buyprice">');
        }
        dom.push('<span class="f-left">' + item.price + '</span>')
        dom.push('</span>');
        dom.push('<span class="f-right depthamount">');
        dom.push('<span>');
        dom.push(item.amount);
        dom.push('</span>');
        dom.push('</span>');
//        dom.push('<span class="f-right depthvolume">');
//        dom.push('<span>');
//        var dealprice=item.price*item.amount;
//        var str=dealprice.toString()
//        var index=str.indexOf('.');
//        var dealprice=str.slice(0,index+9);
//        dom.push(dealprice);
//        dom.push('</span>');
//        dom.push('<span class="zhuzhuang" style="width:'+widthRatio+'px">');
//        dom.push('</span>');
//        dom.push('</span>');
        dom.push('</div>');
    },
    /*求数组最大值*/
    search_max: function (arr) {
        return Math.max.apply(null, arr);
    },
    tradeInfo: function () {
        $.ajax({
            type: "get",
            url: "/n/getAllExchangeType.html?" + Math.round(Math.random() * 100),
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    var dom = [];
                    dom.push('<li class="f-fl clickf-fr" id="defaultStart" data-index="0"><span class="icon iconfont icon-shoucang ng-binding">' + language["apple.dom.msg68"] + '</span></li>');
                    $.each(data.data, function (index, item) {
                        if (trade.currentCoinTabName != "") {
                            if (trade.currentCoinTabName == item.name) {
                                dom.push(' <li class="f-fr f-nomargin active clickf-fr" data-index=' + (index + 1) + ' data-name=' + item.name + '>');
                            } else {
                                dom.push(' <li class="f-fr clickf-fr" data-index=' + (index + 1) + ' data-name=' + item.name + '>');
                            }
                        } else {
                            if (index == 0) {
                                trade.currentCoinTabName = item.name;
                                dom.push(' <li class="f-fr f-nomargin active clickf-fr" data-index=' + (index + 1) + ' data-name=' + item.name + '>');
                            } else {
                                dom.push(' <li class="f-fr clickf-fr" data-index=' + (index + 1) + ' data-name=' + item.name + '>');
                            }
                        }
                        dom.push(item.name);
                        dom.push('</li>');
                    });
                    $('#marketTrade').html(dom.join(''));
                }
            }
        });
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
    /*获取深度和最近成交数据*/
    depthchange: function () {
        if (WSUtil.isConnected()) {
            trade.connectDepthWebSocket();
            return;
        }
        $.ajax({
            type: 'get',
            url: "/n/getDepthAndSuccessData.html?" + Math.round(Math.random() * 100),
            dataType: 'json',
            data: {
                symbol: $("#fcode").val(),
                mergeType: trade.demical
            },
            success: function (data) {
                if (data.success) {
                    //处理数据
                    trade.handleDepthAndSuccessData(data.data.buys, data.data.sells, data.data.trades);
                    trade.handleLastKlineData(data);
                }
            }
        })
        //2秒钟跑一次
        setTimeout(trade.depthchange, 2000);
    },
    /**
     * 处理深度和最新成交数据
     */
    handleDepthAndSuccessData: function (buys, sells, trades) {

        /*买*/
        /*获取买卖的数量   求出最大数量*/
        var amount_obj = trade.amounArr(buys, sells)

        /*买的最大数量*/
        var maxAmountBuy = trade.search_max(amount_obj.buyAmount);

        /*卖的最大数量*/
        var maxAmountSell = trade.search_max(amount_obj.sellAmount);
        
        /*清空买的dish-hands*/
        $("#buy-dish-hands").empty();
        $.each(buys, function (index, item) {
            trade.getDishHandsDom(index, true);
        });
//
//        /*卖*/
//        /*清空卖的dish-hands*/
        $("#sell-dish-hands").empty();
        for (var i = sells.length - 1; i >= 0; i--) {
            trade.getDishHandsDom(i, false);
        }
        
        /*买渲染*/
        //1.查找修改和插入数据节点
        trade.insertAndModiDepthDom(buys, false, maxAmountBuy);
        //2.查找需要删除的节点
        trade.delDepthDom(buys, false);

        /*最佳买价*/
        if (sells[0] && $('#buy-price').val() == '' && !$('#buy-price').hasClass('.placeholder')) {
            $('#buy-price').val(sells[0].price);
        }
        /*卖渲染*/
        //1.查找修改删插入数据节点
        trade.insertAndModiDepthDom(sells, true, maxAmountSell);
        //2.查找需要删除的节点
        trade.delDepthDom(sells, true);
        /*最佳卖价*/
        if (buys[0] && $('#sell-price').val() == '' && !$('#sell-price').hasClass('.placeholder')) {
            $('#sell-price').val(buys[0].price);
        }
        //渲染最新成交的数据
        trade.newDeal(trades);
        trade.depthClick($('.depthbuy'), '.buyprice', $("#sell-amount"), $("#sell-volume"), $("#buy-amount"), 'canselluse', 0)
        trade.depthClick($('.depthsell'), '.sellprice', $("#buy-amount"), $("#buy-volume"), $("#sell-amount"), 'canbuyuse', 1)
    },
    getDishHandsDom: function (index, isbuy) {
        if (isbuy) {
            $("#buy-dish-hands").append("<li class='green'>" + language["apple.dom.msg9"] + (index * 1 + 1) + "</li>");
        } else {
            $("#sell-dish-hands").append("<li class='ryhot'>" + language["apple.dom.msg10"]+ (index * 1 + 1) + "</li>");
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
            tempDiv.css({"margin-left": "70px"});
            var isDel = true;
            var tt = sellDiv[j];
            var findPrice = tempDiv.attr("data-price");
            for (var n = data.length - 1; n >= 0; n--) {
                if (findPrice == data[n].price) {
                    isDel = false;
                    break;
                }
            }
            if (isDel) {
                //console.info("需要删除的节点",tt);
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
                util.removeElement($("." + needRemoveClass)[a]);
                //$("."+needRemoveClass)[a].remove();
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
        /*获取当前数量的最大值*/

        var needAppendDiv = [];
        for (var i = data.length - 1; i >= 0; i--) {
            var item = data[i];
            item.index = i + 1;
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
                //console.info("需要插入的节点",item);
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
                var amount_w = (item.amount / maxAmountSell) * $('.bidTable').width();
                var appendDom = trade.depthRender1(item, amount_w, isSell);
                var div = $('<div style="background-color: ' + bcolor + ';height: 0px;" class="' + allClass + '" data-price="' + item.price + '" data-amount="' + item.amount + '"></div>');
                div.css({"opacity": 0});
                div.html(appendDom);
                if (appendDiv != null) {
                    //console.info("找到插入的节点",appendDiv);
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
                needModiDiv.find(".depthamount").text(item.amount);
                needModiDiv.attr("data-amount", item.amount);
                var dealprice = item.price * item.amount;
                var str = dealprice.toString();
                var index = str.indexOf('.');
                var dealprice = str.slice(0, index + 9);
                var amount_w = (item.amount / maxAmountSell) * $('.bidTable').width();
                needModiDiv.find(".depthvolume").children().eq(0).text(dealprice);
                needModiDiv.find(".depthvolume").children().eq(1).animate({"width": amount_w}, 1000, "linear");
            }
        }

        //执行新增节点动画
        setTimeout(function () {
            for (var a = 0; a < needAppendDiv.length; a++) {
                needAppendDiv[a].animate({
                    opacity: 1,
                    height: '24px',
                    backgroundColor: "#fff"
                }, 1000);
            }
        }, 1000)
    },
    /**
     * 处理最新行情数据
     */

    handleLastKlineData: function (data) {
        trade.buysell_obj = {
            canbuy: data.data.canbuy,        //可买
            cansell: data.data.cansell       //可卖
        };
        var value = $("#nowCur").text();  //获取当前交易对
        var index = $("#nowCur").text().indexOf("/")
        trade.leftcur = $("#nowCur").text().slice(0, index);
        trade.rightcur = $("#nowCur").text().slice(index + 1);

        $("#canbuyVirtaul").text(language["apple.dom.msg69"] + "：" + " " + trade.buysell_obj.canbuy + " " + trade.leftcur);
        $("#cansellVirtaul").text(language["apple.dom.msg70"] + "：" + " " + trade.buysell_obj.cansell + " " + trade.rightcur);
        $(".left-currency").text(language["apple.dom.msg26"] + "(" + trade.rightcur + ")")
        $(".center-currency").text(language["apple.dom.msg27"] + "(" + trade.leftcur + ")")
        var dom = [];
        var item = data.data;
        $("#p_new").text(_util.numFormat(item.p_new, 8));
        $("#p_new_newest_value").text(_util.removeLastZero(_util.numFormat(item.p_new, 8)));
        if (item.is_increase) {
            $("#p_new_newest").removeClass('ryhot').addClass('green');
            $("#p_rose").text(item.rose + "%").removeClass('ryhot').addClass('green');
        } else {
            $("#p_new_newest").removeClass('green').addClass('ryhot');
            $("#p_rose").text(item.rose + "%").removeClass('green').addClass('ryhot');
        }

        $("#p_height").text(item.height).addClass('green');
        $("#p_low").text(_util.numFormat(item.low, 8)).addClass('ryhot');
        $("#p_vol").text(item.vol + " " + $("#rightCoinName").val());


        trade.canbuyuse = _util.numFormat(item.rightotal, 4);
        trade.canselluse = _util.numFormat(item.lefttotal, 4);

        $("#canbuyuse").text(language["apple.dom.msg71"] + "： " + trade.canbuyuse + " " + trade.rightcur);
        $("#canselluse").text(language["apple.dom.msg71"] + "： " + trade.canselluse + " " + trade.leftcur);
        $("#nowTradeCur").text(" " + trade.rightcur)
        $("#nowSellCur").text(" " + trade.rightcur)

        //修改页面title属性
        if (item.p_new) {
            $("title").html(util.numFormat(item.p_new, 8) + $("#fshortname").val());
        }

        /*初始化折合卖1价*/
        if (trade.type == 0) {
            $("#cur-logo").text('￥');
            $("#cur-name").text('');
            var nowCur = trade.rightcur.slice(1)
            $.each(common.iscoinRate, function (index, item) {
                if (item.fshortname == nowCur) {
                    $("#discount-val").text(common.retainDemical($("#buy-price").val() * item.cny, 4))
                }
            })
        } else if (trade.type == 1) {
            $("#cur-logo").text("$");
            $("#cur-name").text('');
            var nowCur = trade.rightcur.slice(1)
            $.each(common.iscoinRate, function (index, item) {
                if (item.fshortname == nowCur) {
                    $("#discount-val").text(common.retainDemical($("#buy-price").val() * item.usd, 4))
                }
            })
        } else if (trade.type == 2) {
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
    buyscrollcb: function (value) {
        if ($("#buy-price").val() == "") {
            return;
        }
        if ($("#buy-price").val() * 0.001 >trade.canbuyusevirtual) {
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
    buyscrollchange: function (volume) {
        $('#buy-slider').find('.ui-slider-handle').css('left', volume.text() * 100 / trade.canbuyusevirtual + "%");
        $('#buy-slider').find('.ui-slider-range').css("width", volume.text() * 100 / trade.canbuyusevirtual + "%");
    },
    sellscrollchange: function (amount) {
        $('#sell-slider').find('.ui-slider-handle').css('left', amount.val() * 100 / trade.cansellusevirtual + "%");
        $('#sell-slider').find('.ui-slider-range').css("width", amount.val() * 100 / trade.cansellusevirtual + "%")
    },
    buyinput: function () {
        var price = $("#buy-price");
        var amount = $("#buy-amount");
        var volume = $("#buy-volume");
        /*1.判断amount  price 是否都存在*/
        if (price.val() && amount.val()) {
            if (price.val() * amount.val() != price.val() * amount.val()) {
                volume.text(0);
                trade.buyscrollchange(volume);
                return
            }
            volume.text(_util.numFormat(price.val() * amount.val(), 8));
            if (volume.text() * 1 < trade.canbuyusevirtual * 1) {
                trade.buyscrollchange(volume);
            } else {
                amount.val(_util.numFormat(trade.canbuyusevirtual / price.val(), 3));
                volume.text(_util.numFormat(amount.val() * price.val(), 8));
                trade.buyscrollchange(volume);
            }
        } else {
            volume.text(0);
            trade.buyscrollchange(volume);
        }
    },
    buyamountinput: function () {
        var price = $("#buy-price");
        var amount = $("#buy-amount");
        var volume = $("#buy-volume");

        //判断相乘是否为NAN
        if (price.val() * amount.val() != price.val() * amount.val()) {
            volume.text(0);
            trade.buyscrollchange(volume);
            return
        }

        /*如果与价格框相乘大于了可用*/
        if (price.val() * amount.val() > trade.canbuyusevirtual) {
            amount.val(_util.numFormat(trade.canbuyusevirtual / price.val(), 3));
            volume.text(_util.numFormat(amount.val() * price.val(), 8));
            trade.buyscrollchange(volume);
        } else {
            volume.text(_util.numFormat(amount.val() * price.val(), 8));
            trade.buyscrollchange(volume);
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
            if (amount.val() * 1 > trade.cansellusevirtual * 1) {
                /*卖出数量为可用*/
                amount.val(_util.numFormat(trade.cansellusevirtual, 3));
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
    /*获取市场交易对信息*/
    marketInfo: function (coin) {
        trade.currentCoinName = coin;
        $.ajax({
            type: "post",
            url: "/n/getAllLastKlineByCoinName.html",
            dataType: 'json',
            data: {
                coinName: coin
            },
            success: function (data) {
                if (data.success) {
                    trade.createMarketDom(data)
                }
            }
        })
    },
    /*获取用户排名*/
    marketInfo: function () {
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            console.info("===================== test =====================");
            console.info(language["apple.dom.msg97"]);
            console.info(language["apple.dom.msg12"]);
            console.info("===================== test =====================");
            trade.showLoginWinwowNoCancel(language["apple.dom.msg97"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        $.ajax({
            type: "get",
            url: "/n/virtualUser.html",
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
            },
            success: function (data) {
                var code = data.code;
                if(404 == code){
                //说明用户没有注册虚拟钱包
                    window.location.href = "/n/virtualApply.html";
                    // trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
                }
                if(401 == code){
                    //用户失效，请重新登录
                    trade.showLoginWinwowNoCancel(language["apple.dom.msg97"], "/user/login.html", language["apple.dom.msg12"]);
                    return;
                }
                   trade.createUserDom(data);
                   trade.getVirtualEntrustData();
            }
        })
    },
    /*获取用户排名*/
    userInfoTask: function () {
        //每2秒刷新一次
        window.setInterval(function () {
            trade.marketInfo();
        }, 2000);
    },
    /**保存用户自选交易对*/
    selfExchangeType: function (id, isDelete) {
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwowNoCancel(language["apple.dom.msg97"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        var url = "/n/saveSelfExchangeType.html";
        if (isDelete) {
            url = "/n/removeSelfExchangetype.html";
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
                if (trade.isCoinTab) {
                    trade.marketInfo(trade.currentCoinName);
                } else {
                    $("#defaultStart").click();
                }
            }
        })
    },
    getVirtualEntrustData: function () {
        var userId = $("#userId").val();
        if (!userId) {
            return;
        }
        var param = {};
        param.symbol = $("#fcode").val();
        param.tradeType = -1;//（-1：全部委托单，0：买入单，1：卖出单）
        param.type = trade.currentType;//（0：当前，1：历史）
        param.currentPage = trade.currentPage;
        param.pageSize = 5;
        if(trade.currentType == 0){
            $.ajax({
                type: 'get',
                url: "/n/virtualEntrust.html",
                dataType: 'json',
                data: param,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
                },
                success: function (data) {
                    if (data.code == 200) {
                        trade.handleVirtualEntrustData(data);
                    }
                    if (data.code == 404) {
                        //说明用户没有信息
                        var dom = [];
                        if (trade.currentType == 0) {
                            if($("#pageUl").length > 0) {
                                $("#pageUl").remove();
                            }
                            $("#currentEntrusts").html(dom.join(''));
                            $("#historyEntrustsTable").hide();
                            $("#currentEntrustsTable").show();
                        } else {
                            if($("#pageUl").length > 0) {
                                $("#pageUl").remove();
                            }
                            $("#historyEntrusts").html(dom.join(''));
                            $("#currentEntrustsTable").hide();
                            $("#historyEntrustsTable").show();
                        }
                        trade.currentTabOnoff = true;
                    }
                }
            })
        }
        if(trade.currentType == 1){
            $.ajax({
                type: 'get',
                url: "/n/virtualEntrustHistory.html",
                dataType: 'json',
                data: param,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("token",$.getCookie('token'));
                },
                success: function (data) {
                    if (data.code == 200) {
                        trade.handleVirtualEntrustHistoryData(data);
                    }
                    if (data.code == 404) {
                        //说明用户没有信息
                        var dom = [];
                        if (trade.currentType == 0) {
                            if($("#pageUl").length > 0) {
                                $("#pageUl").hide();
                            }
                            $("#currentEntrusts").html(dom.join(''));
                            $("#historyEntrustsTable").hide();
                            $("#currentEntrustsTable").show();
                        } else {
                            if($("#pageUl").length > 0) {
                                $("#pageUl").hide();
                            }
                            $("#historyEntrusts").html(dom.join(''));
                            $("#currentEntrustsTable").hide();
                            $("#historyEntrustsTable").show();
                        }
                        trade.currentTabOnoff = true;
                    }
                }
            })
        }

        //2秒钟跑一次，获取委单数据信息
        // setTimeout(trade.getVirtualEntrustData, 2000);
    },
    /**
     * 处理委单数据(old)
     * @param data
     */
    handleEntrustData: function (data) {
        alert(data.data.totalPages);
        if (!data.data || !data.data.totalPages) {
            return;
        }
        trade.createEntrustDom(data.data);
        common.getPageDom(trade.currentPage, data.data.totalPages, "pageUl", trade.getgetEntrustDataByType);
        trade.currentTabOnoff = true;
    },
    /**
     * 处理委单数据
     * @param data
     */
    handleVirtualEntrustData: function (data) {
        $("#pageUl").show();
        var total = Math.ceil(data.data.total/data.data.pageSize);
        if (!data.data || !total) {
            return;
        }
        trade.createVirtualEntrustDom(data.data);
        common.getPageDom(data.data.pageNum, total, "pageUl", trade.getgetEntrustDataByType);
        trade.currentTabOnoff = true;
    },
    /**
     * 处理历史委单数据
     * @param data
     */
    handleVirtualEntrustHistoryData: function (data) {
        $("#pageUl").show();
        var total = Math.ceil(data.data.total/data.data.pageSize);
        if (!data.data || !total) {
            return;
        }
        trade.createEntrustHistoryDom(data.data);
        common.getPageDom(data.data.pageNum, total, "pageUl", trade.getgetEntrustDataByType);
        trade.currentTabOnoff = true;
    },
    getgetEntrustDataByType: function (page) {
        trade.currentPage = page;
        trade.getVirtualEntrustData();
    },
    //根据委单数据创建委单数据dom节点
    createVirtualEntrustDom: function (data) {
        // if (trade.currentType == 0) {
        //     data = data.currentEntrust;
        // } else {
        //     data = data.historyEntrust;
        // }
        if (!data) {
            return;
        }
        var dom = [];
        //先赋值为空
        vartualEntrustBuylist.length = 0
        vartualEntrustSelllist.length = 0
        for (var i = 0; i < data.entrustList.length; i++) {
            var d = data.entrustList[i];
            var dateStr;
            if(typeof(d.fcreateTime[3]) == "undefined"){
                d.fcreateTime[3] = "00";
            }
            if(typeof(d.fcreateTime[4]) == "undefined"){
                d.fcreateTime[4] = "00";
            }
            if(typeof(d.fcreateTime[5]) == "undefined"){
                d.fcreateTime[5] = "00";
            }
            if(d.fcreateTime[3] <10){
                d.fcreateTime[3] = "0" + d.fcreateTime[3];
            }
            if(d.fcreateTime[4]<10){
                d.fcreateTime[4] = "0" + d.fcreateTime[4];
            }
            if(d.fcreateTime[5]<10){
                d.fcreateTime[5] = "0" + d.fcreateTime[5];
            }
             dateStr = (d.fcreateTime[0]+"年"+d.fcreateTime[1]+"月"+d.fcreateTime[2] +"日" + "<br/>"
                    +d.fcreateTime[3]+"时"+d.fcreateTime[4]+"分"+d.fcreateTime[5]+"秒")

            dom.push('<tr role="row" class="odd">');
            dom.push('<td class="f-left">' + dateStr + '</td>');
            if(d.ftype == 0){
                dom.push('<td class="f-center">买</td>');
                //往数组里放id
                vartualEntrustBuylist.push(d.fid);
            }else if(d.ftype == 1){
                dom.push('<td class="f-center">卖</td>');
                //往数组里放id
                vartualEntrustSelllist.push(d.fid);
            }else{
                dom.push('<td class="f-center">' + d.ftype + '</td>');
            }
            dom.push('<td class="f-center">' + _util.numFormat(d.fprize, 4) + '</td>');
            dom.push('<td class="f-center">' + _util.numFormat(d.fcount, 4) + '</td>');
            dom.push('<td class="f-center">' + _util.numFormat(d.ftotalPrize, 4) + '</td>');
            // dom.push('<td class="f-center">' + d.fstatus + '</td>');
            if(d.fstatus == 1){
                dom.push('<td class="f-center">未成交</td>');
            }else if(d.fstatus == 2){
                dom.push('<td class="f-center">部分成交</td>');
            }else if(d.fstatus == 3){
                dom.push('<td class="f-center">完全成交</td>');
            }else if(d.fstatus == 4){
                dom.push('<td class="f-center">撤单处理中</td>');
            }else if(d.fstatus == 5){
                dom.push('<td class="f-center">已撤销</td>');
            }else{
                dom.push('<td class="f-center">订单异常</td>');
            }
            if (trade.currentType == 0) {
                dom.push('<td class="f-right"><a class="cancelTrade" data-id=' + d.fid + '>撤单</a></td>');
            }
            dom.push('</tr>');
        }
        if (trade.currentType == 0) {
            $("#currentEntrusts").html(dom.join(''));
            $("#historyEntrustsTable").hide();
            $("#currentEntrustsTable").show();
        } else {
            $("#historyEntrusts").html(dom.join(''));
            $("#currentEntrustsTable").hide();
            $("#historyEntrustsTable").show();
        }
    },
    //根据历史委单数据创建委单数据dom节点
    createEntrustHistoryDom: function (data) {
        // if (trade.currentType == 0) {
        //     data = data.currentEntrust;
        // } else {
        //     data = data.historyEntrust;
        // }
        if (!data) {
            return;
        }
        var dom = [];

        for (var i = 0; i < data.entrustHistoryList.length; i++) {
            var d = data.entrustHistoryList[i];
            var dateStr;
            if(typeof(d.fcreateTime[3]) == "undefined"){
                d.fcreateTime[3] = "00";
            }
            if(typeof(d.fcreateTime[4]) == "undefined"){
                d.fcreateTime[4] = "00";
            }
            if(typeof(d.fcreateTime[5]) == "undefined"){
                d.fcreateTime[5] = "00";
            }
            dateStr = (d.fcreateTime[0]+"年"+d.fcreateTime[1]+"月"+d.fcreateTime[2] +"日" + "<br/>"
            +d.fcreateTime[3]+"时"+d.fcreateTime[4]+"分"+d.fcreateTime[5]+"秒")

            dom.push('<tr role="row" class="odd">');
            dom.push('<td class="f-left">' + dateStr + '</td>');
            if(d.ftype == 0){
                dom.push('<td class="f-center">买</td>');
            }else if(d.ftype == 1){
                dom.push('<td class="f-center">卖</td>');
            }else{
                dom.push('<td class="f-center">' + d.ftype + '</td>');
            }
            dom.push('<td class="f-center">' + _util.numFormat(d.fprize, 4) + '</td>');
            // if (trade.currentType == 0) {
            //     dom.push('<td class="f-center">' + d.fcount + ' / ' + d.okCount + '</td>');
            // } else {
            //     dom.push('<td class="f-center">' + d.fcount + ' / ' + trade.retainDemical(d.fcount - d.fleftcount, 4) + '</td>');
            // }
            dom.push('<td class="f-center">' + _util.numFormat(d.fcount, 4) + '</td>');
            dom.push('<td class="f-center">' + _util.numFormat(d.ftotalPrize, 4) + '</td>');
            dom.push('<td class="f-center">' + _util.numFormat(d.fsuccessPrize, 4) + '</td>');
            dom.push('<td class="f-center">' + _util.numFormat(d.fsuccessTotalPrize, 4) + '</td>');
            dom.push('<td class="f-center">' + _util.numFormat(d.ffees, 4) + '</td>');
            if(d.fstatus == 1){
                dom.push('<td class="f-center">未成交</td>');
            }else if(d.fstatus == 2){
                dom.push('<td class="f-center">部分成交</td>');
            }else if(d.fstatus == 3){
                dom.push('<td class="f-center">完全成交</td>');
            }else if(d.fstatus == 4){
                dom.push('<td class="f-center">撤单处理中</td>');
            }else if(d.fstatus == 5){
                dom.push('<td class="f-center">已撤销</td>');
            }else{
                dom.push('<td class="f-center">订单异常</td>');
            }
            dom.push('</tr>');
        }
        if (trade.currentType == 0) {
            $("#currentEntrusts").html(dom.join(''));
            $("#historyEntrustsTable").hide();
            $("#currentEntrustsTable").show();
        } else {
            $("#historyEntrusts").html(dom.join(''));
            $("#currentEntrustsTable").hide();
            $("#historyEntrustsTable").show();
        }
    },
    //撤单
    cancelTrade: function (id) {
        var symbol = $("#fcode").val();
        var ids = [];
        ids.push(id);
        $.ajax({
            type: "post",
            url: "/n/virtualEntrustCancel.html",
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
            },
            data: {ids: ids,symbol:symbol},
            success: function (data) {
                if(data.code == 200){
                    sweetAlert('', language["apple.dom.msg13"], 'success');
                    trade.getVirtualEntrustData();
                }

            }
        })
    },

    //撤销全部订单
    cancelAllEntrust: function (type) {
        var symbol = $("#fcode").val();
        //type = 0就是买，1就是卖
        if(type == 0){
            $.ajax({
                type: 'post',
                url: "/n/virtualEntrustCancel.html",
                dataType: 'json',
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
                },
                data: {symbol: symbol,ids: vartualEntrustBuylist},
                success: function (data) {
                    if (data.code) {
                        if (data.code == "200") {
                            sweetAlert('', language["apple.dom.msg13"], 'success');
                        } else {
                            sweetAlert('', data.msg, 'error');
                        }
                        trade.currentPage = 1;
                        trade.currentType = 0;
                        trade.getVirtualEntrustData();
                    }
                }
            })
        }else if(type == 1){
            $.ajax({
                type: 'post',
                url: "/n/virtualEntrustCancel.html",
                dataType: 'json',
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
                },
                data: {symbol: symbol,ids:vartualEntrustSelllist},
                success: function (data) {
                    if (data.code) {
                        if (data.code == "200") {
                            sweetAlert('', language["apple.dom.msg13"], 'success');
                        } else {
                            sweetAlert('', data.msg, 'error');
                        }
                        trade.currentPage = 1;
                        trade.currentType = 0;
                        trade.getVirtualEntrustData();
                    }
                }
            })
        }

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
    showLoginWinwowNoCancel: function (content, url, sureText) {
        swal({
                title: "",
                text: content,
                type: "warning",
                showCancelButton: false,
                confirmButtonText: sureText,
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
    validateTradeEntrustNums: function (price, type) {
        if (type == 0 && price == 0 ) {
            sweetAlert('', language["apple.dom.msg99"], "error");
            return false;
        }
        if (type == 1 && price == 0 ) {
            sweetAlert('', language["apple.dom.msg100"], "error");
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
    saveCoinVirtual: function (tradePrice, tradeAmount) {
        var symbol = $("#fcode").val();
        if (trade.tradeType == 0) {
            url = "/n/virtualEntrust.html";
            param = {
                tradeAmount: tradeAmount,
                tradeCnyPrice: tradePrice,
                symbol: symbol,
                tradeType: "buy"
            }
        } else {
            url = "/n/virtualEntrust.html";
            param = {
                tradeAmount: tradeAmount,
                tradeCnyPrice: tradePrice,
                symbol: symbol,
                tradeType: "sell"
            }
        }


        /*$("#sell-vomume").text(_util.numFormat($("#sell-price").val('')*$("#sell-amount").val(''),8))
        $("#buy-vomume").text(_util.numFormat($("#buy-price").val('')*$("#buy-amount").val(''),8))*/
        $.ajax({
            url: url,
            data: param,
            dataType: "json",
            type: "post",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
            },
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
                    trade.marketInfo();
                } else {
                    sweetAlert('', data.msg, 'error');
                }
                if (data.code == -2) {
                    $("#isopen").val($("#oldIsopen").val());
                    trade.showInputTradePwdWindow();
                }
            }
        })
        //执行刷新委托单的接口
        trade.getVirtualEntrustData();
    },
    buysell: function (priceobj, amiuntobj) {
        //1.判断是否登录
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        //2.验证数据有效性
        var price = priceobj.val();
        var num = amiuntobj.val();
        var flag = trade.validateTradeNums(price, num, 0);
        if (!flag) {
            return;
        }
            //5.提交请求
            trade.saveCoinVirtual(price, num);
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
        return {
            event: 'addChannel',
            channel: 'entrust',
            symbol: $("#fcode").val(),
            type: trade.currentType,
            tradeType: -1,
            ftype: -1,
            currentPage: trade.currentPage,
            pageSize: 5,
            token: $.getCookie('token')
        };
    }
}
/*----------------------------------------------------------------------------------以上是trade对象----------------------------------------*/

$(function () {

    trade.userInfoTask();
    /*买入*/
    $("#buy-btn").on('click', function () {
        if ($("#userId").val() == "") {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return
        }
        trade.tradeType = 0;
        trade.buysell($("#buy-price"), $("#buy-amount"));
    });
    //注册卖出点击事件
    $("#sell-btn").on('click', function () {
        if ($("#userId").val() == "") {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return
        }
        trade.tradeType = 1;
        trade.buysell($("#sell-price"), $("#sell-amount"));
    })


    $(".depthstitle-img").children("img").each(function (index) {
        $(this).click(function () {
            if (index == 0) {
                $("#askScrollBox").animate({
                    height: trade.askScrollBox_h + "px",
                }, 400, "linear");
                $("#bidScrollBox").animate({
                    height: trade.bidScrollBox_h + "px"
                }, 400, "linear");
                $(this).attr("src", "../../../../static/apple/default/img/special_trade/buy&sell-2.jpg");
                $(".depthstitle-img").children("img").eq(1).attr("src", "../../../../static/apple/default/img/special_trade/buy-1.jpg")
                $(".depthstitle-img").children("img").eq(2).attr("src", "../../../../static/apple/default/img/special_trade/sell-1.jpg")
            } else if (index == 1) {
                $("#askScrollBox").animate({
                    height: 0
                }, 400, "linear");
                $("#bidScrollBox").animate({
                    height: trade.bidScrollBox_h * 2 + "px",
                }, 400, "linear");
                $("#bidScrollBox").addClass("overflow-auto");
                $("#buy-dish-handsdiv").addClass("bottom","0px");

                $(".depthstitle-img").children("img").eq(0).attr("src", "../../../../static/apple/default/img/special_trade/buy&sell-1.jpg");
                $(this).attr("src", "../../../../static/apple/default/img/special_trade/buy-2.jpg")
                $(".depthstitle-img").children("img").eq(2).attr("src", "../../../../static/apple/default/img/special_trade/sell-1.jpg")
            } else if (index == 2) {
                $("#askScrollBox").animate({
                    height: trade.bidScrollBox_h * 2 + "px",
                }, 400, "linear");
                $("#askScrollBox").addClass("overflow-auto");
                $("#bidScrollBox").animate({
                    height: 0
                }, 400, "linear");
                $(".depthstitle-img").children("img").eq(0).attr("src", "../../../../static/apple/default/img/special_trade/buy&sell-1.jpg");
                $(".depthstitle-img").children("img").eq(1).attr("src", "../../../../static/apple/default/img/special_trade/buy-1.jpg")
                $(this).attr("src", "../../../../static/apple/default/img/special_trade/sell-2.jpg")
            }
        });
    });


    /*判断输入是否有误  先判断是否输入有误，再进行计算*/
    /*注册买入价格框输入事件*/
    /*输入框限制位数*/
    $('.buy-price').on('input', function () {
        trade.judgeform($(".buy-price"), $("#buy-volume"));
        if (trade.retainDemical($(this).val(), 9) == "") {
            $(this).addClass('.placeholder');
        } else {
            $(this).val(trade.retainDemical(util.trim($(this).val()), 9));
            $(this).removeClass('.placeholder');
        }
        trade.buyinput();
    });
    $('.buy-amount').on('input', function () {
        trade.judgeform($(".buy-amount"), $("#buy-volume"));
        $(this).val(trade.retainDemical($(this).val(), 4));
        trade.buyamountinput();
    });
    $('.sell-price').on('input', function () {
        trade.judgeform($(".sell-price"), $("#sell-volume"));
        if (trade.retainDemical($(this).val(), 9) == "") {
            $(this).addClass('.placeholder');
        } else {
            $(this).val(trade.retainDemical(util.trim($(this).val()), 9));
            $(this).removeClass('.placeholder');
        }
        trade.sellinput();
    });
    $('.sell-amount').on('input', function () {
        trade.judgeform($(".sell-amount"), $("#sell-volume"));
        $(this).val(trade.retainDemical($(this).val(), 4));
        trade.sellamount();
    });


    /*获取所有交易区和所有交易对信息    左上角tab*/

    /*深度与最新成交-------------------------------------------------*/

    //初始化调用深度和最近成交和行情数据
    //trade.depthchange('0.00000001');

    $(".buy-price-add").click(function () {
        common.addReducePrice($(".buy-price"), true)
    });
    $(".buy-price-reduce").click(function () {
        common.addReducePrice($(".buy-price"), false)
    });


    $(".sell-price-add").click(function () {
        common.addReducePrice($(".sell-price"), true)
    })
    $(".sell-price-reduce").click(function () {
        common.addReducePrice($(".sell-price"), false)
    });


    /*深度切换*/
    $('#changeDepth').change(function () {
        var val = parseInt($(this).val());
        if (val == 4) {
            trade.demical = '0.0001';
        } else if (val == 6) {
            trade.demical = '0.000001';
        } else if (val == 8) {
            trade.demical = '0.00000001';
        }
        //切换小数位，重新发起websocket链接
        trade.connectDepthWebSocket();
    });

    //注册事件
    $("#market-con").on("click", '.loveIcon', function () {
        var id = $(this).data().id;
        trade.selfExchangeType(id, false);
    });

    //注册删除自选交易对事件
    $("#market-con").on("click", '.selfTempClass', function () {
        var id = $(this).data().id;
        trade.selfExchangeType(id, true);

    });

    //注册自选交易对事件
    $("#marketTrade").on("click", '#defaultStart', function () {
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        $(".clickf-fr").removeClass('active');
        $(this).addClass('active');
        $.ajax({
            type: 'get',
            url: "/n/getUserAllSelfExchangetype.html",
            dataType: 'json',
            async: false,
            success: function (data) {
                trade.createMarketDom(data);
            }
        })
    });

    //注册撤单事件
    $("#currentEntrusts").on("click", '.cancelTrade', function () {
        var id = $(this).data().id;
        trade.cancelTrade(id);
    });

    //2秒钟拉取一次当前交易区的所有行情信息(可以改造为websocket)
    window.setInterval(function () {
        trade.tradeInfo();
    }, 2000);
    //绑定当前委托和历史委托点击事件
    //点击切换选中样式
    $("#currentTab").click(function () {
        if (trade.currentTabOnoff) {
            trade.currentTabOnoff = false;
            $(this).addClass("ryhot")
            $("#historyTab").removeClass("ryhot")
            trade.currentType = 0;
            trade.currentPage = 1;
            trade.getVirtualEntrustData();
        }
    })
    $("#historyTab").click(function () {
        if (trade.currentTabOnoff) {
            trade.currentTabOnoff = false;
            $(this).addClass("ryhot");
            $("#currentTab").removeClass("ryhot");
            trade.currentType = 1;
            trade.currentPage = 1;
            trade.getVirtualEntrustData();
        }
    })

    //注册撤销全部委单点击事件
    $(".cancelAllEntrust").click(function () {
        var isLogin = trade.isLogin();
        if (isLogin == 'false') {
            trade.showLoginWinwow(language["apple.dom.msg11"], "/user/login.html", language["apple.dom.msg12"]);
            return;
        }
        var type = $(this).data().type;
        if(type == 0 && vartualEntrustBuylist.length == 0) {
                //2.验证数据有效性
                var flag = trade.validateTradeEntrustNums(vartualEntrustBuylist.length,0);
                if (!flag) {
                    return;
            }
        }else if(type == 1 && vartualEntrustSelllist.length == 0){
            //2.验证数据有效性
            var flag = trade.validateTradeEntrustNums(vartualEntrustSelllist.length,1);
            if (!flag) {
                return;
            }
        }
        if (!type) {
            swal({
                    title: language["apple.dom.msg28"],
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d52424",
                    confirmButtonText: language["apple.dom.msg29"],
                    closeOnConfirm: false
                },
                function () {
                    trade.cancelAllEntrust(type);
                });
        } else {
            swal({
                    title: language["apple.dom.msg73"] + "? ",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d52424",
                    confirmButtonText: language["apple.dom.msg29"],
                    closeOnConfirm: false
                },
                function () {
                    trade.cancelAllEntrust(type);
                });
        }
    })

    /*左上角涨跌 成交量切换*/
    $("#r-f-clinch").find('input').each(function (index) {
        $(this).click(function () {
            $("#clinch-rf").text($(this).parents('label').text());
            if ($("#clinch-rf").hasClass("showrose")) {
                $("#clinch-rf").removeClass("showrose")
                trade.isclinch = 0;   //涨跌
            } else {
                trade.isclinch = 1;   //成交量
                $("#clinch-rf").addClass("showrose")
            }
            $("#market-con").find('.clinchvol').each(function () {
                $(this).children('span').eq(index).show().siblings().hide();
            })
        })
    })

    /*买卖判断*/
    /*页面加载初始化滚动条*/


    trade.marketInfo(trade.rightCoinName);

    $("#marketTrade").on("click", '.clickf-fr', function () {
        var index = $(this).data().index;
        if (index > 0) {
            trade.isCoinTab = true;
            trade.changeCur(this);
            trade.currentCoinTabName = $(this).data().name;
        } else {
            trade.isCoinTab = false;
        }
    });

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
        var price, num
        if (trade.tradeType == 0) {
            price = $("#buy-price").val();
            num = $("#buy-amount").val();
        } else {
            price = $("#sell-price").val();
            num = $("#sell-amount").val();
        }
        trade.saveCoinValidate(price, num);
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

    /*资产价值切换*/
    $(".f-usd").click(function () {
        trade.type = 1;
        trade.changeFinanceValue($(".f-usd"), $(".f-cny"), $(".f-btc"))
    })

    $(".f-cny").click(function () {
        trade.type = 0;
        trade.changeFinanceValue($(".f-usd"), $(".f-cny"), $(".f-btc"))
    })
    $(".f-btc").click(function () {
        trade.type = 2;
        trade.changeFinanceValue($(".f-usd"), $(".f-cny"), $(".f-btc"))
    })

    /*显示币种切换下拉*/
    var droptimer = null;
    $(".showdropbox").hover(function () {
        clearTimeout(droptimer);
        $(".drop-box").show();
    }, function () {
        clearTimeout(droptimer);
        droptimer = setTimeout(function () {
            $(".drop-box").hide();
        }, 300)
    })
    $(".drop-box").hover(function () {
        clearTimeout(droptimer);
        $(this).show()
    }, function () {
        clearTimeout(droptimer);
        $(this).hide()
    });
    //注册当前盘口点击事件
    $("#p_new_newest_value").click(function () {
        var value = $(this).text();
        $("#buy-price").val(value);
        $("#sell-price").val(value);
    });

    //websocket注册监听器
    //1.注册深度和最近成交的websocket事件
    WSUtil.registerListener(trade.getRealDepthParam().channel, function (status, res) {
        if (status) {
            //console.info('websocket接入,获取深度，行情，最近成交数据');
            res ? trade.handleDepthAndSuccessData(res.data.buys, res.data.sells, res.data.trades) : trade.depthchange();
            res ? trade.handleLastKlineData(res) : trade.depthchange();
        } else {
            //ajax方式获取数据
            //console.info('非websocket接入,获取深度，行情，最近成交数据');
            trade.depthchange();
        }
    });
    //websocket注册监听器
    var entrustParam = trade.getEntrustParam();
    if (entrustParam) {
        WSUtil.registerListener(entrustParam.channel, function (status, res) {
            if (status) {
                if (res) {
                    //格式化数据，兼容老的接口
                    var data = {};
                    data.data = {};
                    //console.info(res.data);
                    if (res.data) {
                        data.data.currentEntrust = res.data.Goingfentrusts;
                        data.data.historyEntrust = res.data.Cancelfentrusts;
                        data.data.totalPages = res.data.GoingfentrustsPages;
                        //console.info('websocket接入，获取委单数据');
//                        trade.handleEntrustData(data);
                    }
                } else {
                    trade.connectEntrustWebSocket();
                }
            } else {
                //ajax方式获取数据
                //console.info('非websocket接入，获取委单数据');
                trade.getVirtualEntrustData();
            }
        });
    }

})