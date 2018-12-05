String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {
		for ( var i = 0; i < arguments.length; i++) {
			if (arguments[i] != undefined) {
				var reg = new RegExp("({[" + i + "]})", "g");
				result = result.replace(reg, arguments[i]);
			}
		}
	}
	return result;
};
//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
Date.prototype.Format = function(fmt)   
{ 
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

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
Date.prototype.pattern=function(fmt) {           
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
} 
function centerModals() {
	$('.modal').each(function(i) {
		var $clone = $(this);
		var display = $clone.css('display');
		if(display == "none"){
			$clone.css('display','block');
		}
		var modalHeight = $clone.find('.modal-content').height();
		var width = $clone.find('.modal-content').width();
		var top = Math.round(($clone.height() - modalHeight) / 2);
		top = top > 0 ? top : 0;
		$clone.css('display', display);
		$(this).find('.modal-content').css("margin-top", top);
		$(this).find('.modal-mark').css("height", modalHeight + 20).css("width", width + 20);
	});
}

$('.modal').on('show.bs.modal', centerModals);
$(window).on('resize', centerModals);

util.lrFixFooter("#allFooter");

$(function() {
	var speed = 5000;
	var count = 0;
	var newstoplist = jQuery("#newsList p");
	var sumCount = jQuery("#newsList p").length;
	function Marquee() {
		jQuery("#newsList p").hide();
		if(count>=sumCount){
			count=0;
		} 
		jQuery("#newsList p:eq("+(count-1)+")").slideDown(500);	
		jQuery("#newsList p:eq("+count+")").slideUp(500);
		++count;
	}
	if($("body .kWrap").length>0 && $("#newsList p").length>0){
		$(".container-full").show();
		if($("#newsList p").length>1){
			Marquee();
			var MyMar = setInterval(Marquee, speed);
			newstoplist.onmouseover = function() {
				clearInterval(MyMar);
			};
			newstoplist.onmouseout = function() {
				MyMar = setInterval(Marquee, speed);
			};
		} 
	} 
});

$(function(){
	$(".leftmenu-folding").on("click",function(){
		var that=$(this);
		$("."+that.data().folding).slideToggle("fast"); 
	});
});

(function ($) {

    $.cookie = function (key, value, options) {
        var opts;
        // 设置cookie
        var val = String(value);
        if (arguments.length > 1 && val !== "[object Object]") {
            var time, num, type, strsec = 0,
                exp = new Date();
            opts = $.extend({}, $.cookie.defaults, options);
            return (document.cookie = [
                encodeURIComponent(key), '=',
                opts.raw ? val : encodeURIComponent(val),
                time,
                opts.path ? '; path=' + opts.path : '/',
                opts.domain ? '; domain=' + opts.domain : '',
                opts.secure ? '; secure' : ''
            ].join(''))
        }
        
        // 获取cookie
        opts = $.extend({}, $.cookie.defaults, value);
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? {
            true: result[1],
            false: decodeURIComponent(result[1])
        }[opts.raw] : null
    };

    $.cookie.defaults = {
        expires: '',
        path: '/',
        secure: false,
        raw: false,
        domain: ''
    };
    
    /** *cookie 公用 */
    $.setCookie = function (name, value, option) {
        if (typeof value != "string") {
            value = $.toJSON(value);
        }
        option = option || {
                path: "/",
                expires: 30
            };

        return $.cookie(name, value, option);
    };

    $.getCookie = function (name) {
        var value = $.cookie(name);
        if(null == value){
            return value;
        }
        if("token" == name){
            value = value.replace(/^\"|\"$/g,"");
        }
        if (value && value.indexOf("{") != -1) {
            value = $.evalJSON(value);
        }
        if (!value || value == "false" || value == undefined || value == "") {
            value = null;
        }
        return value;
    };

    $.deleteCookie = function (name) {
        var name = decodeURIComponent(name);
        $.cookie(name, null, {
            expires: -1,
            path: '/'
        });
    };

    $.delAllCookie = function (excludeArr) {
        // js 遍历所有Cookie
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; "); // 将多cookie切割为多个名/值对
        for (var i = 0; i < arrCookie.length; i++) { // 遍历cookie数组，处理每个cookie对
            var arr = arrCookie[i].split("=");
            var status;
            if (arr.length > 0) {
                status = true;
            }
            if (excludeArr && excludeArr.length > 0) {
                for (var exclude in excludeArr) {
                    if (excludeArr[exclude] == arr[0]) {
                        status = false;
                        break;
                    }
                }
            }
            if (status) {
                $.deleteSession(arr[0]);
            }
        }
    };
    
    //$.setCookie('Language', 'zh_TW');
    
    $("#header .language").on("click","i", function () {
		$("#header .language").find("span").show();
		$(this).toggleClass("up");
		var id="en_US",cl="en";
		var enTop="",zhTop="top: 34px;";
		if($(this).attr("language")=="zh_CN"){ 
			id="zh_CN",cl="zh";
			enTop="top: 34px;",zhTop="";
		} 
		if($(this).hasClass("up")){ 
			$("#header .language span").show();
		}else{
			$("#header .language span").hide(); 
			$("#header .language span:eq(0)").show();
		}
    });
    $("#header .language").on("click","span", function () {
    	if(!$(this).hasClass("zh")){
    		if($(this).hasClass("en")){
    			util.tipAlert("The English Version Will Be Available Soon");
    		}else if($(this).hasClass("ja")){
    			util.tipAlert("まもなく日本语バージョン语化");
    		}else if($(this).hasClass("ru")){
    			util.tipAlert("Скоро заработает русском языках");
    		}else{
    			util.tipAlert("即将上线，敬请期待！");
    		} 
    		$("#header .language span").hide(); 
			$("#header .language span:eq(0)").show();
			$("#header .language i").addClass("down").removeClass("up");
    		return false;
    	}
    	$.setCookie('Language', $(this).attr("id"), { expires: 7, path: '/' });
    	window.location.reload(true);
    });
    
    $(".goUserOut").on("click", function () {
     	window.location.href="/user/logout.html";
    });
    
   /* $(".goetcchain").on("click", function () {
      	window.open('http://etcchain.com/explorer');  
    });
    
    $(".go91pool").on("click", function () {
    	window.open('http://91pool.com');  
     });
   
     $(".goetchashrate").on("click", function () {
     	window.open('https://etcchain.com/chart/hashrate');  
      });*/
     
    $(".userCenter").on("mouseover",function(){
    	if( $(".userCenter .topUserInfo").css("display") == 'none' ){  
    		//util.getFinancial();
     	}
    	$(".userCenter .topUserInfo").show();
    }).on("mouseleave",function(){
    	$(".userCenter .topUserInfo").hide();
    });
    
    /*util.get91Pool();*/
    setInterval("util.getHeader()", 5000);
    util.getHeader();
	 
	//setInterval("util.getFinancial()", 6000);
	//util.getFinancial();
	
	//撤销委单
	$(".batch-cancel-entrust-tips .revoke_cd").on("click",function(){
		$(this).addClass("tip_active").siblings().removeClass();
	})
	$(".batch-cancel-entrust-tips .close_btn").on("click",function(){
		$("#batch-cancel-entrust-min,#batch-cancel-entrust-max").val(""); 
		$(".batch-cancel-entrust-tips.tip").css("display","none");
	})
	
	$("#batch-cancel-entrust-min").on("keyup",  function(event) {
		var keyCode = event.keyCode ? event.keyCode : event.which;
		var reg = new RegExp("^[0-9]+(.[0-9]{0,10})?$");
		var id="#batch-cancel-entrust-min";
		if(!reg.test($(id).val())) {
			$(id).val('');
			return ;
		} 
			    	
		var v=$(id).val();
		if(v.indexOf(".")>0 && v.substring(v.indexOf(".")+1)>8 && ((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105))){
			$(id).val(v.substring(0, v.indexOf(".") + 9));
		} 	
	});
	
	$("#batch-cancel-entrust-max").on("keyup",  function(event) {
		var keyCode = event.keyCode ? event.keyCode : event.which;
		var reg = new RegExp("^[0-9]+(.[0-9]{0,10})?$");
		var id="#batch-cancel-entrust-max";
		if(!reg.test($(id).val())) {
			$(id).val('');
			return ;
		} 
			    	
		var v=$(id).val();
		if(v.indexOf(".")>0 && v.substring(v.indexOf(".")+1)>8 && ((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105))){
			$(id).val(v.substring(0, v.indexOf(".") + 9));
		} 	
	});
    
})(jQuery)
$(function(){if($('.notice').length>0){if($('.boxLeft').length>0){$('.notice').css({'text-indent':'180px'})}}});

//刷新图片验证码
function flushImageCode(img) {
    $(img).attr("src", "/servlet/ValidateImageServlet.html?r=" + Math.round(Math.random() * 100));
}