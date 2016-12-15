/**全局变量
 * [configObject description]
 * @type {Object}
 */
var configObject = new Object({
    IP :"192.168.200.135:8500",//主机IP
    FreshenTime : 5e3,  //首页刷新时间
    graphFreshenTime :6e4, //graph刷新时间
    graphAllTime : 24,    //graph总共时间
});

var globalObject=new Object({

        serviceName : "",   /*获得服务名-全局变量*/
        hostName    : "",   /*获得主机名-全局变量*/
        isSetJqgrid   : 0,    /*决定首页的CS jqgrid是否重建还是update数据 为0时建表，为1时update数据*/
        // isBaseSetJqgrid : 0,
        // isHostSetJqgrid : 0,
        afterTypeHost :"",
        isTimer : null,
        getGraphFreshenTime : function(){
            return configObject.graphAllTime*36e5/configObject.graphFreshenTime;
        },
        // baseTimer : null,
        // hostTimer : null,
        // jqgridTimer : null,
        // graphTimer : null,
        // grraphDBTimer : null,
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
       if(globalObject.isTimer != null){
             clearTimeout(globalObject.isTimer);
        }
       //页面初始化
        globalObject.isSetJqgrid  =0;
    };
   
}
    
   