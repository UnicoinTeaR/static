var kyc={
    init:function(){
        $(".block-bar-tab li").removeClass('active');
        $("#kycLi").addClass('active');
        
        $("#fidentityno").blur(function(){
        	var fidentityno = $(this).val();
        	if(fidentityno.length == 18){
	        	var birth=fidentityno.substring(6, 10) + "-" + fidentityno.substring(10, 12) + "-" + fidentityno.substring(12, 14);
	        	$("#fbirth").val(birth);
        	}
        });
    }
}
$(function () {
    kyc.init();
})