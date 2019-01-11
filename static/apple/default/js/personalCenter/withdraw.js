!function () {
    var page = {
        init: function () {
            var self = this;
            self.initEvents();
            self.methods.getView.call(this);
            if(self.data.isCny){
                self.dataHandler.getRecordByType.call(this,1);
            }
        },
        initEvents: function () {
            var self=this;
            $("#tradePass").click(function () {
                //设置资金密码
                $("#Fund-password").modal('show');
            });

            $("#sendSMS").on("click",function(){
                self.methods.sendSMSMessage.call(this,self);
            });

            $("#withdrawButton").click(function () {
                self.methods.saveCoinWithdraw.call(this,self);
            });

            //绑定获取短信验证码按钮事件(添加验证码)
            $("#bindsendmessage").on("click", function() {
                self.methods.sendSMSSaveAddress.call(this,self);
            });

            $("#addDress_body").citySelect({
                nodata : "none",
                required : false,
                city_json : city_json
            });

            //校验金额
            $("#withdrawBalance").on("keypress", function(event) {
                return util.goIngKeypress(this, event, 2);
            }).on("keyup", function() {
                self.methods.calculateFeesRate.call(this,false);
            }).on("blur", function(event) {//添加余额限制
                util.goIngKeypress(this, event, 2);
                self.methods.calculateFeesRate.call(this,false);
            });

            $("#withdrawCnyAddrBtn").click(function () {
                self.methods.addCnyAddress.call(this,self);
            });

            $("#withdrawCnyButton").click(function () {
                self.methods.saveCnyWithdraw.call(this,self);
            });
            
            //绑定获取短信验证码按钮事件(修改资金密码)
            $("#phoneMsgCodeB").on("click", function() {
                msg.sendMsgCode($(this).attr('msgtype'));
            });

            //设置资金密码
            $("#bindtradepass-submit").on("click", function() {
                self.methods.saveModifyPwd.call(this,[1, false]);
            });

            //修改资金密码按钮点击事件
            $("#tradeModifyCode-submit").on("click", function() {
                self.methods.saveTradeModifyCode.call(this);
            });
        },
        data: {
            symbol: $("#symbol").val(),
            addressId: $("#adrId").val(),
            isCny:$("input[name=isCny]").val()=="1",
            isReq:false,
            record : {
                currentType:2,
                currentPage:1
            }
        },
        viewHandler: {
            showView: function (data) {

            },
            addCnyAddress : function() {
                var yhknumberModal = $("#modal-yhknumber");

                var payeeAddr = yhknumberModal.find("#payeeAddr").val();
                var openBankTypeAddr = $("#openBankTypeAddr").val();
                var withdrawAccount = util.trim($("#withdrawAccountAddr").val());
                var address = util.trim($("#address").val());
                var prov = util.trim($("#prov").val());
                var city = util.trim($("#city").val()==null?"":$("#city").val());
//		var dist = util.trim($("#dist").val()==null?"":$("#dist").val());
                var totpCode = 0;
                var phoneCode = 0;
                if (payeeAddr == "" || payeeAddr == "请输入您的银行卡开户人" || payeeAddr == "请输入您的支付宝开户人") {
                    sweetAlert('', language["comm.error.tips.129"], 'error');
                    return;
                }
                if (openBankTypeAddr == -1) {
                    sweetAlert('', language["comm.error.tips.70"], 'error');
                    return;
                }
                var reg = /^(\d{16}|\d{17}|\d{18}|\d{19})$/;
                if(!reg.test(withdrawAccount)){
                    //银行卡号不合法
                    sweetAlert('', language["comm.error.tips.134"], 'error');
                    return;
                }
                if (withdrawAccount == "" || withdrawAccount.length > 200 || withdrawAccount == language["comm.error.tips.62"]) {
                    sweetAlert('', language["comm.error.tips.71"], 'error');
                    return;
                }
                var withdrawAccount2 = util.trim($("#withdrawAccountAddr2").val());
                if (withdrawAccount != withdrawAccount2) {
                    sweetAlert('', language["comm.error.tips.72"], 'error');
                    return;
                }
                if ((prov == "" || prov == "请选择") || (city == "" || city == "请选择") || address == "") {
                    sweetAlert('', language["comm.error.tips.73"], 'error');
                    return;
                }
                if (address.length > 300) {
                    sweetAlert('', language["comm.error.tips.73"], 'error');
                    return;
                }

                if ($("#addressTotpCode").length>0) {
                    totpCode = util.trim($("#addressTotpCode").val());
                    if (!/^[0-9]{6}$/.test(totpCode)) {
                        sweetAlert('', language["comm.error.tips.65"], 'error');
                        $("#addressTotpCode").val("");
                        return;
                    }
                }
                if ($("#addressPhoneCode").length>0) {
                    phoneCode = util.trim($("#addressPhoneCode").val());
                    if (!/^[0-9]{6}$/.test(phoneCode)) {
                        sweetAlert('', language["comm.error.tips.66"], 'error');
                        $("#addressPhoneCode").val("");
                        return;
                    }
                }
                $.ajax({
                    url: "/user/save_bankinfo.html?random=" + Math.round(Math.random() * 100),
                    dataType: 'json',
                    data: {
                        account : withdrawAccount,
                        openBankType : openBankTypeAddr,
                        totpCode : totpCode,
                        phoneCode : phoneCode,
                        address : address,
                        prov : prov,
                        city : city,
//			dist : dist,
                        payeeAddr : payeeAddr
                    },
                    type: 'get',
                    async: false,
                    success: function (res) {
                        if (res != null) {
                            if (result.code == 200) {
                                window.location.reload(true);
                            } else {
                                sweetAlert('', result.msg, 'error');
                            }
                        }

                    }
                })
            },
            showVirtualCoinView: function (data) {
                if (data) {
                    $(".coinwithdrawName").text(data.fvirtualcointype.fname);
                    user = data.fuser;
                    if (user.fhasrealvalidate && user.ftradepassword != null) {
                        // if(false){
                        $('#domSec').show();
                        $('#domFir').hide();
                        var fvirtualwallet = data.fvirtualwallet;
                        var fvirtualcointype = data.fvirtualcointype;
                        var addressList = data.fvirtualaddressWithdraw;
                        var domAddress = [];
                        domAddress.push('<select id="withdrawAddr" name="withdrawAddr" class="form-control valid" >');
                        domAddress.push('<option   value="">请选择</option>');
                        $.each(addressList, function (index, item) {
                        	if(item.fid == adrId.value){
                        		domAddress.push('<option  selected="" value="' + item.fid + '">' + item.fremark + '--' + item.fadderess + '</option>');
                        	}else{
                        		domAddress.push('<option value="' + item.fid + '">' + item.fremark + '--' + item.fadderess + '</option>');
                        	}
                        });
                        domAddress.push('</select>');
                        $("#AddressDiv").html(domAddress.join(""));

                        $('#total_v').text(fvirtualwallet.ftotal)
                        $('#day_v').text(data.leftAmount)
                        $('#netfee_v').text(fvirtualcointype.fnetworkfee);
                        $('#minNum_v').text(fvirtualcointype.fminwithdraw);

                        $("#coinName").val(fvirtualwallet.fshortname);
                        $("#isWhiteUser").val(isWhiteUser);
//                        $("#max_double").val(fvirtualcointype.fmaxwithdraw);
//                        $("#min_double").val(fvirtualcointype.fminwithdraw);
                        $("#symbolWithdrawal").val(fvirtualcointype.fid);
                        $("#btcbalance").val(fvirtualwallet.ftotal);
                        $("#btcfee").val(fvirtualcointype.fnetworkfee);
                        $("#fee").val(data.fee.withdraw);
                    }

                    var dom = [];
                    if (data.withdrawList) {
                        data = data.withdrawList;
                        dom.push('<table id="withdrawals" class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg38"]+'</th><th>'+language["apple.dom.msg41"]+'</th><th>'+language["apple.dom.msg39"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                        $.each(data, function (index, item) {
                            dom.push('<tr>');
                            dom.push('<td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.fwithdrawaddress + '</td><td>' + item.addressremark + '</td><td>' + _util.addNum(item.ffees,item.fbtcfees) + '</td><td>' + item.fstatus_s + '</td></tr>');
                        })
                        dom.push('</tbody></table>');
                    }
                    $("#withdrawal2").html(dom.join(""));
                }
                $(".coninner-form").show();
                $('#loading').hide();
                $('#modal-withdrawal').modal('show');
            },
            showCnyCoinView: function (data) {
                if (data) {
                    $(".coinwithdrawName").text(data.fvirtualcointype.fname);
                    user = data.fuser;
                    if (user.fhasrealvalidate && user.ftradepassword != null) {
                        // if(false){
                        $('#domSec').show();
                        $('#domFir').hide();
                        var fvirtualwallet = data.fvirtualwallet;
                        var fvirtualcointype = data.fvirtualcointype;
                        var addressList = data.fvirtualaddressWithdraw;

                        $('#total_v').text(fvirtualwallet.ftotal)
                        $('#day_v').text(data.leftAmount)
                        $('#netfee_v').text(fvirtualcointype.fnetworkfee)
                        $('#minNum_v').text(fvirtualcointype.fminwithdraw)

                        $("#coinName").val(fvirtualwallet.fshortname);
                        $("#isWhiteUser").val(isWhiteUser);
//                        $("#max_double").val(fvirtualcointype.fmaxwithdraw);
//                        $("#min_double").val(fvirtualcointype.fminwithdraw);
                        $("#symbolWithdrawal").val(fvirtualcointype.fid);
                        $("#btcbalance").val(fvirtualwallet.ftotal);
                        $("#btcfee").val(fvirtualwallet.fnetworkfee);
                        $("#fee").val(fee.withdraw);
                    }
                }
                $(".coninner-form").show();
                $('#loading').hide();
                $('#modal-withdrawal').modal('show');
            }
        },
        dataHandler: {
            getVirtualCoinWithDraw: function (callback) {
                var self=this;
                var param = {
                    symbol: self.data.symbol
                };
                $('#loading').show();
                $.ajax({
                    url: "/financial/withdrawModal.html",
                    dataType: 'json',
                    data: param,
                    type: 'get',
                    success: function (res) {
                        var data = res.data;
                        if (typeof callback == "function") {
                            callback.call(this, data);
                        }
                    }
                })
            },
            getRecord: function (params) {
                var type=params[0], symbol=params[1], page=params[2];
                var self=this;
                var url = '/financial/list';
                var record=self.data.record;
                if (page == null) {
                    page = record.currentPage
                }
                var param = {
                    recordType: type,
                    currentPage: page,
                    pageSize: 5
                };
                if (symbol != -2) {
                    $("#symbol").val(symbol)
                }
                symbol = $("#symbol").val();
                param.symbol = symbol;
                $('#loading').show();
                $.ajax({
                    url: url,
                    type: "post",
                    dataType: "json",
                    data: param,
                    success: function (data) {
                        var list = data.data.rechargeList;
                        var dom = [];
                        if(self.data.isCny){
                            if (list && list.data) {
                                data = list.data;
                                if (type == 1) {
                                    dom.push('<table id="qcrecharge" class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg59"]+'</th><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg60"]+'</th><th>'+language["apple.dom.msg53"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                                }
                                if (type == 2) {	
                                    dom.push('<table id="qcwithdrawals" class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg59"]+'</th><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg81"]+'</th><th>'+language["apple.dom.msg82"]+'</th><th>'+language["apple.dom.msg39"]+'</th><th>'+language["apple.dom.msg83"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                                }
                                $.each(data, function (index, item) {
                                    dom.push('<tr>');
                                    if (type == 1)
                                        dom.push('<td>' + item.fcoinname + '</td><td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.frechargeaddress + '</td><td>' + item.fconfirmations + '</td><td>' + item.fstatus_s + '</td></tr>');
                                    if (type == 2)
                                        dom.push('<td>' + item.fcoinname + '</td><td>' + item.fcreatetime + '</td><td>' + item.famount +'</td><td>' + (item.famount-item.ffees) + '</td><td>' + (item.ffees) +'</td><td>' + item.frechargeaddress + '</td><td>' + item.fstatus_language + '</td></tr>');
                                })
                                dom.push('</tbody></table>');
                            }
                            if (type == 1)
                                $("#cnywithdrawal2").html(dom.join(""));
                            if (type == 2)
                                $("#cnywithdrawal2").html(dom.join(""));
                            $("#modal-bills").modal('show');
                            $("#loading").hide();
                            record.currentType = type;
                            // record.symbol = symbol;
                            common.getPageDom(page, list.totalPages, "recordPageUl",self.methods.getRecordByType);
                        }else{
                            if (list && list.data) {
                                data = list.data;
                                if (type == 1) {
                                    dom.push('<table class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg59"]+'</th><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg60"]+'</th><th>'+language["apple.dom.msg53"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                                }
                                if (type == 2) {
                                    dom.push('<table id="withdrawals" class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg59"]+'</th><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg38"]+'</th><th>'+language["apple.dom.msg41"]+'</th><th>'+language["apple.dom.msg39"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                                }
                                $.each(data, function (index, item) {
                                    dom.push('<tr>');
                                    if (type == 1)
                                        dom.push('<td>' + item.fcoinname + '</td><td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.frechargeaddress + '</td><td>' + item.fconfirmations + '</td><td>' + item.fstatus_s + '</td></tr>');
                                    if (type == 2)
                                        dom.push('<td>' + item.fcoinname + '</td><td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.fwithdrawaddress + '</td><td>' + item.addressremark + '</td><td>' + item.ffees + '</td><td>' + item.fstatus_s + '</td></tr>');
                                })
                                dom.push('</tbody></table>');
                            }
                            if (type == 1)
                                $("#homerp2").html(dom.join(""));
                            if (type == 2)
                                $("#updatesrp2").html(dom.join(""));
                            $("#modal-bills").modal('show');
                            $("#loading").hide();
                            record.currentType = type;
                            // record.symbol = symbol;
                            common.getPageDom(page, list.totalPages, "recordPageUl", self.methods.getRecordByType);
                        }
                    }
                })
            },
            getRecordByType: function (page) {
                var self=this;
                self.dataHandler.getRecord.call(self,[self.data.record.currentType, $("#symbol").val(), page]);
            }
        },
        methods: {
            getView: function () {
                var self = this;
                if(self.data.isCny){
                    self.dataHandler.getVirtualCoinWithDraw.call(this, self.viewHandler.showCnyCoinView);
                }else{
                    self.dataHandler.getVirtualCoinWithDraw.call(this, self.viewHandler.showVirtualCoinView);
                }
            },
            sendSMSSaveAddress:function (self) {
                if($(this).hasClass("disabled")){
                    $(this).removeClass("color_blue");
                    $(this).addClass("color_gray");
                    return false;
                }
                $(this).addClass("color_blue");
                self.data.phone = $("#ftelephoneaddress").val();
                msg.sendMsgCode(10, $("#fareacodeaddress").val(), self.data.phone,$("#editphone-imgcode").val());
            },
            sendSMSMessage:function (self) {
                if($(this).hasClass("disabled")){
                    $(this).removeClass("color_blue");
                    $(this).addClass("color_gray");
                    return false;
                }
                $(this).addClass("color_blue");
                self.data.phone = $("#ftelephone").val();
                if(self.data.isCny){
                    msg.sendMsgCode(4, $("#fareacode").val(), self.data.phone);
                }else{
                    msg.sendMsgCode(5, $("#fareacode").val(), self.data.phone);
                }
            },
            saveCnyWithdraw : function(ele) {
                var self=ele;
                var ele=this;
                var withdrawBlank = $("#withdrawBlank").val();
                var withdrawBalance = util.trim($("#withdrawBalance").val());
                var tradePwd = util.trim($("#tradePwd").val());
                var totpCode = 0;
                var phoneCode = 0;
                var min = $("#min_double").val();
                var max = $("#max_double").val();
                var reg = new RegExp("^[0-9]+\.{0,1}[0-9]{0,8}$");
                if(!self.methods.calculateFeesRate.call(this,true)){
                    return false;
                }
                if (!reg.test(withdrawBalance)) {
                    sweetAlert('', language["comm.error.tips.74"], 'error');
                    return;
                }
                if (parseFloat(withdrawBalance) < parseFloat(min)) {
                    sweetAlert('', language["comm.error.tips.77"], 'error');
                    return;
                }
                if (parseFloat(withdrawBalance) > parseFloat(max)) {
                    sweetAlert('', language["comm.error.tips.78"].format(max), 'error');
                    return;
                }
                if (tradePwd == "" || tradePwd.length > 200) {
                    sweetAlert('', language["comm.error.tips.79"], 'error');
                    return;
                }
                if ($("#withdrawTotpCode").length > 0 ) {
                    totpCode = util.trim($("#withdrawTotpCode").val());
                    if (!/^[0-9]{6}$/.test(totpCode)) {
                        sweetAlert('', language["comm.error.tips.80"], 'error');
                        return;
                    }

                }
                if ($("#withdrawPhoneCode").length > 0) {
                    phoneCode = util.trim($("#withdrawPhoneCode").val());
                    if (!/^[0-9]{6}$/.test(phoneCode)) {
                        sweetAlert('', language["comm.error.tips.81"], 'error');
                        return;
                    }
                }
                if ($("#withdrawPhoneCode") <= 0) {
                    sweetAlert('','您没有绑定手机，请去<a href=\'/user/security.html\'>个人中心</a>绑定手机后提现。', 'error');
                    return;
                }
                ele.disabled = true;
                var url = "/withdraw/cny_manual.html?random=" + Math.round(Math.random() * 100);
                var param = {
                    tradePwd : tradePwd,
                    withdrawBalance : withdrawBalance,
                    phoneCode : phoneCode,
                    totpCode : totpCode,
                    withdrawBlank : withdrawBlank
                };
                $.post(url, param, function(result) {
                    ele.disabled = false;
                    if (result != null) {
                        if (result.code == 200) {
                            sweetAlert('', '您的提现订单已提交，请耐心等待 ！', 'success', 1000);
                            location.reload(true);
                        } else {
                            sweetAlert('', result.msg, 'error');
                        }
                    }
                }, "json");
            },
            saveCoinWithdraw: function (self) {
                var withdraw=self.data;
                if (withdraw.isReq || new Date().getTime() - withdraw.lastTime < 10000) {
                    sweetAlert('', language["comm.error.tips.1037"], 'error');
                    withdraw.isReq = false;
                    return;
                }

                withdraw.isReq = true;
                withdraw.lastTime = new Date().getTime();

                if ($("#withdrawButton").hasClass("disabled")) {
                    withdraw.isReq = false;
                    return
                }
                $("#withdrawButton").addClass("disabled");
                var coinName = $("#coinName").val();
                var withdrawAddr = util.trim($("#withdrawAddr").val());
                var withdrawAmount = util.trim($("#withdrawAmount").val());
                var tradePwd = util.trim($("#tradePwd").val());
                var max_double = util.trim($("#max_double").val());
                var min_double = util.trim($("#min_double").val());
                var totpCode = 0;
                var phoneCode = 0;
                var mailCode = 0;
                var btcfee = 0;
                var symbol = $("#symbolWithdrawal").val();
                if ($("#btcbalance").length > 0 && $("#btcbalance").val() == 0) {
                    sweetAlert('', language["comm.error.tips.54"], 'error');
                    $("#withdrawButton").removeClass("disabled");
                    withdraw.isReq = false;
                    return;
                }
                if (withdrawAddr == "") {
                    sweetAlert('', language["comm.error.tips.55"], 'error');
                    $("#withdrawButton").removeClass("disabled");
                    withdraw.isReq = false;
                    return;
                }
                var reg = new RegExp("^[0-9]+\.{0,1}[0-9]{0,8}$");
                if (!reg.test(withdrawAmount)) {
                    sweetAlert('', language["comm.error.tips.56"], 'error');
                    $("#withdrawButton").removeClass("disabled");
                    withdraw.isReq = false;
                    return;
                }
                if (parseFloat(withdrawAmount) < parseFloat(min_double)) {
                    sweetAlert('', language["comm.tips.message.5"] + util.formatNum1(max_double) + coinName, 'error');
                    $("#withdrawButton").removeClass("disabled");
                    withdraw.isReq = false;
                    return;
                }
                if ($("#isWhiteUser").val() == "" && parseFloat(withdrawAmount) > parseFloat(max_double)) {//非白名单用户限制
                    sweetAlert('', language["comm.tips.message.6"] + util.formatNum1(max_double) + coinName, 'error');
                    $("#withdrawButton").removeClass("disabled");
                    withdraw.isReq = false;
                    return;
                }
                var btcfee = util.numFormat($("#btcfee").val(), 4);
                var canTotal = util.numFormat($("#btcbalance").val(), 4);
                var fee = $("#fee").val();
                if (util.numFormat(canTotal - btcfee - fee * withdrawAmount - withdrawAmount, 4) < 0) {
                    sweetAlert('', language["comm.error.tips.54"], 'error');
                    $("#withdrawButton").removeClass("disabled");
                    withdraw.isReq = false;
                    return;
                }

                if (tradePwd == "") {
                    sweetAlert('', language["comm.error.tips.58"], 'error');
                    $("#withdrawButton").removeClass("disabled");
                    withdraw.isReq = false;
                    return;
                }
                if ($("#withdrawTotpCode").length > 0) {
                    totpCode = util.trim($("#withdrawTotpCode").val());
                    if (!/^[0-9]{6}$/.test(totpCode)) {
                        sweetAlert('', language["comm.error.tips.59"], 'error');
                        $("#withdrawButton").removeClass("disabled");
                        withdraw.isReq = false;
                        return;
                    }
                }
                if ($("#withdrawPhoneCode").length > 0) {
                    phoneCode = util.trim($("#withdrawPhoneCode").val());
                    if (!/^[0-9]{6}$/.test(phoneCode)) {
                        sweetAlert('', language["comm.error.tips.60"], 'error');
                        $("#withdrawButton").removeClass("disabled");
                        withdraw.isReq = false;
                        return;
                    }
                }
                if ($("#withdrawMailCode").length > 0) {
                    mailCode = util.trim($("#withdrawMailCode").val());
                    if (!/^[0-9]{6}$/.test(mailCode)) {
                        sweetAlert('', language["comm.error.new.tips.1"], 'error');
                        $("#withdrawMailCode").val("");
                        $("#withdrawButton").removeClass("disabled");
                        withdraw.isReq = false;
                        return;
                    }
                }

                btcfee = util.numFormat($("#btcfee").val(), 4);
                var url = "/withdraw/coin_manual.html?random=" + Math.round(Math.random() * 100);
                var param = {
                    withdrawAddr: withdrawAddr,
                    withdrawAmount: withdrawAmount,
                    tradePwd: tradePwd,
                    totpCode: totpCode,
                    phoneCode: phoneCode,
                    mailCode: mailCode,
                    symbol: symbol
                };
                $("#withdrawButton").attr("disabled", false);
                $.post(url, param, function (result) {
                    withdraw.isReq = false;
                    $("#withdrawButton").removeClass("disabled");
                    if (result != null) {
                        if (result.code == 200) {
                            $("#withdrawButton").attr("disabled", true);
                            sweetAlert('', language["comm.tips.message.7"], 'success');
                            window.location.reload(true);
                        } else {
                            sweetAlert('', result.msg, 'error');
                        }
                    }
                }, "json");
            },
            calculateFeesRate : function(isAlert) {
                var amount = $("#withdrawBalance").val();
                var ftotal = parseFloat($("#ftotal").attr("ftotal"));
                if (amount > ftotal) {
                    amount=ftotal;
                    $$("#withdrawBalance").val(ftotal);
                }
                if (amount < 100) {
                    if(isAlert){
                        sweetAlert('', "最小单笔提现金额100.00", 'error');
                        return false;
                    }
                } else if ($("#isWhiteUser").val()== "" && amount > 200000) {//非白名单用户限制
                    if(isAlert) {
                        sweetAlert('', "最大单笔提现金额200000.00", 'error');
                        return false;
                    }else{
                        amount=200000;
                        $("#withdrawBalance").val(200000);
                    }
                }

                var feesRate = $("#feesRate").val();

                if (amount == "") {
                    amount = 0;
                }
                if (amount >= 100) {
                    var feeamt = util.numFormat(util.accMul(amount, feesRate), 2);
                    if (feeamt < 5) {
                        $("#free").html(5.00);
                        feeamt = 5;
                    } else {
                        $("#free").html(feeamt);
                    }
                    $("#amount").html(util.numFormat(parseFloat(amount) - parseFloat(feeamt), 2));
                }
                return true;
            },
            addCnyAddress : function() {
                var yhknumberModal = $("#modal-yhknumber");

                var payeeAddr = yhknumberModal.find("#payeeAddr").val();
                var openBankTypeAddr = $("#openBankTypeAddr").val();
                var withdrawAccount = util.trim($("#withdrawAccountAddr").val());
                var address = util.trim($("#address").val());
                var prov = util.trim($("#prov").val());
                var city = util.trim($("#city").val()==null?"":$("#city").val());
                //		var dist = util.trim($("#dist").val()==null?"":$("#dist").val());
                var totpCode = 0;
                var phoneCode = 0;
                if (payeeAddr == "" || payeeAddr == "请输入您的银行卡开户人" || payeeAddr == "请输入您的支付宝开户人") {
                    sweetAlert('', language["comm.error.tips.129"], 'error');
                    return;
                }
                if (openBankTypeAddr == -1) {
                    sweetAlert('', language["comm.error.tips.70"], 'error');
                    return;
                }
                var reg = /^(\d{16}|\d{17}|\d{18}|\d{19})$/;
                if(!reg.test(withdrawAccount)){
                    //银行卡号不合法
                    sweetAlert('', language["comm.error.tips.134"], 'error');
                    return;
                }
                if (withdrawAccount == "" || withdrawAccount.length > 200 || withdrawAccount == language["comm.error.tips.62"]) {
                    sweetAlert('', language["comm.error.tips.71"], 'error');
                    return;
                }
                var withdrawAccount2 = util.trim($("#withdrawAccountAddr2").val());
                if (withdrawAccount != withdrawAccount2) {
                    sweetAlert('', language["comm.error.tips.72"], 'error');
                    return;
                }
                if ((prov == "" || prov == "请选择") || (city == "" || city == "请选择") || address == "") {
                    sweetAlert('', language["comm.error.tips.73"], 'error');
                    return;
                }
                if (address.length > 300) {
                    sweetAlert('', language["comm.error.tips.73"], 'error');
                    return;
                }

                if ($("#addressTotpCode").length>0) {
                    totpCode = util.trim($("#addressTotpCode").val());
                    if (!/^[0-9]{6}$/.test(totpCode)) {
                        sweetAlert('', language["comm.error.tips.65"], 'error');
                        $("#addressTotpCode").val("");
                        return;
                    }
                }
                if ($("#addressPhoneCode").length>0) {
                    phoneCode = util.trim($("#addressPhoneCode").val());
                    if (!/^[0-9]{6}$/.test(phoneCode)) {
                        sweetAlert('', language["comm.error.tips.66"], 'error');
                        $("#addressPhoneCode").val("");
                        return;
                    }
                }
                $.ajax({
                    url: "/user/save_bankinfo.html?random=" + Math.round(Math.random() * 100),
                    dataType: 'json',
                    data: {
                        account : withdrawAccount,
                        openBankType : openBankTypeAddr,
                        totpCode : totpCode,
                        phoneCode : phoneCode,
                        address : address,
                        prov : prov,
                        city : city,
//			dist : dist,
                        payeeAddr : payeeAddr
                    },
                    type: 'get',
                    async: false,
                    success: function (res) {
                        if (res != null) {
                            if (res.code == 200) {
                                window.location.reload(true);
                            } else {
                                sweetAlert('', res.msg, 'error');
                            }
                        }

                    }
                })
            },
            saveModifyPwd: function (params) {
                var pwdType=params[0],istrade=params[1];
                var originPwdEle = "";
                var newPwdEle = "";
                var reNewPwdEle = "";
                var phoneCodeEle = "";
                var totpCodeEle = "";
                if (pwdType == 0) {
                    originPwdEle = "#editloginpass-oldpass";
                    newPwdEle = "#editloginpass-newpass";
                    reNewPwdEle = "#editloginpass-confirmpass";
                    phoneCodeEle = "#editloginpass-msgcode";
                    totpCodeEle = "#editloginpass-googlecode";
                } else {
                    if (istrade) {
                        originPwdEle = "#edittradepass-oldpass";
                        newPwdEle = "#edittradepass-newpass";
                        reNewPwdEle = "#edittradepass-confirmpass";
                        phoneCodeEle = "#edittradepass-msgcode";
                        totpCodeEle = "#edittradepass-googlecode";

                    } else {
                        newPwdEle = "#edittradepass-newpass";
                        reNewPwdEle = "#edittradepass-confirmpass";
                        phoneCodeEle = "#edittradepass-msgcode";
                        totpCodeEle = "#edittradepass-googlecode";
                    }
                }
                if (istrade) {
                    var originPwd = util.trim($(originPwdEle).val());
                }
                var newPwd = util.trim($(newPwdEle).val());
                var reNewPwd = util.trim($(reNewPwdEle).val());
                if (istrade) {
                    var originPwdTips = util.isPassword(originPwd);
                }
                var newPwdTips = util.isPassword(newPwd);
                var reNewPwdTips = util.isPassword(reNewPwd);
                if (istrade && originPwdTips != "") {
                    sweetAlert('', originPwdTips, 'error');
                    return;
                }
                if (newPwdTips != "") {
                    sweetAlert('', newPwdTips, 'error');
                    return;
                }
                if (reNewPwdTips != "") {
                    sweetAlert('', reNewPwdTips, 'error');
                    return;
                }
                if (newPwd != reNewPwd) {
                    sweetAlert('', language["comm.error.tips.109"], 'error');
                    $(reNewPwdEle).val("");
                    return;
                }
                var phoneCode = "";
                var totpCode = "";
                if ($(phoneCodeEle).length > 0) {
                    phoneCode = util.trim($(phoneCodeEle).val());
                    if (phoneCode == "") {
                        sweetAlert('', language["comm.error.tips.60"], 'error');
                        return;
                    }
                    if (!/^[0-9]{6}$/.test(phoneCode)) {
                        sweetAlert('', language["comm.error.tips.124"], 'error');
                        return;
                    }
                }
                if ($(totpCodeEle).length > 0) {
                    totpCode = util.trim($(totpCodeEle).val());
                    if (!/^[0-9]{6}$/.test(totpCode)) {
                        sweetAlert('', language["comm.error.tips.98"], 'error');
                        return;
                    }
                }
                if ($(phoneCodeEle).length <= 0 && $(totpCodeEle).length <= 0) {
                    sweetAlert('', language["comm.error.tips.110"], 'error');
                    return;
                }
                var url = "/user/modify_passwd.html?random=" + Math.round(Math.random() * 100);
                var param = {
                    pwdType: pwdType,
                    originPwd: originPwd,
                    newPwd: newPwd,
                    reNewPwd: reNewPwd,
                    phoneCode: phoneCode,
                    totpCode: totpCode
                };
                $.post(url, param, function (data) {
                    if (data.code == 0) {
                        if (istrade) {
                            sweetAlert('', language["apple.dom.msg54"] + (pwdType == 0 ? language["apple.dom.msg55"] :language["apple.dom.msg56"]) + language["apple.dom.msg57"]+"！", 'success');
                        } else {
                            sweetAlert('', language["apple.dom.msg58"]+"！", 'success');
                        }
                        window.location.href = "/n/personalCenter.html";
                    } else if (data.code == -3) {
                        sweetAlert('', data.msg, 'error');
                        $(reNewPwdEle).val("");
                    } else if (data.code == -5) {
                        sweetAlert('', data.msg, 'error');
                        $(originPwdEle).val("");
                    } else if (data.code == -6) {
                        sweetAlert('', data.msg, 'error');
                        $(totpCodeEle).val("");
                    } else if (data.code == -7) {
                        sweetAlert('', data.msg, 'error');
                        $(phoneCodeEle).val("");
                    } else {
                        sweetAlert('', data.msg, 'error');
                    }
                }, "json");
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
                            $(".tradepass_interval_desc").html(language["apple.dom.msg22"]);
                        } else if (interval == 0) {
                            $(".tradepass_interval_desc").html(language["apple.dom.msg23"]);
                        } else {
                            $(".tradepass_interval_desc").html(language["apple.dom.msg24"] + interval + language["apple.dom.msg25"]);
                        }
                        window.location.href = "/n/personalCenter.html";
                    } else {            }

                    sweetAlert('', result.msg, 'error');
                }, "json");

            }
        }
    }

    $(function () {
        page.init();
    });
}();