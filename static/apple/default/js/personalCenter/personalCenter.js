var withdraw = {
    lastTime:0,
    isReq:false
}
var assets = {
    isReq:false
}
var record = {
    currentType:1,
    currentPage:1
}

var tab;

var pcenter;
pcenter = {
    showLoginWinwowNoCancel: function (content, url, sureText,type) {
        swal({
                title: "",
                text: content,
                type: type,
                showCancelButton: false,
                confirmButtonText: sureText,
                closeOnConfirm: false
            },
            function () {
                window.location.href = url;
            });
    },
    init: function () {
        $(".block-bar-tab li").removeClass('active');
        $("#pcenterLi").addClass('active');
    },
    allfinance: {
        cny: '',
        usd: '',
        btc: ''
    },
    isCny:function (shortName) {
        var cnyName=$("input[name=cnyName]").val();
        if(!cnyName){
            return false;
        }else{
            return cnyName==shortName;
        }
    },
    userWwallet: function () {
        var flag = false;
        var loginType;
        var coins = [];
        var coinIds = [];
        //在发起一个ajax
        myajax = $.ajax({
            url: "/n/getbindingRRFINEXUser.html",
            type: "post",
            dataType: "json",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", $.getCookie('token'));
            },
            success: function(data){
                if(data.code == 200) {
                    //做事情
                    logintype = data.data.loginType;
                    coins = data.data.coins;
                    for ( var i = 0; i <coins.length; i++){
                        coinIds.push(coins[i].fcoinid);
                    }
                    //0-需要重新登录R网，1-进入资产划拨页面
                    if(logintype == 0){
                        loginType = 0;
                        flag = true;
                    }else if(logintype == 1){
                        //资产划拨
                        loginType = 1;
                        flag = true;
                    }

                }else {

                }
            }
        })

        $.when(myajax).done(function () {
            //要执行的操作
            $.ajax({
                url: "/n/getUserVirtualWalletInfo.html",
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        var dom = [];
                        var option_dom = [];

                        /*获取当前币种*/
                        var dropvalue = $('.drop').find('em').text();
                        pcenter.allfinance = {
                            cny: data.data.totalCNY,
                            usd: data.data.totalUSDT,
                            btc: data.data.totalBTC
                        };
                        $.each(data.data.wallets, function (index, item) {
                            var total = item.ftotal + item.ffrozen + item.flock;
                            common.discountworth.cny.push({
                                allworth: item.totalCNY + item.ffrozenCNY + item.flockCNY,
                                totalworth: item.totalCNY,
                                frozenworth: item.ffrozenCNY,
                            })
                            common.discountworth.usd.push({
                                allworth: item.totalUSDT + item.ffrozenUSDT + item.flockUSDT,
                                totalworth: item.totalUSDT,
                                frozenworth: item.ffrozenUSDT,
                            })
                            common.discountworth.btc.push({
                                allworth: item.totalBTC + item.ffrozenBTC + item.flockBTC,
                                totalworth: item.totalBTC,
                                frozenworth: item.ffrozenBTC,
                            })
                            if (total == 0) {
                                dom.push('<div class="tr zeroTr">');
                            } else {
                                dom.push('<div class="tr">');
                            }

                            var isCny=pcenter.isCny(item.fshortname);

                            /*币种*/
                            dom.push('<div class="td cointTag">');
                            dom.push('<div class="cell">');
                            dom.push('<img src="' + item.coinImgUrl + '" class="market-icon">');
                            dom.push('<b>');
                            dom.push(item.fshortname);
                            dom.push('</b>');
                            dom.push('</div>');
                            dom.push('</div>');

                            /*总数*/
                            dom.push('<div class="td total cur-total" >');
                            dom.push('<div class="cell">');

                            dom.push('<span class="allworth" title=" '+language["apple.dom.msg31"]+' ￥' + common.retainDemical(item.totalCNY + item.ffrozenCNY + item.flockCNY, 4) + '">');
                            dom.push(_util.numFormat(item.ftotal + item.ffrozen + item.flock, 8));
                            dom.push('</span>');
                            dom.push('</div>');
                            dom.push('</div>');


                            /*总资产占比*/
                            dom.push('<div class="td proportion">');
                            if (total == 0) {
                                dom.push('<div class="cell">');

                            } else {
                                dom.push('<div class="cell hasdata">');
                            }
                            if (pcenter.allfinance.cny <= 0 || isNaN(pcenter.allfinance.cny)) {
                                dom.push(0);
                            } else {
                                var propertion = (item.totalCNY + item.ffrozenCNY + item.flockCNY) * 100 / pcenter.allfinance.cny;
                                if ((propertion.toString().indexOf('E-') != -1) || (propertion.toString().indexOf('e-') != -1)){
                                    dom.push(0);
                                }else{
                                    dom.push(common.retainDemical(propertion, 4));
                                }
                            }

                            dom.push('</div>');
                            dom.push('</div>');

                            /*可用*/
                            dom.push('<div class="td useable">');
                            dom.push('<div class="cell">');
                            dom.push('<span class="totalworth" title=" '+language["apple.dom.msg31"]+' ￥' + common.retainDemical(item.totalCNY,4) + '">');
                            dom.push(common.retainDemical(item.ftotal, 9));
                            dom.push('</span>');
                            dom.push('</div>');
                            dom.push('</div>');

                            /*冻结*/
                            dom.push('<div class="td frozen">');
                            dom.push('<div class="cell">');
                            dom.push('<span class="frozenworth" title=" '+language["apple.dom.msg31"]+' ￥' + common.retainDemical(item.ffrozenCNY,4) + '">');
                            dom.push(_util.numFormat(item.ffrozen,8));
                            dom.push('</span>');
                            dom.push('</div>');
                            dom.push('</div>');


                            /*操作*/
                            dom.push('<div class="td action">');
                            dom.push('<div class="cell">');




                            if(isCny){
                                window.cnyAlert=function () {
                                    sweetAlert('', language['comm.error.tips.140'], 'error')
                                }
                                var alertMessage='javascript:window.cnyAlert();';

                                //循环遍历可以支持R网划拨的币种
                                for ( var i = 0; i <coins.length; i++){
                                    if(coins[i].fcoinid == item.fcoinid){
                                        if(flag &&  loginType == 1){
                                            //资产划拨
                                            dom.push('<a class="btn btn-primary btn-sm" onclick="pcenter.getTransferWindows('+item.fcoinid+')">');
                                            dom.push(language["apple.dom.msg111"]);
                                            dom.push("</a>");
                                        }if(flag &&  loginType == 0){
                                            //需要重新登陸
                                            dom.push('<a class="btn btn-primary btn-sm" onclick="pcenter.transferFail()">');
                                            dom.push(language["apple.dom.msg111"]);
                                            dom.push("</a>");
                                        }
                                        break;
                                    }
                                }
                                //当前币不是支持R网划拨的币种,为了排版整齐设置空的div
                                if(!coinIds.includes(item.fcoinid)) {
                                    dom.push('<div style="margin-right:10px;width: 100px;background:red;display:inline-block"></div>');
                                }


                                dom.push('<a class="btn btn-primary btn-sm qcc2c" href='+ (($('#frealischeck').val() == "2") ? "/n/c2c.html?coinid="+ item.fcoinid : alertMessage) +'>');
                                dom.push(language["apple.dom.msg32"]);
                                dom.push('</a>');
                                dom.push('<a class="qcc2c" href='+ (($('#frealischeck').val() == "2") ? "/n/c2c.html?coinid="+ item.fcoinid : alertMessage) +'>');
                                dom.push(language["apple.dom.msg33"]);
                                dom.push('</a>');
                                dom.push('<a class=""  href="/n/recharge.html?coinid=' + item.fcoinid + '"  >');
                                dom.push(language["apple.dom.msg34"]);
                                dom.push('</a>');
                                dom.push('<a class=""  href="/n/account.html?coinid=' + item.fcoinid + '"   >');
                                dom.push(language["apple.dom.msg35"]);
                                dom.push('</a>');
                            }else{
                                //循环遍历可以支持R网划拨的币种
                                for ( var i = 0; i <coins.length; i++){
                                    if(coins[i].fcoinid == item.fcoinid){
                                        if(flag &&  loginType == 1){
                                            //资产划拨
                                            dom.push('<a class="btn btn-primary btn-sm" onclick="pcenter.getTransferWindows('+item.fcoinid+')">');
                                            dom.push(language["apple.dom.msg111"]);
                                            dom.push("</a>");
                                        }if(flag &&  loginType == 0){
                                            //需要重新登陸
                                            dom.push('<a class="btn btn-primary btn-sm" onclick="pcenter.transferFail()">');
                                            dom.push(language["apple.dom.msg111"]);
                                            dom.push("</a>");
                                        }
                                        break;
                                    }
                                }
                                 //当前币不是支持R网划拨的币种,为了排版整齐设置空的div
                                if(!coinIds.includes(item.fcoinid)) {
                                    dom.push('<div style="margin-right:10px;width: 100px;background:red;display:inline-block"></div>');
                                }

                                // dom.push('<a class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-deposit" id="Deposit'+index+'" onclick="pcenter.openRechargeModal('+item.fcoinid+',1)" >');
                                dom.push('<a class="btn btn-primary btn-sm" href="/n/recharge.html?coinid=' + item.fcoinid + '" >');
                                dom.push(language["apple.dom.msg32"]);
                                dom.push('</a>');
                                dom.push('<a class="" href="/n/withdrawals.html?coinid=' + item.fcoinid + '" >');
                                // dom.push('<a class="" data-toggle="modal" data-target="#modal-withdrawal" id="Withdrawal'+index+'" onclick="pcenter.openWithdrawModal('+item.fcoinid+',2)" >');
                                dom.push(language["apple.dom.msg33"]);
                                dom.push('</a>');
                                // dom.push('<a class="" data-toggle="modal" data-target="#modal-bills" id="Bills'+index+'" onclick="pcenter.getRecord(1,'+item.fcoinid+')">' );
                                dom.push('<a class=""  href="/n/bill.html?coinid=' + item.fcoinid + '"  >');
                                dom.push(language["apple.dom.msg34"]);
                                dom.push('</a>');
                                dom.push('<a class=""  href="/n/account.html?coinid=' + item.fcoinid + '"   >');
                                // dom.push('<a class="" data-toggle="modal" data-target="#modal-address" id="WithdrawalAddress'+index+'" onclick="pcenter.openAddressModal('+item.fcoinid+')">' );
                                dom.push(language["apple.dom.msg35"]);
                                dom.push('</a>');
                            }
                            dom.push('</a>');
                            dom.push('</div>');
                            dom.push('</div>');
                            dom.push('</div>');
                        })

                        $("#tbody-wallets").html(dom.join(""))
                        var allproportion = 0;
                        var lastvalue   //最后一个值
                        if($(".hasdata").length<=0){
                            lastvalue=0
                        }else if($(".hasdata").length==1){
                            lastvalue=$(".hasdata").text()*1000;
                            lastvalue=lastvalue/1000
                        }else{
                            $(".hasdata").each(function (index, item) {
                                if (index < $(".hasdata").length - 1) {
                                    allproportion += $(this).text() * 1000
                                    $(this).text($(this).text())
                                }
                            });
                            lastvalue=100 - allproportion/1000;
                        }
                        lastvalue = lastvalue.toFixed(3);
                        $(".hasdata").last().text(lastvalue);

                        $(".proportion").each(function () {
                            $(this).text($(this).text() + "%")
                        })

                        $("#nowfinance").text(common.retainDemical(pcenter.allfinance.cny, 4));

                        //生成期权钱包数据
                        $.each(data.data.optionWallets, function (index, item) {
                            var total = item.ftotal + item.ffrozen + item.flock;

                            if (total == 0) {
                                option_dom.push('<div class="tr zeroTr">');
                            } else {
                                option_dom.push('<div class="tr">');
                            }

                            /*币种*/
                            option_dom.push('<div class="td cointTag">');
                            option_dom.push('<div class="cell">');
                            option_dom.push('<b>');
                            option_dom.push(item.fshortname);
                            option_dom.push('</b>');
                            option_dom.push('</div>');
                            option_dom.push('</div>');

                            /*总数*/
                            option_dom.push('<div class="td total cur-total" >');
                            option_dom.push('<div class="cell">');

                            option_dom.push('<span class="allworth">');
                            option_dom.push(_util.numFormat(item.ftotal + item.ffrozen + item.flock, 8));
                            option_dom.push('</span>');
                            option_dom.push('</div>');
                            option_dom.push('</div>');


                            /*可赎回量*/
                            option_dom.push('<div class="td redeemable">');
                            if (item.fredeemable == 0) {
                                option_dom.push('<div class="cell">');
                            } else {
                                option_dom.push('<div class="cell hasdata">');
                            }
                            option_dom.push(common.retainDemical(item.fredeemable, 9));
                            option_dom.push('</div>');
                            option_dom.push('</div>');

                            /*可用*/
                            option_dom.push('<div class="td useable">');
                            option_dom.push('<div class="cell">');
                            option_dom.push('<span class="totalworth" >');
                            option_dom.push(common.retainDemical(item.ftotal, 9));
                            option_dom.push('</span>');
                            option_dom.push('</div>');
                            option_dom.push('</div>');

                            /*冻结*/
                            option_dom.push('<div class="td frozen">');
                            option_dom.push('<div class="cell">');
                            option_dom.push('<span class="frozenworth" >');
                            option_dom.push(common.retainDemical(item.ffrozen, 9));
                            option_dom.push('</span>');
                            option_dom.push('</div>');
                            option_dom.push('</div>');

                            /*操作*/
                            option_dom.push('<div class="td action">');
                            option_dom.push('<div class="cell">');
                            option_dom.push('<span class="td cointTag" style="align-content: center">');
                            if (item.disable){
                                option_dom.push(language["apple.dom.msg101"]);
                            }else {
                                option_dom.push(language["apple.dom.msg102"]);
                            }

                            option_dom.push('</span>');
                            // dom.push('<a class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-deposit" id="Deposit'+index+'" onclick="pcenter.openRechargeModal('+item.fcoinid+',1)" >');
                            // option_dom.push('<a class="btn btn-primary btn-sm" href="/n/recharge.html?coinid=' + item.fcoinid + '" >');
                            // option_dom.push(language["apple.dom.msg32"]);
                            // option_dom.push('</a>');
                            // option_dom.push('<a class="" data-toggle="modal" href="/n/withdrawals.html?coinid=' + item.fcoinid + '" >');
                            // dom.push('<a class="" data-toggle="modal" data-target="#modal-withdrawal" id="Withdrawal'+index+'" onclick="pcenter.openWithdrawModal('+item.fcoinid+',2)" >');
                            // option_dom.push(language["apple.dom.msg33"]);
                            // option_dom.push('</a>');
                            // dom.push('<a class="" data-toggle="modal" data-target="#modal-bills" id="Bills'+index+'" onclick="pcenter.getRecord(1,'+item.fcoinid+')">' );
                            // option_dom.push('<a class="" data-toggle="modal" href="/n/bill.html?coinid=' + item.fcoinid + '"  >');
                            // option_dom.push(language["apple.dom.msg34"]);
                            // option_dom.push('</a>');
                            // option_dom.push('<a class="" data-toggle="modal" href="/n/account.html?coinid=' + item.fcoinid + '"   >');
                            // dom.push('<a class="" data-toggle="modal" data-target="#modal-address" id="WithdrawalAddress'+index+'" onclick="pcenter.openAddressModal('+item.fcoinid+')">' );
                            // option_dom.push(language["apple.dom.msg35"]);
                            // option_dom.push('</a>');
                            option_dom.push('</div>');
                            option_dom.push('</div>');
                            option_dom.push('</div>');
                        });

                        $("#tbody-option-wallets").html(option_dom.join(""))
                    }
                }
            })
        });


    },
    openDepositModal: function (fcoinid, recordType) {
        var param = {
            recordType: recordType,
            symbol: fcoinid,
            currentPage: 1
        };
        $.ajax({
            url: "/financial/list.html",
            dataType: 'json',
            data: param,
            type: 'get',
            async: false,
            success: function (res) {
                if (recordType == 1) {
                    $("#modal-deposit").show();
                } else {
                    $("#modal-withdrawal").show();
                }

            }
        })
    },
    openWithdrawModal: function (symbol) {
        var param = {
            symbol: symbol
        };
        $('#loading').show();
        $.ajax({
            url: "/financial/withdrawModal.html",
            dataType: 'json',
            data: param,
            type: 'get',
            success: function (res) {
                var data = res.data
                var user
                if (data) {
                    $(".coinwithdrawName").text(data.fvirtualcointype.fname);
                    user = data.fuser;
                    if (!user.fhasrealvalidate | user.ftradepassword == null) {
                        $('#domSec').hide()
                        $('#domFir').show()

                        var domFir = [];
                        // domFir.push('<div class="withdraw_validate" style=""><div>您还需要完善以下账户信息设置才可以继续进行提币操作：</div>')
                        if (!data.fuser.fhasrealvalidate) {
                            // domTip.push('<div><span>完成初级认证</span><a href="/n/KYCBasic.html">立即认证 >></a></div>')
                            $('#tradePass').hide()
                            $('#KYCBasic').show()
                        }
                        if (user.ftradepassword == null) {
                            // domFir.push('<div><span>设置资金密码</span></div>')
                            $('#KYCBasic').hide()
                            $('#tradePass').show()
                        }
                        // $("#withdrawal1").html(domFir.join(""));
                    }

                    if (user.fhasrealvalidate && user.ftradepassword != null) {
                        // if(false){
                        $('#domSec').show()
                        $('#domFir').hide()
                        var fvirtualwallet = data.fvirtualwallet;
                        var fvirtualcointype = data.fvirtualcointype;
                        var addressList = data.fvirtualaddressWithdraw;
                        var domAddress = [];
                        domAddress.push('<select id="withdrawAddr" name="withdrawAddr" class="form-control valid" >');
                        $.each(addressList, function (index, item) {
                            domAddress.push('<option value="' + item.fid + '">' + item.fremark + '--' + item.fadderess + '</option>');
                        });
                        domAddress.push('</select>');
                        $("#AddressDiv").html(domAddress.join(""));

                        $('#total_v').text(fvirtualwallet.ftotal)
                        $('#day_v').text(data.leftAmount)
                        $('#netfee_v').text(fvirtualcointype.fnetworkfee)
                        $('#minNum_v').text(fvirtualcointype.fminwithdraw)

                        $("#coinName").val(fvirtualwallet.fshortname);
                        $("#isWhiteUser").val(isWhiteUser);
                        $("#max_double").val(fvirtualcointype.fmaxwithdraw);
                        $("#min_double").val(fvirtualcointype.fminwithdraw);
                        $("#symbolWithdrawal").val(fvirtualcointype.fid);
                        $("#btcbalance").val(fvirtualwallet.ftotal);
                        $("#btcfee").val(fvirtualwallet.fnetworkfee);
                        $("#fee").val(fee.withdraw);
                    }
                    var dom = [];
                    if (data.withdrawList) {
                        data = data.withdrawList;
                        dom.push('<table class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg38"]+'</th><th>'+language["apple.dom.msg39"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                        $.each(data, function (index, item) {
                            dom.push('<tr>');
                            dom.push('<td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.fwithdrawaddress + item.addressremark + '</td><td>' + item.ffees + '</td><td>' + item.fstatus_s + '</td></tr>');
                        })
                        dom.push('</tbody></table>');
                    }
                    $("#withdrawal2").html(dom.join(""));
                }
                $('#loading').hide();
                $('#modal-withdrawal').modal('show');
            }
        })
    },
    openAddressModal: function (symbol) {
        var param = {
            symbol: symbol
        };
        $('#loading').show();
        $.ajax({
            url: "/financial/accountAddressModal.html",
            dataType: 'json',
            data: param,
            type: 'get',
            success: function (res) {
                var data = res.data
                if (data) {
                    $(".coinwithdrawName").text(data.fvirtualcointype.fname);
                    $("#coinName").val(data.fvirtualcointype.fshortname);
                    var user = data.fuser;
                    var dom = [];
                    if (data.addressWithdraws) {
                        data = data.addressWithdraws;
                        dom.push('<table class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg41"]+'</th><th>'+language["apple.dom.msg42"]+'</th><th>'+language["apple.dom.msg43"]+'</th></tr></thead><tbody>');
                        $.each(data, function (index, item) {
                            dom.push('<tr>');
                            dom.push('<td>' + item.fremark + '</td><td>' + item.fadderess + '</td><td><a href="#" onclick="pcenter.detelCoinAddress(' + item.fid + ')">'+language["apple.dom.msg44"]+'</a><a href="#" onclick="pcenter.updateAddressAlert(' + item.fid + ')" class="modify_tab">'+language["apple.dom.msg45"]+'</a></td></tr>');
                        })
                        dom.push('</tbody></table>');
                    }
                    $("#address2").html(dom.join(""));
                }
                $('#loading').hide();
                $('#symbolAddress').val(symbol);
                $("#modal-address").modal('show');

            }
        })
    },
    addCoinAddress: function () {
        if (assets.isReq) {
            return;
        }
        assets.isReq = true;
        var coinName = $("#coinName").val();
        var withdrawAddr = util.trim($("#newWithdrawAddress").val());
        var withdrawRemark = util.trim($("#withdrawRemark").val());
        var withdrawBtcPass = util.trim($("#tradePwdAdd").val());
        var withdrawBtcAddrTotpCode = 0;
        var withdrawBtcAddrPhoneCode = 0;
        var withdrawBtcAddrMailCode = 0;
        var symbol = $("#symbolAddress").val();
        if (withdrawAddr == "") {
            sweetAlert('', language["comm.error.tips.63"], 'error');
            assets.isReq = false;
            return;
        }
        var start = withdrawAddr.substring(0, 1);
        if (!(withdrawAddr.length >= 20 && withdrawAddr.length <= 35) && withdrawAddr.length != 42) {
            sweetAlert('', language["comm.error.tips.64"].format(coinName), 'error');
            assets.isReq = false;
            return;
        }
        if ($("#addressTotpCode").length > 0) {
            withdrawBtcAddrTotpCode = util.trim($("#addressTotpCode").val());
            if (!/^[0-9]{6}$/.test(withdrawBtcAddrTotpCode)) {
                sweetAlert('', language["comm.error.tips.65"], 'error');
                $("#addressTotpCode").val("");
                assets.isReq = false;
                return;
            }
        }
        if ($("#addressPhoneCode").length > 0) {
            withdrawBtcAddrPhoneCode = util.trim($("#addressPhoneCode").val());
            if (!/^[0-9]{6}$/.test(withdrawBtcAddrPhoneCode)) {
                sweetAlert('', language["comm.error.tips.66"], 'error');
                $("addressPhoneCode").val("");
                assets.isReq = false;
                return;
            }
        }
        if ($("#addressMailCode").length > 0) {
            withdrawBtcAddrMailCode = util.trim($("#addressMailCode").val());
            if (!/^[0-9]{6}$/.test(withdrawBtcAddrMailCode)) {
                sweetAlert('', language["comm.error.new.tips.1"], 'error');
                $(".addAddress #withdrawBtcAddrMailCode").val("");
                assets.isReq = false;
                return;
            }
        }
        var url = "/user/save_withdraw_address.html?random=" + Math.round(Math.random() * 100);
        var param = {
            withdrawAddr: withdrawAddr,
            totpCode: withdrawBtcAddrTotpCode,
            phoneCode: withdrawBtcAddrPhoneCode,
            mailCode: withdrawBtcAddrMailCode,
            symbol: symbol,
            password: withdrawBtcPass,
            remark: withdrawRemark
        };
        $.post(url, param, function (result) {
            assets.isReq = false;
            if (result != null) {
                if (result.code == 200) {
                    sweetAlert('', language["comm.error.tips.1028"], 'success', 1000);
                    window.location.reload(true);
                    // pcenter.openAddressModal($("#symbolAddress").val())
                } else {
                    sweetAlert('', result.msg, 'error');
                }
            }
        }, "json");
    },
    updateAddressAlert: function (fid) {
        $("#modal-address").modal('hide');
        swal({
                title: language["apple.dom.msg46"],
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: language["apple.dom.msg46"]
            },
            function (inputValue) {
                if (inputValue === false) {
                    pcenter.openAddressModal($("#symbolAddress").val())
                    return false;
                }
                if (inputValue === "") {
                    swal.showInputError(language["apple.dom.msg47"]);
                    return false
                }
                pcenter.updateAddress(fid, inputValue)
            }
        );
    },
    updateAddress: function (fid, inputValue) {
        var symbol = $("#symbolAddress").val();
        var url = "/user/update_withdraw_address.html?random=" + Math.round(Math.random() * 100);
        var param = {
            fid: fid,
            symbol: symbol,
            remark: inputValue
        };
        jQuery.post(url, param, function (result) {
            if (result.code == 200) {
                swal(language["comm.error.tips.1028"]);
            } else {
                swal(language["comm.error.tips.1027"]);
            }
        }, "json");
        pcenter.openAddressModal($("#symbolAddress").val())
    },
    detelCoinAddress: function (fid) {
        swal({
                title: language["apple.dom.msg48"],
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#528bfc",
                confirmButtonText: language["apple.dom.msg49"],
                closeOnConfirm: false
            },
            function () {
                var url = "/user/del_withdraw_address.html?random=" + Math.round(Math.random() * 100);
                var symbol = $("#symbolAddress").val();
                var param = {
                    fid: fid,
                    symbol: symbol
                };
                jQuery.post(url, param, function (result) {
                    if (result.code == 200) {
                        // window.location.reload(true);
                        pcenter.openAddressModal($("#symbolAddress").val())
                        swal(language["apple.dom.msg44"]+"！", language["apple.dom.msg50"]+"。", "success");
                    }
                }, "json");
            });
    },
    saveCoinWithdraw: function () {
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
        if ($("#withdrawAddr").val() == null || $("#withdrawAddr").val() == "") {
            sweetAlert('', language["comm.error.tips.55"], 'error');
            $("#withdrawButton").removeClass("disabled");
            withdraw.isReq = false;
            return;
        }
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
        if (util.numFormat(canTotal - btcfee - fee * canTotal - withdrawAmount, 4) < 0) {
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
                    // pcenter.openAddressModal($("#symbolAddress").val())
                } else {
                    sweetAlert('', result.msg, 'error');
                }
            }
        }, "json");
    },
    openRechargeModal: function (symbol) {
        var param = {
            symbol: symbol,
        };
        $.ajax({
            url: "/financial/rechargeModal.html",
            dataType: 'json',
            data: param,
            type: 'get',
            beforeSend: function () {
                $('#loading').show();
            },
            success: function (res) {
                var data = res.data
                if (data) {
                    $(".coinRechargeName").text(data.coinRechargeName);
                    $('.rechargecoin').text(data.coinRechargeName);
                    if (null == data.fvirtualaddress) {
                        $("#payinaddress").text(language["apple.dom.msg51"]);
                        $("#keyPreImg").hide();
                    } else {
                        $("#keyPreImg").attr('src', data.fvirtualaddress.qrcode);
                        $("#payinaddress").text(data.fvirtualaddress.fadderess);
                        $("#keyPreImg").show();
                    }
                    var dom = [];
                    if (data.rechargeList) {
                        data = data.rechargeList;
                        dom.push('<table class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg52"]+'</th><th>'+language["apple.dom.msg53"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                        $.each(data, function (index, item) {
                            dom.push('<tr>');
                            dom.push('<td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.frechargeaddress + '</td><td>' + item.fconfirmations + '</td><td>' + item.fstatus_s + '</td></tr>');
                        })
                        dom.push('</tbody></table>');
                    }
                    $("#deposit2").html(dom.join(""));
                }
                $('#loading').hide();
                $("#modal-deposit").modal('show');
            }
        })
    },
    saveModifyPwd: function (pwdType, istrade) {
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
        var passwordLevel = util.passwordLevel(newPwd);
        if (passwordLevel < 2) {
        	 sweetAlert('', language['comm.error.tips.19'], 'error');
        	 return ;
        }
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

        if (newPwd == originPwd) {
            sweetAlert('', language["comm.error.tips.139"], 'error');
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
            } else {            
            	sweetAlert('', result.msg, 'error');
            }
        }, "json");

    },
    loadGoogleAuth: function () {
        var url = "/user/bind_google_device.html?random=" + Math.round(Math.random() * 100);
        var param = null;
        $.post(url, param, function (data) {
            if (data.code == 0) {
                if (navigator.userAgent.indexOf("MSIE") > 0) {
                    $('#bindgoogle-qrcode').html("").qrcode({
                        text: data.qecode,
                        width: "140",
                        height: "140",
                        render: "table"
                    });
                } else {
                    $('#bindgoogle-qrcode').html("").qrcode({
                        text: data.data.qecode,
                        width: "140",
                        height: "140"
                    });
                }
                $("#bindgoogle-key").val(data.data.totpKey);
                $("#bindgoogle-key-hide").val(data.data.totpKey);
            }
        }, "json");
    },
    saveBindGoogle: function () {
        var code = $("#bindgoogle-topcode").val();
        var totpKey = $("#bindgoogle-key-hide").val();
        var phoneCode = 0;
        var desc = '';
        if (!/^[0-9]{6}$/.test(code)) {
            desc = language["comm.error.tips.98"];
        }
        if (desc != "") {
            sweetAlert('', desc, 'error');
            return;
        }
        var url = "/user/google_auth.html?random=" + Math.round(Math.random() * 100);
        var param = {
            code: code,
            totpKey: totpKey
        };
        $.post(url, param, function (data) {
            if (data.code == 200) {
                sweetAlert('', data.msg);
                window.location.href = "/n/personalCenter.html";
            } else {
                sweetAlert('', data.msg, 'error');
                $("#bindgoogle-topcode").val("");
            }
        }, "json");
    },
    lookBindGoogle: function () {
        $('#descgoogle-qrcode').html('');
        var totpCode = 0;
        var desc = '';
        totpCode = $("#viewgoogle-topcode").val();
        if (!/^[0-9]{6}$/.test(totpCode)) {
            desc = language["comm.error.tips.98"];
        }
        if (desc != "") {
            sweetAlert('', desc, 'error');
            return;
        }
        var url = "/user/get_google_key.html?random=" + Math.round(Math.random() * 100);
        var param = {
            totpCode: totpCode
        };
        $.post(url, param, function (data) {
            if (data.code == -1) {
                sweetAlert('', data.msg, 'error');
                $("#viewgoogle-topcode").val("");
            } else if (data.code == 0) {
                if (data.code == 0) {
                    $("#viewgoogle").hide();
                    $("#descgoogle").show();
                    if (navigator.userAgent.indexOf("MSIE") > 0) {
                        $('#descgoogle-qrcode').qrcode({
                            text: data.data.qecode,
                            width: "140",
                            height: "140",
                            render: "table"
                        });
                    } else {
                        $('#descgoogle-qrcode').qrcode({
                            text: data.data.qecode,
                            width: "140",
                            height: "140"
                        });
                    }
                    $("#descgoogle-key").html(data.data.totpKey);
                }
            }
        }, "json");
    },
    getRecord: function (type, symbol, page) {
        var url = '/financial/list';
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
                if (list && list.data) {
                    data = list.data;
                    if (type == 1) {
                        dom.push('<table class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg59"]+'</th><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg60"]+'</th><th>'+language["apple.dom.msg53"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                    }
                    if (type == 2) {
                        dom.push('<table class="table table-bordered"><thead><tr><th>'+language["apple.dom.msg59"]+'</th><th>'+language["apple.dom.msg36"]+'</th><th>'+language["apple.dom.msg37"]+'</th><th>'+language["apple.dom.msg38"]+'</th><th>'+language["apple.dom.msg39"]+'</th><th>'+language["apple.dom.msg40"]+'</th></tr></thead><tbody>');
                    }
                    $.each(data, function (index, item) {
                        dom.push('<tr>');
                        if (type == 1)
                            dom.push('<td>' + item.fcoinname + '</td><td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.frechargeaddress + '</td><td>' + item.fconfirmations + '</td><td>' + item.fstatus_s + '</td></tr>');
                        if (type == 2)
                            dom.push('<td>' + item.fcoinname + '</td><td>' + item.fcreatetime + '</td><td>' + item.famount + '</td><td>' + item.fwithdrawaddress + item.addressremark + '</td><td>' + item.ffees + '</td><td>' + item.fstatus_s + '</td></tr>');
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
                common.getPageDom(page, list.totalPages, "recordPageUl", pcenter.getRecordByType);
            }
        })
    },
    getRecordByType: function (page) {
        // page = record.currentPage;
        pcenter.getRecord(record.currentType, $("#symbol").val(), page);
    },
    transferFail: function (){
        pcenter.showLoginWinwowNoCancel("", "https://rfinex.com/", language["apple.dom.msg113"],"error");
    },


    getTransferWindows :function (coinId) {
        $("#fcoinid").val(coinId);
        $("#fcoinid2").val(coinId);
        tab = layer.tab({
            area: ['600px', '300px'],
            tab: [{
                title: '充值ֵ',
                scrollbar: true,
                content: $(".tab1").html()
            }, {
                title: '提现',
                scrollbar: true,
                content: $(".tab2").html()
            }, {
                title: '资产划拨记录',
                scrollbar: true,
                content: ' '
            }],
            success: function(el) {
                $(el).find('.layui-layer-title span').eq(2).on('click', function() {
                        $.ajax({
                            url : '/n/getTransferRFINEXByUser.html?fcoinid='+coinId,
                            type : 'post',
                            success: function(data){
                                var dom = "";
                                $(".layui-layer-tabli").eq(2).html(dom)
                                var data = jQuery.parseJSON(data);
                                if(data.code == 200){
                                    for(var i = 0;i<data.data.length;i++){
                                        dom += '<div class="list-li">';
                                        dom+='<p>';
                                        dom+='<span class="timeSpan">申请时间:'+data.data[i].createDate+'</span>';
                                        dom+='<span class="fr redColor">状态:'+(data.data[i].status == 0 ? "划拨失败" : (data.data[i].status == 1 ? "正在划拨中" : "划拨成功"))+'</span>';
                                        dom+='</p>';
                                        dom+='<p>';
                                        dom+='<span>金额:'+data.data[i].amount+'</span>';
                                        dom+='<span class="fr">类型:'+(data.data[i].fType == 0 ? "充值" : "提现")+'</span>';
                                        dom+='</p>';
                                        dom+='</div>';
                                    }
                                    $(".layui-layer-tabli").eq(2).html(dom)
                                }else{
                                    layer.msg('暂无数据');
                                }
                            }
                        });

                })
            }

        });
    }


};
$(function(){
    pcenter.userWwallet();
    pcenter.init();


    /* 个人面板 资产页面 币种切换统一 */
    $('div.drop-box').find('li').each(function(){
        $(this).click(function(){
            var cny=$(this).text().indexOf("CNY");
            var usd=$(this).text().indexOf("USD");
            var btc=$(this).text().indexOf("BTC");
            if(cny!=-1&&usd==-1&&btc==-1){
                $('.drop').find('em').text('CNY');
                $('.netasset-text').children('.num').html('<b>'+common.retainDemical(pcenter.allfinance.cny,4)+'</b><span> CNY</span>');
                $('.info').children('.num').children('em').text(common.retainDemical(pcenter.allfinance.cny,4)+" CNY");

                $(".allworth").each(function(index,item){
                        $(this).attr("title","￥"+common.retainDemical(common.discountworth.cny[index].allworth,4))
                })
                $(".frozenworth").each(function(index,item){
                    $(this).attr("title","￥"+common.retainDemical(common.discountworth.cny[index].frozenworth,4))
                })
                $(".totalworth").each(function(index,item){
                    $(this).attr("title","￥"+common.retainDemical(common.discountworth.cny[index].totalworth,4))
                })

            }else if(cny==-1&&usd!=-1&&btc==-1){
                $('.drop').find('em').text('USD');
                $('.netasset-text').children('.num').html('<b>'+common.retainDemical(pcenter.allfinance.usd,4)+'</b><span> USD</span>');
                $('.info').children('.num').children('em').text(common.retainDemical(pcenter.allfinance.usd,4)+" USD");

                $(".allworth").each(function(index,item){
                    $(this).attr("title","$"+common.retainDemical(common.discountworth.usd[index].allworth,4))
                })
                $(".frozenworth").each(function(index,item){
                    $(this).attr("title","$"+common.retainDemical(common.discountworth.usd[index].frozenworth,4))
                })
                $(".totalworth").each(function(index,item){
                    $(this).attr("title","$"+common.retainDemical(common.discountworth.usd[index].totalworth,4))
                })

            }else{
                $('.drop').find('em').text('BTC');
                $('.netasset-text').children('.num').html('<b>'+common.retainDemical(pcenter.allfinance.btc,9)+'</b><span> BTC</span>');
                $('.info').children('.num').children('em').text(common.retainDemical(pcenter.allfinance.btc,9)+" BTC");

                $(".allworth").each(function(index,item){
                    $(this).attr("title",common.retainDemical(common.discountworth.btc[index].allworth,9))
                })
                $(".frozenworth").each(function(index,item){
                    $(this).attr("title",common.retainDemical(common.discountworth.btc[index].frozenworth,9))
                })
                $(".totalworth").each(function(index,item){
                    $(this).attr("title",common.retainDemical(common.discountworth.btc[index].totalworth,9))
                })
            }
            $('.drop-box').hide(100);
        })
    })

    /*资产页币种切换*/
    var personal_changeCur_timer=null;
    $("#personal_changeCur").hover(function(){
        $("#personal_choiceCur").finish();
        $("#personal_choiceCur").slideDown()
    },function(){
        $("#personal_choiceCur").finish();
        $("#personal_choiceCur").hide()
    })


    $(".f-usd").click(function(){
        $('.showCur').text("USD");
        $(".f-usd").addClass('active')
        $(".f-cny").removeClass('active')
        $(".f-btc").removeClass('active')
    })
    $(".f-cny").click(function(){
        $('.showCur').text("CNY");
        $(".f-usd").removeClass('active')
        $(".f-cny").addClass('active')
        $(".f-btc").removeClass('active')
    })
    $(".f-btc").click(function(){
        $('.showCur').text("BTC");
        $(".f-usd").removeClass('active')
        $(".f-cny").removeClass('active')
        $(".f-btc").addClass('active')
    })




    $("#withdrawButton").on("click", function() {
        window.setTimeout(function(){pcenter.saveCoinWithdraw();},Math.floor(Math.random()*300));
    });
    //绑定获取短信验证码按钮事件(修改密码)
    $("#phoneMsgCodeA").on("click", function() {
        msg.sendMsgCode($(this).attr('msgtype'));
    });
    //绑定获取短信验证码按钮事件(修改资金密码)
    $("#phoneMsgCodeB").on("click", function() {
        msg.sendMsgCode($(this).attr('msgtype'));
    });
    //绑定修改登录密码按钮事件
    $("#editloginpass-submit").on('click', function() {
        pcenter.saveModifyPwd(0, true);
    });
    //绑定修改资金密码按钮事件
    $("#edittradepass-submit").on('click', function() {
        pcenter.saveModifyPwd(1, true);
    });
    //设置资金密码
    $("#bindtradepass-submit").on("click", function() {
        pcenter.saveModifyPwd(1, false);
    });
    //绑定获取短信验证码按钮事件(修改密码规则)
    $("#tradeModifyCode-sendmessage").on("click", function() {
        msg.sendMsgCode($(this).attr('msgtype'));
    });
    //绑定获取邮箱验证码按钮事件(修改密码规则)
    $("#tradeModifyCode-sendEmailMessage").on("click", function() {
        var address = $("#femail").val();
        if (address == "") {
            sweetAlert("", language["comm.error.tips.7"],'error');
            return;
        }
        msg.sendcodemy($(this).attr("msgtype"), address,null);
    });
    //注册修改资金密码规则事件
    $('input:radio[name="paypasswdintervalradio"]').change( function(){
        var old=$("#oldpaypasswdinterval").val();
        var now= $(this).val();
        if(old==0 && now!=0){
            $(".modify_code_need_code").show();
        }else if(old == 2 && now==-1){
            $(".modify_code_need_code").show();
        }else if(old == -1 && now!=-1){
            $(".modify_code_need_code").hide();
        }else{
            $(".modify_code_need_code").hide();
        }
    });
    //修改资金密码按钮点击事件
    $("#tradeModifyCode-submit").on("click", function() {
        pcenter.saveTradeModifyCode();
    });
    //初始化google验证码相关信息
    pcenter.loadGoogleAuth();
    //注册绑定谷歌验证码按钮事件
    $("#bindgoogle-submit").on("click", function() {
        pcenter.saveBindGoogle();
    });
    //注册查看google验证码按钮事件
    $("#viewgoogle-submit").on("click", function() {
        pcenter.lookBindGoogle();
    });
    //关闭模态框事件
    $('#google-setting2').on('hide.bs.modal', function () {
        $("#descgoogle").hide();
        $("#viewgoogle").show();
        $("#viewgoogle-topcode").val('');
    })
    $('#modal-bills').on('hide.bs.modal', function () {
        $("#homerp2").html("");
        $("#updatesrp2").html("");
        $("#recordPageUl").html("");
        $("#notActive").removeClass("active");
        $("#defaultActive").addClass("active");
        $("#symbol").val(0)
        record.currentType = 1;
        record.currentPage = 1;
    })
    //隐藏0余额
    $("#hide-zero").bootstrapSwitch({
        onColor:'success',
        offColor:'default',
        size:'mini'
    });
    $('#hide-zero').on('switchChange.bootstrapSwitch', function(event, state) {
        /*先获取全部显示的初始高度*/
        var h=$("#personfinance-inner").height();
        $(".zeroTr").finish();
        if(state){
            $(".zeroTr").hide(200);
            $("#personfinance-wrapper").animate({
                height:h-$(".zeroTr").length*69-6+"px"
            },200,'linear')
        }else{
            $("#personfinance-wrapper").animate({
                height:h+$(".zeroTr").length*69+"px"
            },200,'linear',function(){
                $(".zeroTr").show(400);
            })
            window.location.reload();
        }
    });

    $("#sendSMS").on("click", function() {
        if($(this).hasClass("disabled")){
            $(this).removeClass("color_blue");
            $(this).addClass("color_gray");
            return false;
        }
        $(this).addClass("color_blue");
        var phone = $("#ftelephone").val();
        msg.sendMsgCode(5, $("#fareacode").val(), phone);
    });
    $("#sendSMSaddress").on("click", function() {
        var phone = $("#ftelephone").val();
        msg.sendMsgCode(1, $("#fareacode").val(), phone,$("#editphone-imgcode").val());
    });
    $("#sendMail").on("click", function() {
        var address = $("#emailAddress").val();
        if (address == "") {
            sweetAlert('',language["comm.tips.message.8"],'error');
            return;
        }
        email.sendcodemy(5, "errorTip", this.id, address);
    });
    $("#sendMailaddress").on("click", function() {
        var address = $("#emailAdd").val();
        if (address == "") {
            sweetAlert('',language["comm.tips.message.8"],'error');
            return;
        }
        email.sendcodemy(5, "errorTip", this.id, address);
    });
    //新增地址
    $("#addressAddButton").on("click", function() {
        window.setTimeout(function(){pcenter.addCoinAddress();},Math.floor(Math.random()*300));
    });

        //监听提交
        layui.use('form', function() {
            var form = layui.form;
            // 充值立即提交
            form.on('submit(formDemo1)', function(data) {
                $.ajax({
                    url : '/n/transferByRFINEX.html',
                    type : 'post',
                    dataType : 'json',
                    contentType : 'application/json',
                    data :JSON.stringify(data.field),
                    success: function(data){
                        if(data.data.code != 1000){
                            layer.close(tab)
                            pcenter.showLoginWinwowNoCancel(data.data.msg, "https://rfinex.com/", language["apple.dom.msg112"],"error");
                        }else{
                            layer.close(tab);
                            layer.msg('请求成功');
                        }
                    }
                });

                return false;
            });
            // 提现立即提交
            form.on('submit(formDemo2)', function(data) {
                $.ajax({
                    url : '/n/transferByRFINEX.html',
                    type : 'post',
                    dataType : 'json',
                    contentType : 'application/json',
                    data :JSON.stringify(data.field),
                    success: function(data){
                        if(data.data.code != 1000){
                            layer.close(tab)
                            pcenter.showLoginWinwowNoCancel(data.data.msg, "https://rfinex.com/", language["apple.dom.msg112"],"error");
                        }else{
                            layer.close(tab);
                            layer.msg('请求成功');
                        }
                    }
                });
                return false;
            });
            //效验输入的金额的
            form.verify({
                price: function(value, item) {
                    var re=/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,8})?$/;
                    if( re.exec(value) == null){
                        return '请输入正确的价格'
                    }
                }
            });

        });
    })





