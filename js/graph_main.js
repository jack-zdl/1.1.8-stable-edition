/*
	采用模块化编写,将一些抽象函数写在这里,在另一个文件中调用,
	模块 GetData函数  ChangeData函数，opntions设置属性，
 */
var change;
require.config({
	paths:{
		"jquery" : "jquery",
		"math"	:"graph_math",
		"Dygraph":"Dygraphs"
	},
	shim: {
　　　　'Dygraph':{
　　　　　　exports: 'Dygraph'
　　　　}
　　}
});
require(['math','jquery','Dygraph'],function (math,$,Dygraph) {
	$("h1").html("jquery来了");
/*
	function SetDataDy() {
		//建立一个模型来整合建立Dygraphs图表所需的处理数据的步骤
		this.setDygraphs = function(obj_url,obj_name) {
			var GetData1 =new  math.GetData();
			var url  = obj_url;
	        var dataHis = GetData1.getHistoryData(url)[obj_name];
	        var after_data_cpu1;
	        var dataFlotCpu = {};
	        var runDataIncFunction = function() {
	        	var changeData1 =new  math.ChangeData();
	            function comData(){
	            var dataIncCpu = GetData1.getRandomData().Graph_cpu_load[0][obj_name];//增量数据
	            dataHis =changeData1.m2(dataHis, dataIncCpu);//合并历史和增量数据
	            }
	            comData();
	            var data_sort = changeData1.m3(dataHis); //sort data
	            var data_null = changeData1.m4(data_sort); //add null into data
	            after_data = changeData1.m1(data_null);
	            return after_data;
	        };
	        runDataIncFunction();
	         return after_data;
		};
	}
*/
	function SetAllDygraphs() {
		//建立一个模型来整合建立Dygraphs图表所需的处理数据的步骤
		this.setAllData = function(obj_array_url,obj_array_key,obj_array_name) {
			var getHostName1 = function() {
			        var arrayName = document.cookie.split(";");

			        for (var a = 0; a < arrayName.length; a++) {
			            if (arrayName[a].indexOf("hostName") != -1) {
			                hostName = arrayName[a].split("=")[1];
							console.log("hostName=="+hostName);		           
			            }
			        }
			        for (var a = 0; a < arrayName.length; a++) {
			            if (arrayName[a].indexOf("serviceName") != -1) {
			                serviceName = arrayName[a].split("=")[1];
			            	console.log("serviceName=="+serviceName);	
			            }
			        }
	   			};
			getHostName1();
			var after_array = [];
			var runDataIncFunction;
			for (var i = obj_array_url.length - 1; i >= 0; i--) {
				var url = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/"+obj_array_url[i] +"/history/" +hostName  + "?raw";
				var GetData1 =new  math.GetData();
				var dataHis = GetData1.getHistoryData(url)[obj_array_name[i]];
				var after_data;
        		var dataFlot = {};
        		runDataIncFunction = function() {
		        	var changeData1 =new  math.ChangeData();
		            function comData(){
		            	if(i<0)
		            		return ;
			            var dataInc = GetData1.getRandomData()[obj_array_key[i]][0][obj_array_name[i]];//增量数据
			            dataHis =changeData1.m2(dataHis, dataInc);//合并历史和增量数据
		            }
		            comData();
		            var data_sort = changeData1.m3(dataHis); //sort data
		            var data_null = changeData1.m4(data_sort); //add null into data
		            after_data = changeData1.m1(data_null);
		            var data_object = {};
		            data_object[obj_array_name[i]] = after_data;
		            after_array.unshift(data_object);
		           return after_array;
        		};
        		runDataIncFunction(); 
			}
			return {after_array:after_array,
					runDataIncFunction: runDataIncFunction
					};
		};
	}
	function graphFunction(){
/*	
        var dygraphs_cpu_load = function() {
            var url_cpu1 = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_cpu_load/history/" +hostName  + "?raw";
            var testsetDygraphs = new SetDataDy();
            var name = "cpu_load";
            var after_data = testsetDygraphs.setDygraphs(url_cpu1,name);

            var option = new math.Options();
            var cpu1_option = option.m1();

            var g = new Dygraph(   //建立图表
                document.getElementById("cpu_load"),
                after_data,
                cpu1_option );

            setInterval(function() {
              after_data_cpu1 =  runDataIncFunction();
              g.updateOptions( { 'file': after_data_cpu1 } );
            }, 60000);
            change=function (el) {
                g.setVisibility(parseInt(el.id), el.checked);
            };
        };
*/
		var dygraphsAll = function(){
			var array = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used"];//url
 			var arrayKay = ["Graph_cpu_util","Graph_cpu_load","Graph_swap_used"];//增量数据外层关键字
 			var key = ["cpu_util","cpu_load","swap_util"];//增量数据内层关键字
 			var setALLData = new SetAllDygraphs();
 		    var DygraphLabels = [["Date","user","system","iowait","idle","softirq","irq"],["Date","load1","load5","load15"],["Date","in","out"]];//图表标签	
 			var afterAllData = setALLData.setAllData(array,arrayKay,key).after_array;
			var array_id = ["cpu_util","cpu_load","swap_used"];//id数组
 			var array_title = ["status_cpu_util","status_cpu_load","status_swap_used"];//标签数组
 			var DygraphLabels = [["Date","user","system","iowait","idle","softirq","irq"],["Date","load1","load5","load15"],["Date","in","out"]];//图表标签	
			var g;
			var g=new Array(3);
			for (var i =afterAllData.length - 1; i >= 0; i--) {
				var option = new math.Options();
	        	var all_option = option.m1(array_title[i]);
	        		all_option.labels=DygraphLabels[i];
	        	after_data = afterAllData[i][key[i]];
	        	
				g[i] = new Dygraph(   //建立图表
			 	document.getElementById(array_id[i]),
				after_data,
				all_option	);
				switch (i){
					case 2:
						console.log(g);
						var ID = setInterval(function() {
              			after_data =   setALLData.setAllData(array,arrayKay,key).after_array[2]["swap_util"];
              			debugger;
              			g[2].updateOptions( { 'file': after_data } );
            			}, 6000);
            			console.log("ID="+ID);
						break;
					case 1:
					console.log(g);
						var ID = setInterval(function() {
	              		after_data =   setALLData.setAllData(array,arrayKay,key).after_array[1]["cpu_load"];
	              		debugger;
	              		g[1].updateOptions( { 'file': after_data } );
            			}, 6000);
            			console.log("ID="+ID);
						break;
					case 0:
					console.log(g);
						var ID = setInterval(function() {
	              		after_data =   setALLData.setAllData(array,arrayKay,key).after_array[0]["cpu_util"];
	              		debugger;
	              		g[0].updateOptions( { 'file': after_data } );
            			}, 6000);
            			console.log("ID="+ID);
						break;
				}
			}
			var onclick = function(ev) {
			    if (g.isSeriesLocked()) {
			      g.clearSelection();
			    } else {
			      g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
			    }
			  };
			  g.updateOptions({clickCallback: onclick}, true);
			 
		};
		dygraphsAll();
	}
	graphFunction();
});