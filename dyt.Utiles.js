;(function($){
	// 邮箱
	reg_email = /\w{3,}@\w+(\.\w+)+$/;
	// 中文
	reg_chinese = /[\u4e00-\u9fa5]/;
	// 双字节
	reg_DByte = /[^\x00-\xff]/;
	// 正实数
	reg_Floating_Positive = /^(0|[1-9]\d*)(\.\d*)?$/;
	//移动电话
	reg_mobil_phone = /^(?:13\d|15\d)\d{5}(\d{3}|\*{3})$/;
	//家用电话
	reg_phone = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;

	// 公共方法工具包
	$.dyt = {
			// 规则验证
			validator : {
					common  : function(reg, obj) {
						return reg.test(obj);
					} ,
					// 验证邮箱
					isEmail : function(obj) {
						return $.dyt.validator.common(reg_email, obj);
					},
					// 中文
					isChinese : function(obj){
						return $.dyt.validator.common(reg_chinese, obj);
					},
					// 双字节
					isDoubleByte : function(obj){
						return $.dyt.validator.common(reg_DByte, obj)
					},
					// 正实数
					isFPositive :  function(obj){
						return $.dyt.validator.common(reg_Floating_Positive, obj);
					},
					//移动电话
					isMobilePh  : function(obj){
						return $.dyt.validator.common(reg_mobil_phone, obj);
					},
					//家用电话
					isPhone     : function(obj){
						return $.dyt.validator.common(reg_phone, obj);
					},
					 // 两个数之间(包括)
					between : function(which, start, end){
							return (which < end && which > start) ? true : false;
					}
			},
			// 提示插件
			prompt : {
				   // 淡出提示错误
				 fost : function(msgDivId, msg){
					 $(msgDivId).html(msg).show().fadeOut(2500,function(){
						 $(msgDivId).html("");
					 });
				 }
			},
			// 表单验证
			form_validate : {
				　// 表单值不能为空
				 required : function(fieldId, promptDivId, promptMsg){
					 if($.trim($(fieldId).val()) == ""){
						 return false;
					 }
					return true;
				 }
			},
			// 公共方法集
			commons : {
				create_WarnDiv : function( clss, msg){
					return $("<div></div>").addClass(clss).append(msg)
				}
			}
			
	};
	
	
	/** ---------------这里的.warn需要重构----------------* */
	
	/**
	 *　@param　boolean required　是否必须
	 *  @param　string req_prompt　表单为空时的提示语
	 *  @param　string url ajax查询的地址
	 *  @param string key json数据的key,　如{key : value}
	 *  @param string exist_prompt 已存在时的提示语
	 *  @author zjzhai
	 */
	$.fn.dyt_required_exist = function(options ){
		var settings = $.extend({
			required   : false,
			req_prompt : "不能为空",
			url        : null,
			key        : "",
			exist_prompt : "已存在"
		},  options || {});
		
		return this.blur(function(e){
			var value = $.trim(e.target.value);
			var data = $.parseJSON( '{"'+settings.key+'":"'+value+'"}');
			
			if(!	value){
				if(settings.required){
					$(e.target).next(".warn").remove();
					$(e.target).after($.dyt.commons.create_WarnDiv("warn",settings.req_prompt ));
				}
			}else{
				$.ajax({
					  type   : 'POST',
					  url    : settings.url,
					  data   : data,
					  success: function(data){
						  $(e.target).next(".warn").remove();
							if(data.exist){
								$('<div></div>').attr("class","warn").html(settings.exist_prompt).insertAfter(e.target);
							}
					  },
					 dataType: 'json'
					});
			}
		});
	};
	
	// 只能为实数
	$.fn.dyt_isFPositive = function(prompt, options){
		
		var settings = $.extend({
			required : false,
		  prompt2	 : "内容不能为空"
		}, options || {});
		
		return this.blur(function(e){
			$(e.target).next(".warn").remove();
			if($.trim(e.target.value)){
				if(!$.dyt.validator.isFPositive(e.target.value)){
					$(e.target).after($.dyt.commons.create_WarnDiv("warn", prompt));
					$(e.target).attr("value","");
				}
			}else{
				if(settings.required){
					$(e.target).after($.dyt.commons.create_WarnDiv("warn", settings.prompt2));
				}
			}
		});
		
	};
	
	// 两数之间
	$.fn.dyt_between = function(start, end, prompt){
		this.blur(function(e){
			$(e.target).next(".warn").remove();
			if($.trim(e.target.value)){
				if(!$.dyt.validator.isFPositive(e.target.value) || !$.dyt.validator.between(e.target.value, new Number(start), new Number(end)) ){
					$(e.target).after($.dyt.commons.create_WarnDiv("warn", prompt));
					$(e.target).attr("value","");
				}
			}
		});
		return this;
	};
	
	//电话
	$.fn.dyt_isPhone = function(prompt, options){
		var settings = $.extend({
			required : false,
		  prompt2	 : "内容不能为空"
		}, options || {});
		
		return this.blur(function(e){
			$(e.target).next(".warn").remove();
			if($.trim(e.target.value)){
				if(!$.dyt.validator.reg_mobil_phone(e.target.value) || !$.dyt.validator.reg_phone(e.target.value) ){
					$(e.target).after($.dyt.commons.create_WarnDiv("warn", prompt));
					$(e.target).attr("value","");
				}
			}else{
				if(settings.required){
					$(e.target).after($.dyt.commons.create_WarnDiv("warn", settings.prompt2));
				}
			}
		});
		
	};
	
	
	
	
})(jQuery);


