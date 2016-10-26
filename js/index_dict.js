/*这个是主页的点击效果，function :  预定义首页为CS页面，当点击某个菜单时相应相应的页面
 */

/*预定义首页，
 */
var load = function() {
    $("#content").load("ajax/jqgrid.html");
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
/*BACK标签的函数（未使用）
 */
var backFunction = function() {
    window.location.href = "http://" + IP + "/ui/log.html";
};
/*点击CS菜单
 */
$("#Home").click(function() {
    $("#content").load("ajax/jqgrid.html");
});
/*点击base info
 */
$(".serviceNews").click(function() {
    serviceName = $(this).attr("id");
    document.cookie = "serviceName=" + serviceName;
    $("#content").load("ajax/jqgrid2.html");
});
/*点击主机节点
 */
$(".serviceHost").click(function() {
    hostName = $(this).attr("id");
    serviceName =$($($($($($(this).parents("ul")[0])).children("li")[0]).children("a")).children("span")).attr("id");
    
    document.cookie = "hostName=" + hostName;
    document.cookie = "serviceName=" + serviceName;
    $("#content").load("ajax/jqgrid3.html");
});
/*2016/9/20 add Host_real_status
 */
/*2016/10/24 点击菜单传达 service and host net_card
 */
 $(".GHS").click(function(){
    
    hostName = $(this).attr("id");
    serviceName =$($($(this).parents("ul")[0]).prev()).children("span").html();
    document.cookie = "hostName=" + hostName;
    document.cookie = "serviceName=" + serviceName;
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