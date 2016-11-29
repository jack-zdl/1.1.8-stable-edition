/*将变量赋给全局变量whole_commons
 */

// var IP = "192.168.200.135:8500"; /*配置consul的IP*/

// var FreshenTime = 5e3;           /*设置刷新时间*/

// var IP_old = 0;                 /*全局变量*/

// var net1_card="";   //graph的全局变量
// var nameDisk =""; //graph的全局变量
//   var nameHtmlDisk = "";
// var serviceName = "";           /*全局变量*/

// var hostName = "";               /*全局变量*/

// var net_card ="";

// var HostType = "";               /*全局变量*/

// var Hostrole_id = "";            /*全局变量*/

// var stopclearInterval;

// var IntData =0;  /*Graph全局变量  来判断执行那个左边菜单*/
// var IntData_cs=0;/*Graph全局变量  来执行移除那个菜单DOM元素*/
// /*real_status.js的全局变量*/

// var  cstimeSetTimeout =0;
// var  cstimeSetTimeout_b =0;
// var  kaiguan_cs=0;
// var  changeGraphMemu;


// var kaiguan=0;                  
// var after_sys_real_status_values = [];
// var int_data=0;
// var typeIntHost=1;

// /*全局函数*/
// var formatter_db_status = function(cellvalue, options, rowObject) {
//     if (rowObject.REPL - STATUS == "OK") {
//         return '<span style="color:green;" >' + cellvalue + "</span>";
//     } else if (rowObject.REPL - STATUS == "warning") {
//         return '<span style="color:red;" >' + cellvalue + "</span>";
//     } else {
//         return '<span style="color:red;" >' + cellvalue + "</span>";
//     }
// };
// /*全局函数*/
// var formatter_db_counter_status = function(cellvalue, options, rowObject) {
//     if (rowObject.REPL - ERR - COUNTER == 0) {
//         return '<span style="color:green;" >' + cellvalue + "</span>";
//     } else {
//         return '<span style="color:red;" >' + cellvalue + "</span>";
//     }
// };
// /*全局函数 === 已经不需要，在函数内被代替*/
// var formatter_role = function(cellvalue, options, rowObject) {
//     if (Hostrole_id == "leader") {
//         return '<span  style="color:green;" >' + Hostrole_id + "</span>";
//     }
//     return "<span  >" + cellvalue + "</span>";
// };
// /*全局函数*/
// var formatter_repl_status = function(cellvalue, options, rowObject) {
//     if (rowObject.REPL_STATUS == "OK") {
//         return '<span style="color:green;" >' + cellvalue + "</span>";
//     } else if (rowObject.REPL_STATUS == "warning") {
//         return '<span style="color:red;" >' + cellvalue + "</span>";
//     } else {
//         return '<span style="color:red;" >' + cellvalue + "</span>";
//     }
// };
// /*全局函数*/
// var formatter_counter_status = function(cellvalue, options, rowObject) {
//     if (rowObject.REPL_ERR_COUNTER == 1) {
//         return '<span style="color:red;" >' + cellvalue + "</span>";
//     }
//     return '<span style="color:green;" >' + cellvalue + "</span>";
// };
/*
 function getDate(tm) {  //以毫秒为单位
        var tt = new Date(tm);

        var Y = tt.getFullYear() + "-";
        var M = (tt.getMonth() + 1 < 10 ? "0" + (tt.getMonth() + 1) :tt.getMonth() + 1) + "-";
        var D = (tt.getDate() < 10 ? "0" + tt.getDate() :tt.getDate()) + " ";
        var h = (tt.getHours() < 10 ? "0" + tt.getHours() :tt.getHours()) + ":";
        var m = (tt.getMinutes() < 10 ? "0" + tt.getMinutes() :tt.getMinutes()) + ":";
        var s = tt.getSeconds() < 10 ? "0" + tt.getSeconds() :tt.getSeconds();
        var tt_time = h + m + s;
        
        return tt_time;
    }
    */
    //  function getDate(tm) {  //以毫秒为单位
    //     var tt = new Date(tm);
    //     var Y = tt.getFullYear() + "-";
    //     var M = (tt.getMonth() + 1 < 10 ? "0" + (tt.getMonth() + 1) :tt.getMonth() + 1) + "-";
    //     var D = (tt.getDate() < 10 ? "0" + tt.getDate() :tt.getDate()) + " ";
    //     var h = (tt.getHours() < 10 ? "0" + tt.getHours() :tt.getHours()) + ":";
    //     var m = (tt.getMinutes() < 10 ? "0" + tt.getMinutes() :tt.getMinutes()) + ":";
    //     var s = tt.getSeconds() < 10 ? "0" + tt.getSeconds() :tt.getSeconds();
    //     var tt_time = h + m + s;
        
    //     return tt_time;
    // }
    // require.config({

    // });
    require([],function(){
        var configObject = new Object({
            IP :"192.168.200.135:8500",
            FreshenTime : 5e3

        });
    var globalObject=new Object({
                serviceName : "",   /*获得服务名-全局变量*/
                hostName    : "",   /*获得主机名-全局变量*/
                afterTypeHost :"",
                /**
                 * [getTypeHost description]根据API获得主机类型
                 * @return {[type]} [description]返回主机类型db system
                 */
                getTypeHost : function (){
                            var typeHost;
                    　　　　　　$.ajax({
                                    url: "http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/type/" + hostName + "?raw",
                                    method: "get",
                                    async: false,
                                    dataType: "json",
                                    success: function(result, status, xhr) {
                                        typeHost = result;
                                    },
                                    error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                                        
                                    }
                                });
                                /**
                                 * [switch description]来获得是主机类型
                                 * @param  {[type]} typeHost.type [description]
                                 * @return {[type]}               [description]
                                 */
                                switch (typeHost.type) {
                                    case "db":
                                       globalObject.afterTypeHost = "db";
                                        break;
                                    case "chap":
                                        globalObject.afterTypeHost = "system";
                                        break;
                                    case "cs":
                                        globalObject.afterTypeHost = "system";
                                        break;
                                    default:
                                        console.log("主机类型出错");
                                        break;
                                }
                    return globalObject.afterTypeHost;
    　　　　　　},
                getDate    :   function(tm) {  //以毫秒为单位
                    var tt = new Date(tm);
                    var Y = tt.getFullYear() + "-";
                    var M = (tt.getMonth() + 1 < 10 ? "0" + (tt.getMonth() + 1) :tt.getMonth() + 1) + "-";
                    var D = (tt.getDate() < 10 ? "0" + tt.getDate() :tt.getDate()) + " ";
                    var h = (tt.getHours() < 10 ? "0" + tt.getHours() :tt.getHours()) + ":";
                    var m = (tt.getMinutes() < 10 ? "0" + tt.getMinutes() :tt.getMinutes()) + ":";
                    var s = tt.getSeconds() < 10 ? "0" + tt.getSeconds() :tt.getSeconds();
                    var tt_time = h + m + s;
                    
                    return tt_time;
                },
        　　　　m2 : function (){
        　　　　　　
        　　　　}
    });
    return {
        configObject : configObject,
        globalObject : globalObject
    };
    });
    
    
   