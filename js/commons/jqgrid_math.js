require.config({
	paths:{
		"jquery":"lib/jquery"
	}
});
define(['jquery'],function ($) {
	function SetDataFunction(){
		var ncpu = 0;
		this.changeNcpu= function(obj_ncpu){
			return ncpu=obj_ncpu;
		};
		this.setData = function(obj_array_url) {  //获得db的数据，根据url数组，得到数组数据
		//	var keys = [];
			var values = [];
			//var getDataOfValues = function() {
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
			//	};
			//getDataOfValues();
			return values;
		};
		this.changeData =function(obj_array_values,obj_int_datagrid,obj_time){
			var values = [];
			var sys_values = [],
				db_values = [],
				after_values = {},
				//after_values = null,
				ncpu=0,
				time=999;
			for (var i = 0; i < obj_array_values.length; i++) {
				var endTime = obj_array_values[i].sys.time;
				endTime = endTime.replace(/\-/g, '/');
				var date_values = new Date(endTime);
				var time_values = (date_values).getTime();
				if (obj_int_datagrid == 0) {  //判断是否是第一次建表
					var after_time = globalObject.getDate(endTime);
					obj_array_values[i].sys.time = after_time;
					obj_array_values[i].db.time = after_time;
					// after_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
					// ncpu = obj_array_values[i].sys.ncpu;
					sys_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
					ncpu = obj_array_values[i].sys.ncpu;
					//db_values.push(obj_array_values[i].db);
					//db_values.push(obj_array_values[i].db);
					time = time_values;
				} else {
					if (time_values > obj_time) {
						var after_time = globalObject.getDate(endTime);
						obj_array_values[i].sys.time = after_time;
						obj_array_values[i].db.time = after_time;
						// after_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
						// ncpu = obj_array_values[i].sys.ncpu;
						sys_values = $.extend({}, obj_array_values[i].sys, obj_array_values[i].db);
						ncpu = obj_array_values[i].sys.ncpu;
						//db_values.push(obj_array_values[i].db);
					//	db_values.push(obj_array_values[i].db);
						time = time_values;
					}else{
						time=time_values;
					}
				}
			}
			after_values = sys_values;
			//after_values.db = db_values;
			after_object = {};
			after_object["after_values"]= after_values;
			after_object["time"]=time;
			after_object["ncpu"]=ncpu;
			return	after_object;
		};
		this.formatter_system_time_color=function(cellvalue, options, rowObject) {
					return '<span style="color:yellow;" >' + cellvalue + "</span>";
		};
		this.formatter_system_one_color = function(cellvalue, options, rowObject) {
					if (rowObject.one_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_two_color = function(cellvalue, options, rowObject) {
					if (rowObject.five_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_three_color = function(cellvalue, options, rowObject) {
					if (rowObject.fifteen_m > ncpu) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_usr_color = function(cellvalue, options, rowObject) {
					if (rowObject.usr > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
		};
		this.formatter_system_sys_color = function(cellvalue, options, rowObject) {
					if (rowObject.sys > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_iow_color = function(cellvalue, options, rowObject) {
					if (rowObject.iow > 10) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
		};
		this.formatter_system_si_color = function(cellvalue, options, rowObject) {
					if (rowObject.si > 0) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_so_color = function(cellvalue, options, rowObject) {
					if (rowObject.so > 0) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_recv_color = function(cellvalue, options, rowObject) {
					if (rowObject.recv.indexOf("MB") != -1) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
		};
		this.formatter_system_send_color = function(cellvalue, options, rowObject) {
					if (rowObject.send.indexOf("MB") != -1) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
		};
		this.formatter_system_rkb_color = function(cellvalue, options, rowObject) {
					if (rowObject.rkB_s > 1024) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_wkb_color = function(cellvalue, options, rowObject) {
					if (rowObject.wkB_s > 1024) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_await_color = function(cellvalue, options, rowObject) {
					if (rowObject.await > 5) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_svctm_color = function(cellvalue, options, rowObject) {
					if (rowObject.svctm > 5) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  >' + cellvalue + "</span>";
					}
		};
		this.formatter_system_util_color = function(cellvalue, options, rowObject) {
					if (rowObject.util > 80) {
						return '<span style="color:red;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:#00CC00;">' + cellvalue + "</span>";
					}
		};
		this.formatter_system_qps_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
		};
		this.formatter_system_tps_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
		};
		this.formatter_system_hit_color = function(cellvalue, options, rowObject) {
					if (rowObject.hit > 99) {
						return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
					} else {
						return '<span  style="color:red;">' + cellvalue + "</span>";
					}
		};
		this.formatter_system_run_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
		};
		this.formatter_system_con_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
		};
		this.formatter_system_cre_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
		};
		this.formatter_system_cac_color = function(cellvalue, options, rowObject) {
					return '<span style="color:#00CC00;" >' + cellvalue + "</span>";
		};
	}
	return {
		SetDataFunction : SetDataFunction
	};
});