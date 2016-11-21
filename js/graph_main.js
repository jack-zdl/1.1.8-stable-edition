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
		"highcharts":"highcharts",
		"list"	: "graph_list"
		
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
require(['math','jquery','Dygraph',"highcharts","list"],function (math,$,Dygraph,highcharts,list) {
var array = {"netkey":{
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
var pieArray ={"disk_space":{"lable":"Disk Space Usage for",
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
								 	"id":"containerC"}};
	 // var getHostName = function() {
  //       var arrayName = document.cookie.split(";");
  //       for (var a = 0; a < arrayName.length; a++) {
  //           if (arrayName[a].indexOf("hostName") != -1) {
  //               hostName = arrayName[a].split("=")[1];
  //               console.log("====hostName="+hostName);
  //           }
  //       }
  //       for (var b = 0; b < arrayName.length; b++) {
  //           if (arrayName[b].indexOf("serviceName") != -1) {
  //               serviceName = arrayName[b].split("=")[1];
  //               console.log("=====serviceName="+serviceName);
  //           }
  //       }                
  //   };
  //   getHostName();
    //目录生成
	var run_network_list = function(){
		var url_network ="http://"+IP+"/v1/kv/cmha/service/"+serviceName+"/net_dev/"+hostName+"?raw";
		var getDataNetwork =  new list.get_graph_list();
		var dataNetwork = getDataNetwork.m1(url_network);
		getDataNetwork.m2("Network",dataNetwork['dev_name']);
		var url_disk ="http://"+IP+"/v1/kv/cmha/service/"+serviceName+"/disk_dev/"+hostName+"?raw";
		var getDataDisk =  new list.get_graph_list();
		var dataDisk = getDataDisk.m1(url_disk);
		getDataDisk.m3("Disk",dataDisk['dev_name']);
	};
    run_network_list();
	//目录生成结束
	//切换
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
	//结束切换

	//定位
	//结束定位
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
			var arrayDygraph = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used"];//url
 			var arrayKay = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used"];//增量数据外层关键字
 			var key = ["cpu_util","cpu_load","swap_util"];//增量数据内层关键字----历史数据的key
 			var setALLData = new SetAllDygraphs();
 		   // var DygraphLabels = [["Date","user","system","iowait","idle","softirq","irq"],["Date","load1","load5","load15"],["Date","in","out"]];//图表标签	
 			var afterAllData = setALLData.setAllData(arrayDygraph,arrayKay,key).data_object;
			var array_id = ["cpu_util","cpu_load","swap_used"];//id数组
 			var array_title = ["status_cpu_util","status_cpu_load","status_swap_used"];//标签数组
 			var DygraphLabels = [["Date","user","system","iowait","idle","softirq","irq"],["Date","load1","load5","load15"],["Date","in","out"]];//图表标签	
			var allKey={"cpu_util":{"status":"status_cpu_util",
									 "DygraphLabels":["Date","user","system","idle","iowait","softirq","irq"],
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
								var date = new Date();
								console.log("graph_main定时器"+date+"定时器名称="+g[ky]);
								after_data =   setALLData.setAllData(arrayDygraph,arrayKay,key).data_object[ky];
                    			g[ky].updateOptions( { 'file': after_data } );
							}
                        }, 10000);
			}
		};
		dygraphsAll();
	}
	graphFunction();

	function SetNDygraphs() {//建立network DISK 的抽象数据函数，url,name，OutKey,InKey
		this.setAllData = function(obj_array_url,obj_array_url_name,obj_array_key,obj_array_name) {
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
		var setNData =new SetNDygraphs();	
		var afterNetData = setNData.setAllData(array.netkey.Graph,array.netkey.Name,array.netkey.OutKey,array.netkey.InKey).data_object;
		var afterDiskData = setNData.setAllData(array.diskkey.Graph,array.diskkey.Name,array.diskkey.OutKey,array.diskkey.InKey).data_object;
		var after_alldata = $.extend({}, afterNetData, afterDiskData);
		var allKey={"net_Bytes":{"status":"status_net_Bytes",
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
			for (var key in allKey) {
				if(key == "net_Bytes" || key == "net_packets"){
				allKey[key].title = allKey[key].title+"  ("+array.netkey.Name[0]+")";
				}
				else{
					allKey[key].title = allKey[key].title +" "+array.diskkey.Title[0];
				}
			}
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
								var IncafterNetData = setNData.setAllData(array.netkey.Graph,array.netkey.Name,array.netkey.OutKey,array.netkey.InKey).data_object;
								var IncafterDiskData = setNData.setAllData(array.diskkey.Graph,array.diskkey.Name,array.diskkey.OutKey,array.diskkey.InKey).data_object;
								var Incafter_alldata = $.extend({}, IncafterNetData, IncafterDiskData);
								var IncAfterData =Incafter_alldata[ky];
                    			g[ky].updateOptions( { 'file': IncAfterData } );
							}
                        }, 10000);
			}
	}
	setNDFunction();

	function SetDataPie(){ //建立长条和圆饼的数据处理 圆饼图的disk实时也需要切换
		this.setPie = function(obj_name){
			var dataObject = new math.GetData();
			var allData = dataObject.getRandomData();
			//var memory_space_data = allData.Graph_memory[0].memory_space[0].data;
			var dataAllDisk =allData.Graph_disk;
			var dataDisk = {};
			for (var i = dataAllDisk.length - 1; i >= 0; i--) {
				if(dataAllDisk[i].net_card == obj_name){
					dataDisk = dataAllDisk[i];
					break;
				}
			}
			var data                 ={};
				data["disk_space"      ] =dataDisk.disk_space[0].data;
				data["disk_inodes_util"] =dataDisk.disk_inodes_util[0].data;
				data["swap_space"      ] =allData.Graph_swap_size[0].swap_space[0].data;
				data["memory_space"    ] =allData.Graph_memory[0].memory_space[0].data;
			var pieName = ["used","free","buffers","cached"];
			var afterData            = {};
			for(var k in data){
				var dataArray            = [];
				for(var j=0;j<data[k].length;j++){
					var dataObjUse           ={};
					dataObjUse["name"]       =pieName[j];
					dataObjUse["y"]          =parseInt(data[k][j]);
					dataArray.push(dataObjUse);
				}
				afterData[k]             =dataArray;
			}
			return afterData;
			};
	}
	function setPie(){
		var pieObj = new SetDataPie();
		var pieTables=[];
		var getPieData = pieObj.setPie(array["diskkey"]["Name"]);
		var g ={};
		for(var k in getPieData){
			var options =new  math.Options();
			var pieOption = options.pieFun();
			var lablePie = pieArray[k].lable+pieArray[k].name;
			pieOption.title.text=lablePie;
			pieOption.series[0]["data"]=getPieData[k];
			g[k]= new Highcharts.chart(pieArray[k].id,pieOption);
			var ID= setInterval(function(){
			 	var getPieData = pieObj.setPie(array["diskkey"]["Name"]);//更新数据
			 	for(var ky in getPieData){
			 		g[ky].series[0].setData(getPieData[ky]);
			 	}
			 },10000);
		}
	}
	setPie();
});