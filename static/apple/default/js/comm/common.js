/**
 * Created by my on 2017/11/22.
 */
var common={
    nowCur:1,
    allfinance:{
        btcToUsdtRate:1,
        usdtToCnyRate:1,
        cny:0,
        usd:0,
        btc:0
    },
    buysell_obj:{
        canbuy:0,
        cansell:0
    },
    discountworth:{
        cny:[],
        usd:[],
        btc:[]
    },
    prev_showCur:'CNY',
    /*当前币种对 cny usd btc 的汇率*/
    iscoinRate:[],
    /*保存几位小数*/
    retainDemical:function(val,few){
        var str= val.toString();
        var index=str.indexOf('.');
        if(index!=-1){
            var newstr=str.slice(0,index+few);
            return newstr
        }else{
            return val
        }
    },
    /*判断买卖框成交额数据是否为NaN*/
    volumeIsNaN:function(price,amount){
        if(price*amount!=price*amount){
            return true
        }
        return false
    },
    sliceDemical:function(val){
        var str= val.toString();
        var index=str.indexOf('.');
        if(index!=-1){
            var newstr=str.slice(index+1);
            return newstr
        }else{
            return val
        }
    },
    sliceDemical2:function(val){
        var str= val.toString();
        var index=str.indexOf('.');
        if(index!=-1){
            var newstr=str.slice(index+1);
            return '.'+newstr
        }else{
            return ""
        }
    },
    addReducePrice:function(obj,isadd){
        var a=Number(obj.val());
        if(isadd){
            a+=0.00000001;
            obj.val(_util.numFormat(a,8));
        }else{
            if(a<=0){
                a=0;
            }else{
                a-=0.00000001;
            }
            obj.val(_util.numFormat(a,8));
        }
    },
    /*判断输入是否有误*/
    judgeform:function(obj){
        obj.on("keyup",function(e){
            var con=e.keyCode;
            var str=$(this).val();
            var arr_point=[];
            var end_point=false;
            var hasother=false;
            for(var i=0; i<str.length; i++){
                if(str[i]=="."){
                    arr_point.push(i);
                }else if(str[i]=="。"){
                    end_point=true;
                }else if(isNaN(str[i])){
                    hasother=true;
                }
            }
            if(hasother||arr_point.length>1||end_point){
                str="";
            }else if(str[0]=="."){
                str="";
            }else if(str[0]==0&&str[1]!="."&&str[1]!=null){
                str="";
            }
            $(this).val(str);
        })
    },
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
    pattern:function(fmt) {
        var o = {
            "M+" : this.getMonth()+1, //月份
            "d+" : this.getDate(), //日
            "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
            "H+" : this.getHours(), //小时
            "m+" : this.getMinutes(), //分
            "s+" : this.getSeconds(), //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S" : this.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    },
    personalMarket:function(){
        $.ajax({
            type:'get',
            url:"/n/getUserVirtualWalletInfo.html?"+Math.round(Math.random() * 100),
            dataType:"json",
            success:function(data){
                if(data.success){
                    var dom=[];
                    common.allfinance= {
                        btcToUsdtRate: data.data.btcToUsdtRate,
                        usdtToCnyRate: data.data.usdtToCnyRate,
                        cny: data.data.totalCNY,
                        usd: data.data.totalUSDT,
                        btc: data.data.totalBTC
                    }
                    $('.scroll-content').empty();
                    $('#finance-nums').html('<em>'+common.retainDemical(data.data.totalCNY,4)+' CNY</em>');
                    $.each(data.data.wallets,function(index,item){
                        var total = item.ftotal + item.ffrozen + item.flock;
                        if(total==0){
                            dom.push('<ul class="body clearfix zeroUl">');
                        }else{
                            dom.push('<ul class="body clearfix">');
                        }

                        dom.push('<li>');
                        dom.push('<img src="'+item.coinImgUrl+'" class="market-icon">'+item.fshortname);

                        dom.push('</li>');
                        dom.push('<li>');
                        dom.push('<b>');
                        dom.push(_util.numFormat(item.ftotal,8));
                        dom.push('</b>');
                        dom.push('</li>');
                        dom.push('<li>');
                        dom.push(_util.numFormat(item.ffrozen,8));
                        dom.push('</li>');
                        dom.push('</ul>');
                        common.iscoinRate.push({
                            cny:item.cnyRate,
                            usd:item.ustdRate,
                            btc:item.btcRate,
                            fshortname:item.fshortname
                        })
                    })
                    $('.scroll-content').html(dom.join(""))
                }
            }
        })
    },
    tradeDistrict:function(){
        $.ajax({
            url:"/n/getAllExchangeType.html",
            type:"post",
            dataType:"json",
            success:function(data){
                var kdom = common.getTradeAreaDom(data,true);
                $("#Kmarket-list").html(kdom.join(''));
                var dom = common.getTradeAreaDom(data,false);
                $("#group-list").html(dom.join(''));
                /*模拟交易*/
                var vdom = common.getTradeAreaDom1(data);
                $("#virtual-list").html(vdom.join(''));
                var Ldom = common.switchLanguage();
                $("#Language-list").html(Ldom.join(''));
            }
        })
    },
    tradeOptionDistrict:function(){
        $.ajax({
            url:"/n/getAllOptionExchangeType.html",
            type:"post",
            dataType:"json",
            success:function(data){
                /*期权交易*/
                    var vdom = common.getOptionTradeAreaDom(data);
                    $("#option-list").html(vdom.join(''));
            }
        })
    },
    tradeVirtualOptionDistrict:function(){
        $.ajax({
            url:"/n/getAllVirtualOptionExchangeType.html",
            type:"post",
            dataType:"json",
            success:function(data){
                if(null == data.data) {
                    $("#virtual_option").hide();
                }else{
                    $("#virtual_option").show();
                /*模拟期权交易*/
                var vodom = common.getOptionVirtualTradeAreaDom(data);
                $("#option-virtual-list").html(vodom.join(''));
                }
            }
        })
    },


    getTradeAreaDom:function(data,isKtrade){
        var dom=[];
        for(var i=0;i<data.data.length;i++){
            var d = data.data[i];
            dom.push('<div class="group-item">');
            dom.push('<p role="button" class="">');
            dom.push('<img src="'+d.coinImgUrl+'" class="market-icon">');
            dom.push(d.name+language["apple.dom.msg1"]);
            dom.push('</p>');
            dom.push('<div class="group-box">')
            for(var j=0;j<d.exchangeTypes.length;j++){
                var dd = d.exchangeTypes[j];
                if(isKtrade){
                    dom.push('<a href="/n/ktrade.html?symbol='+dd.fcode+'" target="_blank">');
                }else{
                    dom.push('<a href="/n/trade.html?symbol='+dd.fcode+'">');
                }
                dom.push('<img src="'+dd.leftCoinImgUrl+'" class="market-icon">');
                dom.push(dd.fshortname);
                dom.push('</a>');
            }
            dom.push('</div></div>');
        }
        return dom;
    },
    getTradeAreaDom1:function(data){
        var dom=[];
        for(var i=0;i<data.data.length;i++){
            var d = data.data[i];
            dom.push('<div class="group-item">');
            dom.push('<p role="button" class="">');
            dom.push('<img src="'+d.coinImgUrl+'" class="market-icon">');
            dom.push(d.name+language["apple.dom.msg1"]);
            dom.push('</p>');
            dom.push('<div class="group-box">')
            for(var j=0;j<d.exchangeTypes.length;j++){
                var dd = d.exchangeTypes[j];
                dom.push('<a href="/n/virtual.html?symbol='+dd.fcode+'">');
                dom.push('<img src="'+dd.leftCoinImgUrl+'" class="market-icon">');
                dom.push(dd.fshortname);
                dom.push('</a>');
            }
            dom.push('</div></div>');
        }
        return dom;
    },
    getOptionTradeAreaDom:function(data){
        var dom=[];
        for(var i=0;i<data.data.length;i++){
            var d = data.data[i];
            dom.push('<div class="group-item">');
            dom.push('<p role="button" class="">');
            dom.push(d.name+language["apple.dom.msg103"]);
            dom.push('</p>');
            dom.push('<div class="group-box">')
            for(var j=0;j<d.exchangeTypes.length;j++){
                var dd = d.exchangeTypes[j];
                dom.push('<a style="padding: 15px 25px 15px 10px;" href="/n/ktrade.html?symbol='+dd.fcode+'">');
                dom.push(dd.fshortname);
                dom.push('</a>');
            }
            dom.push('</div></div>');
        }
        return dom;
    },
    getOptionVirtualTradeAreaDom:function(data){
        var dom=[];
        for(var i=0;i<data.data.length;i++){
            var d = data.data[i];
            dom.push('<div class="group-item">');
            dom.push('<p role="button" class="">');
            dom.push(d.name+language["apple.dom.msg103"]);
            dom.push('</p>');
            dom.push('<div class="group-box">')
            for(var j=0;j<d.exchangeTypes.length;j++){
                var dd = d.exchangeTypes[j];
                dom.push('<a style="padding: 15px 25px 15px 10px;" href="/n/optionVirtualKtrade.html?symbol='+dd.fcode+'">');
                dom.push(dd.fshortname);
                dom.push('</a>');
            }
            dom.push('</div></div>');
        }
        return dom;
    },
    switchLanguage:function(){
        var zh_CN = 'zh_CN';
        var en_US = 'en_US';
        var zh_TW = 'zh_TW';
        var dom=[];
        dom.push('<div class="group-item">');
        dom.push('<p role="button" class="" onclick="common.switchLanguage_zh_CN()">');
        dom.push('<img src="/static/apple/default/img/language/cn.png" class="market-icon">');
        dom.push('中文(简体)');
        dom.push('</p>');
        dom.push('</div>');
        dom.push('<div class="group-item">');
        dom.push('<p role="button" class="" onclick="common.switchLanguage_en_US()">');
        dom.push('<img src="/static/apple/default/img/language/en.png" class="market-icon">');
        dom.push('English');
        dom.push('</p>');
        dom.push('</div>');
        dom.push('<div class="group-item">');
        dom.push('<p role="button" class="" onclick="common.switchLanguage_zh_TW()">');
        dom.push('<img src="/static/apple/default/img/language/cn.png" class="market-icon">');
        dom.push('中文(繁體)');
        dom.push('</p>');
        dom.push('</div>');
        return dom;
    },
    switchLanguage_zh_CN:function(){
        //$("#language").attr('src',"${staticurl}/../js/language/language_zh_CN.js");
        $.ajax({
            url:"/n/index.html?swicthLanguage=zh_CN",
            type:"get",
            success:function(){
            }
        })
        location.reload();
    },
    switchLanguage_en_US:function(){
        // $("#language").attr('src',"${staticurl}/../js/language/language_en_US.js");
        $.ajax({
            url:"/n/index.html?swicthLanguage=en_US",
            type:"get",
            success:function(){
            }
        })
        location.reload();
    },
    switchLanguage_zh_TW:function(){
        // $("#language").attr('src',"${staticurl}/../js/language/language_en_US.js");
        $.ajax({
            url:"/n/index.html?swicthLanguage=zh_TW",
            type:"get",
            success:function(){
            }
        })
        location.reload();
    },
    //获取分页dom
    getPageDom:function(currentPage,total,id,cb){
        var dom = [];
        currentPage = parseInt(currentPage);
        dom.push('<li data-index='+(currentPage-1)+'><a href="javascript:void(0);">上一页</a></li>');
        if (currentPage == 1) {
            dom.push('<li class="active" data-index=1><a>1</a></li>');
        }else{
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
            dom.push('<li data-index='+i+'><a>'+i+'</a></li>');
        }
        if (currentPage != 1 && currentPage != 2) {
            dom.push('<li class="active" data-index='+currentPage+'><a>'+currentPage+'</a></li>');
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
            dom.push('<li data-index='+i+'><a>'+i+'</a></li>');
        }
        if (total - currentPage > 6) {
            dom.push('<li><a>...</a></li>');
        }
        if (total >= 11 && total - currentPage > 4) {
            dom.push('<li data-index='+total+'><a>'+total+'</a></li>');
        }
        dom.push('<li data-index='+(currentPage+1)+'><a href="javascript:void(0);">下一页</a></li>');
        $("#"+id).off("click","li");
        $("#"+id).on("click","li",function(){
            var page = $(this).attr("data-index");
            if(!page){
                return;
            }
            if(page == currentPage)return;
            if(page <= 0){
                page = 1;
            }
            if(page > total){
                page = total;
            }
            cb.call(null,page);
        });
        $("#"+id).html(dom.join(''));
    }

}
