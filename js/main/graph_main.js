/*
	采用模块化编写,将一些抽象函数写在这里,在另一个文件中调用,
	模块 GetData函数  ChangeData函数，opntions设置属性，
 */
var change;
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
define(['math','jquery','Dygraph',"highcharts","list","set",'allKeyFun'],function (math,$,Dygraph,highcharts,list,set,allKeyFun) {
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
	var pieArray = {
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
										 	"id":"containerC"}
					};
		//切换
	function elementClick(){
		$(".GL").click(function(){
			debugger;
			array.netkey.Name[0]=$(this).attr("id");
			array.netkey.Title[0]=$(this).attr("id");
			run_graph_sys_main();
		});	
		$(".GLD").click(function(){
			debugger;
			array.diskkey.Name[0]=$(this).attr("id");
			array.diskkey.Title[0]=$(this).html();
			pieArray.disk_space.name=$(this).html();
			pieArray.disk_inodes_util.name=$(this).html();
			run_graph_sys_main();
		});
	}
	
	//结束切换
	function run_graph_sys_main(){
		debugger;
		elementClick();
		/**
		 * [run_network_list description]set memu network or disk
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
		//目录生成结束
		//获得增量数据
		var getIncData;//全局变量
		function getIncDataFun(){
			var getData = new math.GetData();
			getIncData = getData.getRandomData();
			return getIncData;
		}
		getIncDataFun();
		setInterval(getIncDataFun,60000);
		/**
		 * [getAllDygraphs 建立系统的常规折线图]
		 * @return {[type]} [description]
		 */
		var g={};
		var allKey;
		var getAllData ;
		//var after_alldata;
		var getNetData;  
		var getDiskData; 
		function setTime(){
			var getAllDygraphs = new set.SetDygraphs();
			var getDNgraphs = new set.SetDygraphs();
			var allKeyFunction = new allKeyFun.Commons().systemAllKey;
			var pieObj = new set.SetDygraphs();
		  	var getPieData =pieObj.SetDatePie(array["diskkey"]["Name"],globalObject.afterTypeHost,getIncData);//更新数据
		  	for(var ky in getPieData){
		  		g[ky].series[0].setData(getPieData[ky]);
		  	}
			var after_data_network1 = getDNgraphs.incDNComHis(getNetData.data_id_object,array.netkey.OutKey,array.netkey.Name,getIncData);
			var after_data_disk1 = getDNgraphs.incDNComHis(getDiskData.data_id_object,array.diskkey.OutKey,array.diskkey.Name,getIncData);
			var after_data1 = getAllDygraphs.incComHis(getAllData.data_id_object,allKeyFunction,getIncData);
			var afterAlldata = $.extend({}, after_data_network1, after_data_disk1,after_data1);
			for (var ky in allKeyFunction) {
					g[ky].updateOptions( { 'file': afterAlldata[ky] } );
				}
				console.log("system定时器");
			globalObject.graphTimer = setTimeout(setTime,6000);
 		}
 		setTimeout(setTime,6000);
		function getAllDygraphs(){
 			var arrayOutKey = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used"];//url
 			var arrayInKey = ["cpu_util","cpu_load","swap_util"];//增量数据内层关键字----历史数据的key
 			var DygraphLabels = [["Date","user","system","iowait","idle","softirq","irq"],["Date","load1","load5","load15"],["Date","in","out"]];//图表标签	
			allKey={
							"cpu_util":{"status":"status_cpu_util",
										"DygraphLabels":["Date","user","system","idle","iowait","softirq","irq"],
										"OutKey":"Graph_cpu_util",
										
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
							"swap_util":{"status":"status_swap_used",
										"OutKey":"Graph_swap_used",
										  "DygraphLabels":["Date","in","out"],
										  "id":"swap_used",
										  "title":"Swap I/O (system.swapio)",
										  "ylabel":"swapio"
										  }
						};
			var getAllDygraphs = new set.SetDygraphs();
			getAllData = getAllDygraphs.setAllData(arrayOutKey,arrayInKey);				
			for (var k in allKey) {
				var all_option , after_data;
					all_option= new math.Options().m1(allKey[k].status);
					all_option.labels =	allKey[k].DygraphLabels;	
					all_option.title  = allKey[k].title;
					all_option.ylabel = allKey[k].ylabel;
					after_data =getAllData.data_object[k];//
					g[k] = new Dygraph(   //建立图表
                 			document.getElementById(allKey[k].id),
                 			after_data,
                 			all_option);
			}
		}
		getAllDygraphs();
		function getNDygraphs(){
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
			//var after_alldata = $.extend({}, getNetData.data_object, getDiskData.data_object);
			after_alldata = $.extend({}, getNetData.data_object, getDiskData.data_object);
			for(var key in allKey){
				if(key == "net_Bytes" || key == "net_packets"){
					allKey[key].title = allKey[key].title+"  ("+array.netkey.Name[0]+")";
				}else{
					allKey[key].title = allKey[key].title +" "+array.diskkey.Title[0];
				}
			}
			//var g={};
			// function setTime() {
			// 	var after_data_network1 = getDNgraphs.incDNComHis(getNetData.data_id_object,array.netkey.OutKey,array.netkey.Name,getIncData);
			// 	var after_data_disk1 = getDNgraphs.incDNComHis(getDiskData.data_id_object,array.diskkey.OutKey,array.diskkey.Name,getIncData);
			// 	var after_all_data = $.extend({}, after_data_network1, after_data_disk1);

			// 	for (var ky in allKey) {
			// 		var after_data_inc = after_all_data[ky];
			// 		g[ky].updateOptions( { 'file': after_data_inc } );
			// 	}
			// 	setTimeout(setTime,60000);
			// }
			// setTimeout(setTime,6000);
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
			var getPieData = pieObj.SetDatePie(array["diskkey"]["Name"],globalObject.afterTypeHost,getIncData);
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
		run_graph_sys_main : run_graph_sys_main
	};
});