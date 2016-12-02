/**
 * [graph_db_main  graph_db页面主js]采用Dygraphs技术建立折线图，采用highcharts建立圆饼图
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-24 13:07:39
 * @version $1.1.7_graph_db.01$
 */
require.config({
	paths:{
		"jquery" : "lib/jquery",
		"math"	:"commons/graph_math",
		"Dygraph":"lib/Dygraphs",
		"highcharts":"lib/highcharts",
		"list"	: "commons/graph_list",
		"set":"commons/graph_set",
		"allKeyFun":"commons/allKey"
	},
	shim: {
　　　　'Dygraph':{
　　　　　　exports: 'Dygraph'
　　　　},
		'highcharts':{
			deps: ['jquery'],
			exports :'highcharts'
		}
　　}
});
define(['math','jquery','Dygraph',"highcharts",'list','set','allKeyFun'],function (math,$,Dygraph,highcharts,list,set,allKeyFun) {
	var array = {
					"netkey":{
						"Name":["eth0"],
						"Title":["eth0"],
						"Graph":["Graph_net_Bytes","Graph_net_packets"],
						"InKey":["net_Bytes","net_packets"], //以它的数目来循环netGraph
						"OutKey":["Graph_net"]
						},
					"diskkey":{
						"Name":["dm-0"],
						"Title":["/"],
						"Graph":["Graph_disk_Throughput", "Graph_disk_await",  "Graph_disk_iops",
									"Graph_disk_queue","Graph_disk_svctm", "Graph_disk_util"],
						"InKey":["disk_rkB_s",
									"disk_await",
									"disk_r_s",
									"disk_queue",
									"disk_svctm",
									"disk_util"
									],
						"OutKey":["Graph_disk"]
							}
				};
	var pieArray =	{
						"disk_space":{"lable":"Disk Space Usage for",
							"name":"/",
							"id":"container"},
					   "disk_inodes_util":{"lable":"Disk Files (inodes) Usage for",
											"name":"/",
											"id":"containerA"},
					   "swap_space":{"lable":"Swap Utilization",
											"name":" ",
									 		"id":"containerB"},
					   "memory_space":{"lable":"Memory Utilization",
											"name":" ",
										 	"id":"containerC"},
						"buffer_pool":{"lable":"buffer_pool ",
											"name":" ",
										 	"id":"buffer_pool"}
					};
	/**
	 * click network   or disk ,tables change
	 * @param  {[type]} ){		array.netkey.Name[0] [description]
	 * @return {[type]}                           [description]
	 */
	
	//结束切换
	function run_graph_db_main(){
		$(".GL").click(function(){
			array.netkey.Name[0]=$(this).attr("id");
			array.netkey.Title[0]=$(this).attr("id");
			setNDFunction();
		});	
		$(".GLD").click(function(){
			array.diskkey.Name[0]=$(this).attr("id");
			array.diskkey.Title[0]=$(this).html();
			pieArray.disk_space.name=$(this).html();
			pieArray.disk_inodes_util.name=$(this).html();
			setNDFunction();
			setPie();
		});
		/**
		 * [run_network_list   set up  memu]
		 * @return {[type]} [description]
		 */
		var run_network_list = function(){
			var url_network ="http://"+configObject.IP+"/v1/kv/cmha/service/"+globalObject.serviceName+"/net_dev/"+globalObject.hostName+"?raw";
			var getDataNetwork =  new list.get_graph_list();
			var dataNetwork = getDataNetwork.m1(url_network);
			getDataNetwork.m2("Network",dataNetwork['dev_name']);
			var url_disk ="http://"+configObject.IP+"/v1/kv/cmha/service/"+globalObject.serviceName+"/disk_dev/"+globalObject.hostName+"?raw";
			var getDataDisk =  new list.get_graph_list();
			var dataDisk = getDataDisk.m1(url_disk);
			getDataDisk.m3("Disk",dataDisk['dev_name']);
		};
    	run_network_list();
    	
		var getIncData;//全局变量
		/**
		 * [getIncDataFun  Get all  incremental data获得增量数据]
		 * @return {object} [increment data]
		 */
		function getIncDataFun(){
			var getData = new math.GetData();
			 getIncData = getData.getRandomData();
			return getIncData;
		}
		getIncDataFun();
		setInterval(getIncDataFun,60000);

		var allKey;
		var g = {};
		var getAllData;
		var getNetData ;
		var getDiskData;
		/**
		 * [setTime description]update data
		 */
		function setTime(){
				console.log("时间="+new Date()+"循环执行graph_main页面");
				var getAllDygraphs = new set.SetDygraphs();
				var allKeyFunction = new allKeyFun.Commons().dbAllKey;
				var getDNgraphs = new set.SetDygraphs();
				var pieObj = new set.SetDygraphs();
				var getPieData =pieObj.SetDatePie(array["diskkey"]["Name"],globalObject.afterTypeHost,getIncData);//更新数据
		  	for(var ky in getPieData){
		  		g[ky].series[0].setData(getPieData[ky]);
		  	}
			var after_data_network1 = getDNgraphs.incDNComHis(getNetData.data_id_object,array.netkey.OutKey,array.netkey.Name,getIncData);
			var after_data_disk1 = getDNgraphs.incDNComHis(getDiskData.data_id_object,array.diskkey.OutKey,array.diskkey.Name,getIncData);
			var after_DN_data = $.extend({}, after_data_network1, after_data_disk1);
			var after_data_com = getAllDygraphs.incComHis(getAllData.data_id_object,allKey,getIncData);
			var after_data_ins =$.extend({},after_DN_data,after_data_com);
			for (var ky in allKeyFunction) {
					g[ky].updateOptions( { 'file': after_data_ins[ky] } );
				}
			globalObject.grraphDBTimer=setTimeout(setTime,6000);
		}
		setTimeout(setTime,6000);
		/**
		 * [getAllDygraphs get all graph-not disk or network]
		 * @return {[type]} [description]
		 */
		function getAllDygraphs(){
			var arrayCommonOutKey = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used","Graph_db_commit_counter","Graph_db_connections","Graph_db_net_Bytes","Graph_db_connection_Aborted","Graph_db_tmp_tables","Graph_Open_files","Graph_Open_table_definitions","Graph_Open_tables","Graph_db_buffer_pool_hit","Graph_db_row_change","Graph_db_Binlog_cache","Graph_db_redo_log_fsyncs","Graph_db_data_fsyncs","Graph_Table_locks_waited","Graph_db_innodb_transaction"]; 
			var arrayCommonInKey  = ["cpu_util","cpu_load","swap_util","db_commit_counter","db_connections","db_net_Bytes","db_connection_Aborted","db_tmp_tables","Open_files","Open_table_definitions","Open_tables","db_buffer_pool_hit","db_row_change","db_Binlog_cache","db_redo_log_fsyncs","db_data_fsyncs","Table_locks_waited","db_innodb_transaction"];
			allKey={"cpu_util":{"status":"status_cpu_util",
									"OutKey":"Graph_cpu_util",
									"DygraphLabels":["Date","user","system","idle","iowait","softirq","irq"],
									"id":"cpu_util",
									"title":"CPU utilization (system.cpu)",
									"ylabel":"percentage"
									} ,
						"cpu_load":{"status":"status_cpu_load",
									"OutKey":"Graph_cpu_load",
									"DygraphLabels":["Date","load1","load5","load15"],
									"id":"cpu_load",
									"title":"System Load Average",
									"ylabel":"load"
									} ,
						"swap_util":{"status":"status_swap_util",
									"OutKey":"Graph_swap_used",
									"DygraphLabels":["Date","in","out"],
									"id":"swap_util",
									"title":"swap_util",
									"ylabel":"swapio"
									},
						"db_commit_counter":{"status":"status_db_commit_counter",
									"OutKey":"Graph_db_commit_counter",
									"DygraphLabels":["Date","Com_insert","Com_update","Com_select","Com_delete","Com_replace","Com_update_multi","Com_insert_select","Com_delete_multi","Com_replace_select"],
									"id":"db_commit_counter",
									"title":"db_commit_counter",
									"ylabel":"swapio"
									},
						"db_connections":{"status":"status_db_connections",
									"OutKey":"Graph_db_connections",
									"DygraphLabels":["Date " ," Threads_running" ,"Threads_connected" ,"Threads_created" ,"Threads_cached" ,"max_connections" ,"Max_used_connections"],
									"id":"db_connections",
									"title":"db_connections",
									"ylabel":"swapio"
									},
						"db_net_Bytes":{"status":"status_db_net_Bytes",
									"OutKey":"Graph_db_net_Bytes",
									"DygraphLabels":["Date","Bytes_received","Bytes_sent"],
									"id":"db_net_Bytes",
									"title":"db_net_Bytes",
									"ylabel":"swapio"
									},
						"db_connection_Aborted":{"status":"status_db_connection_Aborted",
									"OutKey":"Graph_db_connection_Aborted",
									"DygraphLabels":["Date","Aborted_clients","Aborted_connects","Max_used_connections"],
									"id":"db_connection_Aborted",
									"title":"db_connection_Aborted",
									"ylabel":"swapio"
									},
					  	"db_tmp_tables":{"status":"status_db_tmp_tables",
					  				"OutKey":"Graph_db_tmp_tables",
									"DygraphLabels":["Date","Created_tmp_tables","Created_tmp_disk_tables"],
									"id":"db_tmp_tables",
									"title":"db_tmp_tables",
									"ylabel":"swapio"
									},
					  	"Open_files":{"status":"status_Open_files",
					  				"OutKey":"Graph_Open_files",
									"DygraphLabels":["Date","Open_files","Opened_files"],
									"id":"Open_files",
									"title":"Open_files",
									"ylabel":"Open_files"
									},
					  	"Open_table_definitions":{"status":"status_Open_table_definitions",
									"OutKey":"Graph_Open_table_definitions",
									"DygraphLabels":["Date","Open_table_definitions","Opened_table_definitions"],
									"id":"Open_table_definitions",
									"title":"Open_table_definitions",
									"ylabel":"swapio"
									},
					  	"Open_tables":{"status":"status_Open_tables",
					  				"OutKey":"Graph_Open_tables",
									"DygraphLabels":["Date","Open_tables","Opened_tables"],
									"id":"Open_tables",
									"title":"Open_tables",
									"ylabel":"swapio"
									},	
					    "db_buffer_pool_hit":{"status":"status_db_buffer_pool_hit",
					    			"OutKey":"Graph_db_buffer_pool_hit",
									"DygraphLabels":["Date","buffer_pool_hit"],
									"id":"db_buffer_pool_hit",
									"title":"db_buffer_pool_hit",
									"ylabel":"swapio"
									},
					  	"db_row_change":{"status":"status_db_row_change",
					  				"OutKey":"Graph_db_row_change",
									"DygraphLabels":["Date","Innodb_rows_inserted","Innodb_rows_updated","Innodb_rows_deleted","Innodb_rows_read"],
									"id":"db_row_change",
									"title":"db_row_change",
									"ylabel":"swapio"
									},
					  	"db_Binlog_cache":{"status":"status_db_Binlog_cache",
					  				"OutKey":"Graph_db_Binlog_cache",
									"DygraphLabels":["Date","Binlog_cache_disk_use","Binlog_cache_use"],
									"id":"db_Binlog_cache",
									"title":"db_Binlog_cache",
									"ylabel":"swapio"
									},
					  	"db_redo_log_fsyncs":{"status":"status_db_redo_log_fsyncs",
					  				"OutKey":"Graph_db_redo_log_fsyncs",
									"DygraphLabels":["Date","Innodb_os_log_fsyncs","Innodb_log_writes","Innodb_os_log_pending_fsyncs","Innodb_os_log_pending_writes"],
									"id":"db_redo_log_fsyncs",
									"title":"db_redo_log_fsyncs",
									"ylabel":"swapio"
									},
					  	"db_data_fsyncs":{"status":"status_db_data_fsyncs",
					  				"OutKey":"Graph_db_data_fsyncs",
									"DygraphLabels":["Date","Innodb_data_fsyncs","Innodb_data_pending_fsyncs","Innodb_data_writes","Innodb_data_pending_writes","Innodb_data_reads","Innodb_data_pending_reads"],
									"id":"db_data_fsyncs",
									"title":"db_data_fsyncs",
									"ylabel":"swapio"
									},
					  	"Table_locks_waited":{"status":"status_Table_locks_waited",
					  				"OutKey":"Graph_Table_locks_waited",
									"DygraphLabels":["Date","Table_locks_waited","Table_locks_immediate"],
									"id":"Table_locks_waited",
									"title":"Table_locks_waited",
									"ylabel":"swapio"
									},
					  	"db_innodb_transaction":{"status":"status_db_innodb_transaction",
									"OutKey":"Graph_db_innodb_transaction",
									"DygraphLabels":["Date","current_transactions","lock_wait_transactions","active_transactions"],
									"id":"db_innodb_transaction",
									"title":"db_innodb_transaction",
									"ylabel":"swapio"
									  }
									};
			var getAllDygraphs = new set.SetDygraphs();
			getAllData = getAllDygraphs.setAllData(arrayCommonOutKey,arrayCommonInKey);
			/**
			 * [for description] 循环建立graphs
			 * @param  {[type]} var k             in allKey [description]
			 * @return {[type]}     [description]
			 */
			for(var k in allKey){
				var all_option,after_data;
				all_option = new math.Options().m1(allKey[k].status);
				all_option.labels = allKey[k].DygraphLabels;
				all_option.title = allKey[k].title;
				all_option.ylabel = allKey[k].ylabel;
				after_data = getAllData.data_object[k];
				g[k] = new Dygraph(   //建立图表
                 			document.getElementById(allKey[k].id),
                 			after_data,
                 			all_option);
				}
		}//end getAllDygraphs
		getAllDygraphs();
		/**
		 * [getNDygraphs set up network or disk function]
		 * @return {[type]} [description]
		 */
		function getNDygraphs() {
			var allKey={
					"net_Bytes":{"status":"status_net_Bytes",
									 "DygraphLabels":["Date","received","sent"],
									 "id":"net_Bytes",
									 "title":"Bandwidth ",
									 "ylabel":"load"
									 } ,
					"net_packets":{"status":"status_net_packets",
									 "DygraphLabels":["Date","received","sent"],
									 "id":"net_packets",
									 "title":"Net Packets ",
									 "ylabel":"load"
									 } ,
					"disk_rkB_s":{"status":"status_disk_rkB_s",
									 "DygraphLabels":["Date","reads","writes"],
									 "id":"disk_rkB_s",
									 "title":"Disk Average Throughput for",
									 "ylabel":"kilobytes/s"
									 } ,
					"disk_await":{"status":"status_disk_await",
									 "DygraphLabels":["Date","await"],
									 "id":"disk_await",
									 "title":"Average await  for",
									 "ylabel":"load"
									 } ,
					"disk_r_s":{"status":"status_disk_r_s",
									  "DygraphLabels":["Date","reads","writes"],
									  "id":"disk_r_s",
									  "title":"Disk I/O Operations for ",
									  "ylabel":"operations/s"
									  }, 
					"disk_queue":{"status":"status_disk_queue",
									 "DygraphLabels":["Date","queue"],
									 "id":"disk_queue",
									 "title":"Average await  for ",
									 "ylabel":"load"
									 } ,
					"disk_svctm":{"status":"status_disk_svctm",
									 "DygraphLabels":["Date","svctm"],
									 "id":"disk_svctm",
									 "title":"Average Service Time for ",
									 "ylabel":"load"
									 } ,
					"disk_util":{"status":"status_disk_util",
									 "DygraphLabels":["Date","utilization"],
									 "id":"disk_util",
									 "title":"Disk Utilization Time for",
									 "ylabel":"load"
									 } 
			};
			var getDNgraphs = new set.SetDygraphs();
			getNetData  = getDNgraphs.setDNData(array.netkey.Graph,array.netkey.OutKey,array.netkey.Name,array.netkey.InKey);
			getDiskData = getDNgraphs.setDNData(array.diskkey.Graph,array.diskkey.OutKey,array.diskkey.Name,array.diskkey.InKey);
			var after_alldata = $.extend({}, getNetData.data_object, getDiskData.data_object);
			/**
			 * [for description] change show title
			 */
			for(var key in allKey){
				if(key == "net_Bytes" || key == "net_packets"){
					allKey[key].title = allKey[key].title+"  ("+array.netkey.Name[0]+")";
				}else{
					allKey[key].title = allKey[key].title +" "+array.diskkey.Title[0];
				}
			}
			for(var k in allKey){
				var all_option , after_data;
					all_option= new math.Options().m1(allKey[k].status);
					all_option.labels =	allKey[k].DygraphLabels;	
					all_option.title  = allKey[k].title;
					all_option.ylabel = allKey[k].ylabel;
					after_data =after_alldata[k];//
					g[k] = new Dygraph(   //建立图表
                 			document.getElementById(allKey[k].id),
                 			after_data,
                 			all_option);
			}
		}
		getNDygraphs();
		function getPieGraphs(){
			var pir;
			var pieObj = new set.SetDygraphs();
			var pieTables=[];
			getPieData = pieObj.SetDatePie(array["diskkey"]["Name"],globalObject.afterTypeHost,getIncData);
			for(var k in getPieData){
				var options =new  math.Options();
				var pieOption = options.pieFun();
				var lablePie = pieArray[k].lable+pieArray[k].name;
				pieOption.title.text=lablePie;
				pieOption.series[0]["data"]=getPieData[k];
				g[k]= new Highcharts.chart(pieArray[k].id,pieOption);
			}
		}
		getPieGraphs();
	}
	return {
		run_graph_db_main : run_graph_db_main
	};
});

