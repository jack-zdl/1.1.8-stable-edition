/*模块化写法  这里是目录生成页面的抽象函数
 */
require.config({
	paths:{
		"jquery" : "lib/jquery"
	}
});
define(['jquery'],function($){
	function get_graph_list() {
	/*
	获得服务名和主机名
	 */
		this.m1 = function(obj_url){
			var dataAllGraphHost={};
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
			 // dataAllGraphHost= {"net_dev": ["lo","eth0","eth1"]};
                return dataAllGraphHost;
		};
		this.m2 = function(obj_id,obj_array_list){
			 //这是左面菜单栏的cs菜单
			var ul = document.getElementById(obj_id);
			for (var i = obj_array_list.length - 1; i >= 0; i--) {
		        var li = document.createElement("li");
		        var a  = document.createElement("a");
		        a.setAttribute("href","#net_Bytes");
		        a.setAttribute("class","GL");
		        a.setAttribute("id",obj_array_list[i].name);
		        a.innerHTML=obj_array_list[i].name;
		        li.appendChild(a);
		        ul.appendChild(li);
			 }
		};
		//用来处理Disk的目录
		this.m3 = function(obj_id,obj_array_list) {
			var ul = document.getElementById(obj_id);
			for (var i = obj_array_list.length - 1; i >= 0; i--) {
				var li = document.createElement("li");
				var a  = document.createElement("a");
				a.setAttribute("href","#disk_rkB_s");
			//	a.setAttribute("class","GLD");
				a.setAttribute("class","GLD");
				a.setAttribute("id",obj_array_list[i].name);
				a.innerHTML=obj_array_list[i].mount;
				li.appendChild(a);
		        ul.appendChild(li);
			}
		};
}
return {
	get_graph_list : get_graph_list
};
});



