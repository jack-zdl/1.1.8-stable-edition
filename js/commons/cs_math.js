/**
 * 这是里jqgrid_cs_main依赖的数据处理抽象函数
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-29 10:28:03
 * @version $1.1.7$
 */
require.config({
	paths:{
		"jquery" : "lib/jquery"
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
		//判断那个consul是Leader,每个页面都要使用
		this.isLeader = function(obj_ip,obj_leader_ip){
			if(obj_ip == obj_leader_ip){
				return "leader";
			}else{
				return "";
			}
		};
		//得到leader的纯IP不要端口
		this.getLeaderIp = function(obj_leader){
            // var leader_string_Array = [];
            // leader_string_Array = obj_leader.split(" ");
            var leader_ip_Array = [];
          //  leader_ip_Array = leader_string_Array[leader_string_Array.length - 1].split(":");
          	  leader_ip_Array = obj_leader.split(":");
            var leaderIp = leader_ip_Array[0];
            return leaderIp;

		};
		//从cs的alldata中去获得详细的名称
		this.changeData = function(){

		};
		this.formatter = function(cellvalue, options, rowObject) {
            if (rowObject.Address == after_data_leader_cs) {
                return "<span after_data_leader_db >" + cellvalue + "</span>";
            } else {
                return "<span  >" + cellvalue + "</span>";
            }
        };
        this.formatter_status = function(cellvalue, options, rowObject) {
            if (rowObject.Status == "passing") {
                return '<span style="color:green;" >' + cellvalue + "</span>";
            } else if (rowObject.Status == "warning") {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            } else {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            }
        };
        /**
         * [changeStatus description]特殊字句进行转意
         * @param  {[type]} obj_status [description]
         * @return {[type]}            [description]
         */
        this.changeStatus = function(obj_status){	
        	switch (obj_status_all) {
              case "passing":
                obj_status_all = "OK";
                return obj_status_all;

              case "critical":
                obj_status_all = "Fail";
                return obj_status_all;

              default:
                return obj_status_all;
            }
        };
       
	}

	return {
		Commons : Commons
	};

});

