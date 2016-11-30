var pagefunction = function() {
 
 
    var getServiceName = function() {
        var arrayName = document.cookie.split(";");
        for (var a = 0; a < arrayName.length; a++) {
            if (arrayName[a].indexOf("serviceName") != -1) {
               
                serviceName = arrayName[a].split("=")[1];
            }
        }
    };
    getServiceName();
    function run_jqgrid_db_function() {
        var data_leader_db = [];
        var data_services_db = {};
        var cmha_db_bocop = [];
        var dbServiceName = [];
        var after_data_services_db = "";
        var getAllDataService = function() {
            for (var i = 0; i < dbServiceName.length; i++) {
                $.ajax({
                    method:"get",
                    url:"http://" + IP + "/v1/health/service/" + dbServiceName[i],
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                        var cmha_data_service_old = [];
                        cmha_data_service_old = result;
                        cmha_db_bocop.push(cmha_data_service_old);
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("getAllDataService 失败状态文本 " + status);
                    }
                });
            }
        };
        var changeStatus = function(obj_status_all) {
            switch (obj_status_all) {
              case "passing":
                obj_status_all = "OK";
                return obj_status_all;

              case "critical":
                obj_status_all = "Fail";
                return obj_status_all;

              default:
                return obj_status_all;
            }
        };
        var getStatus = function(obj_status, obj_agent_statsu) {
            if (obj_agent_statsu == "Fail") {
                return obj_status = "Unknown";
            } else if (obj_agent_statsu == "OK") {
                if (obj_status == "passing") {
                    obj_status = "OK";
                } else if (obj_status == "critical") {
                    obj_status = "Fail";
                }
                return obj_status;
            }
        };
        var getVipofchap = function(obj_serviceName) {
            var data_getVipofchap = "";
            $.ajax({
                method:"get",
                url:"http://" + IP + "/v1/kv/cmha/service/" + obj_serviceName + "/chap/VIP?raw",
                async:false,
                dataType:"text",
                success:function(result, status, xhr) {
                    data_getVipofchap = result;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getVipofchap 失败状态文本 " + status);
                }
            });
            return data_getVipofchap;
        };
        var makeMstaer = function(obj_master, obj_serviceName) {
            if (obj_master == "master") {
                var data_master = {};
                data_master["role"] = obj_master;
                data_master["VIP"] = getVipofchap(obj_serviceName);
                return data_master;
            } else {
                var data_backup = {};
                data_backup["role"] = obj_master;
                data_backup["VIP"] = " ";
                return data_backup;
            }
        };
        var getRoleofchap = function(obj_serviceName, obj_hostName) {
            var data_RandVofchap = {};
            $.ajax({
                method:"get",
                url:"http://" + IP + "/v1/kv/cmha/service/" + obj_serviceName + "/chap/role/" + obj_hostName + "?raw",
                async:false,
                dataType:"text",
                success:function(result, status, xhr) {
                    data_RandVofchap = makeMstaer(result, obj_serviceName);
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getRoleofchap 失败状态文本 " + status);
                }
            });
            return data_RandVofchap;
        };
        var getRepl_err_counterOfDB = function(objRepl_serviceName, obj5Repl_hostname) {
            var data_result = "";
            $.ajax({
                method:"get",
                url:"http://" + IP + "/v1/kv/cmha/service/" + objRepl_serviceName + "/db/repl_err_counter/" + obj5Repl_hostname + "?raw",
                async:false,
                dataType:"json",
                success:function(result, status, xhr) {
                    data_result = result;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getRepl_err_counterOfDB 失败状态文本 " + status);
                }
            });
            return data_result;
        };
        var changeRoleOfDB = function(obj_IP) {
            for (var i = after_data_leader_db.length - 1; i >= 0; i--) {
                if (after_data_leader_db[i] == obj_IP) {
                    return "leader";
                }
            }
            return " ";
        };
        var changeRoleOfChap = function(obj_a_serfHealth_status,obj_role){
            if(obj_a_serfHealth_status == "OK"){
                return obj_role;
            }else{
                return "Unknown";
            }
        };
        var changeVipOfChap = function(obj_a_serfHealth_status,obj_vip){
            if(obj_a_serfHealth_status == "OK"){
                return obj_vip;
            }else{
                return "";
            }
        };
        var changeType = function(obj_type, a_Node, a_Service_ID, a_chap01_status, obj_Address,obj_a_serfHealth_status) {
            var dataArray = {};
            switch (obj_type) {
              case "chap-slave":
                dataArray = {};
                obj_type = "chap";
                dataArray["type"] = obj_type;
                var a_dataArray = getRoleofchap(a_Service_ID, a_Node);
                dataArray["role"] =  changeRoleOfChap(obj_a_serfHealth_status,a_dataArray.role);
                dataArray["VIP"] = changeVipOfChap(obj_a_serfHealth_status,a_dataArray.VIP);
                dataArray["REPL_ERR_COUNTER"] = " ";
                dataArray["REPL_STATUS"] = " ";
                return dataArray;

              case "chap-master":
                dataArray = {};
                obj_type = "chap";
                dataArray["type"] = obj_type;
                var b_dataArray = getRoleofchap(a_Service_ID, a_Node);
                dataArray["role"] =changeRoleOfChap(obj_a_serfHealth_status,b_dataArray.role);
                dataArray["VIP"] =  changeVipOfChap(obj_a_serfHealth_status,b_dataArray.VIP);
                dataArray["REPL_ERR_COUNTER"] = " ";
                dataArray["REPL_STATUS"] = " ";
                return dataArray;

              case "master":
                dataArray = {};
                obj_type = "db";
                dataArray["type"] = obj_type;
                dataArray["REPL_ERR_COUNTER"] = getRepl_err_counterOfDB(a_Service_ID, a_Node);
                dataArray["REPL_STATUS"] = a_chap01_status;
                dataArray["role"] = changeRoleOfDB(obj_Address);
                dataArray["VIP"] = " ";
                return dataArray;

              case "slave":
                dataArray = {};
                obj_type = "db";
                dataArray["type"] = obj_type;
                dataArray["REPL_ERR_COUNTER"] = getRepl_err_counterOfDB(a_Service_ID, a_Node);
                dataArray["REPL_STATUS"] = a_chap01_status;
                dataArray["role"] = changeRoleOfDB(obj_Address);
                dataArray["VIP"] = " ";
                return dataArray;
            }
        };
        var getDataLeader = function() {
            for (var t = 0; t < dbServiceName.length; t++) {
                $.ajax({
                    method:"get",
                    url:"http://" + IP + "/v1/kv/cmha/service/" + dbServiceName[t] + "/db/leader?raw",
                    async:false,
                    dataType:"text",
                    success:function(result, status, xhr) {
                        var cmha_data_service_leader_old = [];
                        cmha_data_service_leader_old = result;
                        data_leader_db = data_leader_db.concat(cmha_data_service_leader_old);
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("getDataLeader 失败状态文本 " + status);
                    }
                });
            }
        };
        var after_cmha_db_bocop = [], cmha_db_bocop_a = [], cmha_db_bocop_b = [], cmha_db_bocop_c = [], cmha_db_bocop_d = [], after_cmha_db_bocop_a = {}, after_cmha_db_bocop_b = {}, after_cmha_db_bocop_c = {}, after_cmha_db_bocop_d = {};
        var changeData_db = function() {
            after_cmha_db_bocop = [];
            for (var x = 0; x < cmha_db_bocop.length; x++) {
                after_cmha_db_bocop_a = {};
                for (var y = 0; y < cmha_db_bocop[x].length; y++) {
                    cmha_db_bocop_a = cmha_db_bocop[x][y];
                    var a_Node = cmha_db_bocop_a.Node;
                    var a_Service_ID = cmha_db_bocop_a.Service.ID;
                    var a_Service_Service = cmha_db_bocop_a.Service.Service;
                    var a_type = cmha_db_bocop_a.Service.Tags[0];
                    var a_Address = cmha_db_bocop_a.Service.Address;
                    var a_Port = cmha_db_bocop_a.Service.Port;
                    var a_chap01 = cmha_db_bocop_a.Checks[0].CheckID;
                    var a_serfHealth_status = changeStatus(cmha_db_bocop_a.Checks[1].Status);
                    var a_chap01_status = getStatus(cmha_db_bocop_a.Checks[0].Status, a_serfHealth_status);
                    var a_serfHealth = cmha_db_bocop_a.Checks[1].CheckID;
                    var a_chap01_Output = cmha_db_bocop_a.Checks[0].Output;
                    after_cmha_db_bocop_a = changeType(a_type, a_Node.Node, a_Service_ID, a_chap01_status, a_Address,a_serfHealth_status);
                    after_cmha_db_bocop_a["Node"] = a_Node.Node;
                    after_cmha_db_bocop_a["Address"] = a_Node.Address;
                    after_cmha_db_bocop_a["ServiceID"] = a_Service_ID;
                    after_cmha_db_bocop_a["ServiceName"] = a_Service_Service;
                    after_cmha_db_bocop_a["ServiceAddress"] = a_Address;
                    after_cmha_db_bocop_a["ServicePort"] = a_Port;
                    after_cmha_db_bocop_a["chap_CheckID"] = a_chap01;
                    after_cmha_db_bocop_a["chap_status"] = a_chap01_status;
                    after_cmha_db_bocop_a["serfHealth_CheckID"] = a_serfHealth;
                    after_cmha_db_bocop_a["serfHealth_status"] = a_serfHealth_status;
                    after_cmha_db_bocop_a["Output"] = a_chap01_Output;
                    after_cmha_db_bocop.push(after_cmha_db_bocop_a);
                }
            }
        };
        var after_data_leader_db = [];
        var getLeader = function() {
            for (var k = 0; k < data_leader_db.length; k++) {
                var leader_string_Array = [];
                leader_string_Array = data_leader_db[k].split(" ");
                var leader_ip_Array = [];
                leader_ip_Array = leader_string_Array[leader_string_Array.length - 1].split(":");
                after_data_leader_db.push(leader_ip_Array[0]);
            }
        };
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
        var getServiceDb = function() {
            try {
                dbServiceName.push(serviceName);
                getAllDataService();
                getDataLeader();
                getLeader();
            } catch (erro) {
                console.error("获得DB数据出错！！！");
            } finally {
                changeData_db();
            }
        };
        getServiceDb();
        var formatter_chap_status = function(cellvalue, options, rowObject) {
            if (rowObject.chap_status == "OK") {
                return '<span style="color:green;" >' + cellvalue + "</span>";
            } else if (rowObject.chap_status == "warning") {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            } else {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            }
        };
        var formatter_serfHealth_status = function(cellvalue, options, rowObject) {
            if (rowObject.serfHealth_status == "OK") {
                return '<span style="color:green;" >' + cellvalue + "</span>";
            } else if (rowObject.serfHealth_status == "warning") {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            } else {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            }
        };
        var formatter_role_status = function(cellvalue, options, rowObject) {
            if (rowObject.role == "Unknown") {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            }  else {
                return '<span >' + cellvalue + "</span>";
            }
        };
     
        var dbJqGrid = function() {
            if (IP_old == 0) {
                jQuery("#jqgrid_db").jqGrid({
                    data:after_cmha_db_bocop,
                    datatype:"local",
                    height:"auto",
                    colNames:[ "ServiceName", "Node", "Type", "Address", "ServicePort", "Status", "Ca_Status", "Role", "VIP", "Repl_Status", "Repl_Err_Counter", "Output" ],
                    colModel:[ {
                        name:"ServiceName",
                        index:"ServiceName",
                         align:"center",
                        editable:true
                    }, {
                        name:"Node",
                          align:"center",
                        index:"Node"
                    }, {
                        name:"type",
                          align:"center",
                        index:"type"
                    }, {
                        name:"Address",
                        index:"Address",
                          align:"center",
                        editable:true
                    }, {
                        name:"ServicePort",
                        index:"ServicePort",
                        align:"center",
                        editable:true
                    }, {
                        name:"chap_status",
                        index:"chap_status",
                         align:"center",
                        formatter:formatter_chap_status
                    }, {
                        name:"serfHealth_status",
                        index:"serfHealth_status",
                         align:"center",
                        formatter:formatter_serfHealth_status
                    }, {
                        name:"role",
                          align:"center",
                           formatter:formatter_role_status,
                        index:"role"
                    }, {
                        name:"VIP",
                          align:"center",
                        index:"VIP"
                    }, {
                        name:"REPL_STATUS",
                        index:"REPL_STATUS",
                          align:"center",
                        formatter:formatter_repl_status
                    }, {
                        name:"REPL_ERR_COUNTER",
                        index:"REPL_ERR_COUNTER",
                          align:"center",
                        formatter:formatter_counter_status
                    }, {
                        name:"Output",
                        index:"Output",
                        align:"left"
                    } ],
                    rowNum:10,
                    rowList:[ 10 ],
                    pager:"#pjqgrid_db",
                    sortname:"ServiceName",
                    toolbarfilter:true,
                    viewrecords:true,
                    sortorder:"asc",
                    gridComplete:function() {
                        var ids = jQuery("#jqgrid_db").jqGrid("getDataIDs");
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                        }
                    },
                    editurl:"dummy.html",
                    caption:"service info",
                    multiselect:true,
                    autowidth:true
                });
            } else {
                jQuery("#jqgrid_db").setGridParam({
                    data:after_cmha_db_bocop,
                    datatype:"local"
                }).trigger("reloadGrid");
            }
        };
        dbJqGrid();
    }
    
    var run_jqgrid_warn_function = function() {
        var after_data_WSV = [];
        var data_WSK = [];
        var data_WSV = [];
        var getData_WS = function() {
            var getData_WSK = function() {
                $.ajax({
                    method:"get",
                    url:"http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/alerts/alerts_counter?keys",
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                        data_WSK = result;
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("getData_WS 失败状态文本 " + status);
                    }
                });
            };
            var getData_WSV = function() {
                for (var w = 0; w < data_WSK.length; w++) {
                    $.ajax({
                        method:"get",
                        url:"http://" + IP + "/v1/kv/" + data_WSK[w] + "?raw",
                        async:false,
                        dataType:"text",
                        success:function(result, status, xhr) {

                            data_WSV.push(result);
                        },
                        error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                            console.error("getData_WSV 失败状态文本 " + status);
                        }
                    });
                }
            };
            getData_WSK();
            getData_WSV();
        };
        var changeData_WSV = function() {
            for (var q = 0; q < data_WSV.length; q++) {
                var a_data_WSV = data_WSV[q];
                var index_a = a_data_WSV.indexOf("@");
                var index_aa = a_data_WSV.indexOf(" ", index_a);
                var index_aaa = a_data_WSV.indexOf(" ", index_aa + 1);
                var value_a_data_WSV = a_data_WSV.substring(index_aaa);
                var array_a_data_WSV = a_data_WSV.split("]", 3);
                var after_a_data_WSV = {};
                after_a_data_WSV["valueOW"] = value_a_data_WSV;
                after_a_data_WSV["timeOW"] = array_a_data_WSV[0].substring(1);
                after_a_data_WSV["typeOW"] = array_a_data_WSV[1].substring(2);
                after_a_data_WSV["serviceOW"] = array_a_data_WSV[2].substring(3);
                after_data_WSV.push(after_a_data_WSV);
            }
        };
        var warnJqGrid = function() {
            if (IP_old == 0) {
                jQuery("#jqgrid_warning").jqGrid({
                    data:after_data_WSV,
                    datatype:"local",
                    height:"auto",
                    colNames:[ "Time", "Type", "ServiceName", "Log" ],
                    colModel:[ {
                        name:"timeOW",
                        index:"timeOW",
                        align:"left",
                        editable:true,
                        sortable:true,
                        width:30
                    }, {
                        name:"typeOW",
                        index:"typeOW",
                        align:"center",
                        sortable:false,
                        width:20
                    }, {
                        name:"serviceOW",
                        index:"serviceOW",
                        align:"center",
                        sortable:false,
                        width:20
                    }, {
                        name:"valueOW",
                        index:"valueOW",
                        align:"left",
                        sortable:false
                    } ],
                    rowNum:10,
                    rowList:[ 10 ],
                    pager:"#pjqgrid_warning",
                    sortname:"timeOW",
                    toolbarfilter:true,
                    viewrecords:true,
                    sortorder:"desc",
                    gridComplete:function() {
                        var ids = jQuery("#jqgrid_warning").jqGrid("getDataIDs");
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                        }
                    },
                    editurl:"dummy.html",
                    caption:"service alerts info",
                    multiselect:true,
                    autowidth:true
                });
            } else {
                jQuery("#jqgrid_warning").setGridParam({
                    data:after_data_WSV,
                    datatype:"local"
                }).trigger("reloadGrid");
            }
        };
        getData_WS();
        changeData_WSV();
        warnJqGrid();
    };
    run_jqgrid_db_function();
    run_jqgrid_warn_function();
};

var setTimeFunction = function() {

    pagefunction();
    IP_old = 1;
   
var date = new Date();
  cstimeSetTimeout = setTimeout(setTimeFunction, FreshenTime);
  console.log("service定时器"+date+"=="+cstimeSetTimeout); 
   
 kaiguan_cs++;







};


 if(kaiguan_cs != 0){
   IP_old=0;
   clearInterval(cstimeSetTimeout);
   setTimeFunction();
 }else{
    IP_old=0;
    setTimeFunction();
 }