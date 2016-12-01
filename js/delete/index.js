/*这是首页的js文件，用于设置动态菜单。
 *根据consul下的所有service服务名，以及服务下的所有主机节点。
 *动态产生左边菜单栏。
 */
var changeCsMemu = function() {
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
    /*获得服务名和主机节点的信息，动态产生菜单栏。
     */
    function addElementLi(obj,obj_cs) {

        var ul = document.getElementById(obj);
        ul.appendChild(obj_cs);
        for (var k in dataMenuItem) {
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
            for (var ky = 0; ky < dataMenuItem[k].length; ky++) {
                var li_1 = document.createElement("li");
                var a_1 = document.createElement("a");
                a_1.setAttribute("href", "#");
                var i_1 = document.createElement("i");
                i_1.setAttribute("class", "fa fa-dot-circle-o fa-lg  ");
                var span_1 = document.createElement("span");
                span_1.setAttribute("class", "serviceHost nav-text");
                span_1.setAttribute("id", dataMenuItem[k][ky]);
                span_1.innerHTML = dataMenuItem[k][ky];
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
        
    };
/*只针对主机节点的菜单没有base info
 *区别在与每一个主机我都添加了RS 点击这个RS跳到另一个页面
 */  
function addElementLiHost(obj,obj_cs,obj_rs) {

        var ul = document.getElementById(obj);
        ul.appendChild(obj_cs);
        for (var k in dataMenuItem) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.setAttribute("href", "#");
            var i = document.createElement("i");
            i.setAttribute("class", "fa fa-skype fa-lg");
            var ul_1 = document.createElement("ul");
            var li_news = document.createElement("li");
            var a_news = document.createElement("a");
            a_news.setAttribute("href", "#");

           
            for (var ky = 0; ky < dataMenuItem[k].length; ky++) {
                var li_1 = document.createElement("li");
                var a_1 = document.createElement("a");
                a_1.setAttribute("href", "#");
                var i_1 = document.createElement("i");
                i_1.setAttribute("class", "fa fa-dot-circle-o fa-lg  ");
                var span_1 = document.createElement("span");
                span_1.setAttribute("class", "serviceHost nav-text");
                span_1.setAttribute("class",obj_rs);
        
                span_1.setAttribute("id", dataMenuItem[k][ky]);
                span_1.innerHTML = dataMenuItem[k][ky];
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
        
    };
/*执行CS首页的次级菜单栏
 */
    var addCSElementLi = function (obj_Element) {
        //这是左面菜单栏的cs菜单
        var li_cs = document.createElement("li");
        var a_cs  = document.createElement("a");
        a_cs.setAttribute("href","#");
        a_cs.setAttribute("id","Home");
        var i_cs =document.createElement("i");
        i_cs.setAttribute("class","fa fa-archive fa-lg");
        
        var span_cs = document.createElement("span");
        span_cs.setAttribute("class","nav-text aaahaha");
        span_cs.innerHTML="CS";
        a_cs.appendChild(i_cs);
        a_cs.appendChild(span_cs);
        li_cs.appendChild(a_cs);
        addElementLi(obj_Element,li_cs);
       
    }
/*执行主机节点的真实状态的左边菜单
 *Graph点击后的左边菜单
 * RS = real_status
 */
    var addHostRSElementLi = function (obj_Element,obj_rs) {
        //添加CS的各个主机节点信息
        var li_host = document.createElement("li");
        var a_host  = document.createElement("a");
        a_host.setAttribute("href","#");
        a_host.setAttribute("id","Home");
        var i_host =document.createElement("i");
        i_host.setAttribute("class","fa fa-archive fa-lg");

        var ul_host =document.createElement("ul");
        for(var y=0; y<ConuslName.length;y++){
               var li_host1 = document.createElement("li");
                var  a_host1 = document.createElement("a");
                a_host1.setAttribute("href", "#");
                var i_host1 =document.createElement("i");
                i_host1.setAttribute("class", "fa fa-dot-circle-o fa-lg  ");
                var span_host1 = document.createElement("span");
                span_host1.setAttribute("class", "serviceHost nav-text");
               span_host1.setAttribute("class", obj_rs);
                span_host1.setAttribute("id", ConuslName[y]);
                span_host1.innerHTML = ConuslName[y];
                a_host1.appendChild(i_host1);
                a_host1.appendChild(span_host1);
                li_host1.appendChild(a_host1);
                ul_host.appendChild(li_host1); 
        }
        var span_host = document.createElement("span");
        span_host.setAttribute("class","nav-text");
        span_host.innerHTML="CS";
        a_host.appendChild(i_host);
        a_host.appendChild(span_host);
        li_host.appendChild(a_host);
        li_host.appendChild(ul_host);
       addElementLiHost(obj_Element,li_host,obj_rs);
    };
/*获得服务名和主机节点的信息，动态产生菜单栏。

    function addElementLi(obj) {
        var ul = document.getElementById(obj);

        for (var k in dataMenuItem) {
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
            for (var ky = 0; ky < dataMenuItem[k].length; ky++) {
                var li_1 = document.createElement("li");
                var a_1 = document.createElement("a");
                a_1.setAttribute("href", "#");
                var i_1 = document.createElement("i");
                i_1.setAttribute("class", "fa fa-dot-circle-o fa-lg  ");
                var span_1 = document.createElement("span");
                span_1.setAttribute("class", "serviceHost nav-text");
                span_1.setAttribute("id", dataMenuItem[k][ky]);
                span_1.innerHTML = dataMenuItem[k][ky];
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
 */
 
    var startFunction = function() {
        getService_db();
        getConsulName();
        getCSName();
        changeServiceName();
        getAllDataService();
        changeDataAllSrvice();

        if(IntData == 0){
            
             addCSElementLi("parentUl");
        }else{
            
            var parent=document.getElementById("parentUlAll");
            var child=document.getElementById("parentUl");
            parent.removeChild(child);
            IntData_cs=1;
           // return false;
             addHostRSElementLi("parentUlGraph","GHS");
        }

 //cs
 //      addCSElementLi("parentUl","RS"); // 这是CS页面带有cs次级菜单的菜单栏
    };
    startFunction();
};




changeCsMemu();