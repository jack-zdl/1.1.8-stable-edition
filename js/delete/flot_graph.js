$(".GLD").click(function(){
      nameDisk = $(this).attr("id");
       
 $('#cpu1_host').empty(); 
  $('#choices_cpu1').empty(); 

 $('#cpu2_host').empty(); 
  $('#choices_cpu2').empty(); 

  $('#network_host').empty(); 
  $('#choices').empty(); 

$('#swap_host').empty(); 
  $('#choices_swap').empty(); 

 $('#disk_iops_host').empty(); 
  $('#choices_disk_iops').empty(); 

   $('#disk_Throughput_host').empty(); 
  $('#choices_disk_Throughput').empty();

   $('#disk_queue_host').empty(); 
  $('#choices_disk_queue').empty(); 
  
   $('#disk_await_host').empty(); 
  $('#choices_disk_await').empty(); 
  
   $('#disk_svctm_host').empty(); 
  $('#choices_disk_svctm').empty(); 
  
   $('#disk_util_host').empty(); 
  $('#choices_disk_util').empty(); 
    runFlotFunction();
});

$(".GL").click(function(){
    net1_card = $(this).attr("id");
   

    // document.cookie = "graph_card=" + graph_card;
    //var newrunFlotFunction = new runFlotFunction();
    // $.plot('#network_host', {}, {});
    //  $.plot('#demo_network_host', {}, {});
   // flotNetworkHost.destroy();
 $('#cpu1_host').empty(); 
  $('#choices_cpu1').empty(); 

 $('#cpu2_host').empty(); 
  $('#choices_cpu2').empty(); 

  $('#network_host').empty(); 
  $('#choices').empty(); 

$('#swap_host').empty(); 
  $('#choices_swap').empty(); 

 $('#disk_iops_host').empty(); 
  $('#choices_disk_iops').empty(); 

   $('#disk_Throughput_host').empty(); 
  $('#choices_disk_Throughput').empty();

   $('#disk_queue_host').empty(); 
  $('#choices_disk_queue').empty(); 
  
   $('#disk_await_host').empty(); 
  $('#choices_disk_await').empty(); 
  
   $('#disk_svctm_host').empty(); 
  $('#choices_disk_svctm').empty(); 
  
   $('#disk_util_host').empty(); 
  $('#choices_disk_util').empty(); 
    runFlotFunction();
});



 function getAllCard () {
        net1_card = $($($("#Network").children("li")[0]).children("a")).html();
        nameDisk = $($($("#Disk").children("li")[0]).children("a")).attr("id");
        nameHtmlDisk = $($($("#Disk").children("li")[0]).children("a")).html();
    } 
    getAllCard();
function runFlotFunction() {
    function add0(m){return m<10?'0'+m:m }
    var getData = new Object({　　　　
        m1: function(obj_url) {
            //获得全量数据
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
                    console.error("gethistoryData 状态 " + status);
                }
            });
            return dataAllGraphHost;　　　　
        },
        m2: function(obj_inc_url) {
            //获得增量数据
            　　　　　　
            var dataGraphHost = {};　　　　　
            $.ajax({
                url: obj_inc_url,
                method: "get",
                async: false,
                dataType: "json",
                success: function(result, status, xhr) {
                    dataGraphHost = result;
                },
                error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getIncData 状态 " + status);
                }
            });

            return dataGraphHost;　　　　
        },
        m3: function() {
            var dataset = [
            
            ];
            return dataset;
        }　　
    });

    var changeData = new Object({　　　　
        m1: function(obj_data) {
            //处理原始全量数据
            var int_data = 0;
            var after_data = [];
            for (var i = obj_data.length - 1; i >= 0; i--) {
                if (int_data == 0) {
                    if (obj_data[i].id == 0) {
                        int_data = 1;
                        obj_data.splice(i, 1);
                        continue;
                    }
                }
                if (i > 200 && i < 300) {

                    obj_data[i].data[1] = null;

                }
                after_data.push(obj_data[i].data);
            }
            return after_data;　　　　　
        },
        　　　　m2: function(obj_data_his, obj_data_inc) {　　　　　　
            /*处理原始增量数据，将增量数据加进去
             *1  If 720  greater than length of old(history) data, add data to old data.
             *2  If 720  don`t greater than length of old data, on the basis of id,add data to old data.
             */
            if (obj_data_his.length >= 5) {
                var obj_data_his_length = obj_data_his.length;
                for (var j = 0; j < obj_data_his_length; j++) {
                    if (obj_data_his[j].id == obj_data_inc[0].id) {
                        obj_data_his.splice(j, 1, obj_data_inc[0]);
                        return obj_data_his;
                    }
                }

                return obj_data_his;
            } else {
                obj_data_his.push(obj_data_inc[0]);
                return obj_data_his;
            }
            return obj_data_his;
        },
        m3: function(obj_array) {
            //js 的冒泡排序

            var len = obj_array.length,
                tmp, j;
            for (var i = 1; i < len; i++) {

                var data_array = obj_array[i];
                tmp = obj_array[i].data[0];
                j = i - 1;
                while (j >= 0 && tmp < obj_array[j].data[0]) {
                    obj_array[j + 1] = obj_array[j];
                    j--;
                }
                obj_array[j + 1] = data_array;
            }
            return obj_array;
        },
        m4: function(obj_array) {
            //断点设置  js 的比较大小，添加null值进去
            var len = obj_array.length;
            for (var i = len - 1; i > 0; i--) {

                var quotient = Math.floor((obj_array[i].data[0] - obj_array[i - 1].data[0]) / 60000);
                var dataStart = obj_array[i - 1].data[0];
                if (quotient > 1) {
                    for (var j = quotient - 1; j > 0; j--) {

                        var Intdatatimestamp = parseInt(dataStart, 10);
                        var stringData = "" + (Intdatatimestamp + j * 60000);
                        var incObject = {
                            "data": [stringData, null]
                        };
                        obj_array.splice(i, 0, incObject);
                    }
                }
            }
            return obj_array;
        },
        m5: function(obj_array) {
            //delete id=0 from all history data
            // all history data sort by desc
            var len = obj_array.length;
            for (var i = len - 1; i >= 0; i--) {
                if (obj_array[i].id == 0) {
                    obj_array.splice(i, 1);
                    break;
                }
            }
            return obj_array;
        },
        m6 : function (num, total) { 
            num = parseFloat(num); 
            total = parseFloat(total); 
            if (isNaN(num) || isNaN(total)) { 
            return "-"; 
            } 
            return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%"); 
        } 　　
    });

    var options = new Object({　　　　
        m1: {
            //network的option
            series: {
                lines: {
                    show: true,
                    fill: true
                }, //,fillColor: "rgba(154,255,154,1)"
                points: {
                    show: false,
                    fill: false
                }
            },
            xaxes: [{
                mode: "time",
                //          timeformat: "%H/%M/%S",
                tickFormatter: function(val, axis) {
                    var d = new Date(val);
            //        return (d.getHours()) + "/" + d.getMinutes() + "/" + d.getSeconds();
                     return (d.getHours()) + ":" + add0(d.getMinutes() )+ ":" +add0( d.getSeconds());
                }
            }],
            legend: {
                container: $(".label_network_host"),
                show: true,
                noColumns: 0,
                labelFormatter: function(label, series) {
                    return "<font color=\"red\">" + label + "</font>";
                },
          //      backgroundColor: "#000",
                 backgroundColor: "#2A212A",
                backgroundOpacity: 0.9,
          //      labelBoxBorderColor: "#000000",
              labelBoxBorderColor: "#2A212A",
                position: "nw"
            },
            grid: {
                autoHighlight: false,
                hoverable: true,
                borderWidth: 3,
                mouseActiveRadius: 50,
                backgroundColor: {
                     colors: ["#2A212A", "#2A212A"]
                   // colors: ["#000", "#000000"]
                },
                axisMargin: 20
            },
            yaxis: {
                color: "black"
            },
            crosshair: {
                mode: "x"
            }　　　　　　　　　
        },
        m2: {
            series: {
                pie: {
                    show: true,
                          label: {
                            show:true,
                            radius: 0.8,
                            formatter: function (label, series) {                
                                return '<div style="border:1px solid grey;font-size:8pt;text-align:center;padding:5px;color:white;">' +
                                label + ' : ' +
                                Math.round(series.percent) +
                                '%</div>';
                            },
                            background: {
                                opacity: 0.8,
                                color: '#000'
                            }
                        },
                        grid: {
                            hoverable: true
                        }

                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true
            }
        },
        m3: {
            //demo network
            series: {
                lines: {
                    show: true,
                    lineWidth: 1
                },
                shadowSize: 0
            },
            xaxis: {
                ticks: [],
                mode: "time"
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
    //////////////////////
    //面向对象写法使用构造函数写法 // //
    //////////////////////
    function Visitors() {
        /**
         * [m1 SET UP flot visitors demo]
         * @param  {[type]} obj_id        [id of flot visitors graph]
         * @param  {[type]} obj_flot      [function Name  of flot graph]
         * @param  {[type]} obj_flot_demo [function Name of flot demo graph]
         * @return {[type]}               [no]
         */
        this.m1 = function(obj_id, obj_flot, obj_flot_demo) {
            //对原图表建立可点击伸缩轴
            $(obj_id).bind("plotselected", function(event, ranges) {
                // do the zooming
                $.each(obj_flot.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                obj_flot.setupGrid();
                obj_flot.draw();
                obj_flot.clearSelection();
                // don't fire event on the overview to prevent eternal loop
                obj_flot_demo.setSelection(ranges, true);
            });
            //对样表建立伸缩轴
            $( + obj_id).bind("plotselected", function(event, ranges) {
                obj_flot.setSelection(ranges);
            });
        };
    }
    /**
     * [ShowTooltip SET UP SHOW DATA OF FLOT]
     */
    function ShowTooltip(){
        this.m1 = function (obj_key) {
              //  show flot data
         var UseTooltip = function() {
            var previousPoint = null,
                previousLabel = null;
            $(this).bind("plothover", function(event, pos, item) {
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
                            "<strong>" + item.series.label + "</strong><br>" +
                            //              (date.getHours() + 1) + "/" + date.getMinutes() +"/"+date.getSeconds()
                            (date.getHours()) + "/" + date.getMinutes() + "/" + date.getMinutes() + " : <strong>" + y + "</strong> ("+obj_key+"/s)");
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

        return  UseTooltip();
    };
}

var changeAugmenter = new Object({
    dataAllGraphHost : {},
    m1 : function(){
        console.log("serviceName="+serviceName+"hostName="+hostName);
        $.ajax({
                url:"http://" + IP + "/v1/kv/cmha/service/"+serviceName+"/Graph/current/"+hostName+"?raw" ,
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
    },
    getGraph_cpu_load : function(){
        var Graph_cpu_load=[];
        Graph_cpu_load=dataAllGraphHost.Graph_cpu_load;
        return Graph_cpu_load;
    },
    getGraph_cpu_util : function() {
        var Graph_cpu_util=[];
        Graph_cpu_util=dataAllGraphHost.Graph_cpu_util;
        return Graph_cpu_util;
    },
    //network的变化的网卡名字和数量
    getDataNetwork : function(obj_name) {
        var DataNetwork=[];
        var len = dataAllGraphHost.Graph_net.length;
        for (var i = len - 1; i >= 0; i--) {
            if(dataAllGraphHost.Graph_net[i].net_card == obj_name){
                DataNetwork.push(dataAllGraphHost.Graph_net[i]);
                return DataNetwork;
            }
        }
        return DataNetwork;
    },
//元饼图 -- 内存
    getDataGraph_memory  : function() {
        var dataPiesMemory=[];
        var Graph_memory = [];
        Graph_memory =dataAllGraphHost.Graph_memory;
        for (var i = Graph_memory.length - 1; i >= 0; i--) {
            var data_Graph_memory = Graph_memory[i];
           for (var key in data_Graph_memory) {
               var obj_data = {};
               var key_memory = key;
               var data_memory= Graph_memory[0][key][0].data[1];
               obj_data['label']=key_memory;
               obj_data['data']=data_memory;
               dataPiesMemory.push(obj_data);
            }
        }
        
        return dataPiesMemory;
    },
    getSwapused : function() {
        var Swapused  = [];
        Swapused = dataAllGraphHost.Graph_swap_used;
        return Swapused;
    },
    getGraphswapsize : function() {
        var dataGraphswapsize = dataAllGraphHost.Graph_swap_size;
        return dataGraphswapsize;
    },
    getDiskData : function(obj_name) {
        var dataDiskAll = {};
        var lenDisk = dataAllGraphHost.Graph_disk.length;
        for (var i = lenDisk - 1; i >= 0; i--) {
           if(dataAllGraphHost.Graph_disk[i].disk_dev ==obj_name){
                dataDiskAll = dataAllGraphHost.Graph_disk[i];
                return dataDiskAll;
           }
        }
       return dataDiskAll;
    }
});
function setDATE(){
    changeAugmenter.m1();
    setTimeout(setDATE,10000);
}
setDATE();
//执行Cpu的flot图形
var flot_cpu1 = function() {
       
        var url_cpu1 = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_cpu_load/history/" +hostName  + "?raw";
        var dataCpu1 = getData.m1(url_cpu1);
        var data_cpu1_one = changeData.m5(dataCpu1.one_m);
        var data_cpu1_five = changeData.m5(dataCpu1.five_m);
        var data_cpu1_fifteen=changeData.m5(dataCpu1.fifteen_m);
        var after_data_cpu1_one;
        var after_data_cpu1_five;
        var after_data_cpu1_fifteen;

        var dataFlotCpu = {};
        var dataDemoFlotCpu = [];
        /*get old data ||get increment data*/
        var runDataIncFunction = function() {
            /////////////////////
            //BOCOP cmha-chap2 //
            /////////////////////
            function comData(){
            var dataIncCpu = changeAugmenter.getGraph_cpu_load();
         
            var data_inc_cpu1_one =  dataIncCpu[0].one_m;
            var data_inc_cpu1_five = dataIncCpu[0].five_m;
            var data_inc_cpu1_fifteen = dataIncCpu[0].fifteen_m;

            data_cpu1_one = changeData.m2(data_cpu1_one , data_inc_cpu1_one);
            data_cpu1_five= changeData.m2(data_cpu1_five, data_inc_cpu1_five);
            data_cpu1_five= changeData.m2(data_cpu1_five, data_inc_cpu1_five);
  
            }
            comData();
            var data_sort_cpu1_one = changeData.m3(    data_cpu1_one ); //sort data
            var data_sort_cpu1_five= changeData.m3(    data_cpu1_five); //sort data         
            var data_sort_cpu1_fifteen = changeData.m3(data_cpu1_five); //sort data

            var data_null_cpu1_one = changeData.m4(data_sort_cpu1_one); //add null into data
            var data_null_cpu1_five= changeData.m4(data_sort_cpu1_five); //add null into data  
            var data_null_cpu1_fifteen = changeData.m4(data_sort_cpu1_fifteen); //add null into data

            after_data_cpu1_one = changeData.m1(data_null_cpu1_one);
            after_data_cpu1_five = changeData.m1(data_null_cpu1_five);
            after_data_cpu1_fifteen = changeData.m1(data_null_cpu1_fifteen);

            dataFlotCpu = { "one": { label: "one", data: after_data_cpu1_one ,color: "#FF77FF"},
                                "five": { label: "five",data: after_data_cpu1_five,color: "#77DDFF" },
                                 "fifteen": { label: "fifteen",data: after_data_cpu1_fifteen ,color: "#FF3333 "}
            };
            dataDemoFlotCpu = [{label: "",data: after_data_cpu1_one,color: "#FF77FF"},
                                    {label: "",data: after_data_cpu1_five,color: "#77DDFF"},
                                   {label: "",data: after_data_cpu1_fifteen,color: "#FF3333 "
            }];
        };
        runDataIncFunction();
        setInterval(runDataIncFunction, 60000);
        ///////////
        //设置颜色//
        ///////////      
        // var i = 4;
        // $.each(dataFlotCpu, function(key, val) {
        //     val.color = i;
        //     ++i;
        // });
        /////////////////////
        //  FLOT VISITORS show flot data //
        /////////////////////
        var networkShowTooltip = new ShowTooltip();
         $.fn.UseTooltip =function(){
            networkShowTooltip.m1("KB");
         };
        /*satrt checkbox*/
        // insert checkboxes 
        var choiceContainer = $("#choices_cpu1");
        $.each(dataFlotCpu, function(key, val) {
           switch(val.label)
            {
                case 'one':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #FF77FF' for='id" + key + "'>" + val.label + "</label>");
                    break;
                case 'five':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #77DDFF' for='id" + key + "'>" + val.label + "</label>");
                    
                  break;
                case 'fifteen':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #FF3333' for='id" + key + "'>" + val.label + "</label>");
                    
                break;
            }
           
        });

        choiceContainer.find("input").click(plotAccordingToChoices);
        var flotCpuHost;
        function plotAccordingToChoices() {
             runDataIncFunction();
            var data = [];
            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && dataFlotCpu[key]) {
                    data.push(dataFlotCpu[key]);
                }
            });
            if (data.length > 0) {
                flotCpuHost = $.plot($("#cpu1_host"),
                    data,
                    options.m1
                );
                $("#cpu1_host").UseTooltip();
            }
            setTimeout(plotAccordingToChoices,60000);
        }
        plotAccordingToChoices();
        /******end checkbox***************************************************/
        /*satrt伸缩轴模型*/
        var overview = $.plot($("#demo_cpu1_host"), dataDemoFlotCpu, options.m3);
        var network_visitors = new Visitors();
        network_visitors.m1(demo_network_host, flotCpuHost, overview);
};
flot_cpu1();
//执行Cpu的flot图形
var flot_cpu2 = function() {
       
        var url_cpu2 = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_cpu_util/history/" +hostName  + "?raw";
        var dataCpu2 = getData.m1(url_cpu2);
        var data_cpu2_user = changeData.m5(  dataCpu2.user);
        var data_cpu2_sys  = changeData.m5(  dataCpu2.sys );
        var data_cpu2_idle = changeData.m5(  dataCpu2.idle);
        var data_cpu2_iow  = changeData.m5(  dataCpu2.iow );
        var data_cpu2_irq  = changeData.m5(  dataCpu2.irq );
        var data_cpu2_softirq  = changeData.m5(  dataCpu2.softirq );


        var after_data_cpu2_user;
        var after_data_cpu2_sys ;
        var after_data_cpu2_idle;
        var after_data_cpu2_iow ;
        var after_data_cpu2_irq ;
        var after_data_cpu2_softirq;

        var dataFlotCpu2 = {};
        var dataDemoFlotCpu2 = [];
        /*get old data ||get increment data*/
        var runDataIncFunction = function() {
            /////////////////////
            //BOCOP cmha-chap2 //
            /////////////////////
          
          function comData(){
  
           var dataIncCpu = changeAugmenter.getGraph_cpu_util();
           
            var data_inc_cpu2_user=  dataIncCpu[0].user;
            var data_inc_cpu2_sys =  dataIncCpu[0].sys ;
            var data_inc_cpu2_idle=  dataIncCpu[0].idle;
            var data_inc_cpu2_iow =  dataIncCpu[0].iow ; 
            var data_inc_cpu2_irq =  dataIncCpu[0].irq ; 
            var data_inc_cpu2_softirq =  dataIncCpu[0].softirq ; 

            data_cpu2_user= changeData.m2(data_cpu2_user, data_inc_cpu2_user);
            data_cpu2_sys = changeData.m2(data_cpu2_sys , data_inc_cpu2_sys );
            data_cpu2_idle= changeData.m2(data_cpu2_idle, data_inc_cpu2_idle);
            data_cpu2_iow = changeData.m2(data_cpu2_iow , data_inc_cpu2_iow );
            data_cpu2_irq = changeData.m2(data_cpu2_irq , data_inc_cpu2_irq );
            data_cpu2_softirq = changeData.m2(data_cpu2_softirq , data_inc_cpu2_softirq );
  
        }
        comData();
            //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
            

            var data_sort_cpu2_user = changeData.m3(data_cpu2_user); //sort data
            var data_sort_cpu2_sys  = changeData.m3(data_cpu2_sys ); //sort data         
            var data_sort_cpu2_idle = changeData.m3(data_cpu2_idle); //sort data
            var data_sort_cpu2_iow  = changeData.m3(data_cpu2_iow ); //sort data
            var data_sort_cpu2_irq  = changeData.m3(data_cpu2_irq ); //sort data
            var data_sort_cpu2_softirq = changeData.m3(data_cpu2_softirq ); //sort data

            var data_null_cpu2_user = changeData.m4(data_sort_cpu2_user); //add null into data
            var data_null_cpu2_sys  = changeData.m4(data_sort_cpu2_sys ); //add null into data  
            var data_null_cpu2_idle = changeData.m4(data_sort_cpu2_idle); //add null into data
            var data_null_cpu2_iow  = changeData.m4(data_sort_cpu2_iow ); //add null into data
            var data_null_cpu2_irq   = changeData.m4(data_sort_cpu2_irq ); //add null into data
            var data_null_cpu2_softirq  = changeData.m4(data_sort_cpu2_softirq ); //add null into data

            after_data_cpu2_user = changeData.m1(data_null_cpu2_user);
            after_data_cpu2_sys  = changeData.m1(data_null_cpu2_sys );
            after_data_cpu2_idle = changeData.m1(data_null_cpu2_idle);
            after_data_cpu2_iow  = changeData.m1(data_null_cpu2_iow );
            after_data_cpu2_irq  = changeData.m1(data_null_cpu2_irq );
            after_data_cpu2_softirq  = changeData.m1(data_null_cpu2_softirq );

            dataFlotCpu2 = { "user": { label: "user"    ,data: after_data_cpu2_user ,color: "#FF77FF"},
                                "sys ": { label: "sys"   ,data: after_data_cpu2_sys  ,color: "#0f77FF" },
                                "idle": { label: "idle"   ,data: after_data_cpu2_idle ,color: "#FF3333"},
                                 "irq": { label: "irq"   ,data:    after_data_cpu2_irq ,color: "#FFFF00"},
                                  "softirq": { label: "softirq"   ,data: after_data_cpu2_softirq ,color: "#33FF00"},
                                "iow ": { label: "iow",data: after_data_cpu2_iow ,color: "#7D0096" }
            };
            dataDemoFlotCpu2 = [{label: "",data: after_data_cpu2_user,   color: "#FF77FF"},
                                   {label: "",data: after_data_cpu2_sys ,color: "#0f77FF"},
                                   {label: "",data: after_data_cpu2_idle,color: "#FF3333"},
                                    {label: "",data: after_data_cpu2_idle,color: "#FFFF00"},
                                     {label: "",data: after_data_cpu2_idle,color: "#33FF00"},
                                   {label: "",data: after_data_cpu2_iow ,color: "#7D0096"
            }];
        };
        runDataIncFunction();
        setInterval(runDataIncFunction, 6000);
        ///////////
        //设置颜色//
        ///////////      
      
        /////////////////////
        //  FLOT VISITORS show flot data //
        /////////////////////
        var networkShowTooltip = new ShowTooltip();
         $.fn.UseTooltip =function(){
            networkShowTooltip.m1("KB");
         };
        /*satrt checkbox*/
        // insert checkboxes 
        var choiceContainer = $("#choices_cpu2");
         $.each(dataFlotCpu2, function(key, val) {
           switch(val.label)
            {
                case 'user':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #FF77FF' for='id" + key + "'>" + val.label + "</label>");
                    break;
                case 'sys':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #0f77FF' for='id" + key + "'>" + val.label + "</label>");
                    
                  break;
                case 'idle':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #FF3333' for='id" + key + "'>" + val.label + "</label>");
                    
                break;
                  case 'irq':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #FFFF00' for='id" + key + "'>" + val.label + "</label>");
                    
                break;
                  case 'softirq':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #33FF00' for='id" + key + "'>" + val.label + "</label>");
                    
                break;

                 case 'iow':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #7D0096' for='id" + key + "'>" + val.label + "</label>");
                    
                break;
            }
           
        });
      
        choiceContainer.find("input").click(plotAccordingToChoices);
        var flotCpu2Host;
        function plotAccordingToChoices() {
            runDataIncFunction();
            var data = [];
            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && dataFlotCpu2[key]) {
                    data.push(dataFlotCpu2[key]);
                }
            });
            if (data.length > 0) {
                flotCpu2Host = $.plot($("#cpu2_host"),
                    data,
                    options.m1
                );
                $("#cpu2_host").UseTooltip();
            }
            setTimeout(plotAccordingToChoices, 6000);
        }
        plotAccordingToChoices();
        /******end checkbox***************************************************/
        /*satrt伸缩轴模型*/
        var overview = $.plot($("#demo_cpu2_host"), dataDemoFlotCpu2, options.m3);
        var network_visitors = new Visitors();
        network_visitors.m1(demo_network_host, flotCpu2Host, overview);
};
flot_cpu2();
//network的默认折线图
//执行network的flot图
var flot_network = function() {
    console.info(hostName+serviceName+net1_card);
    $('#network_title').html("Bandwidth(net."+net1_card+")");
    var url_network  ="";
    url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_net/history/" +hostName  + "/" + net1_card + "?raw";
    var dataNetwork = {};
    dataNetwork = getData.m1(url_network);

    var data_net_output = [];
    data_net_output = changeData.m5(dataNetwork.net_output_Bytes);
    var data_net_input = [];
    data_net_input = changeData.m5(dataNetwork.net_input_Bytes);
    var after_data_net_output = [];
    var after_data_net_input = [];
    var dataFlotNetwork = {};
    var dataDemoFlotNetwork = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {

        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
        //var dataIncCpu = changeAugmenter.getGraph_cpu_util();
        /**
         * 获得增量数据
         */
        //循环增加增量数据-------
        function comDataNetwork(){
  
            var dataIncNetwork = [];
            dataIncNetwork = changeAugmenter.getDataNetwork(net1_card);
           
            /**
             * [data_inc_net_output 取出data_inc_net_output和data_inc_net_input]
             * @type {[type]}
             */
            var data_inc_net_output = [];
            data_inc_net_output = dataIncNetwork[0].net_output_Bytes;
            var data_inc_net_input  = [];
            data_inc_net_input = dataIncNetwork[0].net_input_Bytes ;
            /**
             * [data_com_net_output 合并历史数据和增量数据]
             * @type {[type]}
             */
           // var data_com_net_output = [];
            data_net_output = changeData.m2(data_net_output,data_inc_net_output);//changeData.m2(data_net_output, data_inc_net_output);                                                                         
            //var data_com_net_input = [];
            data_net_input = changeData.m2(data_net_input ,data_inc_net_input );//changeData.m2(data_net_input , data_inc_net_input );
            
  
        }
        comDataNetwork();
        /**
         * [data_sort_net_output 排序数据，使其升序排列]
         * @type {[type]}
         */
      
        var data_sort_net_output = [];
        data_sort_net_output = changeData.m3(data_net_output); //sort data
        var data_sort_net_input = [];
        data_sort_net_input  = changeData.m3(data_net_input ); //sort data         
        /**
         * [data_null_net_output add null into data]
         * @type {[type]}
         */
        var data_null_net_output = [];
        data_null_net_output = changeData.m4(data_sort_net_output); //add null into data
        var data_null_net_input = [];
        data_null_net_input = changeData.m4(data_sort_net_input ); //add null into data          
        /**
         * [after_data_net_output 取出data]
         * @type {[type]}
         */
        after_data_net_output = changeData.m1(data_null_net_output);
        after_data_net_input  = changeData.m1(data_null_net_input );

        dataFlotNetwork = { "sent": { label: "sent", data: after_data_net_output,color: "#CD0000" },
                            "received": { label: "received",data: after_data_net_input,color: "#76EE00" }
        };
        dataDemoFlotNetwork = [{label: "",data: after_data_net_input,color: "#CD0000"},
                               {label: "",data: after_data_net_output,color: "#76EE00"
        }];
       
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 10000);
    ///////////
    //设置颜色//            flot_updating_chart.setData([getRandomData()]);
                          //flot_updating_chart.draw();
    ///////////      
    
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices");
      $.each(dataFlotNetwork, function(key, val) {
           switch(val.label)
            {
                case 'sent':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #CD0000' for='id" + key + "'>" + val.label + "</label>");
                    break;
                case 'received':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #76EE00' for='id" + key + "'>" + val.label + "</label>");
                    
                  break;
            }
           
        });
    choiceContainer.find("input").click(plotAccordingToChoices);
   var flotNetworkHost;
    function plotAccordingToChoices() {
        runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotNetwork[key]) {
                data.push(dataFlotNetwork[key]);
            }
        });
        if (data.length > 0) {
            flotNetworkHost = $.plot($("#network_host"),
                data,
                options.m1
            );
            $("#network_host").UseTooltip();
        }
        ///
        setTimeout(plotAccordingToChoices, 6000);
    }
    plotAccordingToChoices();

    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_network_host"), dataDemoFlotNetwork, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_network_host, flotNetworkHost, overview);

    //动态显示数据--实时数据
    
};
flot_network();
var flot_network2 = function() {
    $('#network_title2').html("Net Packets (net."+net1_card+")");
    console.info(hostName+serviceName+net1_card);
    var url_network  ="";
    url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_net/history/" +hostName  + "/" + net1_card + "?raw";
    var dataNetwork = {};
    dataNetwork = getData.m1(url_network);

    var data_net_output = [];
    data_net_output = changeData.m5(dataNetwork.net_input_packets);
    var data_net_input = [];
    data_net_input = changeData.m5(dataNetwork.net_output_packets);
    var after_data_net_output = [];
    var after_data_net_input = [];
    var dataFlotNetwork2 = {};
    var dataDemoFlotNetwork2 = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {

        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
        //var dataIncCpu = changeAugmenter.getGraph_cpu_util();
        /**
         * 获得增量数据
         */
        //循环增加增量数据-------
        function comDataNetwork(){
  
            var dataIncNetwork = [];
            dataIncNetwork = changeAugmenter.getDataNetwork(net1_card);
           
            /**
             * [data_inc_net_output 取出data_inc_net_output和data_inc_net_input]
             * @type {[type]}
             */
            var data_inc_net_output = [];
            data_inc_net_output = dataIncNetwork[0].net_output_packets;
            var data_inc_net_input  = [];
            data_inc_net_input = dataIncNetwork[0].net_input_packets ;
            /**
             * [data_com_net_output 合并历史数据和增量数据]
             * @type {[type]}
             */
           // var data_com_net_output = [];
            data_net_output = changeData.m2(data_net_output,data_inc_net_output);//changeData.m2(data_net_output, data_inc_net_output);                                                                         
            //var data_com_net_input = [];
            data_net_input = changeData.m2(data_net_input ,data_inc_net_input );//changeData.m2(data_net_input , data_inc_net_input );
            
  
        }
        comDataNetwork();
        /**
         * [data_sort_net_output 排序数据，使其升序排列]
         * @type {[type]}
         */
      
        var data_sort_net_output = [];
        data_sort_net_output = changeData.m3(data_net_output); //sort data
        var data_sort_net_input = [];
        data_sort_net_input  = changeData.m3(data_net_input ); //sort data         
        /**
         * [data_null_net_output add null into data]
         * @type {[type]}
         */
        var data_null_net_output = [];
        data_null_net_output = changeData.m4(data_sort_net_output); //add null into data
        var data_null_net_input = [];
        data_null_net_input = changeData.m4(data_sort_net_input ); //add null into data          
        /**
         * [after_data_net_output 取出data]
         * @type {[type]}
         */
        after_data_net_output = changeData.m1(data_null_net_output);
        after_data_net_input  = changeData.m1(data_null_net_input );
/*
#FF77FF
#0f77FF
#FF3333
#7D0096
 */
        dataFlotNetwork2 = { "sent": { label: "sent", data: after_data_net_output,color: "#CD0000" },
                            "received": { label: "received",data: after_data_net_input,color: "#76EE00" }
        };
        dataDemoFlotNetwork2 = [{label: "",data: after_data_net_input,color: "#CD0000"},
                               {label: "",data: after_data_net_output,color: "#76EE00"
        }];
       
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 10000);
    ///////////
    //设置颜色//            flot_updating_chart.setData([getRandomData()]);
                          //flot_updating_chart.draw();
    ///////////      
    
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_network2");
      $.each(dataFlotNetwork2, function(key, val) {
           switch(val.label)
            {
                case 'sent':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='ida" + key + "'></input>" +
                    "<label  style='color: #CD0000' for='ida" + key + "'>" + val.label + "</label>");
                    break;
                case 'received':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='ida" + key + "'></input>" +
                    "<label  style='color: #76EE00' for='ida" + key + "'>" + val.label + "</label>");
                    
                  break;
            }
           
        });
    choiceContainer.find("input").click(plotAccordingToChoices);
   var flotNetworkHost2;
    function plotAccordingToChoices() {
        runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotNetwork2[key]) {
                data.push(dataFlotNetwork2[key]);
            }
        });
        if (data.length > 0) {
            flotNetworkHost2 = $.plot($("#network2_host"),
                data,
                options.m1
            );
            $("#network2_host").UseTooltip();
        }
        ///
        setTimeout(plotAccordingToChoices, 6000);
    }
    plotAccordingToChoices();

    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_network2_host"), dataDemoFlotNetwork2, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_network2_host, flotNetworkHost2, overview);

    //动态显示数据--实时数据
    
};
flot_network2();
//执行swap的flot图
//swap_used
var flot_swap = function() {
    console.info(hostName+serviceName+net1_card);
    //cmha/service/BOCOP/Graph/Graph_swap_used/history/cmha-chap1
    var url_swap = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_swap_used/history/" +hostName + "?raw";
 
    var dataSwap = getData.m1(url_swap);
    var data_swap_si = changeData.m5(dataSwap.si);
    var data_swap_so = changeData.m5(dataSwap.so);
    var after_data_swap_si;
    var after_data_swap_so;
    var dataFlotSwap    = {};
    var dataDemoFlotSwap = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {
        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
         function comData(){
  
             var dataIncSwap = changeAugmenter.getSwapused();
        /**
         * [data_inc_net_output 取出data_inc_net_output和data_inc_net_input]
         * @type {[type]}
         */
        var data_inc_swap_si = dataIncSwap[0].si;
        var data_inc_swap_so = dataIncSwap[0].so;
        /**
         * [data_com_net_output 合并历史数据和增量数据]
         * @type {[type]}
         */
        data_swap_si = changeData.m2(data_swap_si,data_inc_swap_si);//changeData.m2(data_net_output, data_inc_net_output);                                                                         
        data_swap_so = changeData.m2(data_swap_so,data_inc_swap_so);//changeData.m2(data_net_input , data_inc_net_input );
        }
        comData();
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
        //var dataIncCpu = changeAugmenter.getGraph_cpu_util();
        /**
         * 获得增量数据
         */
        /**
         * [data_sort_net_output 排序数据，使其升序排列]
         * @type {[type]}
         */
        var data_sort_swap_si = changeData.m3(data_swap_si); //sort data
        var data_sort_swap_so = changeData.m3(data_swap_so); //sort data         
        /**
         * [data_null_net_output add null into data]
         * @type {[type]}
         */
        var data_null_swap_si = changeData.m4(data_sort_swap_si); //add null into data
        var data_null_swap_so = changeData.m4(data_sort_swap_so); //add null into data          
        /**
         * [after_data_net_output 取出data]
         * @type {[type]}
         */
        after_data_swap_si = changeData.m1(data_null_swap_si);
        after_data_swap_so = changeData.m1(data_null_swap_so);

        dataFlotSwap = { "in": { label: "in", data: after_data_swap_si ,color: "#76EE00"},
                            "out" : { label: "out",  data: after_data_swap_so ,color: "#CD0000"}
        };
        dataDemoFlotSwap = [{label: "",data: after_data_swap_si,color: "#76EE00"},
                               {label: "",data: after_data_swap_so,color: "#CD0000"
        }];
    };
    runDataIncFunction();
     setInterval(runDataIncFunction, 60000);
    ///////////
    //设置颜色//
    ///////////      
    var i = 4;
    $.each(dataFlotSwap, function(key, val) {
        val.color = i;
        ++i;
    });
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("MB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_swap");
    $.each(dataFlotSwap, function(key, val) {
           switch(val.label)
            {
                case 'out':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #CD0000' for='id" + key + "'>" + val.label + "</label>");
                    break;
                case 'in':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #76EE00' for='id" + key + "'>" + val.label + "</label>");
                    
                  break;
            }
           
        });
    choiceContainer.find("input").click(plotAccordingToChoices);
    
    function plotAccordingToChoices() {
         runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotSwap[key]) {
                data.push(dataFlotSwap[key]);
            }
        });
        if (data.length > 0) {
            flotSwapHost = $.plot($("#swap_host"),
                data,
                options.m1
            );
            $("#swap_host").UseTooltip();
        }
        setTimeout(plotAccordingToChoices,60000);
    }
    plotAccordingToChoices();
    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_swap_host"), dataDemoFlotSwap, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_swap_host, flotSwapHost, overview);
};
flot_swap();
    //////////////
    //pies flot //
    //////////////
var flot_pies_memory = function() {
    $.fn.showMemo = function() {
        $(this).bind("plothover", function(event, pos, item) {
            if (!item) {
                return;
            }
            var html = [];
            var percent = parseFloat(item.series.percent).toFixed(2);
            html.push("<div style=\"border:1px solid grey;background-color:",
                item.series.color,
                "\">",
                "<span style=\"color:red\">",
                item.series.label,
                " : ",
                $.formatNumber(item.series.data[0][1], {
                    format: "#,###",
                    locale: "us"
                }),
                " (", percent, "%)",
                "</span>",
                "</div>");
            $("#flot-memo").html(html.join(''));
        });
    };
    //首先必须先有disk的名字
   
    var dataPiesMemory =  changeAugmenter.getDataGraph_memory();
   
    
    $.plot("#flot-placeholder", dataPiesMemory, options.m2);
    $("#flot-placeholder").showMemo();
};
flot_pies_memory();
var flot_Graph_swap_size = function() {
    var data_Graph_swap_size = changeAugmenter.getGraphswapsize();
    var dataSizeFree = data_Graph_swap_size[0].free[0].data[1];
    var dataSizeAll  = data_Graph_swap_size[0].total[0].data[1];
    var swapPrecent  = changeData.m6(dataSizeFree,dataSizeAll);


    $("#SizeFree").css("width",swapPrecent);
    $("#SizeTotal").append("("+"Total = "+dataSizeAll+")");
    //$("#SizeFree").style.with(swapPrecent);
    //document.getElementById( "SizeFree" ).style.with = swapPrecent;
    $("#SizeFree").html("("+swapPrecent+") ").append(dataSizeFree);
};
flot_Graph_swap_size();
var flotDiskModul = function() {

    var dataDiskAll;
    function startModul(){
        dataDiskAll =changeAugmenter.getDiskData(nameDisk);
        setTimeout(startModul,60000);
    }
    startModul();
//space的进度条
    $("#SpaceTotal").append(nameHtmlDisk);
    var dataSizeFree = dataDiskAll.space_free[0].data[1];
    var dataSizeAll  = dataDiskAll.space_total[0].data[1];
    var swapPrecent  = changeData.m6(dataSizeFree,dataSizeAll);
    $("#SpaceFree").css("width",swapPrecent);
    $("#SpaceTotal").append("("+"Total = "+dataSizeAll+")");
    $("#SpaceFree").html("("+swapPrecent+") ").append(dataSizeFree);
//inodes的进度条 Inodes
    $("#InodesTotal").append(nameHtmlDisk);
    var dataInodesUsed = dataDiskAll.inodes_used[0].data[1];
    var dataInodesAll  = dataDiskAll.inodes_total[0].data[1];
    var inodesPrecent  = changeData.m6(dataInodesUsed,dataInodesAll);
    $("#InodesFree").css("width",inodesPrecent);
    $("#InodesTotal").append("("+"Total = "+dataInodesAll+")");
    $("#InodesFree").html("("+inodesPrecent+") ").append(dataInodesUsed);
//   iops的折线图
    function flotDiskModelIops(){
      $("#iops_title").append(nameHtmlDisk);
    var url_iops = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_disk_iops/history/" +hostName  +"/"+nameDisk+ "?raw";
    var dataIops = getData.m1(url_iops);
    var data_iops_r_s    = changeData.m5(dataIops.r_s);
    var data_iops_w_s    = changeData.m5(dataIops.w_s);
  
    var after_data_iops_r_s;
    var after_data_iops_w_s;

    var dataFlotIops = {};
    var dataDemoFlotIops = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {
        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
         function comDiskData(){
            var data_inc_iops_r_s=  dataDiskAll.r_s;
            var data_inc_iops_w_s = dataDiskAll.w_s;

            data_iops_r_s= changeData.m2(data_iops_r_s, data_inc_iops_r_s);
            data_iops_w_s= changeData.m2(data_iops_w_s, data_inc_iops_w_s);
      
       }
        comDiskData();
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
  

        var data_sort_iops_r_s= changeData.m3(data_iops_r_s); //sort data
        var data_sort_iops_w_s= changeData.m3(data_iops_w_s); //sort data         
        
        var data_null_iops_r_s= changeData.m4(data_sort_iops_r_s); //add null into data
        var data_null_iops_w_s= changeData.m4(data_sort_iops_w_s); //add null into data  

        after_data_iops_r_s = changeData.m1(data_null_iops_r_s);
        after_data_iops_w_s = changeData.m1(data_null_iops_w_s);

        dataFlotIops = { "reads": { label: "reads", data: after_data_iops_r_s,color: "#76EE00"},
                        "writes": { label: "writes", data: after_data_iops_w_s  ,color: "#CD0000"}
        };
        dataDemoFlotIops = [{label: "",data: after_data_iops_r_s    ,color: "#76EE00"},
                           {label: "",data: after_data_iops_w_s,color: "#CD0000"
        }];
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 60000);
    
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_disk_iops");
   $.each(dataFlotIops, function(key, val) {
           switch(val.label)
            {
                case 'reads':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='ida" + key + "'></input>" +
                    "<label  style='color: #76EE00' for='ida" + key + "'>" + val.label + "</label>");
                    break;
                case 'writes':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='ida" + key + "'></input>" +
                    "<label  style='color: #CD0000' for='ida" + key + "'>" + val.label + "</label>");
                    
                  break;
            }
           
        });
    choiceContainer.find("input").click(plotAccordingToChoices);
    var flotCpuIops;
    function plotAccordingToChoices() {
        runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotIops[key]) {
                data.push(dataFlotIops[key]);
            }
        });
        if (data.length > 0) {
            flotCpuIops = $.plot($("#disk_iops_host"),
                data,
                options.m1
            );
            $("#disk_iops_host").UseTooltip();
        }
        setTimeout(plotAccordingToChoices,60000);
    }
    plotAccordingToChoices();
    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_disk_iops_host"), dataDemoFlotIops, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_disk_iops_host, flotCpuIops, overview);
}

flotDiskModelIops();  

//end iops的折线图
//Throughput的折线图
function flotDiskModelThroughput(){
    $("#throughput_title").append(nameHtmlDisk);
    var url_Throughput = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_disk_Throughput/history/" +hostName  +"/"+nameDisk+ "?raw";
    var dataThroughput = getData.m1(url_Throughput);
    var data_Throughput_rkB_s   = changeData.m5(dataThroughput.rkB_s);
    var data_Throughput_wkB_s   = changeData.m5(dataThroughput.wkB_s);
  
    var after_data_Throughput_rkB_s;
    var after_data_Throughput_wkB_s;

    var dataFlotThroughput = {};
    var dataDemoFlotThroughput = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {
        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
         function comDiskData(){
            var data_inc_Throughput_rkB_s=  dataDiskAll.r_s;
            var data_inc_Throughput_wkB_s = dataDiskAll.w_s;

            data_Throughput_rkB_s= changeData.m2(data_Throughput_rkB_s, data_inc_Throughput_rkB_s);
            data_Throughput_wkB_s= changeData.m2(data_Throughput_wkB_s, data_inc_Throughput_wkB_s);

       }
        comDiskData();
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
       
        var data_sort_Throughput_rkB_s= changeData.m3(data_Throughput_rkB_s); //sort data
        var data_sort_Throughput_wkB_s= changeData.m3(data_Throughput_wkB_s); //sort data         
        
        var data_null_Throughput_rkB_s= changeData.m4(data_sort_Throughput_rkB_s); //add null into data
        var data_null_Throughput_wkB_s= changeData.m4(data_sort_Throughput_wkB_s); //add null into data  

        after_data_Throughput_rkB_s = changeData.m1(data_null_Throughput_rkB_s);
        after_data_Throughput_wkB_s = changeData.m1(data_null_Throughput_wkB_s);

        dataFlotThroughput = { "reads": { label: "reads", data: after_data_Throughput_rkB_s ,color: "#76EE00"},
                         "writes": { label: "writes", data: after_data_Throughput_wkB_s ,color: "#CD0000"}
        };
        dataDemoFlotThroughput = [{label: "",data: after_data_Throughput_rkB_s,color: "#76EE00"},
                            {label: "",data: after_data_Throughput_wkB_s,color: "#CD0000"
        }];
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 60000);
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_disk_Throughput");
    $.each(dataFlotThroughput, function(key, val) {
           switch(val.label)
            {
                case 'reads':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #76EE00' for='id" + key + "'>" + val.label + "</label>");
                    break;
                case 'writes':
                    choiceContainer.append("<br/><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label  style='color: #CD0000' for='id" + key + "'>" + val.label + "</label>");
                    
                  break;
            }
           
        });
    choiceContainer.find("input").click(plotAccordingToChoices);
    var flotCpuThroughput;
    function plotAccordingToChoices() {
        runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotThroughput[key]) {
                data.push(dataFlotThroughput[key]);
            }
        });
        if (data.length > 0) {
            flotCpuThroughput = $.plot($("#disk_Throughput_host"),
                data,
                options.m1
            );
            $("#disk_Throughput_host").UseTooltip();
        }
        setTimeout(plotAccordingToChoices,60000);
    }
    plotAccordingToChoices();
    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_disk_Throughput_host"), dataDemoFlotThroughput, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_disk_Throughput_host, flotCpuThroughput, overview);
}
flotDiskModelThroughput();  

//end iops的折线图
//Queue的折线图
function flotDiskModelQueue(){
    $("#queue_title").append(nameHtmlDisk);
    var url_Queue = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_disk_queue/history/" +hostName  +"/"+nameDisk+ "?raw";
    var dataQueue = getData.m1(url_Queue);
    var data_Queue_queue   = changeData.m5(dataQueue.queue);
  
    var after_data_Queue_queue;

    var dataFlotQueue = {};
    var dataDemoFlotQueue = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {
        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
        function comDiskData(){
             var data_inc_Queue_queue=  dataDiskAll.queue;

             data_Queue_queue= changeData.m2(data_Queue_queue, data_inc_Queue_queue);

       }
       comDiskData();
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
       

        var data_sort_Queue_queue= changeData.m3(data_Queue_queue); //sort data
        
        var data_null_Queue_queue= changeData.m4(data_sort_Queue_queue); //add null into data

        after_data_Queue_queue = changeData.m1(data_null_Queue_queue);

        dataFlotQueue = { 
                         "queue": { label: "queue", data: after_data_Queue_queue ,color: "#7D0096"}
        };
        dataDemoFlotQueue = [
                            {label: "",data: after_data_Queue_queue,color: "#7D0096"
        }];
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 60000);
    ///////////
    //设置颜色//
    ///////////      
    
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_disk_queue");
    $.each(dataFlotQueue, function(key, val) {
        choiceContainer.append("<br/><input type='checkbox' name='" + key +
            "' checked='checked' id='id" + key + "'></input>" +
            "<label style='color: #7D0096'  for='id" + key + "'>" + val.label + "</label>");
    });
    choiceContainer.find("input").click(plotAccordingToChoices);
    var flotCpuQueue;
    function plotAccordingToChoices() {
        runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotQueue[key]) {
                data.push(dataFlotQueue[key]);
            }
        });
        if (data.length > 0) {
            flotCpuQueue = $.plot($("#disk_queue_host"),
                data,
                options.m1
            );
            $("#disk_queue_host").UseTooltip();
        }
        setTimeout(plotAccordingToChoices,60000);
    }
    plotAccordingToChoices();
    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_disk_queue_host"), dataDemoFlotQueue, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_disk_queue_host, flotCpuQueue, overview);
}
flotDiskModelQueue();  

//end iops的折线图
//Queue的折线图
function flotDiskModelAwait(){
    $("#await_title").append(nameHtmlDisk);
    var url_Await = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_disk_await/history/" +hostName  +"/"+nameDisk+ "?raw";
    var dataAwait = getData.m1(url_Await);
    var data_Await_await  = changeData.m5(dataAwait.await);
  
    var after_data_Await_await;

    var dataFlotAwait = {};
    var dataDemoFlotAwait = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {
        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
        function comDiskData(){
             var data_inc_Await_await =  dataDiskAll.await;

            data_Await_await = changeData.m2(data_Await_await, data_inc_Await_await);
       }
       comDiskData();
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
       

        var data_sort_Await_await= changeData.m3(data_Await_await); //sort data
        
        var data_null_Await_await= changeData.m4(data_sort_Await_await); //add null into data

        after_data_Await_await = changeData.m1(data_null_Await_await);

        dataFlotAwait = { 
                         "await": { label: "await", data: after_data_Await_await,color: "#CD0000" }
        };
        dataDemoFlotAwait = [
                            {label: "",data: after_data_Await_await,color: "#CD0000"
        }];
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 60000);
   
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_disk_await");
    $.each(dataFlotAwait, function(key, val) {
        choiceContainer.append("<br/><input type='checkbox' name='" + key +
            "' checked='checked' id='id" + key + "'></input>" +
            "<label  style='color: #CD0000'  for='id" + key + "'>" + val.label + "</label>");
    });
    choiceContainer.find("input").click(plotAccordingToChoices);
    var flotCpuAwaits;
    function plotAccordingToChoices() {
         runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotAwait[key]) {
                data.push(dataFlotAwait[key]);
            }
        });
        if (data.length > 0) {
            flotCpuAwaits = $.plot($("#disk_await_host"),
                data,
                options.m1
            );
            $("#disk_await_host").UseTooltip();
        }
        setTimeout(plotAccordingToChoices,60000);
    }
    plotAccordingToChoices();
    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_disk_await_host"), dataDemoFlotAwait, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_disk_await_host, flotCpuAwaits, overview);
}
flotDiskModelAwait();  

//end iops的折线图
//Queue的折线图
function flotDiskModelSvctm(){
    $("#Average_title").append(nameHtmlDisk);
    var url_Svctm = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_disk_svctm/history/" +hostName  +"/"+nameDisk+ "?raw";
    var dataSvctm = getData.m1(url_Svctm);
    var data_Svctm_svctm = changeData.m5(dataSvctm.svctm);
    var after_data_Svctm_svctm;
    var dataFlotSvctm = {};
    var dataDemoFlotSvctm = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {
        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
       function comDiskData(){
            var data_inc_Svctm_svctm =  dataDiskAll.svctm;

            data_Svctm_svctm = changeData.m2(data_Svctm_svctm, data_inc_Svctm_svctm);

       }
       comDiskData();
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
       
        var data_sort_Svctm_svctm= changeData.m3(data_Svctm_svctm); //sort data
        
        var data_null_Svctm_svctm= changeData.m4(data_sort_Svctm_svctm); //add null into data

        after_data_Svctm_svctm = changeData.m1(data_null_Svctm_svctm);

        dataFlotSvctm = { 
                         "svctm": { label: "svctm", data: after_data_Svctm_svctm ,color: "#76EE00"}
        };
        dataDemoFlotSvctm = [
                            {label: "",data: after_data_Svctm_svctm,color: "#76EE00"
        }];
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 60000);
   
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KB");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_disk_svctm");
    $.each(dataFlotSvctm, function(key, val) {
        choiceContainer.append("<br/><input type='checkbox' name='" + key +
            "' checked='checked' id='id" + key + "'></input>" +
            "<label style='color: #76EE00' for='id" + key + "'>" + val.label + "</label>");
    });
    choiceContainer.find("input").click(plotAccordingToChoices);
    var flotCpuSvctm;
    function plotAccordingToChoices() {
         runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotSvctm[key]) {
                data.push(dataFlotSvctm[key]);
            }
        });
        if (data.length > 0) {
            flotCpuSvctm = $.plot($("#disk_svctm_host"),
                data,
                options.m1
            );
            $("#disk_svctm_host").UseTooltip();
        }
        setTimeout(plotAccordingToChoices,60000);
    }
    plotAccordingToChoices();
    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_disk_svctm_host"), dataDemoFlotSvctm, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_disk_svctm_host, flotCpuSvctm, overview);
}
flotDiskModelSvctm();  

//end iops的折线图
////Queue的折线图
function flotDiskModelUtil(){
    $("#util_title").append(nameHtmlDisk);
    var url_Util = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Graph_disk_util/history/" +hostName  +"/"+nameDisk+ "?raw";
    var dataUtil = getData.m1(url_Util);
    var data_Util_util = changeData.m5(dataUtil.util);
  
    var after_data_Util_util;

    var dataFlotUtil = {};
    var dataDemoFlotUtil = [];
    /*get old data ||get increment data*/
    var runDataIncFunction = function() {
        /////////////////////
        //BOCOP cmha-chap2 //
        /////////////////////
        function comDiskData(){
            var data_inc_Util_util =  dataDiskAll.util;

            data_Util_util = changeData.m2(data_Util_util, data_inc_Util_util);

       }
       comDiskData();
        //var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
       

        var data_sort_Util_util= changeData.m3(data_Util_util); //sort data
        
        var data_null_Util_util= changeData.m4(data_sort_Util_util); //add null into data

        after_data_Util_util = changeData.m1(data_null_Util_util);

        dataFlotUtil= { 
                         "util": { label: "util", data: after_data_Util_util,color: "#CD0000"}
        };
        dataDemoFlotUtil = [
                            {label: "",data: after_data_Util_util,color: "#CD0000"
        }];
    };
    runDataIncFunction();
    setInterval(runDataIncFunction, 60000);
    
    /////////////////////
    //  FLOT VISITORS show flot data //
    /////////////////////
    var networkShowTooltip = new ShowTooltip();
     $.fn.UseTooltip =function(){
        networkShowTooltip.m1("KN");
     };
    /*satrt checkbox*/
    // insert checkboxes 
    var choiceContainer = $("#choices_disk_util");
    $.each(dataFlotUtil, function(key, val) {
        choiceContainer.append("<br/><input type='checkbox' name='" + key +
            "' checked='checked' id='id" + key + "'></input>" +
            "<label style='color:#CD0000'for='id" + key + "'>" + val.label + "</label>");
    });
    choiceContainer.find("input").click(plotAccordingToChoices);
    var flotCpuUtil;
    function plotAccordingToChoices() {
         runDataIncFunction();
        var data = [];
        choiceContainer.find("input:checked").each(function() {
            var key = $(this).attr("name");
            if (key && dataFlotUtil[key]) {
                data.push(dataFlotUtil[key]);
            }
        });
        if (data.length > 0) {
            flotCpuUtil = $.plot($("#disk_util_host"),
                data,
                options.m1
            );
            $("#disk_util_host").UseTooltip();
        }
        setTimeout(plotAccordingToChoices,60000);
    }
    plotAccordingToChoices();
    /******end checkbox***************************************************/
    /*satrt伸缩轴模型*/
    var overview = $.plot($("#demo_disk_util_host"), dataDemoFlotUtil, options.m3);
    var network_visitors = new Visitors();
    network_visitors.m1(demo_disk_util_host, flotCpuUtil, overview);
}
flotDiskModelUtil();  

//end iops的折线图


};
flotDiskModul();
}
console.time('t');
 /**
     * [getHostName description]
     * @return {[type]} [description]
     */
    

if(serviceName!="" && hostName!=""){
    runFlotFunction();
}else{
 
    alert("please click host");
}

console.timeEnd('t');