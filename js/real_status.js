
var JQGridData = 0;             /*全局变量*/
var iiiiiii=0;
function real_status_grid_system() {
var ncpu = 0;
	var int_datagrid = 0;
	var aaaassssaaa;
	var HostInterval = function() {
 console.log("表格定时器-------开始"+iiiiiii+"=="+aaaassssaaa);

			aaaassssaaa = setInterval(run_real_status_system, 800);
		};
	stopclearInterval = function() {
		
		clearInterval(aaaassssaaa);
	};
	var time = 9999; //全局变量，判断第二次建表
	after_sys_real_status_values = [];
	var getData = function(obj_array_url) {
			var keys = [];
			var values = [];
			var getDataOfValues = function() {
					for (var i = obj_array_url.length - 1; i >= 0; i--) {
						$.ajax({
							url: obj_array_url[i],
							method: "get",
							async: false,
							dataType: "json",
							success: function(result, status, xhr) {
								values.push(result[0]);
							},
							error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
							console.error("getDataOfValues 状态 ="+status);
							}
						})
					}
				};
			getDataOfValues();
			return values;
		};
	var changeData = function(obj_array_values) {
			var values = [];
			var sys_values = [],
				db_values = [],
				after_values = {};
			for (var i = 0; i < obj_array_values.length; i++) {
				var endTime = obj_array_values[i].sys.time;
				endTime = endTime.replace(/\-/g, '/');
				var date_values = new Date(endTime);
				var time_values = (date_values).getTime();
				if (int_datagrid == 0) {  //判断是否是第一次建表
					var after_time = getDate(endTime);
					obj_array_values[i].sys.time = after_time;
					obj_array_values[i].db.time = after_time;
					sys_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
					ncpu = obj_array_values[i].sys.ncpu;
					
					db_values.push(obj_array_values[i].db);
					time = time_values;
				} else {
					if (time_values > time) {
						var after_time = getDate(endTime);
						obj_array_values[i].sys.time = after_time;
						obj_array_values[i].db.time = after_time;
						sys_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
						ncpu = obj_array_values[i].sys.ncpu;
						db_values.push(obj_array_values[i].db);
						time = time_values;
					}
				}
			}
			after_values.sys = sys_values;
			after_values.db = db_values;
			return after_values;
		};
	var run_real_status_system = function() {

		 var date = new Date();
		 console.log("表格定时器"+iiiiiii+date+"==");
		 iiiiiii++;
			var url_keys_a = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/real_status/" + hostName + "/1?raw";
			var url_array = [];
			url_array.push(url_keys_a);
			var real_status_values = getData(url_array);
			var after_real_status_values = [];
			after_real_status_values = changeData(real_status_values);
			after_sys_real_status_values = after_sys_real_status_values.concat(after_real_status_values.sys);
		

			var   real_status_system_data = new Date();

			if (after_sys_real_status_values.length > 100) {
				after_sys_real_status_values.shift();
			}
			var formatter_system_time_color = function(cellvalue, options, rowObject) {
					return '<span style="color:yellow;" >' + cellvalue + "</span>";
				};
			var formatter_system_one_color = function(cellvalue, options, rowObject) {
					
					if (rowObject.one_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_two_color = function(cellvalue, options, rowObject) {
					if (rowObject.five_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_three_color = function(cellvalue, options, rowObject) {
					if (rowObject.fifteen_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_usr_color = function(cellvalue, options, rowObject) {
					if (rowObject.usr > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_sys_color = function(cellvalue, options, rowObject) {
					if (rowObject.sys > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_iow_color = function(cellvalue, options, rowObject) {
					if (rowObject.iow > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_si_color = function(cellvalue, options, rowObject) {
					if (rowObject.si > 0) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_so_color = function(cellvalue, options, rowObject) {
					if (rowObject.so > 0) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_recv_color = function(cellvalue, options, rowObject) {
					if (rowObject.recv.indexOf("MB") != -1) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_send_color = function(cellvalue, options, rowObject) {
					if (rowObject.send.indexOf("MB") != -1) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_rkb_color = function(cellvalue, options, rowObject) {
					if (rowObject.rkB_s > 1024) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_wkb_color = function(cellvalue, options, rowObject) {
					if (rowObject.wkB_s > 1024) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_await_color = function(cellvalue, options, rowObject) {
					if (rowObject.await > 5) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
					}
				};
			var formatter_system_svctm_color = function(cellvalue, options, rowObject) {
					if (rowObject.svctm > 5) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_util_color = function(cellvalue, options, rowObject) {
					if (rowObject.util > 80) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			if (JQGridData == 0) {
				if (int_data == 0) {
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
							formatter: formatter_system_time_color
						}, {
							name: "one_m",
							index: "one_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_one_color
						}, {
							name: "five_m",
							index: "five_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_two_color
						}, {
							name: "fifteen_m",
							index: "fifteen_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_three_color
						}, {
							name: "usr",
							index: "usr",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_usr_color
						}, {
							name: "sys",
							index: "sys",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_sys_color
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
							formatter: formatter_system_iow_color
						}, {
							name: "si",
							index: "si",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_si_color
						}, {
							name: "so",
							index: "so",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_so_color
						}, {
							name: "recv",
							index: "recv",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_recv_color
						}, {
							name: "send",
							index: "send",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_send_color
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
							formatter: formatter_system_wkb_color
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
							formatter: formatter_system_await_color
						}, {
							name: "svctm",
							index: "svctm",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_svctm_color
						}, {
							name: "util",
							index: "util",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_util_color
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
		};
	run_real_status_system();
	int_data = 1;
	int_datagrid = 1;
	HostInterval();
}




function real_status_grid_db() {
	var ncpu = 0;  //全局变量----来显示是否为红色
	var int_datagrid = 0;
	var aaaassssaaa;
var	HostInterval = function() {
			aaaassssaaa = setInterval(run_real_status_data, 800);
		};
	stopclearInterval = function() {
			
		clearInterval(aaaassssaaa);
	};
	var time = 9999;
	after_sys_real_status_values = [];
	var getData = function(obj_array_url) {
			var keys = [];
			var values = [];
			var getDataOfValues = function() {
					for (var i = obj_array_url.length - 1; i >= 0; i--) {
						$.ajax({
							url: obj_array_url[i],
							method: "get",
							async: false,
							dataType: "json",
							success: function(result, status, xhr) {
								values.push(result[0]);
							},
							error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
								console.error("getDataOfValues 状态 ="+status);
							}
						});
					}
				};
			getDataOfValues();
			return values;
		};
	var changeData = function(obj_array_values) {
			var values = [];
			var sys_values = [],
				db_values = [],
				after_values = {};
			for (var i = 0; i < obj_array_values.length; i++) {
				var endTime = obj_array_values[i].sys.time;
				endTime = endTime.replace(/\-/g, '/');
				var date_values = new Date(endTime);
				var time_values = (date_values).getTime();
				if (int_datagrid == 0) {
					var after_time = getDate(endTime);
					obj_array_values[i].sys.time = after_time;
					obj_array_values[i].db.time = after_time;
					sys_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
					ncpu = obj_array_values[i].sys.ncpu;
					db_values.push(obj_array_values[i].db);
					time = time_values;
				} else {
					if (time_values > time) {
						var after_time = getDate(endTime);
						obj_array_values[i].sys.time = after_time;
						obj_array_values[i].db.time = after_time;
						sys_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
						ncpu = obj_array_values[i].sys.ncpu;
						db_values.push(obj_array_values[i].db);
						time = time_values;
					}
				}
			}
			after_values.sys = sys_values;
			after_values.db = db_values;
			return after_values;
		};
	var run_real_status_data = function() {
			var url_keys_a = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/real_status/" + hostName + "/1?raw";
			var url_array = [];
			url_array.push(url_keys_a);
			var real_status_values = getData(url_array);
			var after_real_status_values = [];
			after_real_status_values = changeData(real_status_values);
			after_sys_real_status_values = after_sys_real_status_values.concat(after_real_status_values.sys);
			
			var   real_status_data = new Date();
			console.info("host_status执行="+real_status_data);
			
			if (after_sys_real_status_values.length > 100) {
				after_sys_real_status_values.shift();
			}
			var formatter_system_time_color = function(cellvalue, options, rowObject) {
					return '<span style="color:yellow;" >' + cellvalue + "</span>";
				};
			var formatter_system_one_color = function(cellvalue, options, rowObject) {
					if (rowObject.one_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_two_color = function(cellvalue, options, rowObject) {
					if (rowObject.five_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_three_color = function(cellvalue, options, rowObject) {
					if (rowObject.fifteen_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_usr_color = function(cellvalue, options, rowObject) {
					if (rowObject.usr > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_sys_color = function(cellvalue, options, rowObject) {
					if (rowObject.sys > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_iow_color = function(cellvalue, options, rowObject) {
					if (rowObject.iow > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_si_color = function(cellvalue, options, rowObject) {
					if (rowObject.si > 0) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_so_color = function(cellvalue, options, rowObject) {
					if (rowObject.so > 0) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_recv_color = function(cellvalue, options, rowObject) {
					if (rowObject.recv.indexOf("MB") != -1) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_send_color = function(cellvalue, options, rowObject) {
					if (rowObject.send.indexOf("MB") != -1) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_rkb_color = function(cellvalue, options, rowObject) {
					if (rowObject.rkB_s > 1024) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_wkb_color = function(cellvalue, options, rowObject) {
					if (rowObject.wkB_s > 1024) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_await_color = function(cellvalue, options, rowObject) {
					if (rowObject.await > 5) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
					}
				};
			var formatter_system_svctm_color = function(cellvalue, options, rowObject) {
					if (rowObject.svctm > 5) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
				};
			var formatter_system_util_color = function(cellvalue, options, rowObject) {
					if (rowObject.util > 80) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_qps_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
				};
			var formatter_system_tps_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
				};
			var formatter_system_hit_color = function(cellvalue, options, rowObject) {
					if (rowObject.hit > 99) {
						return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:red;">' + cellvalue + "</span>";
					}
				};
			var formatter_system_run_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
				};
			var formatter_system_con_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
				};
			var formatter_system_cre_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
				};
			var formatter_system_cac_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
				};
			if (JQGridData == 0) {
				if (int_data == 0) {
					
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
							formatter: formatter_system_time_color
						}, {
							name: "one_m",
							index: "one_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_one_color
						}, {
							name: "five_m",
							index: "five_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_two_color
						}, {
							name: "fifteen_m",
							index: "fifteen_m",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_three_color
						}, {
							name: "usr",
							index: "usr",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_usr_color
						}, {
							name: "sys",
							index: "sys",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_sys_color
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
							formatter: formatter_system_iow_color
						}, {
							name: "si",
							index: "si",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_si_color
						}, {
							name: "so",
							index: "so",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_so_color
						}, {
							name: "recv",
							index: "recv",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_recv_color
						}, {
							name: "send",
							index: "send",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_send_color
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
							formatter: formatter_system_wkb_color
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
							formatter: formatter_system_await_color
						}, {
							name: "svctm",
							index: "svctm",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_svctm_color
						}, {
							name: "util",
							index: "util",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_util_color
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
							formatter: formatter_system_qps_color
						}, {
							name: "tps",
							index: "tps",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_tps_color
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
							formatter: formatter_system_hit_color
						}, {
							name: "run",
							index: "run",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_run_color
						}, {
							name: "con",
							index: "con",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_con_color
						}, {
							name: "cre",
							index: "cre",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_cre_color
						}, {
							name: "cac",
							index: "cac",
							classes: 'hostTableColor',
							align: "center",
							sortable: false,
							formatter: formatter_system_cac_color
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
		};
	run_real_status_data();
	int_data = 1;
	int_datagrid = 1;
	HostInterval();
}
var getHostName = function() {
		var arrayName = document.cookie.split(";");
		for (var a = 0; a < arrayName.length; a++) {
			if (arrayName[a].indexOf("hostName") != -1) {
				hostName = arrayName[a].split("=")[1];
				break;
			}
		}
		for (var b = 0; b < arrayName.length; b++) {
			if (arrayName[b].indexOf("serviceName") != -1) {
				serviceName = arrayName[b].split("=")[1];
				break;
			}
		}
	};
$("#showServiceName").html(serviceName);
$("#showHostName").html(hostName);
var typeHost = {};
var getTypeHost = function() {
		getHostName();
		$.ajax({
			url: "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/type/" + hostName + "?raw",
			method: "get",
			async: false,
			dataType: "json",
			success: function(result, status, xhr) {
				typeHost = result;
			},
			error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
				
			}
		});
		//  if(kaiguan_cs != 0){
   
  //  			clearInterval(cstimeSetTimeout);
  //  			if (kaiguan == 0) {
				
		// 		kaiguan++;
		// 	} else {
				
			
			
		// 	stopclearInterval();
		// 	}

 	// 	}else{
 	// 		if (kaiguan == 0) {
			
		// 	kaiguan++;
		// } else {
			
			
			
		// 	stopclearInterval();
		// }
    		
 	// 	}

		$.ajaxSetup ({
    	// Disable caching of AJAX responses */
   		 cache: false
		});
		switch (typeHost.type) {
		case "db":
			int_data = 0;
			typeIntHost = 0;
			
			real_status_grid_db();
			break;
		case "chap":
			int_data = 0;
			typeIntHost = 1;
			real_status_grid_system();
			break;
		case "cs":
			int_data = 0;
			typeIntHost = 1;
			real_status_grid_system();
			break;
		default:
			break;
		}
	};
getTypeHost();
	var chengeDataStart = function () {
  		JQGridData = 0;
	};
	var chengeDataStop = function () {
  		JQGridData = 1;
	};
