var header = {
    /*切换语言*/
    changeLanguage: function (url) {
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    window.location.href = window.location.href;
                }
            }
        })
    },
    getParam: function (key) {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        console.log(arr)
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                if (name == key) {
                    return value;
                }
            }
        }
        return null;
    },
    isShowLoginInfo: function () {
        if ($("#userId").val() != "") {
            $('.topmenu-login').hide();
            $('.topmenu-info').show();
        } else {
            $('.topmenu-login').show();
            $('.topmenu-info').hide();
        }
    },
    changeFinanceVal: function (cur, discountcur, obj) {
        $('#finance-nums').html('<em>' + _util.numFormat(common.allfinance[discountcur], 8) + '' + cur + '</em>');
        $('.showCur').text(cur);
        $("#discountmenu").hide();
        obj.addClass('active').siblings().removeClass('active')
    },
    //根据参数设置网站显示模式
    sdkMode: function () {
        var thirdAppNew = this.getParam('sdkMode');
        var newSdk = this.getParam('newSdk');
        var thirdAppOld = $.getCookie('sdkMode');

        //原本为空的情况下可以直接设置
        if (thirdAppNew != null && (thirdAppOld == null || thirdAppOld == "null")) {
            $.cookie("sdkMode", thirdAppNew);
        } else if (newSdk == "new" && thirdAppNew != null) {
            //原本不为空的情况下需要指定参数才能强制修改
            $.cookie("sdkMode", thirdAppNew);
        }
    },
    //隐藏其他入口只留期权
    hideOther: function () {
        //判断是否为UNICOIN本站还是SDK模式
        var thirdApp = $.getCookie('sdkMode');

        if (thirdApp == "null" || thirdApp == null || thirdApp == "UNICOIN") {
            //所有都显示
            // alert("显示！" + thirdApp)
            // $(".section-main2").show(100);
            //首页行情
            $(".market-box").show(100);
            //模拟期权模块
            $("#virtual_option").show(100);
            //模拟交易
            $("#Virtual_market").show(100);
            //专业交易
            $("#special_market").show(100);
            //K线交易
            $("#kmarket_special_market").show(100);

            //隐藏部分按钮
            //返回UNICOIN
            $("#return-unicoin").hide(100);



        } else {
            //所有都隐藏
            // alert("隐藏！" + thirdApp)
            // $(".section-main2").hide(100);
            //首页行情
            $(".market-box").hide(100);
            //模拟期权模块
            $("#virtual_option").hide(100);
            //模拟交易
            $("#Virtual_market").hide(100);
            //专业交易
            $("#special_market").hide(100);
            //K线交易
            $("#kmarket_special_market").hide(100);


            //显示部分按钮
            //返回UNICOIN
            $("#return-unicoin").show(100);
        }

    }
}

$(function () {

    //初始化header栏
    header.sdkMode();
    header.hideOther();
    /*页面加载执行，获取用户资产信息*/
    common.personalMarket();
    //初始化头部交易区信息
    common.tradeDistrict();
    //初始化头部期权交易区信息
    common.tradeOptionDistrict();
    common.tradeVirtualOptionDistrict();

    /*判断是否登录 显示登录注册还是用户名*/
    header.isShowLoginInfo();

    var name = "未登录访客";
    if ($('#floginname').val() != "") {
        name = $('#floginname').val();
    }

    //加载Udesk客服系统
    (function (a, h, c, b, f, g) {
        a["UdeskApiObject"] = f;
        a[f] = a[f] || function () {
            (a[f].d = a[f].d || []).push(arguments)
        };
        g = h.createElement(c);
        g.async = 1;
        g.charset = "utf-8";
        g.src = b;
        c = h.getElementsByTagName(c)[0];
        c.parentNode.insertBefore(g, c)
    })(window, document, "script", "http://assets-cli.udesk.cn/im_client/js/udeskApi.js", "ud");
    ud({
        "code": "2j72e06a",
        "link": "http://unicoin365.udesk.cn/im_client/?web_plugin_id=60203&product_image=http://www.unicoin365.com/static/apple/default/img/devlogo.png&product_url=http://www.unicoin365.com&product_title=" + name
    });

    /*注册切换语言*/
    $(".langlist_a").click(function () {
        var url = $(this).data().href;
        header.changeLanguage(url);// 暂时没做该功能
    })


    /*资产价值切换*/
    $(".f-usd").click(function () {
        header.changeFinanceVal('USD', 'usd', $(this))
    })
    $(".f-cny").click(function () {
        header.changeFinanceVal('CNY', 'cny', $(this))
    })
    $(".f-btc").click(function () {
        header.changeFinanceVal('BTC', 'btc', $(this))
    })

    /*头部币种切换*/
    var timer = null
    $("#headdrop").hover(function () {
        clearTimeout(timer);
        $("#discountmenu").show();
    }, function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $("#discountmenu").hide();
        }, 300)
    })
    $("#discountmenu").hover(function () {
        clearTimeout(timer);
        $(this).show()
    }, function () {
        clearTimeout(timer);
        $(this).hide()
    });


    /*个人面板隐藏0余额*/
    $(".hide-z").on('click', function () {
        $(".zeroUl").finish()
        if ($(".hide-z").attr('showzero') == 'true') {
            $(".zeroUl").slideDown(300);
            $(".hide-z").attr('showzero', false)
            $(".hide-z-text").text(language["apple.dom.msg76"])
        } else {
            $(".zeroUl").slideUp(300);
            $(".hide-z").attr('showzero', true);
            $(".hide-z-text").text(language["apple.dom.msg77"])
        }
    });


    /*头部导航栏 下拉菜单 */

    /*资产中心*/
    var assetstop_timer = null;
    $("#assetstop").hover(function () {
        $("#assetslist").finish()
        clearTimeout(assetstop_timer)
        $("#assetslist").slideDown(200)
    }, function () {
        $("#assetslist").finish()
        clearTimeout(assetstop_timer)
        assetstop_timer = setTimeout(function () {
            $("#assetslist").slideUp(90)
        }, 50)
    })
    $("#assetslist").hover(function () {
        $("#assetslist").finish()
        clearTimeout(assetstop_timer)
        $("#assetslist").slideDown(200)
    }, function () {
        $("#assetslist").finish()
        clearTimeout(assetstop_timer)
        assetstop_timer = setTimeout(function () {
            $("#assetslist").slideUp(90)
        }, 50)
    })

    /*个人中心*/
    var personaltop_timer = null;
    $("#personaltop").hover(function () {
        $("#personallist").finish()
        clearTimeout(personaltop_timer)
        $("#personallist").slideDown(200)
    }, function () {
        $("#personallist").finish()
        clearTimeout(personaltop_timer)
        personaltop_timer = setTimeout(function () {
            $("#personallist").slideUp(90)
        }, 50)
    })
    $("#personallist").hover(function () {
        $("#personallist").finish()
        clearTimeout(personaltop_timer)
        $("#personallist").slideDown(200)
    }, function () {
        $("#personallist").finish()
        clearTimeout(personaltop_timer)
        personaltop_timer = setTimeout(function () {
            $("#personallist").slideUp(90)
        }, 50)
    })


    /*个人面板*/
    var userName_timer = null;
    $("#market-userName").hover(function () {
        $("#personMarket").finish()
        clearTimeout(userName_timer)
        $("#personMarket").slideDown(200)
    }, function () {
        $("#personMarket").finish()
        clearTimeout(userName_timer)
        userName_timer = setTimeout(function () {
            $("#personMarket").slideUp(90)
        }, 50)
    })
    $("#personMarket").hover(function () {
        $("#personMarket").finish()
        clearTimeout(userName_timer)
        $("#personMarket").slideDown(200)
    }, function () {
        $("#personMarket").finish()
        clearTimeout(userName_timer)
        userName_timer = setTimeout(function () {
            $("#personMarket").slideUp(90)
        }, 50)
    })

    /*专业交易*/
    var special_trade_timer = null;
    $("#special_trade").hover(function () {
        $("#group-list").finish()
        clearTimeout(special_trade_timer)
        $("#group-list").slideDown(200)
    }, function () {
        $("#group-list").finish()
        clearTimeout(special_trade_timer)
        special_trade_timer = setTimeout(function () {
            $("#group-list").slideUp(90)
        }, 50)
    })
    $("#group-list").hover(function () {
        $("#group-list").finish()
        clearTimeout(special_trade_timer)
        $("#group-list").slideDown(200)
    }, function () {
        $("#group-list").finish()
        clearTimeout(special_trade_timer)
        special_trade_timer = setTimeout(function () {
            $("#group-list").slideUp(90)
        }, 50)
    })

    /*K先交易*/
    var kmarket_trade_timer = null;
    $("#kmarket_trade").hover(function () {
        $("#Kmarket-list").finish()
        clearTimeout(kmarket_trade_timer)
        $("#Kmarket-list").slideDown(200)
    }, function () {
        $("#Kmarket-list").finish()
        clearTimeout(kmarket_trade_timer)
        kmarket_trade_timer = setTimeout(function () {
            $("#Kmarket-list").slideUp(90)
        }, 50)
    })
    $("#Kmarket-list").hover(function () {
        $("#Kmarket-list").finish()
        clearTimeout(kmarket_trade_timer)
        $("#Kmarket-list").slideDown(200)
    }, function () {
        $("#Kmarket-list").finish()
        clearTimeout(kmarket_trade_timer)
        kmarket_trade_timer = setTimeout(function () {
            $("#Kmarket-list").slideUp(90)
        }, 50)
    })

    /*模拟交易*/
    var virtual_trade_timer = null;
    $("#Virtual_trade1").hover(function () {
        $("#virtual-list").finish()
        clearTimeout(virtual_trade_timer)
        $("#virtual-list").slideDown(200)
    }, function () {
        $("#virtual-list").finish()
        clearTimeout(virtual_trade_timer)
        virtual_trade_timer = setTimeout(function () {
            $("#virtual-list").slideUp(90)
        }, 50)
    })
    $("#virtual-list").hover(function () {
        $("#virtual-list").finish()
        clearTimeout(virtual_trade_timer)
        $("#virtual-list").slideDown(200)
    }, function () {
        $("#virtual-list").finish()
        clearTimeout(virtual_trade_timer)
        virtual_trade_timer = setTimeout(function () {
            $("#virtual-list").slideUp(90)
        }, 50)
    })


    /*期权交易*/
    var option_trade_timer = null;
    $("#option_trade1").hover(function () {
        $("#option-list").finish()
        clearTimeout(option_trade_timer)
        $("#option-list").slideDown(200)
    }, function () {
        $("#option-list").finish()
        clearTimeout(option_trade_timer)
        option_trade_timer = setTimeout(function () {
            $("#option-list").slideUp(90)
        }, 50)
    })
    $("#option-list").hover(function () {
        $("#option-list").finish()
        clearTimeout(option_trade_timer)
        $("#option-list").slideDown(200)
    }, function () {
        $("#option-list").finish()
        clearTimeout(option_trade_timer)
        option_trade_timer = setTimeout(function () {
            $("#option-list").slideUp(90)
        }, 50)
    })

    /*模拟期权交易*/
    var option_virtual_trade_timer = null;
    $("#option_virtual_trade1").hover(function () {
        $("#option-virtual-list").finish()
        clearTimeout(option_virtual_trade_timer)
        $("#option-virtual-list").slideDown(200)
    }, function () {
        $("#option-virtual-list").finish()
        clearTimeout(option_virtual_trade_timer)
        option_virtual_trade_timer = setTimeout(function () {
            $("#option-virtual-list").slideUp(90)
        }, 50)
    })
    $("#option-virtual-list").hover(function () {
        $("#option-virtual-list").finish()
        clearTimeout(option_virtual_trade_timer)
        $("#option-virtual-list").slideDown(200)
    }, function () {
        $("#option-virtual-list").finish()
        clearTimeout(option_virtual_trade_timer)
        option_virtual_trade_timer = setTimeout(function () {
            $("#option-virtual-list").slideUp(90)
        }, 50)
    })

    /*语言切换*/
    var switch_language_timer = null;
    $("#switch_language").hover(function () {
        $("#Language-list").finish()
        clearTimeout(switch_language_timer)
        $("#Language-list").slideDown(200)
    }, function () {
        $("#Language-list").finish()
        clearTimeout(switch_language_timer)
        switch_language_timer = setTimeout(function () {
            $("#Language-list").slideUp(90)
        }, 50)
    })
    $("#Language-list").hover(function () {
        $("#Language-list").finish()
        clearTimeout(switch_language_timer)
        $("#Language-list").slideDown(200)
    }, function () {
        $("#Language-list").finish()
        clearTimeout(switch_language_timer)
        switch_language_timer = setTimeout(function () {
            $("#Language-list").slideUp(90)
        }, 50)
    })

    /*帮助中心*/
    var help_menu_timer = null;
    $("#help_menu").hover(function () {
        $("#help-list").finish()
        clearTimeout(help_menu_timer)
        $("#help-list").slideDown(200)
    }, function () {
        $("#help-list").finish()
        clearTimeout(help_menu_timer)
        help_menu_timer = setTimeout(function () {
            $("#help-list").slideUp(90)
        }, 50)
    })
    $("#help-list").hover(function () {
        $("#help-list").finish()
        clearTimeout(help_menu_timer)
        $("#help-list").slideDown(200)
    }, function () {
        $("#help-list").finish()
        clearTimeout(help_menu_timer)
        help_menu_timer = setTimeout(function () {
            $("#help-list").slideUp(90)
        }, 50)
    })

    /*语言切换*/
    var apple_timer = null;
    $("#apple-logo").hover(function () {
        $("#change_language").finish()
        $("#change_language").slideDown(300)
    }, function () {
        $("#change_language").finish()
        $("#change_language").slideUp(300)
    })


})