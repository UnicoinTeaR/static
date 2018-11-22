/**
 * 该JS没有使用
 * */
var markt = {
	check : 1,
    type : 0,
	tradeType:0,
	lastprice:0,
	fixedNum:util.fixedNum,
	rmbRate:1,
	usRate:1,
    currentPage: 1,
    pageSize: 5,
	numVerify : function(tradeType,keyCode) {
		var reg = new RegExp("^[0-9]+(.[0-9]{0,10})?$");
		var regAmount = new RegExp("^[0-9]+(.[0-9]{0,5})?$");
		if(tradeType=="1"){
			var userCnyBalance = $("#tradebuyprice").val();
			if (userCnyBalance == "") {
				userCnyBalance = 0;
			}else{
				if(!reg.test($("#tradebuyprice").val())) {
					$("#tradebuyprice").val('');
					return ;
				} 
				var v=$("#tradebuyprice").val();
				if(v.indexOf(".")>0 && v.substring(v.indexOf(".")+1)> markt.fixedNum && ((keyCode>=48&&keyCode<=57)||(keyCode>=96&&keyCode<=105))){
					$("#tradebuyprice").val(v.substring(0, v.indexOf(".") + (markt.fixedNum + 1)));
				} 
			}
			var tradebuyAmount = $("#tradebuyamount").val();
			if (tradebuyAmount == "") {
				tradebuyAmount = 0;
			}else{
				if(!regAmount.test($("#tradebuyamount").val())) {
					$("#tradebuyamount").val('');
					return ;
				}
				var v=$("#tradebuyamount").val();
				if(v.indexOf(".")>0 && v.substring(v.indexOf(".")+1)>3 && ((keyCode>=48&&keyCode<=57)||(keyCode>=96&&keyCode<=105))){
					$("#tradebuyamount").val(v.substring(0, v.indexOf(".") + 4));
				} 	
			}
			userCnyBalance = $("#tradebuyprice").val()/1;
			tradebuyAmount = $("#tradebuyamount").val()/1;
			var tradeTurnover = util.numFormat(util.accMul(userCnyBalance, tradebuyAmount),markt.fixedNum);
			
			var toptradecnymoney=Number($(".toptradecnymoney").html());
			if(tradeTurnover>toptradecnymoney){
				tradebuyAmount = util.accDiv(toptradecnymoney, userCnyBalance);
				tradebuyAmount = util.numFormat(tradebuyAmount , 3);
				$("#tradebuyamount").val(tradebuyAmount);
				tradeTurnover = util.accMul(userCnyBalance, tradebuyAmount);
			}
			if(toptradecnymoney>0){
				var val= util.numFormat(tradeTurnover*100/toptradecnymoney,2);
				$('#buyslider').data('slider').val(val)
				$("#buyslidertext").html(val + "%");
			}
			$("#tradebuyTurnover").html(util.numFormat(tradeTurnover, markt.fixedNum));
			if($("#exchangeTypeName").val().indexOf("CNYT") == -1){
				var rmbvalue = markt.rmbRate*userCnyBalance;
				rmbvalue = util.numFormat(rmbvalue, 2)
				rmbvalue = '≈'+rmbvalue+'CNYT';
				// $("#buy_reduced").html(rmbvalue);
			}
		}else if(tradeType=="2"){
				var userCnyBalance = $("#tradesellprice").val();
				if (userCnyBalance == "") {
					userCnyBalance = 0;
				}else{
					if(!reg.test($("#tradesellprice").val())) {
						$("#tradesellprice").val('');
						return ;
					} 
					var v=$("#tradesellprice").val();
					if(v.indexOf(".")>0 && v.substring(v.indexOf(".")+1)>markt.fixedNum && ((keyCode>=48&&keyCode<=57)||(keyCode>=96&&keyCode<=105))){
						$("#tradesellprice").val(v.substring(0, v.indexOf(".") + (markt.fixedNum + 1)));
					} 
				}
				var tradebuyAmount = $("#tradesellamount").val();
				if (tradebuyAmount == "") {
					tradebuyAmount = 0;
				}else{
					if(!regAmount.test($("#tradesellamount").val())) {
						$("#tradesellamount").val('');
						return ;
					}
					var v=$("#tradesellamount").val();
					if(v.indexOf(".")>0 && v.substring(v.indexOf(".")+1)>3 && ((keyCode>=48&&keyCode<=57)||(keyCode>=96&&keyCode<=105))){
						$("#tradesellamount").val(v.substring(0, v.indexOf(".") + 4));
					} 	
				}
				userCnyBalance = $("#tradesellprice").val()/1;
				tradebuyAmount = $("#tradesellamount").val()/1;
				var tradeTurnover = util.accMul(userCnyBalance, tradebuyAmount);
				
				var toptrademtccoin= util.numFormat($(".toptrademtccoin").html()/1,3); 
				
				if (tradebuyAmount > toptrademtccoin) {
	 				tradebuyAmount = toptrademtccoin;
					$("#tradesellamount").val(tradebuyAmount); 
					tradeTurnover = util.accMul(userCnyBalance, tradebuyAmount);
				}
	 			if(toptrademtccoin>0){
	 				var val =  util.numFormat(tradebuyAmount*100/toptrademtccoin,2);
//	 				$("#sellslider").data('value',val);
	 				$('#sellslider').data('slider').val(val)
	 				$("#sellslidertext").html(val + "%");
	 			}
				$("#tradesellTurnover").html(util.numFormat(tradeTurnover, markt.fixedNum));
				if($("#exchangeTypeName").val().indexOf("CNYT") == -1){
					var rmbvalue = markt.rmbRate*userCnyBalance;
					rmbvalue = util.numFormat(rmbvalue, 2)
					rmbvalue = '≈'+rmbvalue+'CNYT';
					// $("#sell_reduced").html(rmbvalue);
				}
		} 
	},
	onPortion:function(portion, tradeType){
		portion = util.accDiv(portion, 100);
		if (tradeType == 1) {
			var userCnyBalance = $("#tradebuyprice").val();
			if (userCnyBalance) {
				var money = Number(userCnyBalance);
				var tradecnymoney = Number($("#can-use-etc-id").html());
				if(money>0){
					var mtcNum = util.accDiv(tradecnymoney, money);//can buy 
					mtcNum = util.accMul(mtcNum, portion);
					mtcNum = util.numFormat(mtcNum, 3);
					$("#tradebuyamount").val(mtcNum);
					var portionMoney = util.accMul(money, mtcNum);
					$("#tradebuyTurnover").html(util.numFormat(portionMoney, markt.fixedNum));
				}else{
					$("#tradebuyamount").val(0);
					$("#tradebuyTurnover").html(util.numFormat(0,markt.fixedNum));
				}
			}
		} else {
			var userCnyBalance = $("#tradesellprice").val();
			if (userCnyBalance) {
				var money = Number(userCnyBalance);
				var toptrademtccoin = Number($("#can-use-win-id").html());
				if(money > 0){
					var mtcNum = util.accMul(toptrademtccoin, portion);
					mtcNum = util.numFormat(mtcNum, 3);
					$("#tradesellamount").val(mtcNum);
					var portionMoney = util.accMul(money, mtcNum);
					$("#tradesellTurnover").html(util.numFormat(portionMoney,markt.fixedNum));
				}else{
					
				}
			}
		}
	},
	submitTradePwd : function() {
		var tradePwd = $("#pay-pwd-input").val();
		if (tradePwd != "") {
			$(".pay-pwd-cls").hide();
 		} else {
			util.showerrortips("remarkErrorTip", language["comm.error.tips.79"]);
			return;
		}
		markt.saveCoinTrade(markt.tradeType, false);
	},
	errorTip:function(content,callback){
		if(content){
			$(".div_message_error").html(content).animate({height: 'toggle', opacity: 'toggle'}, "slow");
			if(callback){
				$(".div_message_error").delay(3000).hide(1000,function(){
					callback();
				});
			}else{
				$(".div_message_error").delay(3000).hide(1000);
			}			
		}else{
			$(".div_message_error").hide();
		} 
 	}, 
	saveCoinTrade : function(tradeType, flag) {
		markt.tradeType = tradeType;
		var login=$("#login");
		if(login.val()=="false"){
			util.tipConfirm(language["comm.error.kline.1"],language["comm.error.kline.2"],language["comm.error.tips.39"],
					function(){
				window.location.href="/index.html?forwardUrl=/market/"+$("#symbol").val()+".html";
			},function(){
				
			});
			return false;
		}
		errorele = "";
		if (tradeType == 0) {
			errorele = "buy-errortips";
		} else {
			errorele = "sell-errortips";
		}
		var tradePassword = $("#tradePassword").val();
		if (tradePassword == "true") {
			util.tipConfirm(language["comm.error.tips.1030"], language["comm.error.tips.1025"],language["comm.error.tips.1026"], function() {
				window.location.href = '/user/security.html?op=bind-tradepass&forwardUrl=/market/'+$("#symbol").val()+ '.html';
			}, null, null );
			return;
		}
		var symbol = $("#symbol").val();
		var coinName = $("#coinshortName").val();
		var tradeAmount = 0;
		var tradeCnyPrice = 0;
		if (tradeType == 0) {
			tradeAmount = $("#tradebuyamount").val();
			tradeCnyPrice = $("#tradebuyprice").val();
		} else {
			tradeAmount = $("#tradesellamount").val();
			tradeCnyPrice = $("#tradesellprice").val();
		}
		var limited = 0;
		if (tradeType == 0) {
			var tradeTurnover = tradeAmount * tradeCnyPrice;
			if ($("#toptradecnymoney").length > 0 && Number($("#toptradecnymoney").html()) < Number(tradeTurnover)) {
				markt.errorTip(language["comm.error.tips.41"]);
				return;
			} else {
				markt.errorTip();
			}
		} else {
			if ($("#toptrademtccoin").length > 0 && Number($("#toptrademtccoin").html()) < Number(tradeAmount)) {
				markt.errorTip(language["comm.error.tips.42"].format(coinName));
				return;
			} else {
				markt.errorTip();
			}
		}
		var reg = new RegExp("^[0-9]+\.{0,1}[0-9]{0,"+markt.fixedNum+"}$");
		if (!reg.test(tradeAmount)) {
			markt.errorTip(language["comm.error.tips.43"]);
			return;
		} else {
			markt.errorTip();
		}
		if (tradeAmount < 0.001) {
			markt.errorTip(language["comm.error.tips.44"].format('0.001', coinName));
			return;
		} else {
			markt.errorTip();
		}
		if (!reg.test(tradeCnyPrice)) {
			markt.errorTip(language["comm.error.tips.45"]);
			return;
		} else {
			markt.errorTip();
		}
		if (tradeCnyPrice < 0.00000001) {
			markt.errorTip(language["comm.tips.message.18"].format('0.00000001'));
			return;
		} else {
			markt.errorTip();
		}
		var total = util.numFormat(util.accMul(tradeAmount, tradeCnyPrice), markt.fixedNum);
		if (parseFloat(total) < 0.00000001) {
			markt.errorTip(language["comm.tips.message.19"].format('0.00000001'));
			return;
		} else {
			markt.errorTip();
		}
		var isopen = $("#isopen").val();//-1不需要输入，0一直需要输入，1间隔时间内需要输入
		if ((isopen == "0" || isopen == "1") && flag) {//如果没有设置资金密码到缓存则需要输入资金密码
			$("#pay-pwd-input").val("");
			$(".pay-pwd-cls").show();
			return;
		}
		
		var tradePwd = "";
		if ($("#pay-pwd-input").length > 0) {
			tradePwd = util.trim($("#pay-pwd-input").val());
		}
		if (tradePwd == "" && isopen == "true") {
			markt.errorTip(language["comm.error.tips.46"]);
 			return;
		} else {
			markt.errorTip();
		}
		var url = "";
		if (tradeType == 0) {
			url = "/trade/cny_buy.html?random=" + Math.round(Math.random() * 100);
		} else {
			url = "/trade/cny_sell.html?random=" + Math.round(Math.random() * 100);
		}
		tradePwd = isopen == "true" ? "" : tradePwd;
		var param = {
			tradeAmount : tradeAmount,
			tradeCnyPrice : tradeCnyPrice,
			tradePwd : tradePwd,
			symbol : symbol,
			limited : limited
		};
		var btntext="";
		var btn = "";
		if(tradeType==0){
			btn = $(".buyBut");
			btntext = btn.html();
			btn.html(language["comm.tips.message.13"]);
			$("#tradebuyamount").val("");
		}else{
			btn = $(".sellBut");
			btntext = btn.html();
			btn.html(language["comm.tips.message.14"]);
			$("#tradesellamount").val("");
		}
		btn.attr("disabled",true);		
		jQuery.post(url, param, function(data) {
			btn.attr("disabled",false);	
			btn.html(btntext);
			markt.errorTip(data.msg); 
			if(data.code == 200) { 
 				if (isopen != "0") {//-1不需要输入，0一直需要输入，1间隔时间内需要输入 
					$("#isopen").val("-1");
				}
			}	
			if (data.code == -2) {
				$("#isopen").val($("#oldIsopen").val());
			}
			markt.getEntrustInfo();
		}, "json");
	},
	marktUnit:function(buys,sells){
		var tmpBuy=buys.concat(sells);
		if(tmpBuy.length<=0){
			return;
		}
		tmpBuy.sort(function (a, b) {
            return a.amount - b.amount;
        });
		var i=Math.floor((tmpBuy.length/3)*2,0);
        return tmpBuy[i].amount<1?1:tmpBuy[i].amount;
	},
	entrustSource:function(type){
		//1 web；2 app；3 api
		if(type==3){
			return language["comm.tips.message.15"];
		}else if(type==2){
			return language["comm.tips.message.16"];
		}else{
			return language["comm.tips.message.17"];
		}
	},
    autoRefreshEntrustData :function(data) {
	    var type = markt.type;
        if(type==0){
            var str="";
            if(data.Goingfentrusts && data.Goingfentrusts.length>0){
                var _temp="";
                for(var i=0;i<data.Goingfentrusts.length;i++){
                    _temp=data.Goingfentrusts[i];
                    str += '<ul>';
                    str += '<li>'+util.dateFormat(_temp.fcreatetime)+'</li>';
                    str += '<li class="'+(_temp.ftype==1?"color_00bb5a":"color_ff3c3c")+'">'+_temp.ftype_s+'</li>';
                    str += '<li>'+util.numFormat(_temp.fprize,markt.fixedNum)+'/'+util.numFormat(_temp.flast,markt.fixedNum)+'</li>';
                    str += '<li>'+util.numFormat(_temp.fcount,3)+'/'+util.numFormat(_temp.fsuccessamount,markt.fixedNum)+'</li>';
//						 str += '<li>'+util.numFormat(_temp.flast,markt.fixedNum)+'</li>';
//						 str += '<li>' + util.numFormat(_temp.fsuccessamount,markt.fixedNum) +'</li>';

                    if('未完成' == _temp.fstatus_s){
                        str += '<li>-</li>';
                    }else{
                        if(_temp.ftype==1){
                            str += '<li>' + util.numFormat(_temp.ffees,8) + '('+markt.coinRightName+')</li>';
                        }else{
                            str += '<li>' + util.numFormat(_temp.ffees,8) + '('+markt.coinLeftName+')</li>';
                        }
                    }
                    if('未完成' == _temp.fstatus_s){
                        str += '<li class="color_ff3c3c">' + _temp.fstatus_s + '</li>';
                    }else if('部分完成' == _temp.fstatus_s){
                        str += '<li>' + _temp.fstatus_s + '</li>';
                    }else if('完全完成' == _temp.fstatus_s){
                        str += '<li class="color_00bb5a">' + _temp.fstatus_s + '</li>';
                    }else{
                        str += '<li>' + _temp.fstatus_s + '</li>';
                    }
                    str += '<li>' + markt.entrustSource(_temp.fsource) + '</li>';
                    if(_temp.fstatus == 1 || _temp.fstatus== 2) {
                        str += '<li data-value="'+ _temp.fid + '"><a href="javascript:;" style="color:#666666">撤销</a></li>';
                    } else {
                        str += '<li></li>';
                    }
                    str += '</ul>';
                }
            } else{
                str='<div class="no_record">'+language["comm.tips.message.9"]+'</div>';
            }
            $("#tarde_cur_con_data").html(str);
            //前端分页
            util.getPageDom(markt.currentPage,data.GoingfentrustsPages,"tarde_bot_page_1",markt.getEntrustInfoByPageNum);
        }else if(type==1){
            var str="";
            if(data.Cancelfentrusts && data.Cancelfentrusts.length>0){
                var _temp="";
                for(var i=0;i<data.Cancelfentrusts.length;i++){
                    _temp=data.Cancelfentrusts[i];
                    str += '<ul>';
                    str += '<li>'+util.dateFormat(_temp.fcreatetime)+'</li>';
                    str += '<li class="'+(_temp.ftype==1?"color_00bb5a":"color_ff3c3c")+'">'+_temp.ftype_s+'</li>';
                    str += '<li>'+util.numFormat(_temp.fprize,markt.fixedNum)+'/'+util.numFormat(_temp.flast,markt.fixedNum)+'</li>';
                    str += '<li>'+util.numFormat(_temp.fcount,3)+'/'+util.numFormat(_temp.fsuccessamount,markt.fixedNum)+'</li>';
//						 str += '<li>'+util.numFormat(_temp.flast,markt.fixedNum)+'</li>';
//						 str += '<li>' + util.numFormat(_temp.fsuccessamount,markt.fixedNum) +'</li>';
                    if(_temp.ftype==1){
                        str += '<li>' + util.numFormat(_temp.ffees,8) + '('+markt.coinRightName+')</li>';
                    }else{
                        str += '<li>' + util.numFormat(_temp.ffees,8) + '('+markt.coinLeftName+')</li>';
                    }
                    if('未完成' == _temp.fstatus_s){
                        str += '<li class="color_ff3c3c">' + _temp.fstatus_s + '</li>';
                    }else if('部分完成' == _temp.fstatus_s){
                        str += '<li>' + _temp.fstatus_s + '</li>';
                    }else if('完全完成' == _temp.fstatus_s){
                        str += '<li class="color_00bb5a">' + _temp.fstatus_s + '</li>';
                    }else{
                        str += '<li>' + _temp.fstatus_s + '</li>';
                    }
                    str += '<li>' + markt.entrustSource(_temp.fsource) + '</li>';
                    str += '</ul>';
                }
            }else{
                str='<div class="no_record">'+language["comm.tips.message.9"]+' </div>';
            }
            $("#tarde_his_con_data").html(str);
            //前端分页
            util.getPageDom(markt.currentPage,data.GoingfentrustsPages,"tarde_bot_page_2",markt.getEntrustInfoByPageNum);
        }
    },
    getEntrustInfo:function(){
		var symbol = $("#symbol").val();
		var login = $("#login");
		if(login.val()=="false"){
			return;
		}
        if(WSUtil.isConnected()){
            markt.connectEntrustWebSocket();
            return;
        }
        var entrustParam = markt.getEntrustParam();
        if(!entrustParam)return;
        $.post("/trade/entrustInfo.html", entrustParam,markt.autoRefreshEntrustData , "json");
        // setTimeout(markt.entrustInfo, 2000);
	},
	getEntrustInfoByPageNum:function(current){
		markt.currentPage = current;
		markt.getEntrustInfo();
	},
	cancelEntrustBtc : function(id) {
		var url = "/trade/cny_cancel.html?random=" + Math.round(Math.random() * 100);
		var param = {
			id : id
		};
		$.post(url, param, function(data) {
			if(data.code == 200){
				util.tipAlert(language["comm.success.tips.1035"], 'success', 2000);
				markt.getEntrustInfo();
			}else{
				markt.errorTip(language["comm.tips.message.11"]);
			}			
		},"json");
	},
	cancelAllEntrust : function(symbol) {
		
		var coinshortName = $("#exchangeTypeName").val();
		util.tipConfirm(language["comm.tips.message.22"].format(coinshortName),language["comm.tips.message.23"],language["comm.tips.message.24"],
		function(){
			var url = "/trade/cancel_batch_entrust.html?random=" + Math.round(Math.random() * 100); 
 			var param = {symbol:symbol};
			$.post(url, param, function(data) {
				if(data.code == 200){
					$(".tarde_cur div .cancelEntrust").html(language["comm.tips.message.10"]);
				}else{
					markt.errorTip(data.msg);
				}
			},"json");
		},function(){
			return false;
		});  
	},
	cancelBatchEntrustBtc:function(id) {
		var login=$("#login");
		if(login.val()=="false"){
			util.tipConfirm(language["comm.error.kline.1"],language["comm.error.kline.2"],language["comm.error.tips.39"],
				function(){
					window.location.href="/index.html?forwardUrl=/trade/" + $("#symbol").val() + ".html?tradeType=0";
				},function(){

				});
			return false;
		} 
		var coinshortName = $("#coinshortName").val(); 
		var url = "/trade/cancel_batch_entrust.html?random=" + Math.round(Math.random() * 100); 
		var symbol = $("#symbol").val();
		var b_type=$(".tip_active").attr("b_type");
		var b_max = $("#batch-cancel-entrust-max").val();
		var b_min = $("#batch-cancel-entrust-min").val();
 		var param = {symbol:symbol,type:b_type,minPrice:b_min,maxPrice:b_max};
		$.post(url, param, function(data) {
			$(".batch-cancel-entrust-tips").hide();
			if(data.code == 200){
 				markt.errorTip(data.msg);
				markt.getEntrustInfo();
			} else {
 				markt.errorTip(data.msg);
			}
			$("#batch-cancel-entrust-min,#batch-cancel-entrust-max").val(""); 
		},"json");
	},
	preZeroFill:function(num, size) {
	    if (num >= Math.pow(10, size)) { //如果num本身位数不小于size位
	        return num.toString();
	    } else {
	        var _str = Array(size + 1).join('0') + num;
	        return _str.slice(_str.length - size);
	    }
	},
	autoRefreshRealDepthData : function(data) {
		if (data != "") {
			data=data.data;
			markt.rmbRate = data.rmbRate;
			markt.usRate = data.usRate;
			var lastprice = Number(data.p_new); 
			var _temp; 
			if(lastprice){
				$(".curprice .price").html(lastprice==0?0:util.numFormat(lastprice, markt.fixedNum))
				if(data.is_increase){
					$(".curprice .price").css("color","#ff3c3c");
				}else{
					$(".curprice .price").css("color","#00bb5a");
				}
				markt.lastprice=lastprice;
                var newrmb=util.numFormat(data.p_new_to_cnyt,2);
                if(data.virtualwallet_right&&data.virtualwallet_left){
                    if(data.virtualwallet_right.fshortname=="CNYT"&&data.virtualwallet_left.fshortname=="BTM"){
                        newrmb = util.numFormat(data.p_new_to_cnyt,3);
                    }
                }else{
                    var coinType=$("#exchangeTypeName").val();
                    var types = coinType.split("/");
                    var t1 = types[0].toUpperCase().trim();
                    var t2 = types[1].toUpperCase().trim();
                	if(t1=="BTM"&&t2=="CNYT"){
                        newrmb = util.numFormat(data.p_new_to_cnyt,3);
					}
				}
				newrmb = '≈'+newrmb+'CNYT';
				// $("#pricecnyt_1").html(newrmb)
			}else{
				$(".curprice .price").css("color","#ff3c3c").html(lastprice==0?"0.00000000":util.numFormat(lastprice, markt.fixedNum));
			}
			if(lastprice){
				$("title").html(lastprice==0?0:util.numFormat(lastprice, markt.fixedNum)+$("#exchangeTypeName").val());
			}
			if(data.virtualwallet_left){
				_temp=data.lefttotal;
				$(".toptrademtccoin").html(_temp==0?"0.00000000":util.numFormat(_temp, 8));
				if(lastprice<=0){
					$(".getcny").html(" - - ");
				}else{
					$(".getcny").html(_temp==0?"0.000":util.numFormat(util.accMul(_temp, lastprice), markt.fixedNum));
				} 
			}else{
				$(".toptrademtccoin").html(" - - ");
			}
			if(data.virtualwallet_right){
				_temp=data.rightotal;
				$(".toptradecnymoney").html(_temp==0?"0.00000000":util.numFormat(_temp, markt.fixedNum));
				if(lastprice<=0){
					$(".getcoin").html(" - - ");
				}else{
					$(".getcoin").html(_temp==0?"0.000":util.numFormat(util.accDiv(_temp, lastprice), 8));
				} 
			}else{
				$(".toptradecnymoney").html(" - - ");
			}  
			var unit=markt.marktUnit(data.buys,data.sells);
			var str="";
 			if(data.sells){
				var ask;
				for(var i=0;i<data.sells.length;i++){
					ask=data.sells[i];
					str='<li><span class="price">'+util.numFormat(ask.price, markt.fixedNum)+'</span><span class="amount">'+util.numFormat(ask.amount, 3)+'</span></li> '+str;
				}
			}
 			$(".trade_depth .asks ul").html(str);
 			str="";
 			if(data.buys){ 
				var bid;
				for(var i=0;i<data.buys.length;i++){
					bid=data.buys[i];
					str+='<li><span class="price">'+util.numFormat(bid.price, markt.fixedNum)+'</span><span class="amount">'+util.numFormat(bid.amount, 3)+'</span></li> ';
				} 
			}
 			$(".trade_depth .bids ul").html(str);
 			str="";
 			if(data.trades){ 
				var trade;
				var color;
				for(var i=0;i<data.trades.length;i++){
					trade=data.trades[i];
					color= trade.en_type=="bid"?"#ff3c3c":"#00bb5a";
					str+='<li style="color:'+color+'"><span>'+trade.time+'</span><span>'+util.numFormat(trade.price, markt.fixedNum)+'</span><span>'+util.numFormat(trade.amount, 3)+'</span></li>';
				} 
			}
 			$(".trade_new .trades ul").html(str);				 
		};
	},
	klineFullScreenOpen:function (){
		$("#op_trade_div").hide();
		$("#openfullscreen").hide();
		$("#trade_container_div").hide();
		$("#op_trade_div").css("display","none");
		$("#closefullscreen").css("display","block");
		$("#openfullscreen").css("display","none");
  		$("#klineFullScreen").addClass("fullscreen");
	},
	klineFullScreenClose:function (){
		$("#op_trade_div").show();
		$("#openfullscreen").show();
		$("#trade_container_div").show();
		$("#op_trade_div").css("display","block");
		$("#closefullscreen").css("display","none");
		$("#openfullscreen").css("display","block");
  		$("#klineFullScreen").removeClass("fullscreen");
	},
	initDate:function(){
		markt.numVerify(1,49);
		markt.numVerify(2,49);
	},
    autoRefreshRealDepth : function() {
        if(WSUtil.isConnected()){
            markt.connectRealDepthWebSocket();
            return;
        }
        //查询实时行情
        var globalurl = util.globalurl[symbol];
        if(typeof(globalurl)=="undefined"){
            globalurl=util.globalurl["DEFAULT"];
        }
        $.post(globalurl.market,markt.getRealDepthParam(),markt.autoRefreshRealDepthData, "json");
        setTimeout(function() {
			markt.autoRefreshRealDepth();
		}, 1000);
    },
    connectRealDepthWebSocket:function () {
        WSUtil.sendMsg(markt.getRealDepthParam());
    },
    getRealDepthParam :function(){
        return  {
            event: 'addChannel',
            channel: 'real_depth',
            exchangeTypeCode: symbol,
            buysellcount: 30,
            successcount: 80,
            mergeType: 0.00000001,
            token: $.getCookie('token')
        };
    },
    connectEntrustWebSocket:function () {
        var param = markt.getEntrustParam();
        if(!param)return;
        WSUtil.sendMsg(param);
    },
    getEntrustParam :function(){
        var login = $("#login");
        if (login.val() == "false"){
            return;
        }
        var symbol = $("#symbol").val();
        return  {
            event: 'addChannel',
            channel: 'entrust',
            symbol : symbol,
            type : markt.type,
            tradeType : 0,
            ftype : markt.ftype,
            currentPage : markt.currentPage,
            pageSize : markt.pageSize,
            token: $.getCookie('token')
        };
    }
};

	$("#tradebuyprice").css("ime-mode", "disabled").on("keyup", function(event) {
		var keyCode = event.keyCode ? event.keyCode : event.which;
		markt.numVerify(1,keyCode);
	}).on("keypress", function(event) {
		/*return util.goIngKeypress(this, event, markt.fixedNum);*/
	}).on("focus", function() {
		$(this).parent().addClass("active");
	}).on("blur", function() {
		var tradebuyprice=$("#tradebuyprice").val();
		var tradebuyamount=$("#tradebuyamount").val();
		var toptradecnymoney=$(".toptradecnymoney").html();
		if(util.numFormat(util.accMul(tradebuyamount,tradebuyprice), markt.fixedNum)>parseFloat(toptradecnymoney)){
			$("#tradebuyamount").val(util.numFormat(util.accDiv(toptradecnymoney,tradebuyprice),3));
			markt.numVerify(1);
		}
		$(this).parent().removeClass("active");
	});
	$("#tradebuyamount").css("ime-mode", "disabled").on("keyup",  function(event) {
		var keyCode = event.keyCode ? event.keyCode : event.which;
		markt.numVerify(1,keyCode);
	}).on("keypress", function(event) {
		/*return util.goIngKeypress(this, event, 3);*/
	}).on("focus", function() {
		$(this).parent().addClass("active");
	}).on("blur", function() {
		
		$(this).parent().removeClass("active");
	});
	
	$("#tradesellprice").css("ime-mode", "disabled").on("keyup", function(event) {
		var keyCode = event.keyCode ? event.keyCode : event.which;
		markt.numVerify(2,keyCode);
	}).on("keypress", function(event) {
		/*return util.goIngKeypress(this, event, markt.fixedNum);*/
	}).on("focus", function() {
		$(this).parent().addClass("active");
	}).on("blur", function() {
		/*var tradesellprice=$("#tradesellprice").val();
		var tradesellamount=$("#tradesellamount").val();
		var toptrademtccoin=$(".getcny").html(); 
		if(util.numFormat(util.accMul(tradesellprice,tradesellamount), markt.fixedNum)>parseFloat(toptrademtccoin)){
			$("#tradesellprice").val(util.numFormat(util.accDiv(toptrademtccoin,tradesellamount),markt.fixedNum));
			markt.numVerify(2);
		}*/
		$(this).parent().removeClass("active");
	});
	$("#tradesellamount").css("ime-mode", "disabled").on("keyup",  function(event) {
		var keyCode = event.keyCode ? event.keyCode : event.which;
		markt.numVerify(2,keyCode);
	}).on("keypress", function(event) {
		/*return util.goIngKeypress(this, event, 3);*/
 	}).on("focus", function() {
		$(this).parent().addClass("active");
	}).on("blur", function() {
		
		$(this).parent().removeClass("active");
	});
	$(".buyBut").on("click", function() {
		markt.saveCoinTrade(0, true);
	});
	$(".sellBut").on("click", function() {
		markt.saveCoinTrade(1, true);
	}); 
	$("#openfullscreen").on("click", function() {
		markt.klineFullScreenOpen();
	});
	$("#closefullscreen").on("click", function() {
		markt.klineFullScreenClose();
	});
	$("#tarde_cur_con_data").on("click","ul li",function(){
		var id=$(this).attr("data-value");
		if(id){
			markt.cancelEntrustBtc(id);
		}
	});  
	$(".trade_list .trade_titile li").on("click",function(){
		$(".trade_list .trade_titile li").removeClass("active");
		$(this).addClass("active");
        var type = 0;
		if($(this).attr("t_y")=="0"){
			$(".tarde_history").hide();
			type = 0;
			$(".tarde_cur").show();
		}else{
			$(".tarde_cur").hide();
            type = 1;
			$(".tarde_history").show();
		}
        if(markt.type != type){
            markt.currentPage = 1;
        }
        markt.type = type;
        markt.getEntrustInfo();
	});  
	
	$("#pay-pwd-btn").on("click", function() {
		markt.submitTradePwd();
	});
	
	/*$(".IconCommentK").on("click",function(){
		var symbol=$("#symbol").val();
		if(symbol)
			markt.cancelAllEntrust(symbol);
	});*/
	
	$("#pay-pwd-close-btn").on("click",function(){
		$(".pay-pwd-cls").hide();
		$("#pay-pwd-input").val('');
	});
	
	$(".IconCommentK").on("click", function() {
		$(".batch-cancel-entrust-tips").show();
		/*trade.cancelBatchEntrustBtc();*/
	});
	
	$("#batch-cancel-entrust-btn").on("click", function() {
		var login=$("#login");
		if(login.val()=="false"){
			util.tipConfirm(language["comm.error.kline.1"],language["comm.error.kline.2"],language["comm.error.tips.39"],
				function(){
					window.location.href="/index.html?forwardUrl=/trade/" + $("#symbol").val() + ".html?tradeType=0";
				},function(){

				});
			return false;
		} 
		markt.cancelBatchEntrustBtc();
	});

var symbol = $("#symbol").val();
var token = $.getCookie('token');
window._autoIndexmarket = "1";
window._autoGetfinancial = "1";

$(function() {
    markt.coinLeftName = $("#coinLeftName").val();
    markt.coinRightName = $("#coinRightName").val();
	setInterval("markt.initDate()", 2000);

    //websocket注册监听器
    WSUtil.registerListener(markt.getRealDepthParam().channel,function(status,res){
        if(status){
            res?markt.autoRefreshRealDepthData(res):markt.connectRealDepthWebSocket();
        }else{
            //定时自动刷新
            markt.autoRefreshRealDepth();
        }
    });

    //websocket注册监听器
    var entrustParam = markt.getEntrustParam();
    if(entrustParam) {
        WSUtil.registerListener(entrustParam.channel, function (status, res) {
            if (status) {
                res ? markt.autoRefreshEntrustData(res.data) : markt.connectEntrustWebSocket();
            } else {
                //手动刷新
                markt.getEntrustInfo();
            }
        });
    }

});