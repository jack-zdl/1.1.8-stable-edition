function runFlotFunction () {
    var getData = new Object({
    　　　
    　　　　m1 : function (obj_url){
                //获得全量数据
                var dataAllGraphHost ={};
    　　　　　 $.ajax({
                    url:obj_url,
                    method:"get",
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                        dataAllGraphHost = result;
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("getData 状态 " + status);
                    }
                });
                
                return dataAllGraphHost;
    　　　　},
    　　　　m2 : function (obj_inc_url){
                //获得增量数据
    　　　　　　var dataGraphHost ={};
    　　　　　 $.ajax({
                    url:obj_inc_url,
                    method:"get",
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                        debugger;
                        dataGraphHost = result;
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("getIncData 状态 " + status);
                    }
                });
                
                return dataGraphHost;
    　　　　}
    　　});
    var changeData = new Object({
    　　　　m1 : function (obj_data){
                //处理原始全量数据
                var int_data =0;
                var after_data = [];
                for (var i = obj_data.length - 1; i >= 0; i--) {
                    if(int_data == 0 ){
                        if(obj_data[i].id == 0){
                            int_data = 1;
                            obj_data.splice(i,1);
                            continue;
                        }
                    }
                     if(i > 200 &&  i <300){
                      
                            obj_data[i].data[1]=null;

                        }
                    after_data.push(obj_data[i].data);
                }
                return after_data;　
    　　　　},
    　　　　m2 : function (obj_data_his,obj_data_inc){
    　　　　　　/*处理原始增量数据，将增量数据加进去
                 *1  If 720  greater than length of old(history) data, add data to old data.
                 *2  If 720  don`t greater than length of old data, on the basis of id,add data to old data.
                 */
                 if(obj_data_his.length >= 720){
                    var obj_data_his_length =obj_data_his.length;
                    for (var j =0; j <  obj_data_his_length ; j++) {
                      if(obj_data_his[j].id == obj_data_inc[0].id){
                          obj_data_his.splice(j,1,obj_data_inc[0]);
                      }
                    }
                    return obj_data_his;
                 }else{
                    debugger;
                    obj_data_his.push(obj_data_inc[0]);
                    return obj_data_his;
                 }

    　　　　},
            m3 : function (obj_array) {
                //js 的冒泡排序
                var length = obj_array.length;
                for (var i = length - 1; i >= 0; i--) {
                   for (var j = length - 1; j >= 0; j--) {
                       if(obj_array[j]> obj_array[j+1]){
                           var aux = obj_array[j];
                           obj_array[j] = obj_array[j+1];
                           obj_array[j+1] = aux;
                       }
                   }
                }
                return obj_array;
            },
            m4 : function (obj_array) {
                //断点设置  js 的比较大小，添加null值进去
                 var length = obj_array.length;
                for (var i = length - 1; i >= 0; i--) {
                    var j=(obj_array[i].data[0]-obj_array[i+1].data[0])/6000;
                    if(j > 1){
                        

                    }  
                }
            }
    　　});

    var options = new Object({
    　　　　m1 : {//network的option
                 series: {
                      lines: { show: true, fill: true ,fillColor: "rgba(154,255,154,1)"},
                      points: { show: false, fill: false }
                },
                 xaxes: [{
                            mode: "time",
                            timeformat: "%H/%M/%S"
                           
                        }],
                legend: {
                    show : true,
                    noColumns: 0,
                    labelFormatter: function (label, series) {
                        return "<font color=\"white\">" + label + "</font>";
                    },
                    backgroundColor: "#000",
                    backgroundOpacity: 0.9,
                    labelBoxBorderColor: "#000000",
                    position: "nw"
                },
                grid: {
                    hoverable: true,
                    borderWidth: 3,
                    mouseActiveRadius: 50,
                    backgroundColor: { colors: ["#ffffff", "#EDF5FF"] },
                    axisMargin: 20
                },
                yaxis: {        
                    color: "black"
                },
                selection: {
                            mode: "x"
                        }
    　　　　　
    　　　　},
    　　　　m2 : function(){
                //...
    　　　　},
            m3 :  {
                //demo network
                series :{
                    lines : {
                        show : true ,
                        lineWidth :1
                    },
                    shadowSize :0
                },
                xaxis: {
                  ticks: [],
                  mode : "time"
             //     min: 1476657700,
             //     max: 1476658000
                },
                yaxis: {
                    ticks: []
                },
                selection: {
                    mode: "x"
                }
              }
    　　});
    var modelShowFlot = new Object({
    　　　　m1 : function (){
    　　　　　　return function showTooltip(x, y, color, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y - 40,
                left: x - 120,
                border: '2px solid ' + color,
                padding: '3px',
                'font-size': '9px',
                'border-radius': '5px',
                'background-color': '#fff',
                'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                opacity: 0.9
            }).appendTo("body").fadeIn(200);
        };
    　　　　},
    　　　　m2 : function () {
             var previousPoint = null, previousLabel = null;
            $(this).bind("plothover", function (event, pos, item) {
                if (item) {
                    if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                        previousPoint = item.dataIndex;
                        previousLabel = item.series.label;
                        $("#tooltip").remove();
                        
                        var x = item.datapoint[0];
                        var y = item.datapoint[1];
                        var date = new Date(x);
                        var color = item.series.color;

                        showTooltip(item.pageX, item.pageY, color,
                                    "<strong>" + item.series.label + "</strong><br>"  +
                                    (date.getHours() + 1) + "/" + date.getMinutes() +"/"+date.getSeconds()+
                                    " : <strong>" + y + "</strong> (USD/oz)");
                    }
                } else {
                    $("#tooltip").remove();
                    previousPoint = null;
                }
            });


        }

    　　});

    //执行network的flot图
    var flot_network = function (){
        var url_network = "http://"+IP+"/v1/kv/cmha/service/"+"BOCOP"+"/Graph/Networktraffic/history/"+"cmha-chap2"+"/"+"lo"+"?raw";
        var dataNetwork = getData.m1(url_network);
        var data_net_output = dataNetwork.net_output_Bytes;
        var data_net_input  = dataNetwork.net_input_Bytes;
        var after_data_net_output;
        var after_data_net_input ;
        /*get old data 
         *get increment data
         */
        var  runDataIncFunction = function () {
            var inc_url_network = "http://"+IP+"/v1/kv/cmha/service/"+"BOCOP"+"/Graph/Networktraffic/"+"cmha-chap2"+"/"+"lo"+"?raw"; 
            var dataIncNetwork = getData.m2(inc_url_network);
            var data_inc_net_output = dataIncNetwork.net_output_Bytes;
            var data_inc_net_input = dataIncNetwork.net_input_Bytes;
            var data_com_net_output = changeData.m2(data_net_output,data_inc_net_output);
            var data_com_net_input = changeData.m2(data_net_input,data_inc_net_input);
          
             after_data_net_output = changeData.m1(data_com_net_output);
            
             after_data_net_input = changeData.m1(data_com_net_input);
            
        };
        runDataIncFunction();
        var int=setInterval(runDataIncFunction,60000); 

        var dataFlotNetwork  =  [
          { label: "input", data: after_data_net_input },
          { label: "output", data: after_data_net_output } 
         ];
         var dataDemoFlotNetwork  =  [
          { label: "", data: after_data_net_input },
          { label: "", data: after_data_net_output } 
         ];
        //  show flot data
        $.fn.UseTooltip = function () {
             var previousPoint = null, previousLabel = null;
            $(this).bind("plothover", function (event, pos, item) {
                if (item) {
                    if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                        previousPoint = item.dataIndex;
                        previousLabel = item.series.label;
                        $("#tooltip").remove();    
                        var x = item.datapoint[0];
                        var y = item.datapoint[1];
                        var date = new Date(x);
                        var color = item.series.color;

                        showTooltip(item.pageX, item.pageY, color,
                                    "<strong>" + item.series.label + "</strong><br>"  +
                                    (date.getHours() + 1) + "/" + date.getMinutes() +"/"+date.getSeconds()+
                                    " : <strong>" + y + "</strong> (USD/oz)");
                    }
                } else {
                    $("#tooltip").remove();
                    previousPoint = null;
                }
            });
        };
    //assocoate with UseTooltip function
        function showTooltip(x, y, color, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y - 40,
                left: x - 120,
                border: '2px solid ' + color,
                padding: '3px',
                'font-size': '9px',
                'border-radius': '5px',
                'background-color': '#fff',
                'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                opacity: 0.9
            }).appendTo("body").fadeIn(200);
        }

        var flotNetworkHost =  $.plot($("#network_host"), 
            dataFlotNetwork,
            options.m1
        );
        $("#network_host").UseTooltip();
    /*satrt伸缩轴模型*/
        var overview =   $.plot($("#demo_network_host"), dataDemoFlotNetwork,options.m3);
            //对原图表建立可点击伸缩轴
            $("#demo_network_host").bind("plotselected", function (event, ranges) {
                // do the zooming
                $.each(flotNetworkHost.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                flotNetworkHost.setupGrid();
                flotNetworkHost.draw();
                flotNetworkHost.clearSelection();
                // don't fire event on the overview to prevent eternal loop
                overview.setSelection(ranges, true);
            });
            //对样表建立伸缩轴
            $("#demo_network_host").bind("plotselected", function (event, ranges) {
                flotNetworkHost.setSelection(ranges);
            });     
    /*end伸缩轴模型*/

    };
    flot_network();
}
runFlotFunction();
  