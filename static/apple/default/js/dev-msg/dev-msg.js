$(function(){         
    $(".depth_check").click(function(){
        var depth_check=document.querySelector(".depth_check");
        if(depth_check&&depth_check.checked){
            $("#orderbook").addClass("show-depth")  
        }else{
            $("#orderbook").removeClass("show-depth") 
        }
    });
    var openonoff=true;
    $(".webchat-r").click(function(){
        if(openonoff){
            $('.dev-msg').addClass('open');
            $("body").addClass('chat-open');
            openonoff=false;
        }else{
            $('.dev-msg').removeClass('open');
            $("body").removeClass('chat-open');
            openonoff=true;
        }
    });

    $(".closes").click(function(){
        $('.dev-msg').removeClass('open');
        $("body").removeClass('chat-open');
        openonoff=true;
    });

});