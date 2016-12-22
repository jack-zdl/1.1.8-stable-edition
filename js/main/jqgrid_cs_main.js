/**
 * 这个是制作jqgrid_cs的页面的主函数
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-29 10:39:57
 * @version $1.1.7$
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
define(['jquery','CsMath','ServiceMath','WarnMath','jquery-ui', 'gridlocale', 'jqG'],function(jQuery,CsMath,ServiceMath,WarnMath){
	//建立jqgrid_cs页面的主函数
	function runJqgridCSFunction(){
		function runJqgridCS(){
			var urlConsul = ["http://" + configObject.IP + "/v1/catalog/service/consul"];
			var getCS = new CsMath.Commons();
			var getCSAllData = getCS.getData(urlConsul);//得到consul的大致信息
			/**
			 * 解析consul的大致信息获得每个consul名
			 * 求得每个consul的array
			 */
			var Node_cs =[];
			var urlArrayNode = [];
			if (getCSAllData[0].length > 0) {
                for (var i = 0; i < getCSAllData[0].length; i++) {
                    Node_cs.push(getCSAllData[0][i].Node);
                    urlArrayNode.push("http://" + configObject.IP + "/v1/health/node/" + getCSAllData[0][i].Node);
                }
            } else {
                    console.error("cmha_cs 没有数据");
            }
            var getNodeData = getCS.getData(urlArrayNode);//得到每个Node的具体信息
            /**可能会出问题----可能是公共函数
             * [for description]剔除ServiceID == "Statistics"的选项
             * @param  {[type]} var j             [description]
             */
            for (var j = getNodeData.length - 1; j >= 0; j--) {
            	for (var k = getNodeData[j].length - 1; k >= 0; k--) {
            		if(getNodeData[j][k].ServiceID == "Statistics"){
                            getNodeData[j].splice(k,1);
                    }
            	}
            }
            /**
             * [urlLeader description]获得consul中leader的IP
             * @type {Array}
             */
            var urlLeader = ["http://" + configObject.IP + "/v1/status/leader"];	 
            var getLeader = getCS.getData(urlLeader); 
            var getLeaderIp = getCS.getLeaderIp(getLeader[0]);
            /**
             * [changeData_cs description]整合数据将node的具体信息，整合到cs的大致信息去
             * @return {[type]} [description]
             */
            var afterAllCSData = [];
            var changeData_cs = function() {
            	getCSAllData;
            	getNodeData;
            	// var afterAllCSData = [];
	            try {
	                for (var a = 0; a < getCSAllData[0].length; a++) {
	                    for (var b = 0; b < getNodeData.length; b++) {
	                        if (getCSAllData[0][a].Node == getNodeData[b][0].Node) {
	                            var afterCSData = getCSAllData[0][a];
	                            var data_status_cs_aa = getNodeData[b][0].Status;
	                            var data_Output_cs_aa = getNodeData[b][0].Output;
	                            $(afterCSData).attr("Status", data_status_cs_aa);
	                            $(afterCSData).attr("Output", data_Output_cs_aa);
	                            $(afterCSData).attr("Role", getCS.isLeader(afterCSData.Address,getLeaderIp));//换回isleader
	                            afterAllCSData.push(afterCSData);
	                            continue;
	                        }
	                    }
	                }
	            } catch (error) {
	                console.error("错误信息名称  = " + error);
	            }
        	};
        	changeData_cs();
        	var setCSJqGrid = function() {
	           if (globalObject.isSetJqgrid == 0) {
	                jQuery("#jqgrid_cs").jqGrid({
	                    data:afterAllCSData,
	                    datatype:"local",
	                    height:"auto",
	                    colNames:[ "ServiceName", "Node", "ServiceAddress", "ServicePort", "Status", "Role", "Output" ],
	                    colModel:[ {
	                        name:"ServiceName",
	                        index:"ServiceName",
	                         align:"center",
	                        editable:true,
	                        sortable:false
	                    }, {
	                        name:"Node",
	                          align:"center",
	                        index:"Node"
	                    }, {
	                        name:"Address",
	                        index:"Address",
	                          align:"center",
	                        editable:true,
	                        sortable:false
	                    }, {
	                        name:"ServicePort",
	                        index:"ServicePort",
	                       align:"center",
	                        editable:true,
	                        sortable:false
	                    }, {
	                        name:"Status",
	                        index:"Status",
	                        align:"center",
	                        formatter:getCS.formatter_status,
	                        sortable:false
	                    }, {
	                        name:"Role",
	                        index:"Role",
	                         align:"center",
	                        sortable:false
	                    }, {
	                        name:"Output",
	                        index:"Output",
	                        align:"left",
	                        sortable:false
	                    } ],
	                    rowNum:10,
	                    rowList:[ 10 ],
	                    pager:"#pjqgrid_cs",
	                    sortname:"Node",
	                    toolbarfilter:true,
	                    viewrecords:true,
	                    sortorder:"asc",
	                    editurl:"dummy.html",
	                    caption:" cs info",
	                    multiselect:true,
	                    autowidth:true
	                });
	            } else {
	                jQuery("#jqgrid_cs").setGridParam({
	                    data:afterAllCSData,
	                    datatype:"local"
	                }).trigger("reloadGrid");
            	}
        	};
        	setCSJqGrid();
		}
		runJqgridCS();
		function runJqgridDBfunction(){
			/**
			 * [urlTotalService description]得到所有的服务名
			 * @type {Array}
			 */
			var urlTotalService = ["http://" + configObject.IP + "/v1/catalog/services"];
			var getDB = new CsMath.Commons();
			var getService = new ServiceMath.Commons();
			var getTotalServiceData = getDB.getData(urlTotalService);
			/**
			 * [for description]删除属性为Statistics consul，将有效地serviceName合并到数组中
			 * @param  {[type]} var k             in getAllServiceData[0] [description]
			 * @return {[type]}     [description]
			 */
			var arrayServiceName = [];
			for(var k in getTotalServiceData[0]){
				if(k == "Statistics" || k == "consul"){
					delete getTotalServiceData[0][k];
				}else{
					arrayServiceName.push(k);
				}
			}
			/**
			 * [urlArrayService description]得到所有service数据
			 * @type {Array}
			 */
			var urlArrayService = [];
			for (var i = arrayServiceName.length - 1; i >= 0; i--) {
				var urlService = "http://" + configObject.IP + "/v1/health/service/" + arrayServiceName[i];
				urlArrayService.push(urlService);
			}
			var getAllServiceData =  getDB.getData(urlArrayService);
			/**
			 * [urlArrayVipChap description]得到每个服务组的vip
			 * @type {Array}
			 */
			var urlArrayVipChap = [];
			for (var j = arrayServiceName.length - 1; j >= 0; j--) {
				var urlVipChap = "http://" + configObject.IP + "/v1/kv/cmha/service/" + arrayServiceName[j] + "/chap/VIP?raw";
				urlArrayVipChap.push(urlVipChap);
			}
			var getVIPChapData = getService.getText(urlArrayVipChap);
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
	                    var chap01_Output =getService.getOutput(data.Checks);
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
	                        index:"Node",
	                        align:"center",
	                        sortable:false
	                    }, {
	                        name:"type",
	                        index:"type",
	                        align:"center",
	                        sortable:false
	                    }, {
	                        name:"Address",
	                        index:"Address",
	                        align:"center",
	                        editable:true,
	                        sortable:false
	                    }, {
	                        name:"ServicePort",
	                        index:"ServicePort",
	                         align:"center",
	                        editable:true,
	                        sortable:false
	                    }, {
	                        name:"chap_status",
	                        index:"chap_status",
	                         align:"center",
	                        formatter:getService.formatter_chap_status,
	                        sortable:false
	                    }, {
	                        name:"serfHealth_status",
	                        index:"serfHealth_status",
	                        align:"center",
	                        formatter:getService.formatter_serfHealth_status,
	                        sortable:false
	                    }, {
	                        name:"role",
	                        index:"role",
	                          align:"center",
	                          formatter:getService.formatter_role_status,
	                        sortable:false
	                    }, {
	                        name:"VIP",
	                        index:"VIP",
	                          align:"center",
	                        sortable:false
	                    }, {
	                        name:"REPL_STATUS",
	                        index:"REPL_STATUS",
	                         align:"center",
	                        formatter:getService.formatter_repl_status,
	                        sortable:false
	                    }, {
	                        name:"REPL_ERR_COUNTER",
	                        index:"REPL_ERR_COUNTER",
	                         align:"center",
	                        formatter:getService.formatter_counter_status,
	                        sortable:false
	                    }, {
	                        name:"Output",
	                        index:"Output",
	                        align:"left",
	                        sortable:false
	                    } ],
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
		runJqgridDBfunction();
		function runJqgridWarnFunction(){
				var urlWarn = ["http://" + configObject.IP + "/v1/kv/cmha/service/" + "CS/alerts/alerts_counter?keys"];
				var getWarn = new WarnMath.Commons();
				var urlArrayWarnKey = getWarn.getData(urlWarn);
				var urlArrayWarn = [];
				for (var i = urlArrayWarnKey[0].length - 1; i >= 0; i--) {
					urlArrayWarn.push("http://" + configObject.IP + "/v1/kv/" + urlArrayWarnKey[0][i] + "?raw");
				}
				var urlArrayWarnValue = getWarn.getText(urlArrayWarn);
				var afterDataWarn = getWarn.changeData(urlArrayWarnValue);
				function setJqgridWarn(){
					if (globalObject.isSetJqgrid == 0) {
		                jQuery("#jqgrid_warning").jqGrid({
		                    data:afterDataWarn,
		                    datatype:"local",
		                    height:"auto",
		                    colNames:[ "Time", "Type", "ServiceName", "Log" ],
		                    colModel:[ {
		                        name:"timeOW",
		                        index:"timeOW",
		                        align:"center",
		                        editable:true,
		                        width:30
		                    }, {
		                        name:"typeOW",
		                        index:"typeOW",
		                        align:"center",
		                        sortable:false,
		                        width:20
		                    }, {
		                        name:"serviceOW",
		                        index:"serviceOW",
		                        align:"center",
		                        sortable:false,
		                        width:20
		                    }, {
		                        name:"valueOW",
		                        index:"valueOW",
		                        align:"left",
		                        sortable:false
		                    } ],
		                    rowNum:10,
		                    rowList:[ 10 ],
		                    pager:"#pjqgrid_warning",
		                    sortname:"timeOW",
		                    toolbarfilter:true,
		                    viewrecords:true,
		                    sortorder:"asc",
		                    editurl:"dummy.html",
		                    caption:"cs alerts info",
		                    multiselect:true,
		                    autowidth:true
		                });
            		} else {
		                jQuery("#jqgrid_warning").setGridParam({
		                    data:afterDataWarn,
		                    datatype:"local"
		                }).trigger("reloadGrid");
		            }
				}
				setJqgridWarn();
		}
		runJqgridWarnFunction();
	}
	function setTime(){
		runJqgridCSFunction();
		globalObject.isSetJqgrid = 1;
		globalObject.isTimer = setTimeout(setTime,configObject.FreshenTime);
	}
	return {
		setTime  : setTime
	};
});

