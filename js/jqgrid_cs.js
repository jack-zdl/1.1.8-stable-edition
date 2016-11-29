var pagefunction = function() {
    //获得service
     var getHostName = function() {
            var arrayName = document.cookie.split(";");
            for (var b = 0; b < arrayName.length; b++) {
                if (arrayName[b].indexOf("serviceName") != -1) {
                    serviceName = arrayName[b].split("=")[1];
                    console.log("=cs====serviceName="+serviceName);
                }
            }                
    };
    getHostName();
  //  serviceName = document.cookie.split(";")[0].split("=")[1];
    
    function run_jqgrid_cs_function() {
        var cmha_cs = [];
        var data_status_cs = [];
        var data_status_csa = [];
        var data_status_csb = [];
        var data_status_csc = [];
        var data_leader_cs = "";
        var Node_cs_a = "", Node_cs_b = "", Node_cs_c = "";
        var Node_cs = [];
        //得到cmha_cs的信息简略信息信息
        var getAllDataCS = function() {
            $.ajax({
                url:"http://" + IP + "/v1/catalog/service/consul",
                method:"get",
                async:false,
                dataType:"json",
                success:function(result, status, xhr) {
                    cmha_cs = result;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getAllDataCS  CS数据状态文本 " + status);
                }
            });
        };
        //得到cmha的某个详细信息
        var getDataCS = function() {
            for (var jj = 0; jj < Node_cs.length; jj++) {
                $.ajax({
                    method:"get",
                    url:"http://" + IP + "/v1/health/node/" + Node_cs[jj],
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                    
                     
                           for (var i_result = result.length - 1; i_result >= 0; i_result--) {
                           
                               if(result[i_result].ServiceID == "Statistics"){
                              
                                       result.splice(i_result,1);
                               }
                           }


                        data_status_cs.push(result);
                    },
                    error:function(XMLHttpRequest, status, textStatus, e) {
                        console.error("getDataCS() Data of one of Data 单个cs节点 状态文本 " + status);
                    }
                });
            }
        };
        //得到那个是leader
        var getDataCS_Leader = function() {
            $.ajax({
                method:"get",
                url:"http://" + IP + "/v1/status/leader",
                async:false,
                dataType:"json",
                success:function(result, status, xhr) {
                    data_leader_cs = result;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getDataCS_Leader get Data of leader 状态文本 " + status);
                }
            });
        };
        //判断那个是Leader
        var changeRoleOfDB = function(obj_IP) {
                if (after_data_leader_cs == obj_IP) {
                return "leader";
                } else {
                return " ";
                }
        };
        var data_cs = [];
        //处理数据
        var changeData_cs = function() {
            try {
                for (i = 0; i < cmha_cs.length; i++) {
                    for (u = 0; u < data_status_cs.length; u++) {
                        if (cmha_cs[i].Node == data_status_cs[u][0].Node) {
                            var data_cs_aa = cmha_cs[i];
                            var data_status_cs_aa = data_status_cs[u][0].Status;
                            var data_Output_cs_aa = data_status_cs[u][0].Output;
                            $(data_cs_aa).attr("Status", data_status_cs_aa);
                            $(data_cs_aa).attr("Output", data_Output_cs_aa);
                            $(data_cs_aa).attr("Role", changeRoleOfDB(data_cs_aa.Address));
                            data_cs.push(data_cs_aa);
                            continue;
                        }
                    }
                }
            } catch (error) {
                console.error("错误信息名称  = " + error);
            }
        };
        var after_data_leader_cs = "";
        //根据原始数据的得到IP
        var getleaderIp = function() {
            var leader_string_Array = [];
            leader_string_Array = data_leader_cs.split(" ");
            var leader_ip_Array = [];
            leader_ip_Array = leader_string_Array[leader_string_Array.length - 1].split(":");
            after_data_leader_cs = leader_ip_Array[0];
        };
        //合并数据
        var getNodeOfCS = function() {
            try {
                getAllDataCS();
                if (cmha_cs.length > 0) {
                    for (var ii = 0; ii < cmha_cs.length; ii++) {
                        Node_cs.push(cmha_cs[ii].Node);
                    }
                } else {
                    console.error("cmha_cs 没有数据");
                }
                getDataCS();
                getDataCS_Leader();
                getleaderIp();
            } catch (error) {
                console.error("获得CS CS_a CS_b CS_c CS_leader 数据出错");
            } finally {
                changeData_cs();
            }
        };
        getNodeOfCS();
        //表格的内在函数
        var formatter = function(cellvalue, options, rowObject) {
            if (rowObject.Address == after_data_leader_cs) {
                return "<span after_data_leader_db >" + cellvalue + "</span>";
            } else {
                return "<span  >" + cellvalue + "</span>";
            }
        };
        var formatter_status = function(cellvalue, options, rowObject) {
            if (rowObject.Status == "passing") {
                return '<span style="color:green;" >' + cellvalue + "</span>";
            } else if (rowObject.Status == "warning") {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            } else {
                return '<span style="color:red;" >' + cellvalue + "</span>";
            }
        };
        var csJqGrid = function() {
            if (IP_old == 0) {
                jQuery("#jqgrid_cs").jqGrid({
                    data:data_cs,
                    datatype:"local",
                    height:"auto",
                    colNames:[ "ServiceName", "Node", "ServiceAddress", "ServicePort", "Status", "Role", "Output" ],
                    colModel:[ {
                        name:"ServiceName",
                        index:"ServiceName",
                         align:"center",
                        editable:true,
                        sortable:false
                    }, {
                        name:"Node",
                          align:"center",
                        index:"Node"
                    }, {
                        name:"Address",
                        index:"Address",
                          align:"center",
                        editable:true,
                        sortable:false
                    }, {
                        name:"ServicePort",
                        index:"ServicePort",
                       align:"center",
                        editable:true,
                        sortable:false
                    }, {
                        name:"Status",
                        index:"Status",
                        align:"center",
                        formatter:formatter_status,
                        sortable:false
                    }, {
                        name:"Role",
                        index:"Role",
                         align:"center",
                        sortable:false
                    }, {
                        name:"Output",
                        index:"Output",
                        align:"left",
                        sortable:false
                    } ],
                    rowNum:10,
                    rowList:[ 10 ],
                    pager:"#pjqgrid_cs",
                    sortname:"Node",
                    toolbarfilter:true,
                    viewrecords:true,
                    sortorder:"asc",
                    gridComplete:function() {
                        var ids = jQuery("#jqgrid_cs").jqGrid("getDataIDs");
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                        }
                    },
                    editurl:"dummy.html",
                    caption:" cs info",
                    multiselect:true,
                    autowidth:true
                });
            } else {
                jQuery("#jqgrid_cs").setGridParam({
                    data:data_cs,
                    datatype:"local"
                }).trigger("reloadGrid");
            }
        };
        csJqGrid();
    }


    function run_jqgrid_db_function() {
        var data_leader_db = [];
        var data_services_db = {};
        var cmha_db_bocop = [];
        var dbServiceName = [];
        var after_data_services_db = "";
        var getService_db = function() {
            $.ajax({
                url:"http://" + IP + "/v1/catalog/services",
                method:"get",
                async:false,
                dataType:"json",
                success:function(result, status, xhr) {
                    data_services_db = result;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("getService_db  get all name of service 状态文本 " + status);
                }
            });
        };
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
                        console.error("getAllDataService get every data of service失败状态文本 " + status);
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
                    console.error("getVipofchap 获得chap的VIP 状态文本 " + status);
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
                    console.error("getRoleofchap 获得chap的role  状态文本 " + status);
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
                    console.error("getRepl_err_counterOfDB 获得DB的repl_err_counter状态文本 " + status);
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
        //具体类型转换
        var changeType = function(obj_type, a_Node, a_Service_ID, a_chap01_status, obj_Address,obj_a_serfHealth_status) {
            var dataArray = {};
            switch (obj_type) {
              case "chap-slave":
                dataArray = {};
                obj_type = "chap";
                dataArray["type"] = obj_type;
                var a_dataArray = getRoleofchap(a_Service_ID, a_Node);
                dataArray["role"] = changeRoleOfChap(obj_a_serfHealth_status,a_dataArray.role);
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
                dataArray["VIP"] = changeVipOfChap(obj_a_serfHealth_status,b_dataArray.VIP);
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
            data_leader_db = [];
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
                        console.error("getDataLeader 获得服务的leader 状态文本 " + status);
                    }
                });
            }
        };
        var getReallyStatus = function(obj_array_status, obj_service) {
            for (var i = obj_array_status.length - 1; i >= 0; i--) {
                if (obj_array_status[i].CheckID.indexOf("service") != -1 && obj_array_status[i].CheckID.indexOf(obj_service) != -1) {
                    return obj_array_status[i].Status;
                }
            }
        };
        var getAgentStatus = function(obj_array_status) {
            for (var i = obj_array_status.length - 1; i >= 0; i--) {
                if (obj_array_status[i].CheckID.indexOf("serfHealth") != -1) {
                    return obj_array_status[i].Status;
                }
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
                    debugger;
                    var a_serfHealth_status = changeStatus(getAgentStatus(cmha_db_bocop_a.Checks));
                    var a_chap01_status = getStatus(getReallyStatus(cmha_db_bocop_a.Checks, dbServiceName[x]), a_serfHealth_status);
                    var a_serfHealth = cmha_db_bocop_a.Checks[1].CheckID;
                    var a_chap01_Output = cmha_db_bocop_a.Checks[0].Output;
                    after_cmha_db_bocop_a = changeType(a_type, a_Node.Node, a_Service_ID, a_chap01_status, a_Address,a_serfHealth_status); //a_serfHealth_status
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
            after_data_leader_db = [];
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
                getService_db();
                var i = 0;
                var serviceName_a = [];
                for (var key in data_services_db) {
                    dbServiceName.push(key);
                    i++;
                }
                dbServiceName.remove("consul");
                dbServiceName.remove("Statistics");
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
        var formatter_db = function(cellvalue, options, rowObject) {
            Hostrole_id = "";
            for (var l = 0; l < after_data_leader_db.length; l++) {
                if (rowObject.Address == after_data_leader_db[l]) {
                    Hostrole_id = "leader";
                    return '<span style="color:green;" >' + cellvalue + "</span>";
                }
            }
            return "<span  >" + cellvalue + "</span>";
        };
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
            var jqGridDate = new Date();
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
                        index:"Node",
                        align:"center",
                        sortable:false
                    }, {
                        name:"type",
                        index:"type",
                        align:"center",
                        sortable:false
                    }, {
                        name:"Address",
                        index:"Address",
                        align:"center",
                        editable:true,
                        sortable:false
                    }, {
                        name:"ServicePort",
                        index:"ServicePort",
                         align:"center",
                        editable:true,
                        sortable:false
                    }, {
                        name:"chap_status",
                        index:"chap_status",
                         align:"center",
                        formatter:formatter_chap_status,
                        sortable:false
                    }, {
                        name:"serfHealth_status",
                        index:"serfHealth_status",
                        align:"center",
                        formatter:formatter_serfHealth_status,
                        sortable:false
                    }, {
                        name:"role",
                        index:"role",
                          align:"center",
                          formatter:formatter_role_status,
                        sortable:false
                    }, {
                        name:"VIP",
                        index:"VIP",
                          align:"center",
                        sortable:false
                    }, {
                        name:"REPL_STATUS",
                        index:"REPL_STATUS",
                         align:"center",
                        formatter:formatter_repl_status,
                        sortable:false
                    }, {
                        name:"REPL_ERR_COUNTER",
                        index:"REPL_ERR_COUNTER",
                         align:"center",
                        formatter:formatter_counter_status,
                        sortable:false
                    }, {
                        name:"Output",
                        index:"Output",
                        align:"left",
                        sortable:false
                    } ],
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
        var after_data_WCSV = [];
        var data_WCSK = [];
        var data_WCSV = [];
        var getData_WCS = function() {
            var getData_WCSK = function() {
                $.ajax({
                    method:"get",
                    url:"http://" + IP + "/v1/kv/cmha/service/" + "CS/alerts/alerts_counter?keys",
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                        data_WCSK = result;
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("getData_WCSK data_warning_cs_key 失败状态文本 " + status);
                    }
                });
            };
            var getData_WCSV = function() {
                for (var w = 0; w < data_WCSK.length; w++) {
                    $.ajax({
                        method:"get",
                        url:"http://" + IP + "/v1/kv/" + data_WCSK[w] + "?raw",
                        async:false,
                        dataType:"text",
                        success:function(result, status, xhr) {
                            data_WCSV.push(result);
                        },
                        error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                            console.error("getData_WCSV  data_warning_cs_value 失败状态文本 " + status);
                        }
                    });
                }
            };
            getData_WCSK();
            getData_WCSV();
        };
        var changeData_WCSV = function() {
            for (var q = 0; q < data_WCSV.length; q++) {
                var a_data_WCSV = data_WCSV[q];
                var index_a = a_data_WCSV.indexOf("@");
                var index_aa = a_data_WCSV.indexOf(" ", index_a);
                var index_aaa = a_data_WCSV.indexOf(" ", index_aa + 1);
                var value_a_data_WCSV = a_data_WCSV.substring(index_aaa);
                var array_a_data_WCSV = a_data_WCSV.split("]", 3);
                var after_a_data_WCSV = {};
                after_a_data_WCSV["valueOW"] = value_a_data_WCSV;
                after_a_data_WCSV["timeOW"] = array_a_data_WCSV[0].substring(1);
                after_a_data_WCSV["typeOW"] = array_a_data_WCSV[1].substring(2);
                after_a_data_WCSV["serviceOW"] = array_a_data_WCSV[2].substring(3);
                after_data_WCSV.push(after_a_data_WCSV);
            }
        };
        var warnJqGrid = function() {
            if (IP_old == 0) {
                jQuery("#jqgrid_warning").jqGrid({
                    data:after_data_WCSV,
                    datatype:"local",
                    height:"auto",
                    colNames:[ "Time", "Type", "ServiceName", "Log" ],
                    colModel:[ {
                        name:"timeOW",
                        index:"timeOW",
                        align:"center",
                        editable:true,
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
                    sortorder:"asc",
                    gridComplete:function() {
                        var ids = jQuery("#jqgrid_warning").jqGrid("getDataIDs");
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                        }
                    },
                    editurl:"dummy.html",
                    caption:"cs alerts info",
                    multiselect:true,
                    autowidth:true
                });
            } else {
                jQuery("#jqgrid_warning").setGridParam({
                    data:after_data_WCSV,
                    datatype:"local"
                }).trigger("reloadGrid");
            }
        };
        getData_WCS();
        changeData_WCSV();
        warnJqGrid();
    };
    run_jqgrid_cs_function();
    run_jqgrid_db_function();
    run_jqgrid_warn_function();
};

var setTimeFunction = function() {
    
    pagefunction();
    IP_old = 1;
    var date = new Date();
   console.log("CS定时器"+date+"=="+cstimeSetTimeout);
    cstimeSetTimeout = setTimeout(setTimeFunction,FreshenTime);
   
  
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
