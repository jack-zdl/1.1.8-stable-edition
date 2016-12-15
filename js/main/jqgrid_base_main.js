/**
 * 
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-30 15:23:36
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
	function runJqgridBaseFunction(){
		function runJqgridDBfunction(){
			var getDB = new CsMath.Commons();
			var getService = new ServiceMath.Commons();
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
			var getAllServiceData =  getDB.getData(urlArrayService);
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
		runJqgridDBfunction();
		function runJqgridWarnFunction(){
			var urlWarn = ["http://" + configObject.IP + "/v1/kv/cmha/service/"  + globalObject.serviceName + "/alerts/alerts_counter?keys"];
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
			                        align:"left",
			                        editable:true,
			                        sortable:true,
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
			                    sortorder:"desc",
			                    editurl:"dummy.html",
			                    caption:"service alerts info",
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
		runJqgridBaseFunction();
		globalObject.isSetJqgrid = 1;
		globalObject.isTimer = setTimeout(setTime,configObject.FreshenTime);
	}
	return {
		setTime :setTime
	};
});
