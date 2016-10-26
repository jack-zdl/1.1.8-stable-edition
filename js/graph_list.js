var run_graph_list = function () {
	var getData = function(){
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
			 /*
			  *{
    			"net_dev": [
					        "lo ",
					        " eth0",
					        "eth1"
						    ]
				}
			  */
			 dataAllGraphHost= {"net_dev": ["lo "," eth0","eth1"]}
                return dataAllGraphHost;
		};

	};
	var changeData = function(){
		this.m1 = function(obj_id,obj_array_list){
			 //这是左面菜单栏的cs菜单
			  var ul = document.getElementById(obj_id);
			 for (var i = obj_array_list.length - 1; i >= 0; i--) {
			 	
		        var li = document.createElement("li");
		        var a  = document.createElement("a");
		        a.setAttribute("href","#");
		        a.setAttribute("class","GL");
		         a.setAttribute("id",obj_array_list[i]);
		        a.innerHTML=obj_array_list[i];
		        li.appendChild(a);
		        ul.appendChild(li);
			 }
		};

	};
	var run_network_list = function(){
		var url_network ="http://"+IP+"/v1/kv/cmha/service/"+"BOCOP"+"/net_dev/"+"cmha-chap2"+"?raw";
		var getDataNetwork =  new getData();
		var dataNetwork = getDataNetwork.m1(url_network);
		var changeDataNetwork = new changeData();
		changeDataNetwork.m1("Network",dataNetwork['net_dev']);

	};
    run_network_list();


};
run_graph_list();