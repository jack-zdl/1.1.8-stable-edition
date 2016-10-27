function runFlotFunction() {
     var net1_card="";
     var net2_card="";
     var net3_card="";
   function getAllCard () {
         net1_card = $($($("#Network").children("li")[0]).children("a")).html();
         net2_card = $($($("#Network").children("li")[1]).children("a")).html();
         net3_card = $($($("#Network").children("li")[2]).children("a")).html();
   } 
   getAllCard();
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
                    console.error("getData 状态 " + status);
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
                //模拟圆饼图数据
                {
                    label: "Asia",
                    data: 4119630000,
                    color: "#005CDE"
                }, {
                    label: "Latin America",
                    data: 590950000,
                    color: "#00A36A"
                }, {
                    label: "Africa",
                    data: 1012960000,
                    color: "#7D0096"
                }, {
                    label: "Oceania",
                    data: 35100000,
                    color: "#992B00"
                }, {
                    label: "Europe",
                    data: 727080000,
                    color: "#DE000F"
                }, {
                    label: "North America",
                    data: 344120000,
                    color: "#ED7B00"
                }
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
            if (obj_data_his.length >= 720) {
                var obj_data_his_length = obj_data_his.length;
                for (var j = 0; j < obj_data_his_length; j++) {
                    if (obj_data_his[j].id == obj_data_inc[0].id) {
                        obj_data_his.splice(j, 1, obj_data_inc[0]);
                    }
                }
                return obj_data_his;
            } else {

                obj_data_his.push(obj_data_inc[0]);
                return obj_data_his;
            }

            　　　　
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
                    return (d.getHours()) + "/" + d.getMinutes() + "/" + d.getSeconds();
                }
            }],
            legend: {
                container: $(".label_network_host"),
                show: true,
                noColumns: 0,
                labelFormatter: function(label, series) {
                    return "<font color=\"red\">" + label + "</font>";
                },
                backgroundColor: "#000",
                backgroundOpacity: 0.9,
                labelBoxBorderColor: "#000000",
                position: "nw"
            },
            grid: {
                autoHighlight: false,
                hoverable: true,
                borderWidth: 3,
                mouseActiveRadius: 50,
                backgroundColor: {
                    colors: ["#ffffff", "#EDF5FF"]
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
                    show: true


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
        this.m1 = function () {
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
                            (date.getHours()) + "/" + date.getMinutes() + "/" + date.getMinutes() + " : <strong>" + y + "</strong> (Kb/s)");
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
    //执行network的flot图
    var flot_network = function() {
        console.info(hostName+serviceName+net1_card);
        var url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/history/" +hostName  + "/" + net1_card + "?raw";
        var dataNetwork = getData.m1(url_network);
        var data_net_output = changeData.m5(dataNetwork.net_output_Bytes);
        var data_net_input = changeData.m5(dataNetwork.net_input_Bytes);
        var after_data_net_output;
        var after_data_net_input;
        var dataFlotNetwork = {};
        var dataDemoFlotNetwork = [];
        /*get old data ||get increment data*/
        var runDataIncFunction = function() {
            /////////////////////
            //BOCOP cmha-chap2 //
            /////////////////////
            var data = new Date();
            console.info("进入runDataFunction"+data);
            var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net1_card + "?raw";
            var dataIncNetwork = getData.m2(inc_url_network);
            var data_inc_net_output = dataIncNetwork.net_output_Bytes;
            var data_inc_net_input = dataIncNetwork.net_input_Bytes;
            var data_com_net_output = changeData.m2(data_net_output, data_inc_net_output);
            var data_com_net_input = changeData.m2(data_net_input, data_inc_net_input);
            var data_sort_net_output = changeData.m3(data_com_net_output); //sort data
            var data_sort_net_input = changeData.m3(data_com_net_input); //sort data         
            var data_null_net_output = changeData.m4(data_sort_net_output); //add null into data
            var data_null_net_input = changeData.m4(data_sort_net_input); //add null into data          
            after_data_net_output = changeData.m1(data_null_net_output);
            after_data_net_input = changeData.m1(data_null_net_input);
            dataFlotNetwork = { "output": { label: "output", data: after_data_net_output },
                                "input": { label: "input",data: after_data_net_input }
            };
            dataDemoFlotNetwork = [{label: "",data: after_data_net_input,color: "#0077FF"},
                                   {label: "",data: after_data_net_output,color: "#7D0096"
            }];
        };
        runDataIncFunction();
         setInterval(runDataIncFunction, 6000);
        ///////////
        //设置颜色//
        ///////////      
        var i = 4;
        $.each(dataFlotNetwork, function(key, val) {
            val.color = i;
            ++i;
        });
        /////////////////////
        //  FLOT VISITORS show flot data //
        /////////////////////
        var networkShowTooltip = new ShowTooltip();
         $.fn.UseTooltip =function(){
            networkShowTooltip.m1();
         };
        /*satrt checkbox*/
        // insert checkboxes 
        var choiceContainer = $("#choices");
        $.each(dataFlotNetwork, function(key, val) {
            choiceContainer.append("<br/><input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "'>" + val.label + "</label>");
        });
        choiceContainer.find("input").click(plotAccordingToChoices);
        var flotNetworkHost;
        function plotAccordingToChoices() {
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
        }
        plotAccordingToChoices();
        /******end checkbox***************************************************/
        /*satrt伸缩轴模型*/
        var overview = $.plot($("#demo_network_host"), dataDemoFlotNetwork, options.m3);
        var network_visitors = new Visitors();
        network_visitors.m1(demo_network_host, flotNetworkHost, overview);
    };
    flot_network();

    /**start第二个flot图*/
 var flot_network2 = function() {
        console.info(hostName+serviceName+net2_card);
        var url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/history/" +hostName  + "/" + net2_card + "?raw";
       console.info(url_network);
        var dataNetwork = getData.m1(url_network);
        var data_net_output = changeData.m5(dataNetwork.net_output_Bytes);
        var data_net_input = changeData.m5(dataNetwork.net_input_Bytes);
        var after_data_net_output;
        var after_data_net_input;
        var dataFlotNetwork = {};
        var dataDemoFlotNetwork = [];
        /*get old data ||get increment data*/
        var runDataIncFunction = function() {
            /////////////////////
            //BOCOP cmha-chap2 //
            /////////////////////
            var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net2_card + "?raw";
            var dataIncNetwork = getData.m2(inc_url_network);
            var data_inc_net_output = dataIncNetwork.net_output_Bytes;
            var data_inc_net_input = dataIncNetwork.net_input_Bytes;
            var data_com_net_output = changeData.m2(data_net_output, data_inc_net_output);
            var data_com_net_input = changeData.m2(data_net_input, data_inc_net_input);
            var data_sort_net_output = changeData.m3(data_com_net_output); //sort data
            var data_sort_net_input = changeData.m3(data_com_net_input); //sort data         
            var data_null_net_output = changeData.m4(data_sort_net_output); //add null into data
            var data_null_net_input = changeData.m4(data_sort_net_input); //add null into data          
            after_data_net_output = changeData.m1(data_null_net_output);
            after_data_net_input = changeData.m1(data_null_net_input);
            dataFlotNetwork = { "output": { label: "output", data: after_data_net_output },
                                "input": { label: "input",data: after_data_net_input }
            };
            dataDemoFlotNetwork = [{label: "",data: after_data_net_input,color: "#0077FF"},
                                   {label: "",data: after_data_net_output,color: "#7D0096"
            }];
        };
        runDataIncFunction();
        var int = setInterval(runDataIncFunction, 60000);
        ///////////
        //设置颜色//
        ///////////      
        var i = 4;
        $.each(dataFlotNetwork, function(key, val) {
            val.color = i;
            ++i;
        });
        /////////////////////
        //  FLOT VISITORS show flot data //
        /////////////////////
        var networkShowTooltip = new ShowTooltip();
         $.fn.UseTooltip =function(){
            networkShowTooltip.m1();
         };
        /*satrt checkbox*/
        // insert checkboxes 
        var choiceContainer = $("#choices1");
        $.each(dataFlotNetwork, function(key, val) {
            choiceContainer.append("<br/><input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "'>" + val.label + "</label>");
        });
        choiceContainer.find("input").click(plotAccordingToChoices);
        var flotNetworkHost;
        function plotAccordingToChoices() {
            var data = [];
            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && dataFlotNetwork[key]) {
                    data.push(dataFlotNetwork[key]);
                }
            });
            if (data.length > 0) {
                flotNetworkHost = $.plot($("#network1_host"),
                    data,
                    options.m1
                );
                $("#network1_host").UseTooltip();
            }
        }
        plotAccordingToChoices();
        /******end checkbox***************************************************/
        /*satrt伸缩轴模型*/
        var overview = $.plot($("#demo_network1_host"), dataDemoFlotNetwork, options.m3);
        var network_visitors = new Visitors();
        network_visitors.m1(demo_network_host, flotNetworkHost, overview);
    };
    flot_network2();
    /*end第二个flot图*/
    /*start第三个flot图*/
    //执行network的flot图
    var flot_network3 = function() {
        console.info(hostName+serviceName+net1_card);
        var url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/history/" +hostName  + "/" + net3_card + "?raw";
        var dataNetwork = getData.m1(url_network);
        var data_net_output = changeData.m5(dataNetwork.net_output_Bytes);
        var data_net_input = changeData.m5(dataNetwork.net_input_Bytes);
        var after_data_net_output;
        var after_data_net_input;
        var dataFlotNetwork = {};
        var dataDemoFlotNetwork = [];
        /*get old data ||get increment data*/
        var runDataIncFunction = function() {
            /////////////////////
            //BOCOP cmha-chap2 //
            /////////////////////
            var inc_url_network = "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/Graph/Networktraffic/" + hostName + "/" + net3_card + "?raw";
            var dataIncNetwork = getData.m2(inc_url_network);
            var data_inc_net_output = dataIncNetwork.net_output_Bytes;
            var data_inc_net_input = dataIncNetwork.net_input_Bytes;
            var data_com_net_output = changeData.m2(data_net_output, data_inc_net_output);
            var data_com_net_input = changeData.m2(data_net_input, data_inc_net_input);
            var data_sort_net_output = changeData.m3(data_com_net_output); //sort data
            var data_sort_net_input = changeData.m3(data_com_net_input); //sort data         
            var data_null_net_output = changeData.m4(data_sort_net_output); //add null into data
            var data_null_net_input = changeData.m4(data_sort_net_input); //add null into data          
            after_data_net_output = changeData.m1(data_null_net_output);
            after_data_net_input = changeData.m1(data_null_net_input);
            dataFlotNetwork = { "output": { label: "output", data: after_data_net_output },
                                "input": { label: "input",data: after_data_net_input }
            };
            dataDemoFlotNetwork = [{label: "",data: after_data_net_input,color: "#0077FF"},
                                   {label: "",data: after_data_net_output,color: "#7D0096"
            }];
        };
        runDataIncFunction();
        var int = setInterval(runDataIncFunction, 60000);
        ///////////
        //设置颜色//
        ///////////      
        var i = 4;
        $.each(dataFlotNetwork, function(key, val) {
            val.color = i;
            ++i;
        });
        /////////////////////
        //  FLOT VISITORS show flot data //
        /////////////////////
        var networkShowTooltip = new ShowTooltip();
         $.fn.UseTooltip =function(){
            networkShowTooltip.m1();
         };
        /*satrt checkbox*/
        // insert checkboxes 
        var choiceContainer = $("#choices2");
        $.each(dataFlotNetwork, function(key, val) {
            choiceContainer.append("<br/><input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "'>" + val.label + "</label>");
        });
        choiceContainer.find("input").click(plotAccordingToChoices);
        var flotNetworkHost;
        function plotAccordingToChoices() {
            var data = [];
            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && dataFlotNetwork[key]) {
                    data.push(dataFlotNetwork[key]);
                }
            });
            if (data.length > 0) {
                flotNetworkHost = $.plot($("#network2_host"),
                    data,
                    options.m1
                );
                $("#network2_host").UseTooltip();
            }
        }
        plotAccordingToChoices();
        /******end checkbox***************************************************/
        /*satrt伸缩轴模型*/
        var overview = $.plot($("#demo_network2_host"), dataDemoFlotNetwork, options.m3);
        var network_visitors = new Visitors();
        network_visitors.m1(demo_network_host, flotNetworkHost, overview);
    };
    flot_network3();
    /*end第三个flot图*/
    //////////////
    //pies flot //
    //////////////
    var flot_pies = function() {
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
        }
        var data_flot_pies = getData.m3();

        $.plot($("#flot-placeholder"), data_flot_pies, options.m2);
        $("#flot-placeholder").showMemo();
    };
    flot_pies();
}
console.time('t');
 /**
     * [getHostName description]
     * @return {[type]} [description]
     */
    var getHostName = function() {
        var arrayName = document.cookie.split(";");

        for (var a = 0; a < arrayName.length; a++) {
            if (arrayName[a].indexOf("hostName") != -1) {
                hostName = arrayName[a].split("=")[1];
            }
        }
        for (var a = 0; a < arrayName.length; a++) {
            if (arrayName[a].indexOf("serviceName") != -1) {
                serviceName = arrayName[a].split("=")[1];
            }
        }
       
    };
  
    getHostName();

if(serviceName!="" && hostName!=""){
 
    runFlotFunction();
}else{
 
    alert("please click host");
}

console.timeEnd('t');