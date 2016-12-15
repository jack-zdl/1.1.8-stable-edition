/*这个是主页的点击效果，function :  预定义首页为CS页面，当点击某个菜单时相应相应的页面
 */

/*预定义首页，
 */
var load = function() {
    $("#content").load("ajax/jqgrid_cs.html");
};
/*登录界面定义的函数（未使用）
 */
var indexfunction = function() {
    if( kaiguan != 0 ){
        stopclearInterval();
    }else{}
    IntData=0;
   
window.location.href = "http://" + IP + "/ui";
//      $("#content").load("ajax/jqgrid.html");
 //   window.location.href = "http://" + IP + "/ui";
};
/*点击CS菜单
 */
$("#Home").click(function() {
    $("#content").load("ajax/jqgrid_cs.html");
});
/*点击base info
 */
$(".serviceNews").click(function() {
    globalObject.serviceName = $(this).attr("id");
    $("#content").load("ajax/jqgrid_base.html");
});
/*点击主机节点
 */
$(".serviceHost").click(function() {
    globalObject.hostName = $(this).attr("id");
    globalObject.serviceName =$($($($($($(this).parents("ul")[0])).children("li")[0]).children("a")).children("span")).attr("id");
    $("#content").load("ajax/jqgrid_host.html");
});
/*2016/9/20 add Host_real_status
 */
/*2016/10/24 点击菜单传达 service and host net_card
 */
 $(".GHS").click(function(){
    globalObject.hostName = $(this).attr("id");
    globalObject.serviceName =$($($(this).parents("ul")[0]).prev()).children("span").html();
     $("#content").load("ajax/graph.html");
 });
 //点击右边菜单
/*
 $(".GL").click(function(){
    net_card = $(this).html();
     document.net_card = "net_card=" + net_card;
 debugger;
 });
 */
//点击菜单host graph
//
$(".RGS").click(function(){
    globalObject.hostName = $(this).attr("id");
    globalObject.serviceName =$($($($(this).parents("li")[1]).children("a")).children("span")[0]).text();
    var hostType  = globalObject.getTypeHost();
    if(hostType == "db")
    $("#content").load("ajax/graph_db.html");
    if(hostType == "system")
    $("#content").load("ajax/graph.html"); 
});   
$(".RS").click(function(){  
    globalObject.hostName = $(this).attr("id");
    globalObject.serviceName =$($($($(this).parents("li")[1]).children("a")).children("span")[0]).text();
   $("#content").load("ajax/jqgrid_real_status.html");
});
