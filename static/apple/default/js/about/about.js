var about={
    init:function(){
        $(".block-bar-left li").removeClass('active');
        $("#coinLi").addClass('active');
    }
}
$(function () {
    about.init();
})