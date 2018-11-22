function MarketPanel(opt){
	this.prev_p_new=0;
    //买单
    this.arr_bids=[];
    //卖单
    this.arr_asks=[];
    //买单量的最大值
    this.bids_max=0;
    //买单量的最大值
    this.asks_max=0;
	this.obj={
		url:opt.url,
		type:opt.type
	};

    this.asks_str={
        row:"",
        price:"",
        f_g:"",
        usd:"",
        amount:"",
        a_g:"",
        depth:"",
        d_i:""
    };
    this.bids_str={
        row:"",
        price:"",
        f_g:"",
        usd:"",
        amount:"",
        a_g:"",
        depth:"",
        d_i:""
    }

}

/*加载*/
MarketPanel.prototype.reloads=function(){
	var that=this;
	$.ajax({
		url:that.obj.url,
		type:that.obj.type,
		dataType:"JSON",
		success:function(data){
			that.maxamount(data);
			that.average(data);
			that.buy(data);
			that.sell(data);
            console.log(data.data.depth.p_new);
		}
	})
}

//平均成交价
MarketPanel.prototype.average=function(data){
	//p_new价格   
    if(data.data.depth.p_new>this.prev_p_new){

        this.priceRose(data);

    }else if(data.data.depth.p_new<this.prev_p_new){

        this.priceReduce(data);

    }else{
        this.prev_p_new=$('.p_new').text();
        return
    }
}

//价格上涨
MarketPanel.prototype.priceRose=function(data){
    $(".current-price.up .animatebox").animate({
        top:-20+"%",
        opacity:0
    },300,'swing',function(){
        $(".current-price.up .animatebox").css("top",120+"%");
        $('.p_new').text(data.data.depth.p_new); //
        $('.current-price.up').css("color","#f56310");
        $(".current-price.up .animatebox").animate({
            top:53+"%",
            opacity:1
        },300,'swing')               
    })
    this.prev_p_new=data.data.depth.p_new; 
}

//价格下跌
MarketPanel.prototype.priceReduce=function(data){
    $(".current-price.up .animatebox").animate({
        top:120+"%",
        opacity:0
    },300,'swing',function(){

        $(".current-price.up .animatebox").css("top",-20+"%");
        $('.p_new').text(data.data.depth.p_new); //
        $('.current-price.up').css('color','#13d573');
        $(".current-price.up .animatebox").animate({
            top:53+"%",
            opacity:1
        },300,'swing')
        
    });
    this.prev_p_new=data.data.depth.p_new; 
}

//买
MarketPanel.prototype.buy=function(data){
    var that=this;
	$("#bids .dish-hands").children('ul').empty();
    $("#bids .table.depth_tale").empty();
    $.each(data.data.depth.bids,function(index,item){
        var f_zhengshu=parseInt(item[0]);
        var f_index=item[0].toString().indexOf(".");
        var f_xiaoshu='';
        if(f_index!=-1){
            f_xiaoshu=item[0].toString().substring(f_index);
        }else{
            f_xiaoshu='';
        };
                
        var amount_zhengshu=parseInt(item[1]);
        var amount_index=item[1].toString().indexOf(".");
        var amount_xiaoshu='';
        if(amount_index!=-1){
            amount_xiaoshu=item[1].toString().substring(amount_index);
        }else{
            amount_xiaoshu='';
        };
        that.struct({
            pushobj:$("#bids .table.depth_tale"),
            obj:that.bids_str,
            item:item,
            f_zhengshu:f_zhengshu,
            f_xiaoshu:f_xiaoshu,
            amount_zhengshu:amount_zhengshu,
            amount_xiaoshu:amount_xiaoshu,
            max:that.bids_max
        });
        $("#bids .dish-hands").children('ul').append("<li>买"+" "+parseInt(index+1)+"</li>");
    })
}


//卖
MarketPanel.prototype.sell=function(data){
	//卖
    var that=this;
    $("#asks .dish-hands").children('ul').empty();
    $("#asks .table.depth_tale").empty();
    $.each(data.data.depth.asks,function(index,item){
        var f_zhengshu=parseInt(item[0]);
        var f_index=item[0].toString().indexOf(".");
        var f_xiaoshu=item[0].toString().substring(f_index);

        var amount_zhengshu=parseInt(item[1]);
        var amount_index=item[1].toString().indexOf(".");
        var amount_xiaoshu='';
        if(amount_index!=-1){
            amount_xiaoshu=item[1].toString().substring(amount_index);
        }else{
            amount_xiaoshu='';
        };
        that.struct({
            pushobj:$("#asks .table.depth_tale"),
            obj:that.asks_str,
            item:item,
            f_zhengshu:f_zhengshu,
            f_xiaoshu:f_xiaoshu,
            amount_zhengshu:amount_zhengshu,
            amount_xiaoshu:amount_xiaoshu,
            max:that.asks_max
        });
        $("#asks .dish-hands").children('ul').append("<li>卖"+" "+parseInt(data.data.depth.asks.length-index)+"</li>");
    })
}

/*渲染结构*/
MarketPanel.prototype.struct=function(opt){
    opt.obj.row=$("<div></div>");
    opt.obj.row.addClass('row');

    opt.obj.price=$("<span>"+opt.f_zhengshu+"</span>");
    opt.obj.price.addClass('prices');

    opt.obj.f_g=$("<g>"+opt.f_xiaoshu+"</g>");
    opt.obj.price.append(opt.obj.f_g);

    opt.obj.usd=$("<span>123</span>");
    opt.obj.usd.addClass('usd');

    opt.obj.amount=$("<span>"+opt.amount_zhengshu+"</span>");
    opt.obj.amount.addClass('amount');

    opt.obj.a_g=$("<g>"+opt.amount_xiaoshu+"</g>");
    opt.obj.amount.append(opt.obj.a_g);

    opt.obj.depth=$("<span></span>");
    opt.obj.depth.addClass("depth");

    opt.obj.d_i=$("<i></i>");
    opt.obj.d_i.width((opt.item[1]/opt.max)*100+"%");

    opt.obj.depth.append(opt.obj.d_i);
    opt.obj.row.append(opt.obj.price);
    opt.obj.row.append(opt.obj.usd);
    opt.obj.row.append(opt.obj.amount);
    opt.obj.row.append(opt.obj.depth);
    opt.pushobj.append(opt.obj.row);
}

//计算最大值
MarketPanel.prototype.maxamount=function(data){
    for(var i=0; i<data.data.depth.bids.length; i++){
        this.arr_bids.push(data.data.depth.bids[i][1]);
    }

    for(var i=0; i<data.data.depth.asks.length; i++){
        this.arr_asks.push(data.data.depth.asks[i][1])
    }
    this.bids_max=Math.max.apply(null,this.arr_bids);
    this.asks_max=Math.max.apply(null,this.arr_asks);
}

