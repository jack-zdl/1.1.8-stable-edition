/**
 * 建立jqgrid_host.html的main程序
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-30 17:48:26
 * @version $Id$
 */
require.config({
	paths:{
		"jquery":"lib/jquery",
		"jquery-ui": "lib/jquery-ui-1.10.3.min",
		"gridlocale": "lib/grid.locale-zh_CN",
		"jqG": "lib/jquery.jqGrid.min",
		"CsMath":"commons/cs_math",
		"ServiceMath" : "commons/service_math",
		"WarnMath" : "commons/warn_math",
		"HostMath":"commons/host_math",
		"dict":"commons/dict"
	},
	shim: {
		'jquery-ui': {
			deps: ['jquery'],
			exports: 'jquery-ui'
		},
		'gridlocale': {
			deps: ['jquery'],
			exports: 'gridlocale'　　　　
		},
		'jqG': {
			deps: ['jquery'],
			exports: 'jqG'
		}
　　}
});
define(['jquery','CsMath','ServiceMath','WarnMath','HostMath','jquery-ui', 'gridlocale', 'jqG'],function(jQuery,CsMath,ServiceMath,WarnMath,HostMath){
	//alert(globalObject.hostName+globalObject.serviceName);
	function runJqgridHostFunction(){
		function runJqgridDBFunction(){
			var getDB = new CsMath.Commons();
			var getService = new ServiceMath.Commons();
			var getHost = new HostMath.Commons();
			/**
			 * [urlArrayService description]得到所有service数据
			 * @type {Array}
			 */
			var arrayServiceName =[globalObject.serviceName];
			var urlArrayService = [];
			for (var i = arrayServiceName.length - 1; i >= 0; i--) {
				var urlService = "http://" + configObject.IP + "/v1/health/service/" + arrayServiceName[i];
				urlArrayService.push(urlService);
			}
			var getAllServiceData = getHost.getHostData(getDB.getData(urlArrayService)[0]);
			/**
			 * [urlArrayServiceLeader description]得到每个服务组的leader
			 * @type {Array}
			 */
			var urlArrayServiceLeader = [];
			for (var a = arrayServiceName.length - 1; a >= 0; a--) {
				var urlServiceLeader = "http://" +configObject.IP + "/v1/kv/cmha/service/" + arrayServiceName[a] + "/db/leader?raw";
				urlArrayServiceLeader.push(urlServiceLeader);
			}
			var getDataServiceLeader = getDB.getText(urlArrayServiceLeader);
			var afterDataServiceLeader = getService.getLeader(getDataServiceLeader);
			function setServiceJqgrid(){
				var afterArrayData = [];
	            for (var x = 0; x < getAllServiceData.length; x++) {
	                var afterData = {};
	                for (var y = 0; y < getAllServiceData[x].length; y++) {
	                    var data = getAllServiceData[x][y];
	                    var Node = data.Node;
	                    var Service_ID = data.Service.ID;
	                    var Service_Service = data.Service.Service;
	                    var type = data.Service.Tags[0];
	                    var Address = data.Service.Address;
	                    var Port = data.Service.Port;
	                    var chap01 = data.Checks[0].CheckID;
	                    var serfHealth_status = getService.changeStatus(getService.getAgentStatus(data.Checks));
	                    var chap01_status = getService.getStatus(getService.getReallyStatus(data.Checks, arrayServiceName[x]), serfHealth_status);
	                    var serfHealth = data.Checks[1].CheckID;
	                    var chap01_Output = data.Checks[0].Output;
	                    afterData = getService.changeType(type, Node.Node, Service_ID, chap01_status, Address,serfHealth_status); //serfHealth_status
	                    afterData["Node"] = Node.Node;
	                    afterData["Address"] = Node.Address;
	                    afterData["ServiceID"] = Service_ID;
	                    afterData["ServiceName"] = Service_Service;
	                    afterData["ServiceAddress"] = Address;
	                    afterData["ServicePort"] = Port;
	                    afterData["chap_CheckID"] = chap01;
	                    afterData["chap_status"] = chap01_status;
	                    afterData["serfHealth_CheckID"] = serfHealth;
	                    afterData["serfHealth_status"] = serfHealth_status;
	                    afterData["Output"] = chap01_Output;
	                    afterArrayData.push(afterData);
	                }
            	}
            	if (globalObject.isSetJqgrid == 0) {
	                jQuery("#jqgrid_db").jqGrid({
	                    data:afterArrayData,
	                    datatype:"local",
	                    height:"auto",
	                    colNames:[ "ServiceName", "Node", "Type", "Address", "ServicePort", "Status", "Ca_Status", "Role", "VIP", "Repl_Status", "Repl_Err_Counter", "Output" ],
	                    colModel:[ {
	                        name:"ServiceName",
	                        index:"ServiceName",
	                         align:"center",
	                        editable:true
	                    }, {
	                        name:"Node",
	                          align:"center",
	                        index:"Node"
	                    }, {
	                        name:"type",
	                          align:"center",
	                        index:"type"
	                    }, {
	                        name:"Address",
	                        index:"Address",
	                          align:"center",
	                        editable:true
	                    }, {
	                        name:"ServicePort",
	                        index:"ServicePort",
	                        align:"center",
	                        editable:true
	                    }, {
	                        name:"chap_status",
	                        index:"chap_status",
	                         align:"center",
	                        formatter:getService.formatter_chap_status
	                    }, {
	                        name:"serfHealth_status",
	                        index:"serfHealth_status",
	                         align:"center",
	                        formatter:getService.formatter_serfHealth_status
	                    }, {
	                        name:"role",
	                          align:"center",
	                           formatter:getService.formatter_role_status,
	                        index:"role"
	                    }, {
	                        name:"VIP",
	                          align:"center",
	                        index:"VIP"
	                    }, {
	                        name:"REPL_STATUS",
	                        index:"REPL_STATUS",
	                          align:"center",
	                        formatter:getService.formatter_repl_status
	                    }, {
	                        name:"REPL_ERR_COUNTER",
	                        index:"REPL_ERR_COUNTER",
	                          align:"center",
	                        formatter:getService.formatter_counter_status
	                    }, {
	                        name:"Output",
	                        index:"Output",
	                        align:"left"
	                    } ],
	                    rowNum:10,
	                    rowList:[ 10 ],
	                    pager:"#pjqgrid_db",
	                    sortname:"ServiceName",
	                    toolbarfilter:true,
	                    viewrecords:true,
	                    sortorder:"asc",
	                    editurl:"dummy.html",
	                    caption:"service info",
	                    multiselect:true,
	                    autowidth:true
	                });
	            } else {
	                jQuery("#jqgrid_db").setGridParam({
	                    data:afterArrayData,
	                    datatype:"local"
	                }).trigger("reloadGrid");
	            }
			}	
			setServiceJqgrid();
		}
		
		//db的切换日志
		function runJqgridDBSwitchFunction(){
			var getDB = new CsMath.Commons();
			var getHost = new HostMath.Commons();
			var urlArrayDBKey =["http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/log/" + globalObject.hostName + "/monitor-handlers?keys"];
			var getDataDBLogKey = getDB.getData(urlArrayDBKey);
			var urlArrayDBLogkey = [];
			for (var i = getDataDBLogKey[0].length - 1; i >= 0; i--) {
				var urlDBLogkey = "http://" +configObject.IP + "/v1/kv/" + getDataDBLogKey[0][i] + "?raw";
				urlArrayDBLogkey.push(urlDBLogkey);
			}
			var getDataDBLogValue = getDB.getText(urlArrayDBLogkey);
			var afterData = getHost.decode(getDataDBLogValue,"Switch");
			function setJqgridDBSwitchFunction(){
				if (globalObject.isSetJqgrid == 0) {
		                jQuery("#jqgrid_switch_monitor").jqGrid({
		                    data:afterData,
		                    datatype:"local",
		                    height:"auto",
		                    colNames:[ "Time", "Type", "Log" ],
		                    colModel:[ {
		                        name:"time",
		                        index:"time",
		                        align:"left",
		                        editable:true,
		                        sortable:false,
		                        width:30
		                    }, {
		                        name:"type",
		                        index:"type",
		                        align:"center",
		                        formatter:getHost.formatter_switch,
		                        sortable:false,
		                        width:20
		                    }, {
		                        name:"value",
		                        index:"value",
		                        align:"left",
		                        sortable:false
		                    } ],
		                    rowNum:10,
		                    rowList:[ 10 ],
		                    pager:"#pjqgrid_switch_monitor",
		                    toolbarfilter:true,
		                    viewrecords:true,
		                    sortorder:"asc",
		                    editurl:"dummy.html",
		                    caption:"db switch async log",
		                    multiselect:true,
		                    autowidth:true
		                });
	            } else {
	                jQuery("#jqgrid_switch").setGridParam({
	                    data:afterData,
	                    datatype:"local"
	                }).trigger("reloadGrid");
	            }
			}
			setJqgridDBSwitchFunction();
		}
		//runJqgridDBSwitchFunction();
		//db的mha的切换日志
		function runJqgridDBFailoverFunction(){
			var getDB = new CsMath.Commons();
			var getHost = new HostMath.Commons();
			var urlAllDataKey = ["http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/log/" + globalObject.hostName + "/mha-handlers?keys"];
			var getDataDBLogKey = getDB.getData(urlAllDataKey);
			var urlArrayDBLogkey = [];
			for (var i = getDataDBLogKey[0].length - 1; i >= 0; i--) {
				urlArrayDBLogkey.push("http://" +configObject.IP + "/v1/kv/" + getDataDBLogKey[0][i] + "?raw");
			}
			var getDataDBLogValue = getDB.getText(urlArrayDBLogkey);
			var afterData = getHost.decode(getDataDBLogValue,"SwitchMHA");
			function setJqgridDBFailoverFunction(){
				if (globalObject.isSetJqgrid == 0) {
		                jQuery("#jqgrid_switch_mha").jqGrid({
		                    data:afterData,
		                    datatype:"local",
		                    height:"auto",
		                    colNames:[ "Time", "Type", "Log" ],
		                    colModel:[ {
		                        name:"time",
		                        index:"time",
		                        align:"left",
		                        editable:true,
		                        sortable:false,
		                        width:30
		                    }, {
		                        name:"type",
		                        index:"type",
		                        align:"center",
		                        formatter:getHost.formatter_switch,
		                        sortable:false,
		                        width:20
		                    }, {
		                        name:"value",
		                        index:"value",
		                        align:"left",
		                        sortable:false
		                    } ],
		                    rowNum:10,
		                    rowList:[ 10 ],
		                    pager:"#pjqgrid_switch_mha",
		                    toolbarfilter:true,
		                    viewrecords:true,
		                    sortorder:"asc",
		                    editurl:"dummy.html",
		                    caption:"db failover log",
		                    multiselect:true,
		                    autowidth:true
		                });
	            } else {
	                jQuery("#jqgrid_switch_mha").setGridParam({
	                    data:afterData,
	                    datatype:"local"
	                }).trigger("reloadGrid");
	            }
			}
			setJqgridDBFailoverFunction();
		}
		//runJqgridDBFailoverFunction();
		//system的报告日志
		function runJqgridDBReportFunction(){
			var getDB = new CsMath.Commons();
			var urlAllDataKey = ["http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/chap/status/" + globalObject.hostName + "?raw"];
			var afterData = getDB.getData(urlAllDataKey).pop();
			function setJqgridDBReportFunction(){
						 if (globalObject.isSetJqgrid == 0) {
				                jQuery("#jqgrid_statistics_report").jqGrid({
				                    data:afterData,
				                    datatype:"local",
				                    height:"auto",
				                    colNames:[ "Name", "Q_cur", "Q_max", "Se_cur", "Se_max", "Se_limit", "Se_Total", "net_in", "net_out", "De_req", "De_resp", "err_req", "err_con", "err_resp", "Warn_retr", "Warn_redis", "status" ],
				                    colModel:[ {
				                        name:"name",
				                          align:"center",
				                        index:"name"
				                    }, {
				                        name:"Queue_cur",
				                       align:"center",
				                        index:"Queue_cur"
				                    }, {
				                        name:"Queue_max",
				                           align:"center",
				                        index:"Queue_max"
				                    }, {
				                        name:"Session_cur",
				                           align:"center",
				                        index:"Session_cur"
				                    }, {
				                        name:"Session_max",
				                           align:"center",
				                        index:"Session_max"
				                    }, {
				                        name:"Session_limit",
				                           align:"center",
				                        index:"Session_limit"
				                    }, {
				                        name:"Session_Total",
				                           align:"center",
				                        index:"Session_Total"
				                    }, {
				                        name:"net_input_Bytes",
				                           align:"center",
				                        index:"net_input_Bytes"
				                    }, {
				                        name:"net_output_Bytes",
				                           align:"center",
				                        index:"net_output_Bytes"
				                    }, {
				                        name:"Denied_req",
				                           align:"center",
				                        index:"Denied_req"
				                    }, {
				                        name:"Denied_resp",
				                           align:"center",
				                        index:"Denied_resp"
				                    }, {
				                        name:"error_req",
				                           align:"center",
				                        index:"error_req"
				                    }, {
				                        name:"error_con",
				                           align:"center",
				                        index:"error_con"
				                    }, {
				                        name:"error_resp",
				                           align:"center",
				                        index:"error_resp"
				                    }, {
				                        name:"Warnings_retr",
				                           align:"center",
				                        index:"Warnings_retr"
				                    }, {
				                        name:"Warnings_redis",
				                           align:"center",
				                        index:"Warnings_redis"
				                    }, {
				                        name:"status",
				                           align:"center",
				                        index:"status"
				                    } ],
				                    rowNum:10,
				                    rowList:[ 10 ],
				                    pager:"#pjqgrid_statistics_report",
				                    toolbarfilter:true,
				                    viewrecords:true,
				                    sortorder:"asc",
				                    editurl:"dummy.html",
				                    caption:"statistics Report",
				                    multiselect:true,
				                    autowidth:true
				                });
				            } else {
				                jQuery("#jqgrid_statistics_report").setGridParam({
				                    data:afterData,
				                    datatype:"local"
				                }).trigger("reloadGrid");
				            }
			}
			setJqgridDBReportFunction();
		}
		function getType() {
			runJqgridDBFunction();
	        if (globalObject.getTypeHost() == "db") {
	            runJqgridDBSwitchFunction();
	            runJqgridDBFailoverFunction();
	        } else {
	            runJqgridDBReportFunction();
	            
	        }
	    }
	    getType();
	}
	function setTime() {
	    runJqgridHostFunction();
	    globalObject.isSetJqgrid = 1;
	    globalObject.isTimer = setTimeout(setTime, configObject.FreshenTime);
	}
	return {
		setTime : setTime
	};
});


