/**
 * 建立warn jqgrid的抽象函数
 * @authors zhzngdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-30 13:56:25
 * @version $1.1.7$
 */
require.config({
	paths:{
		"jquery":"lib/jquery"
	}
});
define(['jquery'],function($){
		function Commons(){
			//来处理所有的http请求
			this.getData = function(obj_array_url) {
				var data = [];
				for (var i = obj_array_url.length - 1; i >= 0; i--) {
					 $.ajax({
		                url:obj_array_url[i],
		                method:"get",
		                async:false,
		                dataType:"json",
		                success:function(result, status, xhr) {
		                    data.push(result);
		                },
		                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
		                    console.error("getAllDataCS  CS数据状态文本 " + status);
		                }
	            	});
				}
				return data;
			};
			this.getText = function(obj_array_url){
				var data = [];
				for (var i = obj_array_url.length - 1; i >= 0; i--) {
					 $.ajax({
		                url:obj_array_url[i],
		                method:"get",
		                async:false,
		                dataType:"text",
		                success:function(result, status, xhr) {
		                    data.push(result);
		                },
		                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
		                    console.error("getAllDataCS  CS数据状态文本 " + status);
		                }
	            	});
				}
				return data;
			};
			this.changeData = function(obj_array_data){
				var after_data_WCSV =[];
				for (var i = obj_array_data.length - 1; i >= 0; i--) {
					var a_data_WCSV = obj_array_data[i];
	                var index_a = a_data_WCSV.indexOf("@");
	                var index_aa = a_data_WCSV.indexOf(" ", index_a);
	                var index_aaa = a_data_WCSV.indexOf(" ", index_aa + 1);
	                var value_a_data_WCSV = a_data_WCSV.substring(index_aaa);
	                var array_a_data_WCSV = a_data_WCSV.split("]", 3);
	                var after_a_data_WCSV = {};
	                after_a_data_WCSV["valueOW"] = value_a_data_WCSV;
	                after_a_data_WCSV["timeOW"] = array_a_data_WCSV[0].substring(1);
	                after_a_data_WCSV["typeOW"] = array_a_data_WCSV[1].substring(2);
	                after_a_data_WCSV["serviceOW"] = array_a_data_WCSV[2].substring(3);
	                after_data_WCSV.push(after_a_data_WCSV);
				}
				return after_data_WCSV;
			};
		}
		return {
			Commons : Commons
		};
});