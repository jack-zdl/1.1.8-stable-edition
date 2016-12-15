require.config({
	paths: {
		"jquery": "lib/jquery",
		"JQmath": "commons/jqgrid_math",
		"gridlocale": "lib/grid.locale-zh_CN",
		"jqG": "lib/jquery.jqGrid.min",
		"jquery-ui": "lib/jquery-ui-1.10.3.min"
	},
	shim: {　　　　
		'grid_locale': {
			deps: ['jquery'],
			　　　　　　exports: 'grid_locale'　　　　
		},
		'jquery-ui': {
			deps: ['jquery'],
			exports: 'jquery-ui'
		},
		'jqG': {
			deps: ['jquery'],
			exports: 'jqG'
		}　　
	}
});
define(['jquery','JQmath', 'gridlocale', 'jqG', 'jquery-ui'], function(jQuery,JQmath, gridlocale) {
	//这个是系统的变量
	var after_sys_real_status_values = [],//表格数据数组
		int_grid = 0,//判断是否二次处理数据
	//	globalObject.isSetJqgrid = 0,//判断是否二次添加表格
		ncpu = 0,//变量--显示红色
		firstTime = 999,//起始时间
		JQGridData = 0;//判断是否停止表格
		function Init(){
			after_sys_real_status_values = [];//表格数据数组
			int_grid = 0;//判断是否二次处理数据
			globalObject.isSetJqgrid = 0;//判断是否二次添加表格
			ncpu = 0;//变量--显示红色
			firstTime = 999;//起始时间
			JQGridData = 0;//判断是否停止表格
		}
		// $("#startHost").click(function(){
		// 	debugger;
		// 		JQGridData = 0;
		// });
		// $("#stopHost").click(function(){
		// 	debugger;
		// 		JQGridData = 1;
		// });
	function runJqgridFunction() {
		jQuery("#showServiceName").html(globalObject.serviceName);
		jQuery("#showHostName").html(globalObject.hostName);

		$("#startHost").click(function(){
			debugger;
			JQGridData = 0;
		});
		$("#stopHost").click(function(){
			debugger;
			JQGridData = 1;
		});


		//获得主机名的类型。分为DB和系统类型
		 var hostType  = globalObject.getTypeHost();
		 after_sys_real_status_values = [];
			switch (hostType) { //根据类型来判定展示哪个表格，Db或系统表格
				case "db":
					Init();
					typeIntHost = 0;
					setRealDB();
					break;
				case "system":
					Init();
					typeIntHost = 1;
					setRealSystem();
					break;
				default:
					break;
			}
		function setRealSystem() {
			//var ncpu=0;//全局变量----来显示是否为红色
			var url_keys_a = "http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/real_status/" + globalObject.hostName + "/1?raw";
			var url_array = [url_keys_a];
			//url_array.push(url_keys_a);
			var getDataFunction = new JQmath.SetDataFunction();
			var getData = getDataFunction.setData(url_array); //得到数据
			var after_real_status_values = getDataFunction.changeData(getData, int_grid, firstTime);
			ncpu = after_real_status_values.ncpu;
			getDataFunction.changeNcpu(ncpu);
			firstTime = after_real_status_values.time;
			after_sys_real_status_values = after_sys_real_status_values.concat(after_real_status_values.after_values);
			//设定表格长度100条
			if (after_sys_real_status_values.length > 100) {
				after_sys_real_status_values.shift();
			}
			if (JQGridData == 0) {
				if (globalObject.isSetJqgrid == 0) {
					jQuery("#jqgrid_system").jqGrid({
						data: after_sys_real_status_values,
						datatype: "local",
						height: "auto",
						colNames: ["time", "1m", "5m", "15m", "usr", "sys", "idle", "iow", "si", "so", "recv", "send", "r/s", "w/s", "rkB/s", "wkB/s", "queue", "await", "svctm", "%util"],
						colModel: [{
							name: "time",
							index: "time",
							classes: 'hostTableColor',
							width: 190,
							align: "center",
							formatter: getDataFunction.formatter_system_time_color
						}, {
							name: "one_m",
							index: "one_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_one_color
						}, {
							name: "five_m",
							index: "five_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_two_color
						}, {
							name: "fifteen_m",
							index: "fifteen_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_three_color
						}, {
							name: "usr",
							index: "usr",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_usr_color
						}, {
							name: "sys",
							index: "sys",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_sys_color
						}, {
							name: "idle",
							index: "idle",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "iow",
							index: "iow",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_iow_color
						}, {
							name: "si",
							index: "si",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_si_color
						}, {
							name: "so",
							index: "so",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_so_color
						}, {
							name: "recv",
							index: "recv",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_recv_color
						}, {
							name: "send",
							index: "send",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_send_color
						}, {
							name: "r_s",
							index: "r_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "w_s",
							index: "w_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "rkB_s",
							index: "rkB_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "wkB_s",
							index: "wkB_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_wkb_color
						}, {
							name: "queue",
							index: "queue",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "await",
							index: "await",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_await_color
						}, {
							name: "svctm",
							index: "svctm",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_svctm_color
						}, {
							name: "util",
							index: "util",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_util_color
						}],
						rowNum: 1000000000000000000,
						width: 1335,
						rowList: [10, 20, 30],
						pager: "#pjqgrid_system",
						sortname: "time",
						viewrecords: true,
						sortorder: "asc",
						jsonReader: {
							repeatitems: false
						},
						caption: " sys realtime status",
						height: "100%"
					});
					jQuery("#jqgrid_system").jqGrid("setGroupHeaders", {
						useColSpanStyle: false,
						groupHeaders: [{
							startColumnName: "time",
							numberOfColumns: 1,
							titleText: "id"
						}, {
							startColumnName: "one_m",
							numberOfColumns: 3,
							titleText: "load-avg"
						}, {
							startColumnName: "usr",
							numberOfColumns: 4,
							titleText: "cpu-usage"
						}, {
							startColumnName: "si",
							numberOfColumns: 2,
							titleText: "swap"
						}, {
							startColumnName: "recv",
							numberOfColumns: 2,
							titleText: "net"
						}, {
							startColumnName: "r_s",
							numberOfColumns: 8,
							titleText: "io-usage"
						}]
					});
				} else {
					jQuery("#jqgrid_system").setGridParam({
						data: after_sys_real_status_values,
						datatype: "local"
					}).trigger("reloadGrid");
				}
			}
			globalObject.isSetJqgrid = 1;
			int_grid = 1;
			console.log(" system realtime_status定时器");
			globalObject.isTimer=setTimeout(setRealSystem, 800);
		}
		function setRealDB(){
			var url_keys_a = "http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/real_status/" + globalObject.hostName + "/1?raw";
			var url_array = [url_keys_a];
			var getDataFunction = new JQmath.SetDataFunction();
			var getData = getDataFunction.setData(url_array); //得到数据
			var after_real_status_values = getDataFunction.changeData(getData, int_grid, firstTime);
			ncpu = after_real_status_values.ncpu;
			getDataFunction.changeNcpu(ncpu);
			firstTime = after_real_status_values.time;
			var array_after_real_status_values = [];
			array_after_real_status_values.push(after_real_status_values.after_values);
			after_sys_real_status_values = after_sys_real_status_values.concat(after_real_status_values.after_values);
			//设定表格长度100条
			if (after_sys_real_status_values.length > 100) {
				after_sys_real_status_values.shift();
			}
			if (JQGridData == 0) {
				if (globalObject.isSetJqgrid == 0) {
					jQuery("#jqgrid_host_db").jqGrid({
						data: after_sys_real_status_values,
						datatype: "local",
						height: "auto",
						colNames: ["time", "1m", "5m", "15m", "usr", "sys", "idle", "iow", "si", "so", "recv", "send", "r/s", "w/s", "rkB/s", "wkB/s", "queue", "await", "svctm", "%util", "ins", "upd", "del", "sel", "qps", "tps", "lor", "hit", "run", "con", "cre", "cac"],
						colModel: [{
							name: "time",
							index: "time",
							classes: 'hostTableColor',
							width: 190,
							align: "center",
							formatter: getDataFunction.formatter_system_time_color
						}, {
							name: "one_m",
							index: "one_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_one_color
						}, {
							name: "five_m",
							index: "five_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_two_color
						}, {
							name: "fifteen_m",
							index: "fifteen_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_three_color
						}, {
							name: "usr",
							index: "usr",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_usr_color
						}, {
							name: "sys",
							index: "sys",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_sys_color
						}, {
							name: "idle",
							index: "idle",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "iow",
							index: "iow",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_iow_color
						}, {
							name: "si",
							index: "si",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_si_color
						}, {
							name: "so",
							index: "so",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_so_color
						}, {
							name: "recv",
							index: "recv",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_recv_color
						}, {
							name: "send",
							index: "send",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_send_color
						}, {
							name: "r_s",
							index: "r_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "w_s",
							index: "w_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "rkB_s",
							index: "rkB_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "wkB_s",
							index: "wkB_s",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_wkb_color
						}, {
							name: "queue",
							index: "queue",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "await",
							index: "await",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_await_color
						}, {
							name: "svctm",
							index: "svctm",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_svctm_color
						}, {
							name: "util",
							index: "util",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_util_color
						}, {
							name: "ins",
							index: "ins",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "upd",
							index: "upd",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "del",
							index: "del",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "sel",
							index: "sel",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "qps",
							index: "qps",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_qps_color
						}, {
							name: "tps",
							index: "tps",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_tps_color
						}, {
							name: "lor",
							index: "lor",
							classes: 'hostTableColor',
							align: "center",
							sortable: false
						}, {
							name: "hit",
							index: "hit",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_hit_color
						}, {
							name: "run",
							index: "run",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_run_color
						}, {
							name: "con",
							index: "con",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_con_color
						}, {
							name: "cre",
							index: "cre",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_cre_color
						}, {
							name: "cac",
							index: "cac",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: getDataFunction.formatter_system_cac_color
						}],
						rowNum: 1000000000000000000,
						width: 1335,
						rowList: [10, 20, 30],
						pager: "#pjqgrid_host_db",
						sortname: "time",
						viewrecords: true,
						sortorder: "asc",
						jsonReader: {
							repeatitems: false
						},
						caption: " sys real status",
						height: "100%"
					});
					jQuery("#jqgrid_host_db").jqGrid("setGroupHeaders", {
						useColSpanStyle: false,
						groupHeaders: [{
							startColumnName: "time",
							numberOfColumns: 1,
							titleText: "id"
						}, {
							startColumnName: "one_m",
							numberOfColumns: 3,
							titleText: "load-avg"
						}, {
							startColumnName: "usr",
							numberOfColumns: 4,
							titleText: "cpu-usage"
						}, {
							startColumnName: "si",
							numberOfColumns: 2,
							titleText: "swap"
						}, {
							startColumnName: "recv",
							numberOfColumns: 2,
							titleText: "net"
						}, {
							startColumnName: "r_s",
							numberOfColumns: 8,
							titleText: "io-usage"
						}, {
							startColumnName: "ins",
							numberOfColumns: 4,
							titleText: "com"
						}, {
							startColumnName: "qps",
							numberOfColumns: 1,
							titleText: "QPS"
						}, {
							startColumnName: "tps",
							numberOfColumns: 1,
							titleText: "TPS"
						}, {
							startColumnName: "lor",
							numberOfColumns: 2,
							titleText: "Hit%"
						}, {
							startColumnName: "run",
							numberOfColumns: 4,
							titleText: "threads"
						}]
					});
				} else {
					jQuery("#jqgrid_host_db").setGridParam({
						data: after_sys_real_status_values,
						datatype: "local"
					}).trigger("reloadGrid");
				}
			}
			globalObject.isSetJqgrid = 1;
			int_grid = 1;
			console.log("db realtime_status定时器");
			globalObject.isTimer=setTimeout(setRealDB, 800);
		}
	}
//	runJqgridFunction();
	return {
		runJqgridFunction : runJqgridFunction
	};
});