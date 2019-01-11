
var index={
    currentTab:null,
    line_market_id : null ,
    line_market_value:[]  ,
    idprefex:"line-market",
    colors:['#AEEEEE','#B0E0E6','#BCEE68','#D2691E','#DAA520','#DB7093','#EEDC82','#CFCFCF','#8B3A62','#FFDAB9'],
    klineColor:[],
    /**
     * 初始化echart
     */
    init_echarts : function () {
        for(var j=0;j<index.line_market_value.length;j++){
            var ids = index.line_market_value[j].id;
            var datas = index.line_market_value[j].value;
            var echarts_ = echarts.init(document.getElementById(ids));
            var linecolor = "";
            for(var k=0;k<index.klineColor.length;k++){
                if(index.klineColor[k].id == ids){
                    linecolor = index.klineColor[k].value;
                    break;
                }
            }
            if(linecolor == ""){
                var tempcolor = {
                    id:ids,
                    value:index.colors[Math.floor(Math.random()*10)]
                };
                index.klineColor.push(tempcolor);
                linecolor = tempcolor.value;
            }
            var data = {
                xdata : [],
                value : []
            };
            for(var i=0;i<datas.length;i++){
                data.xdata.push(datas[i].time);
                data.value.push(datas[i].price);
            }
            option = {
                title: {
                    text: ''
                },
                grid:{
                    top:"80%"
                },
                legend: {
                    data:['']
                },
                xAxis: {
                    show : false,
                    data:data.xdata
                },
                yAxis: {show : false},
                series: [{
                    smooth:true,
                    symbol: 'none',
                    name: '',
                    type: 'line',
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color:linecolor
                            }
                        }
                    },
                    data:data.value
                }]
            };
            echarts_.setOption(option);
        }
    },
    /**
     * 获取行dom节点
     */
    initExchangeTypeTab:function(){
        $.ajax({
            type:"get",
            url:"/n/getAllExchangeType.html",
            dataType:"json",
            success:function(data){
                var dom=[];
                var detaildom=[];
                var echarts_id=[];
                var echarts_value = {};
                for(var i=0;i<data.data.length;i++){
                    var _data = data.data[i];
                    if(index.currentTab != null){
                        if(index.currentTab == _data.name){
                            dom.push('<li class="active">');
                        }else{
                            dom.push('<li>');
                        }
                    }else{
                        if(i == 0){
                            index.currentTab = _data.name;
                            dom.push('<li class="active">');
                        }else{
                            dom.push('<li>');
                        }
                    }
                    dom.push('<a href="#'+_data.name+'" data-toggle="tab" class="index-tab-a" data-tabname="'+_data.name+'">');
                    dom.push('<img src="'+_data.coinImgUrl+'" class="market-icon">');
                    dom.push('<p>');
                    dom.push(_data.name+language["apple.dom.msg1"]);
                    dom.push('</p>');
                    dom.push('</a>');
                    dom.push(' </li>');

                    for(var j=0;j<_data.exchangeTypes.length;j++){
                        var _data_ = _data.exchangeTypes[j];
                        var klineid = index.idprefex+_data_.fid;
                        var pnewid = index.idprefex+_data_.fid+"_p_new";
                        var roseid = index.idprefex+_data_.fid+"_rose";
                        var heightid = index.idprefex+_data_.fid+"_height";
                        var lowid = index.idprefex+_data_.fid+"_low";
                        var volid = index.idprefex+_data_.fid+"_vol";
                        var value = _data_.trades;
                        if(j==0){
                            if(index.currentTab != null){
                                if(index.currentTab == _data.name){
                                    detaildom.push('<div class="tab-pane active" id="'+_data.name+'">');
                                }else{
                                    detaildom.push('<div class="tab-pane" id="'+_data.name+'">');
                                }
                            }else{
                                if(i==0){
                                    detaildom.push('<div class="tab-pane active" id="'+_data.name+'">');
                                }else{
                                    detaildom.push('<div class="tab-pane" id="'+_data.name+'">');
                                }
                            }
                            detaildom.push('<div class="card-body">');
                            detaildom.push('<div class="vue-grid user-assets" >');
                            index.getDetaildomHeader(detaildom);
                            detaildom.push('<div class="tbody">');
                        }
                        detaildom.push('<div class="tr">');
                        detaildom.push('<div class="td cointTag">');
                        detaildom.push('<div class="cell">');
                        detaildom.push('<img src="'+_data_.leftCoinImgUrl+'" class="market-icon">');
                        detaildom.push('<b>');
                        detaildom.push(_data_.fshortname+"");
                        detaildom.push('</b>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('<div class="td">');
                        detaildom.push('<div class="cell">');
                        detaildom.push('<span id='+pnewid+'>');
                        detaildom.push(_util.numFormat(_data_.kiline.p_new,8));
                        detaildom.push('</span>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('<div class="td">');
                        detaildom.push('<div class="cell">');
                        if(_data_.kiline.is_increase){
                            detaildom.push('<span class="color-danger" id='+roseid+'>');
                        }else{
                            detaildom.push('<span class="color-success" id='+roseid+'>');
                        }
                        detaildom.push(_data_.kiline.rose+"%");
                        detaildom.push('</span>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('<div class="td">');
                        detaildom.push('<div class="cell">');
                        detaildom.push('<span id='+heightid+'>');
                        detaildom.push(_util.numFormat(_data_.kiline.height,8));
                        detaildom.push('</span>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('<div class="td">');
                        detaildom.push('<div class="cell">');
                        detaildom.push('<span id='+lowid+'>');
                        detaildom.push(_util.numFormat(_data_.kiline.low,8));
                        detaildom.push('</span>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('<div class="td">');
                        detaildom.push('<div class="cell">');
                        detaildom.push('<span id='+volid+'>');
                        detaildom.push(_data_.kiline.vol);
                        detaildom.push('</span>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('<div class="td">');
                        detaildom.push('<div class="cell">');
                        detaildom.push('<div class="line-market" ><div id="'+klineid+'" style="width: 177px;height: 76px;"></div></div>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('<div class="td">');
                        detaildom.push('<div class="cell">');
                        detaildom.push('<a class="btn btn-primary btn-sm" href="/n/trade.html?symbol='+_data_.fcode+'">');
                        detaildom.push(language["apple.dom.msg8"]);
                        detaildom.push('</a>');
                        detaildom.push('</div>');
                        detaildom.push('</div>');

                        detaildom.push('</div>');

                        if(j == _data.exchangeTypes.length-1){
                            detaildom.push('</div>');
                            detaildom.push('</div>');
                            detaildom.push('</div>');
                            detaildom.push('</div>');
                        }
                        var o = {};
                        o.id = klineid;
                        o.value = value;
                        index.line_market_value.push(o);
                    }

                }
                $("#index-tabs-exchange").html('');
                $("#index-tabs-exchange-detail").html('');
                $("#index-tabs-exchange-detail").html(detaildom.join(''));
                $("#index-tabs-exchange").html(dom.join(''));
                if(index.line_market_value.length>0){
                    index.init_echarts();
                }
            }

        });

    },
    /**
     * 获取行情的header
     * @param detaildom
     * @returns {*}
     */
    getDetaildomHeader:function(detaildom){
        var dom = $("#index-tabs-exchange-detail-theader").html();
        detaildom.push(dom);
        return detaildom;
    },
    /**
     * 重新拉取首页行情数据
     */
    reloadExchangeTypeTabData:function(){
        $.ajax({
            type:"get",
            url:"/n/getAllExchangeType.html",
            dataType:"json",
            success:function(data){
                for(var i=0;i<data.data.length;i++){
                    var _data = data.data[i];
                    for(var j=0;j<_data.exchangeTypes.length;j++){
                        var _data_ = _data.exchangeTypes[j];
                        var pnewid = index.idprefex+_data_.fid+"_p_new";
                        var roseid = index.idprefex+_data_.fid+"_rose";
                        var heightid = index.idprefex+_data_.fid+"_height";
                        var lowid = index.idprefex+_data_.fid+"_low";
                        var volid = index.idprefex+_data_.fid+"_vol";
                        $("#"+pnewid).text(_util.numFormat(_data_.kiline.p_new,8));
                        if(_data_.kiline.is_increase){
                            $("#"+roseid).removeClass("color-success");
                            $("#"+roseid).addClass("color-danger");
                        }else{
                            $("#"+roseid).removeClass("color-danger");
                            $("#"+roseid).addClass("color-success");
                        }
                        $("#"+roseid).text(_data_.kiline.rose+"%");
                        $("#"+heightid).text(_util.numFormat(_data_.kiline.height,8));
                        $("#"+lowid).text(_util.numFormat(_data_.kiline.low,8));
                        $("#"+volid).text(_data_.kiline.vol);
                    }
                }
            }
        })
    }
}
$(function () {
    //初始化交易区信息
    index.initExchangeTypeTab();

    //每秒拉取一次所有交易对最新的行情信息（后期改造为websocket）
    window.setInterval(function(){
        index.reloadExchangeTypeTabData();
    },5000);

    $("#index-tabs-exchange").on('click',".index-tab-a",function(){
        var tabname = $(this).data().tabname;
        index.currentTab = tabname;
    });
    //没5秒重新绘制走势图
    window.setInterval(function(){
        if(index.line_market_value.length>0){
            index.init_echarts();
        }
    },10000);
    /*初始化密码输入框*/
    $("#login-psw").removeClass('is-empty')
});