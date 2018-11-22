/**
 * IE版本控制
 */
 
$(function() {  
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    var isMobile=false;
    
    if($.browser && $.browser.msie){
    	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {//如果是上述设备就会以手机域名打开
        	isMobile=true;
        } 
    	$.browser.msie10 = $.browser.msie && /msie 10\.0/i.test(sUserAgent);  
        $.browser.msie9 = $.browser.msie && /msie 9\.0/i.test(sUserAgent);   
        $.browser.msie8 = $.browser.msie && /msie 8\.0/i.test(sUserAgent);  
        $.browser.msie7 = $.browser.msie && /msie 7\.0/i.test(sUserAgent);  
        $.browser.msie6 = !$.browser.msie8 && !$.browser.msie7 && $.browser.msie && /msie 6\.0/i.test(sUserAgent);  
        if(isMobile || $.browser.msie8 || $.browser.msie7 || $.browser.msie6){
        	$(".nosupport").show();
        }
    } 
});          