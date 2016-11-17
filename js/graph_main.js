/*
	采用模块化编写,将一些抽象函数写在这里,在另一个文件中调用,
	模块 GetData函数  ChangeData函数，opntions设置属性，
 */
var change;
require.config({
	paths:{
		"jquery" : "jquery",
		"math"	:"graph_math",
		"Dygraph":"Dygraphs",
		"highcharts":"highcharts"
		
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
require(['math','jquery','Dygraph',"highcharts"],function (math,$,Dygraph,highcharts) {
	function SetAllDygraphs() {//建立一个模型来整合建立Dygraphs图表所需的处理数据的步骤
		this.setAllData = function(obj_array_url,obj_array_key,obj_array_name) {
			var after_array = [];
			var runDataIncFunction;
			var data_object = {};
			for (var i = obj_array_url.length - 1; i >= 0; i--) {
				var url = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/"+obj_array_url[i] +"/history/" +hostName  + "?raw";
				var GetData1 =new  math.GetData();
				var dataHis = GetData1.getHistoryData(url)[obj_array_name[i]];
				var after_data;
        		var dataFlot = {};
        		runDataIncFunction = function() {
		        	var changeData1 =new  math.ChangeData();
		            function comData(){
			            var dataInc = GetData1.getRandomData()[obj_array_key[i]][0][obj_array_name[i]];//增量数据
			            dataHis =changeData1.m2(dataHis, dataInc);//合并历史和增量数据
		            }
		            comData();
		            var data_sort = changeData1.m3(dataHis); //sort data
		            var data_null = changeData1.m4(data_sort); //add null into data
		            after_data = changeData1.m1(data_null);
		            data_object[obj_array_name[i]] = after_data;
		           return data_object;
        		};
        		runDataIncFunction(); 
			}
			return {data_object:data_object,
					runDataIncFunction: runDataIncFunction
					};
		};
	}
	function graphFunction(){//建立常规折线图的抽象函数
		var dygraphsAll = function(){
			var array = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used"];//url
 			var arrayKay = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used"];//增量数据外层关键字
 			var key = ["cpu_util","cpu_load","swap_util"];//增量数据内层关键字----历史数据的key
 			var setALLData = new SetAllDygraphs();
 		   // var DygraphLabels = [["Date","user","system","iowait","idle","softirq","irq"],["Date","load1","load5","load15"],["Date","in","out"]];//图表标签	
 			var afterAllData = setALLData.setAllData(array,arrayKay,key).data_object;
			var array_id = ["cpu_util","cpu_load","swap_used"];//id数组
 			var array_title = ["status_cpu_util","status_cpu_load","status_swap_used"];//标签数组
 			var DygraphLabels = [["Date","user","system","iowait","idle","softirq","irq"],["Date","load1","load5","load15"],["Date","in","out"]];//图表标签	
			var allKey={"cpu_util":{"status":"status_cpu_util",
									 "DygraphLabels":["Date","user","system","iowait","idle","softirq","irq"],
									 "id":"cpu_util",
									 "title":"CPU utilization (system.cpu)",
									 "ylabel":"percentage"
									 } ,
						"cpu_load":{"status":"status_cpu_load",
									 "DygraphLabels":["Date","load1","load5","load15"],
									 "id":"cpu_load",
									 "title":"System Load Average",
									 "ylabel":"load"
									 } ,
						"swap_util":{"status":"status_swap_used",
									  "DygraphLabels":["Date","in","out"],
									  "id":"swap_used",
									  "title":"Swap I/O (system.swapio)",
									  "ylabel":"swapio"
									  }
						
									};
			var g={};
			for (var k in allKey) {
				var all_option , after_data;
					all_option= new math.Options().m1(allKey[k].status);
					all_option.labels =	allKey[k].DygraphLabels;	
					all_option.title  = allKey[k].title;
					all_option.ylabel = allKey[k].ylabel;
					after_data =afterAllData[k];//
					g[k] = new Dygraph(   //建立图表
                 			document.getElementById(allKey[k].id),
                 			after_data,
                 			all_option);
					var ID = setInterval(function() {
							for (var ky in allKey) {
								after_data =   setALLData.setAllData(array,arrayKay,key).data_object[ky];
                    			g[ky].updateOptions( { 'file': after_data } );
							}
                        }, 60000);
			}
		};
		dygraphsAll();
	}
	graphFunction();
	function SetNDygraphs() {
		this.setAllData = function(obj_array_url,obj_array_url_name,obj_array_key,obj_array_name) {//url,name，OutKey,InKey
			var after_array = [];
			var runDataIncFunction;
			var data_object = {};
			for (var i = obj_array_url.length - 1; i >= 0; i--) {
				var url = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/"+obj_array_url[i] +"/history/" +hostName +"/"+obj_array_url_name[0] + "?raw";
				var GetData1 =new  math.GetData();
				var dataHis = GetData1.getHistoryData(url)[obj_array_name[i]];
				var after_data;
        		var dataFlot = {};
        		runDataIncFunction = function() {
		        	var changeData1 =new  math.ChangeData();
		            function comData(){
		            	var dataAllInc = GetData1.getRandomData()[obj_array_key[0]];//增量数据
		            	var dataInc;
		            	for (var j = dataAllInc.length - 1; j >= 0; j--) {
		            		if(dataAllInc[j].net_card == obj_array_url_name[0] ){
		            			dataInc = dataAllInc[j][obj_array_name[i]];
		            			break;
		            		}
		            	}
			            dataHis =changeData1.m2(dataHis, dataInc);//合并历史和增量数据
		            }
		            comData();
		            var data_sort = changeData1.m3(dataHis); //sort data
		            var data_null = changeData1.m4(data_sort); //add null into data
		            after_data = changeData1.m1(data_null);
		            data_object[obj_array_name[i]] = after_data;
		           return data_object;
        		};
        		runDataIncFunction(); 
			}
			return {data_object:data_object,
					runDataIncFunction: runDataIncFunction
					};
		};
	}
	function setNDFunction() {//建立变化的network和disk的抽象函数
		var array = {"netkey":{
						"Name":["eth0"],
						"Graph":["Graph_net","Graph_net"],
						"InKey":["net_Bytes","net_packets"], //以它的数目来循环netGraph
						"OutKey":["Graph_net"]
					},
					"diskkey":{
						"Name":["dm-0"],
						"Graph":["Graph_disk_Throughput", "Graph_disk_await", /*"Graph_disk_inodes",*/ "Graph_disk_iops",
									"Graph_disk_queue",/* "Graph_disk_space", */"Graph_disk_svctm", "Graph_disk_util"],
						"InKey":["disk_rkB_s",
									"disk_await",
								//	"disk_inodes_util",
									"disk_r_s",
									"disk_queue",
								//	"disk_space",
									"disk_svctm",
									"disk_util"
									],
						"OutKey":["Graph_disk"]
					}};
		//将network和disk分开
		var setNData =new SetNDygraphs();	
		
		var afterNetData = setNData.setAllData(array.netkey.Graph,array.netkey.Name,array.netkey.OutKey,array.netkey.InKey).data_object;
		var afterDiskData = setNData.setAllData(array.diskkey.Graph,array.diskkey.Name,array.diskkey.OutKey,array.diskkey.InKey).data_object;

		var after_alldata = $.extend({}, afterNetData, afterDiskData);

		var allKey={"net_Bytes":{"status":"status_net_Bytes",
									 "DygraphLabels":["Date","load1","load1"],
									 "id":"net_Bytes",
									 "title":"Bandwidth (net.eth0)",
									 "ylabel":"load"
									 } ,
					"net_packets":{"status":"status_net_packets",
									 "DygraphLabels":["Date","load1","load1"],
									 "id":"net_packets",
									 "title":"Net Packets (net.eth0)",
									 "ylabel":"load"
									 } ,


					"disk_rkB_s":{"status":"status_disk_rkB_s",
									 "DygraphLabels":["Date","user","system"],
									 "id":"disk_rkB_s",
									 "title":"Disk Average Throughput for",
									 "ylabel":"percentage"
									 } ,
					"disk_await":{"status":"status_disk_await",
									 "DygraphLabels":["Date","load1"],
									 "id":"disk_await",
									 "title":"Average await  for",
									 "ylabel":"load"
									 } ,
					"disk_r_s":{"status":"status_disk_r_s",
									  "DygraphLabels":["Date","in","out"],
									  "id":"disk_r_s",
									  "title":"Swap I/O (system.swapio)",
									  "ylabel":"swapio"
									  }, 
					"disk_queue":{"status":"status_disk_queue",
									 "DygraphLabels":["Date","load1"],
									 "id":"disk_queue",
									 "title":"System Load Average",
									 "ylabel":"load"
									 } ,
					"disk_svctm":{"status":"status_disk_svctm",
									 "DygraphLabels":["Date","load1"],
									 "id":"disk_svctm",
									 "title":"System Load Average",
									 "ylabel":"load"
									 } ,
					"disk_util":{"status":"status_disk_util",
									 "DygraphLabels":["Date","load1"],
									 "id":"disk_util",
									 "title":"Disk Utilization Time for",
									 "ylabel":"load"
									 } 
					
									};

 			var g={};
			for (var k in allKey) {
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
					var ID = setInterval(function() {
							for (var ky in allKey) {
								after_data =   setALLData.setAllData(array,arrayKay,key).data_object[ky];
                    			g[ky].updateOptions( { 'file': after_data } );
							}
                        }, 60000);
			}
	}
	setNDFunction();
	function SetDataPie(){ //建立长条和圆饼的数据处理
		this.setPie = function(){
			
			var dataObject = new math.GetData();
			var allData = dataObject.getRandomData();
			var pieData = allData.Graph_memory[0].memory_space[0].data;
			var pieDataOption = [{name:"A",y:parseInt(pieData[2]) },
							 	{name:"B",y: parseInt(pieData[3])},
							 	{name:"C",y:parseInt(pieData[4]) },
							 	{name:"D",y: parseInt(pieData[5])}];
			return pieDataOption;
			};
		this.setGauge = function(obj_name) {
			var dataObject = new math.GetData();
			var allData = dataObject.getRandomData();
			var dataAllDisk =allData.Graph_disk;
			var dataDisk = {};
			for (var i = dataAllDisk.length - 1; i >= 0; i--) {
				if(dataAllDisk[i].net_card == obj_name){
					dataDisk = dataAllDisk[i];
					break;
				}
			}
			var data ={};
			data["disk_space"]=dataDisk.disk_space[0].data;
			data["disk_inodes_util"]=dataDisk.disk_inodes_util[0].data;
			data["swap_space"]=allData.Graph_swap_size[0].swap_space[0].data;
			var afterData = {};
			for(var k in data){
				var dataArray = [];
				var dataObjUse={};
				dataObjUse["name"]="Use";
				dataObjUse["y"]=parseInt(data[k][2]);
				var dataObjUuse = {};
				dataObjUuse["name"]="UnUse";
				dataObjUuse["y"]=parseInt(data[k][3]);
				dataArray.push(dataObjUse,dataObjUuse);
				afterData[k]=dataArray;
			}
			//dataAll["disk_space"]=allData["Graph_disk"].
			return	afterData;
		};
			
		
	}
	function setPie(){
		var pieObj = new SetDataPie();
		var getPieData = pieObj.setPie();
		var options =new  math.Options();
		var pieOption = options.pieFun();
		pieOption.series[0]["data"]=getPieData;
		$('#container').highcharts(pieOption);
		//建立长条
		var getGaugeData = pieObj.setGauge("dm-0");
		debugger;
		var idName=["#containerA","#containerB","#containerC"];
		var i =2;
		for(var ky in getGaugeData){
			
			debugger;
			var newOption = new math.Options();
			var newGagueOption = newOption.pieFun();
			newGagueOption.series[0]["data"]=getGaugeData[ky];
			$(idName[i]).highcharts(newGagueOption);
			i--;
		}
		// for (var i = getGaugeData.length - 1; i >= 0; i--) {
		// 	var newOption = new math.Options();
		// 	var newGagueOption = newOption.pieFun();
		// 	newGagueOption.series[0]["data"]=getGaugeData[i];
		// 	document.getElementById(idName[i]).highcharts(newGagueOption);
		// }
	}
	setPie();
		
});