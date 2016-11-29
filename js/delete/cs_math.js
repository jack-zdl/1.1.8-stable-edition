/**
 * 这是里jqgrid_cs_main依赖的数据处理抽象函数
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-29 10:28:03
 * @version $1.1.7$
 */
require.config({
	paths:{
		"jquery" : "lib/jquery",
		"Underscore":"lib/Underscore",
		"backbone":"lib/backbone"
	},
	shim: {
　　　　'underscore':{
　　　　　　exports: '_'
　　　　},
　　　　'backbone': {
　　　　　　deps: ['underscore', 'jquery'],
　　　　　　exports: 'Backbone'
　　　　}
　　}
});
require(['jquery','Underscore','backbone'],function($,Underscore,backbone){
	function Commons(){
		//来处理所有的http请求
		this.getData = function(obj_url) {
			var date;
			$.ajax({
                url:obj_url,
                method:"get",
                async:false,
                dataType:"json",
                success:function(result, status, xhr) {
                    date = result;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getAllDataCS  CS数据状态文本 " + status);
                }
            });
			return date;
		};
		this.changeData = function(){

		};
	}
	return {
		Commons : Commons
	};

});

