/**
 * 
 * @authors graph_set (zhangdelei@bsgchina.com)
 * @date    2016-11-24 18:14:26
 * @version $1.1.7_graph_db.html.1$
 */
require.config({
	paths:{
		"math" : "graph_math"
	}
});
define(['math'],function(math){
	function SetDygraphs(){
		    //建立一个模型来整合建立Dygraphs图表所需的处理数据的步骤
		    /**
         	* [SetAllDygraphs abstract function of set graph 建立图表的抽象函数]
         	*/
            this.setAllData = function(obj_array_outkey,obj_array_inkey) {
                var after_array = [];
                var runDataIncFunction;
                var data_object = {};
                var data_id_object = {};
                for (var i = obj_array_outkey.length - 1; i >= 0; i--) {
                    var url = "http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/Graph/"+obj_array_outkey[i] +"/history/" +globalObject.hostName  + "?raw";
                    var GetData1 =new  math.GetData();
                    var dataHis = GetData1.getHistoryData(url)[obj_array_inkey[i]];
                    var after_data;
                    var dataFlot = {};
                    var changeData1 =new  math.ChangeData();
                    var data_sort = changeData1.m3(dataHis); //sort data
                    var data_null = changeData1.m4(data_sort); //add null into data
                    data_id_object[obj_array_inkey[i]] = data_null;
                    after_data = changeData1.m1(data_null);
                    data_object[obj_array_inkey[i]] = after_data;
                }
                return {data_object:data_object,
                        data_id_object: data_id_object
                        };
            };
            this.setDNData = function(obj_array_Graph,obj_array_outkey,obj_array_name,obj_array_inkey) {
            	var after_array = [];
				var runDataIncFunction;
				var data_object = {};
				var data_id_object = {};
				for (var i = obj_array_inkey.length - 1; i >= 0; i--) {
					var url = "http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/Graph/"+obj_array_Graph[i] +"/history/" +globalObject.hostName +"/"+obj_array_name[0] + "?raw";
					var GetData1 =new  math.GetData();
					var dataHis = GetData1.getHistoryData(url)[obj_array_inkey[i]];
					var after_data;
	        		var dataFlot = {};
		        	var changeData1 =new  math.ChangeData();
		            var data_sort = changeData1.m3(dataHis); //sort data
		            var data_null = changeData1.m4(data_sort); //add null into data
		            data_id_object[obj_array_inkey[i]] = data_null;
		            after_data = changeData1.m1(data_null);
                	data_object[obj_array_inkey[i]] = after_data;
				}
				return {data_object:data_object,
						data_id_object:data_id_object
						};
            };
            //这个是用来获取增量数据和历史数据融合，只获取一次增量数据，
            //进行所有的数据更新，将增量数据push到历史数据的后面，不用在进行融合，排序，加入断点。
            //而是进行push进去，对末未进行排序断点处理。
            this.incComHis = function(obj_data_his,obj_array_allKey,obj_getIncData) {
                var dataFlot = {};
                for(var k in obj_data_his){
                    var i = 0;
                    var incDate = obj_getIncData[obj_array_allKey[k].OutKey][0][k];
                    var changeData2 = new math.ChangeData();
                    var dataHis = changeData2.m2(obj_data_his[k],incDate);
                    var data_null = changeData2.m4(dataHis);
                    var after_data = changeData2.m1(data_null);
                     dataFlot[k] = after_data;
                     i++;
                }
                return dataFlot;
            };
       		this.incDNComHis = function(obj_data_his,obj_array_outKey,obj_array_url_name,obi_getIncData){
       			var dataFlot = {};
				for(var k in obj_data_his){
					var i = 0;
					// var incDate = getIncData[obj_array_outKey[k]][0][k];
					var dataInc;
					var dataAllInc = obi_getIncData[obj_array_outKey[i]];
					for (var j = dataAllInc.length - 1; j >= 0; j--) {
			            		if(dataAllInc[j].net_card == obj_array_url_name[0] ){
			            			dataInc = dataAllInc[j][k];
			            			break;
			            		}
			        }
					var changeData2 = new math.ChangeData();
					var dataHis = changeData2.m2(obj_data_his[k],dataInc);
					var data_null = changeData2.m4(dataHis);
					var after_data = changeData2.m1(data_null);
					 dataFlot[k] = after_data;
					 i++;
				}
				return dataFlot;
       		};
       		this.SetDatePie =function(obj_name,obj_type,obj_getIncData) {
    //    			var dataObject = new math.GetData();
				// var allData = dataObject.getRandomData();
				// 这个是获得增量数据--圆饼图数据----getIncData代替
				var afterData            = {};
				var dataAllDisk =	obj_getIncData.Graph_disk;
				var dataDisk = {};
				for (var i = dataAllDisk.length - 1; i >= 0; i--) {
					if(dataAllDisk[i].net_card == obj_name){
						dataDisk = dataAllDisk[i];
						break;
					}
				}
				if(obj_type == "db"){
					function setDbFun(){
						var dataDb ={};
						dataDb["disk_space"] =dataDisk.disk_space[0].data;
						dataDb["disk_inodes_util"] =dataDisk.disk_inodes_util[0].data;
						dataDb["swap_space"] =obj_getIncData.Graph_swap_size[0].swap_space[0].data;
						dataDb["memory_space"] =obj_getIncData.Graph_memory[0].memory_space[0].data;
						dataDb["buffer_pool"]=obj_getIncData.Graph_db_buffer_pool[0].db_buffer_pool[0].data;
						var pieName = ["used","free","buffers","cached"];
						for(var k in dataDb){
							var dataArray            = [];
							for(var j=0;j<dataDb[k].length;j++){
								var dataObjUse           ={};
								dataObjUse["name"]       = pieName[j];
								dataObjUse["y"]          = parseInt(dataDb[k][j]);
								dataArray.push(dataObjUse);
							}
							afterData[k]             =dataArray;
						}
					}
					setDbFun();
				}else if(obj_type == "system"){
					function setSystemFun(){
						var data                 ={};
						data["disk_space"] =dataDisk.disk_space[0].data;
						data["disk_inodes_util"] =dataDisk.disk_inodes_util[0].data;
						data["swap_space"] =obj_getIncData.Graph_swap_size[0].swap_space[0].data;
						data["memory_space"] =obj_getIncData.Graph_memory[0].memory_space[0].data;
						var pieName = ["used","free","buffers","cached"];
						
						for(var k in data){
							var dataArray            = [];
							for(var j=0;j<data[k].length;j++){
								var dataObjUse           ={};
								dataObjUse["name"]       = pieName[j];
								dataObjUse["y"]          = parseInt(data[k][j]);
								dataArray.push(dataObjUse);
							}
							afterData[k]             =dataArray;
						}
					}
					setSystemFun();
				}
				return afterData;
       		};
	}
	return {
		SetDygraphs : SetDygraphs
	};
});

