/*
	采用模块化编写,将一些抽象函数写在这里,在另一个文件中调用,
	模块 GetData函数  ChangeData函数，opntions设置属性，
 */
//获得serviceName   hostName
require.config({
	paths:{
		"jquery" : "lib/jquery"
	}
});
define(['jquery'], function($){
	var graphIdLength = globalObject.getGraphFreshenTime();
　　function GetData() {
		
		this.getHistoryData = function(obj_url) {//得到历史数据
			var dataAllGraphHost = {};　　　　　
            $.ajax({
                url: obj_url,
                method: "get",
                async: false,
                dataType: "json",
                success: function(result, status, xhr) {
                    dataAllGraphHost = result;
                },
                error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("gethistoryData 状态 =" + status);
                }
            });
            return dataAllGraphHost;　
		};
		this.getRandomData  = function() {//得到增量数据
			
			var dataAllGraphHost = {};
			$.ajax({
                url:"http://" + configObject.IP + "/v1/kv/cmha/service/"+globalObject.serviceName+"/Graph/current/"+globalObject.hostName+"?raw" ,
                method: "get",
                async: false,
                dataType: "json",
                success: function(result, status, xhr) {
                    dataAllGraphHost = result;
                },
                error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getimsData 状态 " + status);
                }
            });
        	return dataAllGraphHost;
		};
	}
	function ChangeData() {

		this.m1 = function(obj_data) {  //处理原始全量数据
			 var  after_data = [];
            for (var i = 0; i < obj_data.length; i++) {
            	for (var j = obj_data[i].data.length - 1; j >= 0; j--) {
            		var Intdata =  Number(obj_data[i].data[j]);
            		 obj_data[i].data.splice(j, 1, Intdata );

            	}
                after_data.push(obj_data[i].data);
            }
            return after_data;　　
		};
		this.m2 = function(obj_data_his,obj_data_inc) {   //处理原始增量数据，将增量数据加进去
	         if (obj_data_his.length >= graphIdLength) {
                var obj_data_his_length = obj_data_his.length;
                for (var j = 0; j < obj_data_his_length; j++) {
                    if (obj_data_his[j].id == obj_data_inc[0].id) {
                    //    obj_data_his.splice(j, 1, obj_data_inc[0]);
                          obj_data_his.splice(j,1);
                          obj_data_his.push(obj_data_inc[0]);
                        return obj_data_his;
                    }
                }

                return obj_data_his;
            } else {
                obj_data_his.push(obj_data_inc[0]);
                return obj_data_his;
            }
            return obj_data_his;
		};
		this.m3 = function(obj_array) {	////js 的插入排序 从小到大
			 var len = obj_array.length,
                tmp, j;
            for (var i = 1; i < len; i++) {

                var data_array = obj_array[i];
                j = i ;
                tmp = obj_array[i].data[0];
                while (j > 0 && tmp < obj_array[j-1].data[0]) {
                    obj_array[j] = obj_array[j-1];
                    j--;
                }
                obj_array[j] = data_array;
            }
            return obj_array;
		};
		this.m4 = function(obj_array) {	//断点设置  js 的比较大小，添加null值进去
            var len = obj_array.length;
            var dataLength = obj_array[0].data;  //查看有几条线
            //= len - 1; i >= 0; i--
            for (var i = 0; i < len-1; i++ ) {

                var quotient = Math.floor((obj_array[i+1].data[0] - obj_array[i].data[0]) / configObject.graphFreshenTime);//60000
                var dataStart = obj_array[i].data[0];
                if (quotient > 1) {
                    for (var j = quotient - 1; j > 0; j--) {

                        var Intdatatimestamp = parseInt(dataStart, 10);
                        var stringData = "" + (Intdatatimestamp + j * configObject.graphFreshenTime);//60000
                        //添加入几条null
                        var data_m_array  = [];
                        data_m_array.push(stringData);
                        for (var k = dataLength.length - 2; k >= 0; k--) {
                        	data_m_array.push(null);
                        }
                        var incObject = {
                            "data": data_m_array
                        };
                        obj_array.splice(i+1, 0, incObject);
                    }
                }
            }
            return obj_array;
		};
	}
	function Options() {
		this.m1 = function(obj_name) {
			return {
				axes: {
           			x: {
                        //   axisLabelFormatter: function (d, gran) {
                        //     return d.toLocaleDateString();
                        // },
                        valueFormatter: function (ms) {
                            return new Date(ms).toLocaleString();//点击显示的时间toLocaleTimeString();//toLocaleDateString();
                        },
		               // valueFormatter: Dygraph.dateString_, //x轴时间
		              axisLabelFormatter: Dygraph.dateAxisFormatter,
		                ticker: Dygraph.dateTicker
		            }
        		},
        		stackedGraph: false,
                //UTC时间
               
                 // labels: ['local time', 'random'],


        		strokeBorderColor:"white",
        		avoidMinZero :true,
        	//	showRangeSelector:true,  is model dygraphs
        	//	showLabelsOnHighlight :false,  is show labels
        	//	highlightCircleSize: 2,
		    //    strokeWidth: 1,
		    //labels: labels.slice(),
		        highlightCircleSize: 2,
        		strokeWidth: 1,
                /*
                联动
                 */
                // zoom: true,
                // selection: true,
         // range: syncRange,

		        strokeBorderWidth: false ? null : 0,
		         showLabelsOnHighlight: true,
		         highlightSeriesBackgroundAlpha :1,
				//xLabelHeight:4,
		        highlightSeriesOpts: {
		          strokeWidth: 3,
		          //strokeBorderWidth: 1,
		          highlightCircleSize: 6
		        },

				// labels: [ "Date", "load1", "load5", "load15"],
				// colors: [ "#00DD55", "rgb(255,100,100)","rgb(51,204,204)"],  /*为每条线设定颜色，但是太麻烦*/
				legend: "always",
                title: {
                   // //text:'System Load Average',
                },

                labelsDivStyles: { 'textAlign': 'left' },
                ylabel: 'load',
        //        labelsDiv: document.getElementById('status'),
                labelsDiv: document.getElementById(obj_name),
                labelsSeparateLines: true,
                labelsKMB: true,
            	axisLineColor: 'black',
                axisLineWidth :3,
                 labelsUTC  :false
              //   labels: ['local time', 'random']
			};
		};
		this.pieFun = function() {
			return {
				 	chart: {
				 		backgroundColor:'#ffffff',
            			plotBackgroundColor: '#ffffff',
            			plotBorderWidth: null,
            			plotShadow: false,
            			type: 'pie'
        			},
        			title: {
        				style:{
 							"color": "#000000",
 							"fontSize": "12px"
        				},
            			text: ''
        			},
					tooltip: {  //提示信息
				        formatter: function() {
				            return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 1) +'% ('+
				                         Highcharts.numberFormat(this.y, 0, ',') +' )'+',total=('+this.total+')';
				        }
					},
					credits: {
          			enabled: false  //将highcharts的标签显示在右下角
      				},
        			plotOptions: {
            			pie: {
                			allowPointSelect: true,
                			size:90,
                			//colors:['#7cb5ec', '#434348'],
                		//	showInLegend:true,
                			cursor: 'pointer',
                			borderWidth:0,
                			borderColor:'#ffffff',
                			dataLabels: {
                			//	padding:0,
                				color:"#000000",
                				distance:10,
                				crop:false,
                    		//	enabled: true,
                    			format: '<b>{point.name}</b>:<br> {point.percentage:.1f} %',
                    			style: {
                        	//		color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    				"textShadow": "0px 0px contrast" 
                    			},
                    			connectorColor: '#000000'
                			}
            			}
        			},
        			series: [{
        				data:[],
            			name: 'Brands'
           
        			}]
			};
		};
	}

	return {
		
		GetData : GetData,
		ChangeData : ChangeData,
		Options  : Options
       
	};
});