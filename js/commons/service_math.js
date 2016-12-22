/**
 * 
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-29 17:04:17
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
			//处理leader原始数据
			this.getLeader = function(obj_data_leader_db) {
				after_data_leader_db = [];
	            for (var k = 0; k < obj_data_leader_db.length; k++) {
	                var leader_string_Array = [];
	                leader_string_Array = obj_data_leader_db[k].split(" ");
	                var leader_ip_Array = [];
	                leader_ip_Array = leader_string_Array[leader_string_Array.length - 1].split(":");
	                after_data_leader_db.push(leader_ip_Array[0]);
	            }
	            return after_data_leader_db;
			};
			 /**
	         * [getStatus description] 对于特殊的字句进行有条件转意,特殊转意
	         * @param  {[type]} obj_status       [description]
	         * @param  {[type]} obj_agent_status [description]
	         * @return {[type]}                  [description]
	         */
	        this.changeStatus = function(obj_status_all) {
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
	        this.getStatus = function(obj_status,obj_agent_status) {
	        	if (obj_agent_status == "Fail") {
	                return obj_status = "Unknown";
	           	}else {     //if (obj_agent_statsu == "OK")
		                if (obj_status == "passing") {
		                    obj_status = "OK";
		                } else if (obj_status == "critical") {
		                    obj_status = "Fail";
		                }
	                return obj_status;
	            }
	        };
	        var getMaster = function(obj_master,obj_serviceName){
	        	  	var data_master = {};
		        	if (obj_master == "master") {
		              //  var data_master = {};
		                data_master["role"] = obj_master;
		                data_master["VIP"] = getVipofchap(obj_serviceName);
		               // return data_master;
		            } else {
		               // var data_backup = {};
		                data_master["role"] = obj_master;
		                data_master["VIP"] = " ";
		                //return data_backup;
		            }
		             return data_master;
	        };
	        var  getVipofchap = function(obj_serviceName) {
		            var data_getVipofchap = "";
		            $.ajax({
		                method:"get",
		                url:"http://" + configObject.IP + "/v1/kv/cmha/service/" + obj_serviceName + "/chap/VIP?raw",
		                async:false,
		                dataType:"text",
		                success:function(result, status, xhr) {
		                    data_getVipofchap = result;
		                },
		                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
		                    console.error("getVipofchap 获得chap的VIP 状态文本 " + status);
		                }
		            });
		            return data_getVipofchap;
        	};
	        this.getRoleofchap = function(obj_serviceName, obj_hostName) {
	            var data_RandVofchap = {};
		            $.ajax({
		                method:"get",
		                url:"http://" + configObject.IP + "/v1/kv/cmha/service/" + obj_serviceName + "/chap/role/" + obj_hostName + "?raw",
		                async:false,
		                dataType:"text",
		                success:function(result, status, xhr) {
							data_RandVofchap = getMaster(result,obj_serviceName);
		                },
		                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
		                    console.error("getRoleofchap 获得chap的role  状态文本 " + status);
		                }
		            });

	            return data_RandVofchap;
        	};
        	this. getRepl_err_counterOfDB = function(objRepl_serviceName, obj5Repl_hostname) {
		            var data_result = "";
		            $.ajax({
		                method:"get",
		                url:"http://" + configObject.IP + "/v1/kv/cmha/service/" + objRepl_serviceName + "/db/repl_err_counter/" + obj5Repl_hostname + "?raw",
		                async:false,
		                dataType:"json",
		                success:function(result, status, xhr) {
		                    data_result = result;
		                },
		                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
		                    console.error("getRepl_err_counterOfDB 获得DB的repl_err_counter状态文本 " + status);
		                }
		            });
		            return data_result;
       		};
       		this.changeRoleOfDB = function(obj_IP) {
	            for (var i = after_data_leader_db.length - 1; i >= 0; i--) {
	                if (after_data_leader_db[i] == obj_IP) {
	                    return "leader";
	                }
	            }
	            return " ";
        	};
        	this.changeRoleOfChap = function(obj_a_serfHealth_status,obj_role){
	            if(obj_a_serfHealth_status == "OK"){
	                return obj_role;
	            }else{
	                return "Unknown";
	            }
        	};
        	this.changeVipOfChap = function(obj_a_serfHealth_status,obj_vip){
	            if(obj_a_serfHealth_status == "OK"){
	                return obj_vip;
	            }else{
	                return "";
	            }
        	};
        	this.changeType = function(obj_type, a_Node, a_Service_ID, a_chap01_status, obj_Address,obj_a_serfHealth_status) {
            	var dataArray = {};
	            switch (obj_type) {
	              case "chap-slave":
	                dataArray = {};
	                obj_type = "chap";
	                dataArray["type"] = obj_type;
	                var a_dataArray = this.getRoleofchap(a_Service_ID, a_Node);
	                dataArray["role"] = this.changeRoleOfChap(obj_a_serfHealth_status,a_dataArray.role);
	                dataArray["VIP"] = this.changeVipOfChap(obj_a_serfHealth_status,a_dataArray.VIP);
	                dataArray["REPL_ERR_COUNTER"] = " ";
	                dataArray["REPL_STATUS"] = " ";
	                return dataArray;
	              case "chap-master":
	                dataArray = {};
	                obj_type = "chap";
	                dataArray["type"] = obj_type;
	                var b_dataArray = this.getRoleofchap(a_Service_ID, a_Node);
	                dataArray["role"] =this.changeRoleOfChap(obj_a_serfHealth_status,b_dataArray.role);
	                dataArray["VIP"] = this.changeVipOfChap(obj_a_serfHealth_status,b_dataArray.VIP);
	                dataArray["REPL_ERR_COUNTER"] = " ";
	                dataArray["REPL_STATUS"] = " ";
	                return dataArray;
	              case "master":
	                dataArray = {};
	                obj_type = "db";
	                dataArray["type"] = obj_type;
	                dataArray["REPL_ERR_COUNTER"] = this.getRepl_err_counterOfDB(a_Service_ID, a_Node);
	                dataArray["REPL_STATUS"] = a_chap01_status;
	                dataArray["role"] = this.changeRoleOfDB(obj_Address);
	                dataArray["VIP"] = " ";
	                return dataArray;
	              case "slave":
	                dataArray = {};
	                obj_type = "db";
	                dataArray["type"] = obj_type;
	                dataArray["REPL_ERR_COUNTER"] = this.getRepl_err_counterOfDB(a_Service_ID, a_Node);
	                dataArray["REPL_STATUS"] = a_chap01_status;
	                dataArray["role"] = this.changeRoleOfDB(obj_Address);
	                dataArray["VIP"] = " ";
	                return dataArray;
            	}
        	};
        	this.getReallyStatus = function(obj_array_status, obj_service) {
	            for (var i = obj_array_status.length - 1; i >= 0; i--) {
	                if (obj_array_status[i].CheckID.indexOf("service") != -1 && obj_array_status[i].CheckID.indexOf(obj_service) != -1) {
	                    return obj_array_status[i].Status;
	                }
	            }
        	};
        	this.getAgentStatus = function(obj_array_status) {
	            for (var i = obj_array_status.length - 1; i >= 0; i--) {
	                if (obj_array_status[i].CheckID.indexOf("serfHealth") != -1) {
	                    return obj_array_status[i].Status;
	                }
	            }
        	};
        	/**
        	 * [formatter_db description]以下全部是表格的内部函数
        	 */
        	this.formatter_db = function(cellvalue, options, rowObject) {
	            Hostrole_id = "";
	            for (var l = 0; l < after_data_leader_db.length; l++) {
	                if (rowObject.Address == after_data_leader_db[l]) {
	                    Hostrole_id = "leader";
	                    return '<span style="color:green;" >' + cellvalue + "</span>";
	                }
	            }
	            return "<span  >" + cellvalue + "</span>";
        	};
        	this.formatter_chap_status = function(cellvalue, options, rowObject) {
	            if (rowObject.chap_status == "OK") {
	                return '<span style="color:green;" >' + cellvalue + "</span>";
	            } else if (rowObject.chap_status == "warning") {
	                return '<span style="color:red;" >' + cellvalue + "</span>";
	            } else {
	                return '<span style="color:red;" >' + cellvalue + "</span>";
	            }
        	};
        	this.formatter_chap_status = function(cellvalue, options, rowObject) {
	            if (rowObject.chap_status == "OK") {
	                return '<span style="color:green;" >' + cellvalue + "</span>";
	            } else if (rowObject.chap_status == "warning") {
	                return '<span style="color:red;" >' + cellvalue + "</span>";
	            } else {
	                return '<span style="color:red;" >' + cellvalue + "</span>";
	            }
        	};
        	this.formatter_serfHealth_status = function(cellvalue, options, rowObject) {
	            if (rowObject.serfHealth_status == "OK") {
	                return '<span style="color:green;" >' + cellvalue + "</span>";
	            } else if (rowObject.serfHealth_status == "warning") {
	                return '<span style="color:red;" >' + cellvalue + "</span>";
	            } else {
	                return '<span style="color:red;" >' + cellvalue + "</span>";
	            }
        	};
        	this.ormatter_role_status = function(cellvalue, options, rowObject) {
	            if (rowObject.role == "Unknown") {
	                return '<span style="color:red;" >' + cellvalue + "</span>";
	            }  else {
	                return '<span >' + cellvalue + "</span>";
	            }
        	};
        	this.formatter_repl_status = function(cellvalue, options, rowObject) {
			    if (rowObject.REPL_STATUS == "OK") {
			        return '<span style="color:green;" >' + cellvalue + "</span>";
			    } else if (rowObject.REPL_STATUS == "warning") {
			        return '<span style="color:red;" >' + cellvalue + "</span>";
			    } else {
			        return '<span style="color:red;" >' + cellvalue + "</span>";
			    }
			};
			this.formatter_counter_status = function(cellvalue, options, rowObject) {
			    if (rowObject.REPL_ERR_COUNTER == 1) {
			        return '<span style="color:red;" >' + cellvalue + "</span>";
			    }
			    return '<span style="color:green;" >' + cellvalue + "</span>";
			};
			this.getOutput = function (obj_array_output) {
				for (var i = obj_array_output.length - 1; i >= 0; i--) {
					if(obj_array_output[i].CheckID != "serfHealth"){
						return obj_array_output[i].Output;
					}
				}
			};




	}
	return {
		Commons : Commons
	};
});

