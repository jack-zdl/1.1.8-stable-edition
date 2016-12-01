/*这是首页的js文件，用于设置动态菜单。
 *根据consul下的所有service服务名，以及服务下的所有主机节点。
 *动态产生top菜单栏。
 */
 
var changeMemu = function() {
    var dataServices = {},
    after_dataMemu = [],
    dataMenuItem = {},
    dataAllService = {},
    dataConsul = [],
    ConuslName = [];

    /*获得consul下的所有服务名。
     */ 
    var getService_db = function() {
        $.ajax({
            url:"http://" + configObject.IP + "/v1/catalog/services",
            method:"get",
            async:false,
            dataType:"json",
            success:function(result, status, xhr) {
                dataServices = result;
            },
            error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                console.error("失败状态文本 " + status);
            }
        });
    };
    /*获得CS下的所有服务名称
     *尝试nginx仿真实的URL
     */
    var getConsulName = function () {
          $.ajax({
            url:"http://" + configObject.IP + "/v1/catalog/service/consul",

            method:"get",
            async:false,
            dataType:"json",
            success:function(result, status, xhr) {
               dataConsul  = result;
            },
            error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                console.error("失败状态文本 " + status);
            }
        });
    }
    /*根据服务名，来获得服务名下的所有主机节点信息。
     */
    var getAllDataService = function() {
        for (var i = 0; i < after_dataMemu.length; i++) {
            $.ajax({
                method:"get",
                url:"http://" + configObject.IP + "/v1/health/service/" + after_dataMemu[i],
                async:false,
                dataType:"json",
                success:function(result, status, xhr) {
                    var cmha_data_service_old = [];
                    cmha_data_service_old = result;
                    dataAllService[after_dataMemu[i]] = cmha_data_service_old;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("失败状态文本 " + status);
                }
            });
        }
    };

    /*处理CS数据，获得CS下的n个主机名
     */
     var getCSName = function () {
        for (var i = dataConsul.length - 1; i >= 0; i--) {
          ConuslName.push(dataConsul[i].Node);
        }
     }
    /*处理主机节点信息，获得服务的四个主机名
     */
    var changeDataAllSrvice = function() {
        try {
            for (var ky in dataAllService) {
                var serviceName = [];
                for (var a = 0; a < dataAllService[ky].length; a++) {
                    serviceName.push(dataAllService[ky][a].Node.Node);
                }
                dataMenuItem[ky] = serviceName;
            }
        } catch (erro) {
            console.error("changeDataAllSrvice  获得主机服务名出错！！！");
        }
    };
    /*自行构造函数，设置可以从数组中remove掉某个对象
     */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    /*getService_db函数执行后，得到所有服务名，筛选服务数据。
     */
    var changeServiceName = function() {
        try {
            for (var key in dataServices) {
                after_dataMemu.push(key);
            }
            after_dataMemu.remove("Statistics");
            after_dataMemu.remove("consul");
        } catch (erro) {
            console.error("changeServiceName 筛选服务名出错 ！！！");
        }
    };
   
    /*只针对主机节点的菜单没有base info
     *区别在与每一个主机我都添加了RS 点击这个RS跳到另一个页面
     *HOST=====HOST
     */  
    function addElementLiHost(obj,obj_cs,obj_rs) {

            var ul = document.getElementById(obj);
            ul.appendChild(obj_cs);
            for (var k in dataMenuItem) {
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
               

               
                for (var ky = 0; ky < dataMenuItem[k].length; ky++) {
                    var li_1 = document.createElement("li");
                    var a_1 = document.createElement("a");
                    a_1.setAttribute("href", "#");
                    a_1.setAttribute("tabindex", "-1");
                    a_1.setAttribute("class",obj_rs);
            
                    a_1.setAttribute("id", dataMenuItem[k][ky]);
                    var span_1 = document.createElement("span");
                //    span_1.setAttribute("class", "serviceHost nav-text");
               //   span_1.setAttribute("class",obj_rs);
            
                 //   span_1.setAttribute("id", dataMenuItem[k][ky]);
                    span_1.innerHTML = dataMenuItem[k][ky];
                  
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
            
        };

    /*执行主机节点的真实状态的左边菜单
     * RS = real_status
     */
    var addHostRSElementLi = function (obj_Element,obj_rs) {
        //添加CS的各个主机节点信息
      
         var li_host = document.createElement("li");
         li_host.setAttribute("class","dropdown-submenu");
        var a_host  = document.createElement("a");
        a_host.setAttribute("href","#");
        a_host.setAttribute("id","Home");
       a_host.setAttribute("tabindex","-1");

        var ul_host =document.createElement("ul");
        ul_host.setAttribute("class","dropdown-menu");
         
        for(var y=0; y<ConuslName.length;y++){
               var li_host1 = document.createElement("li");
                var  a_host1 = document.createElement("a");
                a_host1.setAttribute("href", "#");
               a_host1.setAttribute("class", obj_rs);
               a_host1.setAttribute("tabindex", "-1");
                a_host1.setAttribute("id", ConuslName[y]);
                var span_host1 = document.createElement("span");
                span_host1.innerHTML = ConuslName[y];
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
       addElementLiHost(obj_Element,li_host,obj_rs);

    }

 
    var startFunction = function() {
        
        getService_db();
        getConsulName();
        getCSName();
        changeServiceName();
        getAllDataService();
        changeDataAllSrvice();
 	    addHostRSElementLi("host_second_memu","RS"); 
        addHostRSElementLi("host_graph_memu","RGS"); 
    };
    
    startFunction();
};

changeMemu();


