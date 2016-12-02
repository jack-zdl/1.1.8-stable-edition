/**
 * 制作菜单的工具类
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-12-01 14:39:54
 * @version $1.1.7$
 */
require.config({
	paths:{
		"jquery":"lib/jquery"
	}
});
define(['jquery'],function($){
	function Commons(){
		this.getData = function(obj_array_url){
			var arrayData = [];
			for (var i = 0,len = obj_array_url.length; i < len; i++) {
				$.ajax({
	            	url:obj_array_url,
		            method:"get",
		            async:false,
		            dataType:"json",
		            success:function(result, status, xhr) {
		                 arrayData.push(result);
		            },
		            error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
		                console.error("失败状态文本 " + status);
		            }
	        	});
			}
			return arrayData;
		};
		//将原始数据进行处理，得到所有服务名
		this.changeServiceName = function(obj_all_data){
			var arrayServiceName = [];
			for (var key in obj_all_data) {
                arrayServiceName.push(key);
            }
            arrayServiceName.remove('Statistics');
            arrayServiceName.remove('consul');
            return arrayServiceName;
		};
		this.getObjectData = function(obj_service_url){

			var objactService = {};
			for(var k in obj_service_url){
				$.ajax({
	            	url:obj_service_url[k],
		            method:"get",
		            async:false,
		            dataType:"json",
		            success:function(result, status, xhr) {
		                objactService[k]=result;
		            },
		            error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
		                console.error("失败状态文本 " + status);
		            }
	        	});
			}
			return objactService;
		};
		//私有方法
		function addElementLi(obj,obj_cs,obj_data) {
	        var ul = document.getElementById(obj);
	        ul.appendChild(obj_cs);
	        for (var k in obj_data) {
	            var li = document.createElement("li");
	            var a = document.createElement("a");
	            a.setAttribute("href", "#");
	            var i = document.createElement("i");
	            i.setAttribute("class", "fa fa-skype fa-lg");
	            var ul_1 = document.createElement("ul");
	            var li_news = document.createElement("li");
	            var a_news = document.createElement("a");
	            a_news.setAttribute("href", "#");
	            var i_news = document.createElement("i");
	            i_news.setAttribute("class", "fa fa-stack-exchange fa-lg ");
	            var span_news = document.createElement("span");
	            span_news.setAttribute("class", "serviceNews nav-text");
	            span_news.setAttribute("id", k);
	            span_news.innerHTML = " base info";
	            a_news.appendChild(i_news);
	            a_news.appendChild(span_news);
	            li_news.appendChild(a_news);
	            ul_1.appendChild(li_news);
	            for (var ky = 0; ky < obj_data[k].length; ky++) {
	                var li_1 = document.createElement("li");
	                var a_1 = document.createElement("a");
	                a_1.setAttribute("href", "#");
	                var i_1 = document.createElement("i");
	                i_1.setAttribute("class", "fa fa-dot-circle-o fa-lg  ");
	                var span_1 = document.createElement("span");
	                span_1.setAttribute("class", "serviceHost nav-text");
	                span_1.setAttribute("id", obj_data[k][ky]);
	                span_1.innerHTML = obj_data[k][ky];
	                a_1.appendChild(i_1);
	                a_1.appendChild(span_1);
	                li_1.appendChild(a_1);
	                ul_1.appendChild(li_1);
	            }
	            var span = document.createElement("span");
	            span.setAttribute("class", "nav-text");
	            span.innerHTML = k;
	            a.setAttribute("href", "#");
	            a.appendChild(i);
	            a.appendChild(span);
	            li.appendChild(a);
	            li.appendChild(ul_1);
	            ul.appendChild(li);
	        }
    	}
		this.setCSElementLi = function(obj_Element,obj_data) {
	        //这是左面菜单栏的cs菜单
	        var li_cs = document.createElement("li");
	        var a_cs  = document.createElement("a");
	        a_cs.setAttribute("href","#");
	        a_cs.setAttribute("class","cs-home");
	        a_cs.setAttribute("id","Home");
	        var i_cs =document.createElement("i");
	        i_cs.setAttribute("class","fa fa-archive fa-lg");
	        var span_cs = document.createElement("span");
	        span_cs.setAttribute("class","nav-text aaahaha");
	        span_cs.innerHTML="CS";
	        a_cs.appendChild(i_cs);
	        a_cs.appendChild(span_cs);
	        li_cs.appendChild(a_cs);
	        addElementLi(obj_Element,li_cs,obj_data);
    	};
    	function addElementLiHost(obj,obj_cs,obj_rs,obj_data) {
            var ul = document.getElementById(obj);
            ul.appendChild(obj_cs);
            for (var k in obj_data) {
                var li = document.createElement("li");
                li.setAttribute("class","dropdown-submenu");
                var a = document.createElement("a");
                a.setAttribute("href", "#");
              	a.setAttribute("tabindex","-1");
              	var span = document.createElement("span");
                span.innerHTML = k;
                var span_serive_a = document.createElement("span");
                var ul_1 = document.createElement("ul");
              	ul_1.setAttribute("class","dropdown-menu");
                for (var ky = 0; ky < obj_data[k].length; ky++) {
                    var li_1 = document.createElement("li");
                    var a_1 = document.createElement("a");
                    a_1.setAttribute("href", "#");
                    a_1.setAttribute("tabindex", "-1");
                    a_1.setAttribute("class",obj_rs);
                    a_1.setAttribute("id", obj_data[k][ky]);
                    var span_1 = document.createElement("span");
                    span_1.innerHTML = obj_data[k][ky];
                    a_1.appendChild(span_1);
                    li_1.appendChild(a_1);
                    ul_1.appendChild(li_1);
                }
                a.appendChild(span);
                a.appendChild(span_serive_a);
                li.appendChild(a);
                li.appendChild(ul_1);
                ul.appendChild(li);
            }
        }
        this.setTopElementLi = function(obj_Element,obj_rs,obj_cs,obj_data){
        	var li_host = document.createElement("li");
	        li_host.setAttribute("class","dropdown-submenu");
	        var a_host  = document.createElement("a");
	        a_host.setAttribute("href","#");
	        a_host.setAttribute("id","Home");
	        a_host.setAttribute("tabindex","-1");
	        var ul_host =document.createElement("ul");
	        ul_host.setAttribute("class","dropdown-menu");
	        for(var y=0; y<obj_cs.length;y++){
	               var li_host1 = document.createElement("li");
	               var  a_host1 = document.createElement("a");
	               a_host1.setAttribute("href", "#");
	               a_host1.setAttribute("class", obj_rs);
	               a_host1.setAttribute("tabindex", "-1");
	               a_host1.setAttribute("id", obj_cs[y]);
	               var span_host1 = document.createElement("span");
	               span_host1.innerHTML = obj_cs[y];
	               a_host1.appendChild(span_host1);
	               li_host1.appendChild(a_host1);
	               ul_host.appendChild(li_host1); 
	        }
	        var span_host_a = document.createElement("span");
	        span_host_a.innerHTML="CS";
	        var span_host_b = document.createElement("span");
	        a_host.appendChild(span_host_a);
	        a_host.appendChild(span_host_b);
	        li_host.appendChild(a_host);
	        li_host.appendChild(ul_host);
	        addElementLiHost(obj_Element,li_host,obj_rs,obj_data);
        }
	}
	return {
		Commons : Commons
	};
});

