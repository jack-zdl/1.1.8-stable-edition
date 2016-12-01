/**
 * 这个是cmha的main函数，所有的动作都有这个main函数触发
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-12-01 15:38:25
 * @version $1.1.7$
 */
require.config({
	paths:{
		"jquery":"lib/jquery",
		"menuMain":"main/menu.main",
		"graph_main":"main/graph_main",
		"graph_db_main":"main/graph_db_main",
		"jqgrid_base_main":"main/jqgrid_base_main",
		"jqgrid_cs_main":"main/jqgrid_cs_main",
		"jqgrid_host_main":"main/jqgrid_host_main",
		"jqgrid_main":"main/jqgrid_main"
	}
});
require(['jquery','menuMain','graph_main','graph_db_main','jqgrid_base_main','jqgrid_cs_main','jqgrid_host_main'],function($,menuMain,graph_main){
	function load() {
    	$("#content").load("ajax/jqgrid_cs.html");
	};
	$("#Home").click(function() {
		debugger;
    	$("#content").load("ajax/jqgrid_cs.html");
	});
	$(".serviceNews").click(function() {
		debugger;
    	globalObject.serviceName = $(this).attr("id");
    	$("#content").load("ajax/jqgrid_base.html");
	});
	$(".serviceHost").click(function() {
		debugger;
    	globalObject.hostName = $(this).attr("id");
    	globalObject.serviceName =$($($($($($(this).parents("ul")[0])).children("li")[0]).children("a")).children("span")).attr("id");
    	$("#content").load("ajax/jqgrid_host.html");
	});
	$(".GHS").click(function(){
		debugger;
	    globalObject.hostName = $(this).attr("id");
	    globalObject.serviceName =$($($(this).parents("ul")[0]).prev()).children("span").html();
	    $("#content").load("ajax/graph.html");
 	});
 	$(".RGS").click(function(){
	    globalObject.hostName = $(this).attr("id");
	    globalObject.serviceName =$($($($(this).parents("li")[1]).children("a")).children("span")[0]).text();
	    var hostType  = globalObject.getTypeHost();
	    if(hostType == "db")
	    $("#content").load("ajax/graph_db.html");
	    if(hostType == "system"){
	 		$("#content").load("ajax/graph.html"); 
	 		setTimeout(graph_main.run_graph_sys_main,1000);
	    }
	   
	});   
	$(".RS").click(function(){  
		debugger;
	    globalObject.hostName = $(this).attr("id");
	    globalObject.serviceName =$($($($(this).parents("li")[1]).children("a")).children("span")[0]).text();
	   $("#content").load("ajax/jqgrid_real_status.html");

	});

	// (function(){
	// })($,menuMain);
});

