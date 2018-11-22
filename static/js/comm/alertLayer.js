;(function($) {  
   //这里的notExsit是验证的名字  
   //default是默认信息  
    $.fn.bootstrapValidator.i18n.iphoneAndEmail = $.extend($.fn.bootstrapValidator.i18n.notExsit || {}, {  
        'default': '请输入正确的手机号码或者邮箱!'  
    });  
    //validate是验证的方法  
    $.fn.bootstrapValidator.validators.iphoneAndEmail = {  
        validate: function(validator, $field, options) {  
            var value = $field.val();  
            var validateFieldStr=$(options['validateField']).html();  
            if (util.checkMobile(value) || util.checkEmail(value)) {  
            	return true;  
            } else{
            	return false;  
            } 
        }  
    };  
}(window.jQuery));  
var alertLayer = {
		//"warning", "error", "success" and "info"
		openTips:function(content, tipType,allowOutsideClick,autoFade, time, callback){
			allowOutsideClick = allowOutsideClick|| true;
			var param = {
				  title: language["user.operation.tips.info.23"],
				  text: content,
				  type: tipType,
				  allowOutsideClick:allowOutsideClick
			}
			if(autoFade){
				time = time || 3000;
				param.time=time;
			}
			swal(param,callback);
		},
		tipConfirm:function(content,allowOutsideClick,callback){
			swal({
				  title: '确定操作吗？',
				  text: content,
				  type: "warning",
				  showCancelButton: true,
				  allowOutsideClick:allowOutsideClick,
				  cancelButtonText:"取消",
				  confirmButtonText:"确定",
			},callback);
		}
};