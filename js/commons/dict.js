/*将变量赋给全局变量whole_commons
 */


// var net1_card="";   //graph的全局变量
// var nameDisk =""; //graph的全局变量
//   var nameHtmlDisk = "";


// var net_card ="";


// var Hostrole_id = "";            /*全局变量*/

// var stopclearInterval;

// var IntData =0;  
/*Graph全局变量  来判断执行那个左边菜单*/
// var IntData_cs=0;
//Graph全局变量  来执行移除那个菜单DOM元素
/*real_status.js的全局变量*/

// var  cstimeSetTimeout =0;
// var  cstimeSetTimeout_b =0;
// var  kaiguan_cs=0;
// var  changeGraphMemu;


// var kaiguan=0;                  
// var after_sys_real_status_values = [];
// var globalObject.int_grid=0;
// var typeIntHost=1;
/**全局变量
 * [configObject description]
 * @type {Object}
 */
var configObject = new Object({
    IP :"192.168.200.135:8500",
    FreshenTime : 5e3,
});

var globalObject=new Object({
        serviceName : "",   /*获得服务名-全局变量*/
        hostName    : "",   /*获得主机名-全局变量*/
        isSetJqgrid   : 0,    /*决定首页的CS jqgrid是否重建还是update数据 为0时建表，为1时update数据*/
        // isBaseSetJqgrid : 0,
        // isHostSetJqgrid : 0,
        afterTypeHost :"",
        csTimer : null,
        baseTimer : null,
        hostTimer : null,
        jqgridTimer : null,
        graphTimer : null,
        grraphDBTimer : null,
        /**
         * [getTypeHost description]根据API获得主机类型
         * @return {[type]} [description]返回主机类型db system
         * [switch description]来获得是主机类型
         * @param  {[type]} typeHost.type [description]
         * @return {[type]}               [description]
         */
        getTypeHost :function () {
                    var typeHost;
                    $.ajax({
                                    url: "http://" + configObject.IP + "/v1/kv/cmha/service/" + globalObject.serviceName + "/type/" + globalObject.hostName + "?raw",
                                    method: "get",
                                    async: false,
                                    dataType: "json",
                                    success: function(result, status, xhr) {
                                        typeHost = result;
                                    },
                                    error: function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                                        
                                    }
                    });
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
        getDate : function(tm) {  //以毫秒为单位
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
        getYearData : function(tm){
            var tt = new Date(tm * 1e3);
            var Y = tt.getFullYear() + "-";
            var M = (tt.getMonth() + 1 < 10 ? "0" + (tt.getMonth() + 1) :tt.getMonth() + 1) + "-";
            var D = (tt.getDate() < 10 ? "0" + tt.getDate() :tt.getDate()) + " ";
            var h = (tt.getHours() < 10 ? "0" + tt.getHours() :tt.getHours()) + ":";
            var m = (tt.getMinutes() < 10 ? "0" + tt.getMinutes() :tt.getMinutes()) + ":";
            var s = tt.getSeconds() < 10 ? "0" + tt.getSeconds() :tt.getSeconds();
            var tt_time = Y + M + D + h + m + s;
            return tt_time;
        }
});
//建立销毁定时器的函数和初始化页面的函数的构造函数
function Init(){
    this.distroyTimer = function(){
        debugger;
       if(globalObject.csTimer != null){
             clearTimeout(globalObject.csTimer);
       }else if(globalObject.baseTimer != null){
            clearTimeout(globalObject.baseTimer);
       }else if(globalObject.hostTimer != null){
            clearTimeout(globalObject.baseTimer);
       }else if(globalObject.jqgridTimer != null){
            clearTimeout(globalObject.jqgridTimer);
       }else if(globalObject.graphTimer != null){
            clearTimeout(globalObject.graphTimer);
       }else if(globalObject.grraphDBTimer != null){
            clearTimeout(globalObject.grraphDBTimer);
       }

        globalObject.isSetJqgrid  =0;
    };
   
}
    
   