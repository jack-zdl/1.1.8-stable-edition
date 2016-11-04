var run_graph_list = function () {

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
			 // dataAllGraphHost= {"net_dev": ["lo","eth0","eth1"]};
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
		        a.setAttribute("id",obj_array_list[i].name);
		        a.innerHTML=obj_array_list[i].name;
		        li.appendChild(a);
		        ul.appendChild(li);
			 }
		};
		//用来处理Disk的目录
		this.m2 = function(obj_id,obj_array_list) {
			var ul = document.getElementById(obj_id);
			for (var i = obj_array_list.length - 1; i >= 0; i--) {
				var li = document.createElement("li");
				var a  = document.createElement("a");
				a.setAttribute("href","#");
				a.setAttribute("class","GLD");
				a.setAttribute("id",obj_array_list[i].name);
				a.innerHTML=obj_array_list[i].mount;
				li.appendChild(a);
		        ul.appendChild(li);
			}
		};

	};
	var run_network_list = function(){
		var url_network ="http://"+IP+"/v1/kv/cmha/service/"+serviceName+"/net_dev/"+hostName+"?raw";
		var getDataNetwork =  new getData();
		var dataNetwork = getDataNetwork.m1(url_network);
		var changeDataNetwork = new changeData();
		changeDataNetwork.m1("Network",dataNetwork['dev_name']);

	};
    run_network_list();

    var run_disk_list = function(){
		var url_disk ="http://"+IP+"/v1/kv/cmha/service/"+serviceName+"/disk_dev/"+hostName+"?raw";
		var getDataDisk =  new getData();
		var dataDisk = getDataDisk.m1(url_disk);
		var changeDataDisk = new changeData();
		changeDataDisk.m2("Disk",dataDisk['dev_name']);

	};
    run_disk_list();
};
run_graph_list();



