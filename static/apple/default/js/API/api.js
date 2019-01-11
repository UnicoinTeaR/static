var api={
    init:function(){
        $(".block-bar-left li").removeClass('active');
        $("#APILi").addClass('active');
    }


}
$(function () {
    api.init();
    $(".envor-left-list").animate({
        opacity:1
    },200,"linear")
})