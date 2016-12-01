var pagefunction = function() {
  
     
    var getHostName = function() {
        var arrayName = document.cookie.split(";");
        
        for (var a = 0; a < arrayName.length; a++) {
            if (arrayName[a].indexOf("hostName") != -1) {
                hostName = arrayName[a].split("=")[1];
            }
        }
        for (var b = 0; b < arrayName.length; b++) {
            if (arrayName[b].indexOf("serviceName") != -1) {
                serviceName = arrayName[b].split("=")[1];
            }
        }                
    };
    getHostName();
    function getDate(tm) {
              var tt = new Date(tm * 1e3);
        var Y = tt.getFullYear() + "-";
        var M = (tt.getMonth() + 1 < 10 ? "0" + (tt.getMonth() + 1) :tt.getMonth() + 1) + "-";
        var D = (tt.getDate() < 10 ? "0" + tt.getDate() :tt.getDate()) + " ";
        var h = (tt.getHours() < 10 ? "0" + tt.getHours() :tt.getHours()) + ":";
        var m = (tt.getMinutes() < 10 ? "0" + tt.getMinutes() :tt.getMinutes()) + ":";
        var s = tt.getSeconds() < 10 ? "0" + tt.getSeconds() :tt.getSeconds();
        var tt_time = Y + M + D + h + m + s;
        return tt_time;
    }
    function changTypeOS(obj_typeOS) {
        switch (obj_typeOS) {
          case "I":
            var info = "I";
            return info;

          case "E":
            var error = "error";
            return error;

          case "W":
            var warning = "warning";
            return warning;

          default:
            var weizhi = "Unknown";
            return weizhi;
        }
    }
    var formatter_switch = function(cellvalue, options, rowObject) {
        if (rowObject.type == "I") {
            return '<span style="color:green;" >' + "info" + "</span>";
        } else if (rowObject.type == "E") {
            return '<span style="color:red;" >' + "error" + "</span>";
        } else if (rowObject.type == "W") {
            return '<span style="color:red;" >' + "warning" + "</span>";
        }
    };
    HostType = "";
    function run_jqgrid_db_function() {
        var data_leader_db = [];
        var data_services_db = {};
        var cmha_db_bocop = [];
        var dbServiceName = [];
        var after_data_services_db = "";
        var after_data_leader_db = [];
        var leader_aaaaaaa = {};
        var getAllDataService = function() {
            for (var i = 0; i < dbServiceName.length; i++) {
                cmha_db_bocop = [];
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
                        console.error("getAllDataService  失败状态文本 " + status);
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
                    data_getVipofchap = "";
                    data_getVipofchap = result;
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("失败状态文本 " + status);
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
                    data_RandVofchap = {};
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
                    data_result = "";
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
















        var changeType = function(obj_type, a_Node, a_Service_ID, a_chap01_status, obj_Address, obj_a_serfHealth_status) {
            var dataArray = {};
            switch (obj_type) {
              case "chap-slave":
                HostType = "chap";
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
                HostType = "chap";
                dataArray = {};
                obj_type = "chap";
                dataArray["type"] = obj_type;
                var b_dataArray = getRoleofchap(a_Service_ID, a_Node);
                dataArray["role"] = changeRoleOfChap(obj_a_serfHealth_status,b_dataArray.role);
                dataArray["VIP"] = changeVipOfChap(obj_a_serfHealth_status,b_dataArray.VIP);
                dataArray["REPL_ERR_COUNTER"] = " ";
                dataArray["REPL_STATUS"] = " ";
                return dataArray;

              case "master":
                HostType = "db";
                dataArray = {};
                obj_type = "db";
                dataArray["type"] = obj_type;
                dataArray["REPL_ERR_COUNTER"] = getRepl_err_counterOfDB(a_Service_ID, a_Node);
                dataArray["REPL_STATUS"] = a_chap01_status;
                dataArray["role"] = changeRoleOfDB(obj_Address);
                dataArray["VIP"] = " ";
                return dataArray;

              case "slave":
                HostType = "db";
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
                        var cmha_data_service_leader_old = {};
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
                cmha_db_bocop_a = cmha_db_bocop[x][0];
                cmha_db_bocop_b = cmha_db_bocop[x][1];
                cmha_db_bocop_c = cmha_db_bocop[x][2], cmha_db_bocop_d = cmha_db_bocop[x][3];
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
        };
        var getLeader = function() {
            try {
                after_data_leader_db = [];
                after_data_leader_db.length = 0;
                for (var k = 0; k < data_leader_db.length; k++) {
                    var leader_string_Array = [];
                    leader_string_Array = data_leader_db[k].split(" ");
                    var leader_ip_Array = [];
                    leader_ip_Array = leader_string_Array[leader_string_Array.length - 1].split(":");
                    leader_aaaaaaa = leader_ip_Array[0];
                    after_data_leader_db.push(leader_ip_Array[0]);
                }
            } catch (error) {
                console.error("getLeader  error");
            }
        };
        var getHostData = function() {
            try {
                for (var e = 0; e < cmha_db_bocop[0].length; e++) {
                    if (cmha_db_bocop[0][e].Node.Node == hostName) {
                        var obj = new Object();
                        var cmha_db_bocop_abc = [ [ obj ] ];
                        var obj_a = cmha_db_bocop[0][e];
                        cmha_db_bocop_abc[0][0] = cmha_db_bocop[0][e];
                    }
                }
                cmha_db_bocop = cmha_db_bocop_abc;
            } catch (error) {
                console.error("getHostData error");
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
                getHostData();
                getDataLeader();
            } catch (erro) {
                console.error("获得DB数据出错！！！");
            } finally {
                getLeader();
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
                        editable:true,
                        sortable:false
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
                        sortable:true
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
    var run_jqgrid_switch_function = function() {
        var after_data_SHV = [];
        var data_SHK = [];
        var data_SHV = [];
        var really_data_SHV = [];
        var getData_SH = function() {
            var getData_SHK = function() {
                $.ajax({
                    method:"get",
                    url:"http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/log/" + hostName + "/monitor-handlers?keys",
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                        data_SHK = [];
                        data_SHK = result;
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("失败状态文本--monitor切换的keys " + status);
                    }
                });
            };
            var getData_SHV = function() {
                data_SHV = [];
                for (var w = 0; w < data_SHK.length; w++) {
                    $.ajax({
                        method:"get",
                        url:"http://" + IP + "/v1/kv/" + data_SHK[w] + "?raw",
                        async:false,
                        dataType:"text",
                        success:function(result, status, xhr) {

                            data_SHV.push(result);
                        },
                        error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                            console.error("getData_SHV 失败状态文本 " + status);
                        }
                    });
                }
            };
            getData_SHK();
            getData_SHV();
        };
        var changeData_SHV = function() {
            var dict_monitor = [ 
                                        {
                                            id:"001",
                                            type:"I",
                                            value:"Monitor Handler Triggered"
                                        }, {
                                            id:"002",
                                            type:"E",
                                            value:"Create consul-api client failed!"
                                        }, {
                                            id:"003",
                                            type:"I",
                                            value:"Give up switching to async replication!"
                                        }, {
                                            id:"005",
                                            type:"I",
                                            value:"Create consul-api client successfully! "
                                        }, {
                                            id:"006",
                                            type:"E",
                                            value:"Get peer service | + servicename + | health status from CS failed! "
                                        }, {
                                            id:"007",
                                            type:"I",
                                            value:"Get peer service | + servicename + | health status from CS successfully! "
                                        }, {
                                            id:"008",
                                            type:"E",
                                            value:"|+ servicename + | peer service not exist in CS! "
                                        }, {
                                            id:"009",
                                            type:"I",
                                            value:"|+servicename + | peer service exist in CS! "
                                        }, {
                                            id:"010",
                                            type:"I",
                                            value:"Service health status is passing in CS! "
                                        }, {
                                            id:"011",
                                            type:"W",
                                            value:"Warning! Peer database | + other_hostname + | replicaton error. Service health status is warning in CS! "
                                        }, {
                                            id:"012",
                                            type:"I",
                                            value:"Current switch_async value is | + Switch "
                                        }, {
                                            id:"013",
                                            type:"I",
                                            value:"Config file switch_async format error,off or on! "
                                        }, {
                                            id:"014",
                                            type:"I",
                                            value:"Service health status is critical in CS! "
                                        }, {
                                            id:"015",
                                            type:"E",
                                            value:"Set peer database repl_err_counter to 1 in CS failed! "
                                        }, {
                                            id:"016",
                                            type:"I",
                                            value:"Set peer database repl_err_counter to 1 in CS successfully! "
                                        }, {
                                            id:"017",
                                            type:"E",
                                            value:"Not passing,not waring,not critical ,is invalid state! "
                                        }, {
                                            id:"018",
                                            type:"E",
                                            value:"Get and check current service leader from CS failed! "
                                        }, {
                                            id:"019",
                                            type:"I",
                                            value:"Get and check current service leader from CS successfully! "
                                        }, {
                                            id:"020",
                                            type:"I",
                                            value:"| +ip + | is not service leader! "
                                        }, {
                                            id:"021",
                                            type:"I",
                                            value:"| +ip + | is service leader! "
                                        }, {
                                            id:"022",
                                            type:"E",
                                            value:"Get | +servicename + | service health status from CS failed! "
                                        }, {
                                            id:"023",
                                            type:"I",
                                            value:"Get | +servicename + | service health status from CS successfully! "
                                        }, {
                                            id:"024",
                                            type:"I",
                                            value:"| +ip +| service health status is |+status+| "
                                        }, {
                                            id:"025",
                                            type:"E",
                                            value:"Create connection object to local database failed! "
                                        }, {
                                            id:"026",
                                            type:"I",
                                            value:"Create connection object to local database successfully! "
                                        }, {
                                            id:"027",
                                            type:"E",
                                            value:"Connected to local database failed! "
                                        }, {
                                            id:"028",
                                            type:"I",
                                            value:"Connected to local database successfully! "
                                        }, {
                                            id:"029",
                                            type:"E",
                                            value:"Set rpl_semi_sync_master_keepsyncrepl=0 failed! "
                                        }, {
                                            id:"030",
                                            type:"I",
                                            value:"Set rpl_semi_sync_master_keepsyncrepl=0 successfully! "
                                        }, {
                                            id:"031",
                                            type:"E",
                                            value:"Set rpl_semi_sync_master_trysyncrepl=0 failed! "
                                        }, {
                                            id:"032",
                                            type:"I",
                                            value:"Set rpl_semi_sync_master_trysyncrepl=0 successfully! "
                                        }, {
                                            id:"033",
                                            type:"I",
                                            value:"Switching local database to async replication! "
                                        }, {
                                            id:"034",
                                            type:"I",
                                            value:"Monitor Handler Sleep 60s! "
                                        }, {
                                            id:"035",
                                            type:"I",
                                            value:"Connecting to peer database...... "
                                        }, {
                                            id:"036",
                                            type:"E",
                                            value:"Create connection object to peer database failed! "
                                        }, {
                                            id:"037",
                                            type:"I",
                                            value:"Create connection object to peer database successfully! "
                                        }, {
                                            id:"038",
                                            type:"E",
                                            value:"Connected to the peer database failed! "
                                        }, {
                                            id:"039",
                                            type:"I",
                                            value:"Connected to the peer database successfully! "
                                        }, {
                                            id:"040",
                                            type:"I",
                                            value:"Checking peer database I/O thread status. Failed! "
                                        }, {
                                            id:"041",
                                            type:"I",
                                            value:"Checking peer database I/O thread status. Successfully! "
                                        }, {
                                            id:"042",
                                            type:"E",
                                            value:"Resolve slave status failed! "
                                        }, {
                                            id:"043",
                                            type:"I",
                                            value:"The I/O thread status is | + string(Slave_IO_Running.(uint8)) + |! "
                                        }
                         ];
            var b_really_data_SHV = [];
            var after_decodeData_SHV_monitor = function(obj_valueOfSHV, obj_time) {
                b_really_data_SHV = [];
                var length_b = dict_monitor.length;
                for (var a = 0; a < length_b; a++) {
                    var copy_dict_monitor = {};
                    if (dict_monitor[a].id == obj_valueOfSHV) {
                        copy_dict_monitor = $.extend(true, {}, dict_monitor[a]);
                        copy_dict_monitor["time"] = obj_time;
                        b_really_data_SHV.push(copy_dict_monitor);
                        return null;
                    }
                }
            };
            var after_decodeData_SHV_monitor_a = function(obj_valueOfSHV, obi_variableArray, obj_time) {
                b_really_data_SHV = [];
                for (var a = 0; a < dict_monitor.length; a++) {
                    if (dict_monitor[a].id == obj_valueOfSHV) {
                        var decodeValue = dict_monitor[a].value;
                        var a_dict_monitor = {};
                        var array_decodeValue = decodeValue.split("|");
                        var length_b = obi_variableArray.length;
                        for (var b = 1; b < length_b; b++) {
                            var length_a = array_decodeValue.length;
                            for (var c = 0; c < length_a; c++) {
                                if (array_decodeValue[c].indexOf("+") != -1) {
                                    array_decodeValue[c] = [];
                                    array_decodeValue[c] = obi_variableArray[b];
                                    break;
                                }
                            }
                        }
                        a_dict_monitor = $.extend(true, {}, dict_monitor[a]);
                        a_dict_monitor["value"] = array_decodeValue.join("");
                        a_dict_monitor["time"] = obj_time;
                        b_really_data_SHV.push(a_dict_monitor);
                        return null;
                    }
                }
              
            };
            var decodeData_SHV_monitor = function(obj_SHV) {
                if (obj_SHV.indexOf("{{") != -1) {
                    var timeOfSHV = getDate(obj_SHV.substring(0, 10));
                    var valueOfSHV = obj_SHV.substring(10, 13);
                    var endOfSHV = obj_SHV.substring(13);
                    var variableArray = endOfSHV.split("{{");
                    after_decodeData_SHV_monitor_a(valueOfSHV, variableArray, timeOfSHV);
                    really_data_SHV.push(b_really_data_SHV[0]);
                } else {
                    var timeOfSHV = getDate(obj_SHV.substring(0, 10));
                    var valueOfSHV = obj_SHV.substring(10, 13);
                    after_decodeData_SHV_monitor(valueOfSHV, timeOfSHV);
                    really_data_SHV.push(b_really_data_SHV[0]);
                }
            };
            var changedata_SHV = function() {
                really_data_SHV = [];
                var length_data_SHV_value = [];
                for (var r = 0; r < data_SHV.length; r++) {
                    var a_data_SHV = data_SHV[r];
                    var array_a_data_SHV = a_data_SHV.split("|");
                    length_data_SHV_value = length_data_SHV_value.concat(array_a_data_SHV);
                }
                for (var t = 0; t < length_data_SHV_value.length; t++) {
                    var a_array_a_data_SHV = length_data_SHV_value[t];
                    decodeData_SHV_monitor(a_array_a_data_SHV);
                }
            };
            changedata_SHV();
        };
        var warnJqGrid = function() {
            if (IP_old == 0) {
                jQuery("#jqgrid_switch_monitor").jqGrid({
                    data:really_data_SHV,
                    datatype:"local",
                    height:"auto",
                    colNames:[ "Time", "Type", "Log" ],
                    colModel:[ {
                        name:"time",
                        index:"time",
                        align:"left",
                        editable:true,
                        sortable:false,
                        width:30
                    }, {
                        name:"type",
                        index:"type",
                        align:"center",
                        formatter:formatter_switch,
                        sortable:false,
                        width:20
                    }, {
                        name:"value",
                        index:"value",
                        align:"left",
                        sortable:false
                    } ],
                    rowNum:10,
                    rowList:[ 10 ],
                    pager:"#pjqgrid_switch_monitor",
                    toolbarfilter:true,
                    viewrecords:true,
                    sortorder:"asc",
                    gridComplete:function() {
                        var ids = jQuery("#jqgrid_switch_monitor").jqGrid("getDataIDs");
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                        }
                    },
                    editurl:"dummy.html",
                    caption:"db switch async log",
                    multiselect:true,
                    autowidth:true
                });
            } else {
                jQuery("#jqgrid_switch").setGridParam({
                    data:really_data_SHV,
                    datatype:"local"
                }).trigger("reloadGrid");
            }
        };
        getData_SH();
        changeData_SHV();
        warnJqGrid();
    };
    var run_jqgrid_switch_mha_function = function() {
        var after_data_SHV = [];
        var data_SHK = [];
        var data_SHV = [];
        var really_data_SHV_mha = [];
        var getData_SH = function() {
            var getData_SHK = function() {
                $.ajax({
                    method:"get",
                    url:"http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/log/" + hostName + "/mha-handlers?keys",
                    async:false,
                    dataType:"json",
                    success:function(result, status, xhr) {
                        data_SHK = [];
                        data_SHK = result;
                    },
                    error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                        console.error("getData_SHK 失败状态文本 " + status);
                    }
                });
            };
            var getData_SHV = function() {
                data_SHV = [];
                for (var w = 0; w < data_SHK.length; w++) {
                    $.ajax({
                        method:"get",
                        url:"http://" + IP + "/v1/kv/" + data_SHK[w] + "?raw",
                        async:false,
                        dataType:"text",
                        success:function(result, status, xhr) {
                            data_SHV.push(result);
                        },
                        error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                            console.error(" getData_SHV 失败状态文本 " + status);
                        }
                    });
                }
            };
            getData_SHK();
            getData_SHV();
        };
        var changeData_SHV = function() {
            var dict_mhalog = [ {
                id:"001",
                type:"I",
                value:"MHA Handler Triggered"
            }, {
                id:"002",
                type:"E",
                value:"Create consul-api client failed!"
            }, {
                id:"003",
                type:"I",
                value:"Give up leader election"
            }, {
                id:"005",
                type:"I",
                value:"Create consul-api client successfully!"
            }, {
                id:"006",
                type:"E",
                value:"Get and check current service leader from CS failed!"
            }, {
                id:"007",
                type:"I",
                value:"Get and check current service leader from CS successfully!"
            }, {
                id:"008",
                type:"E",
                value:"Get |+ip+| repl_err_counter=|+kvValue+| failed!"
            }, {
                id:"009",
                type:"I",
                value:"Get | + ip + | repl_err_counter=| + kvValue + | successfully!"
            }, {
                id:"010",
                type:"E",
                value:"| + ip + | give up leader election"
            }, {
                id:"011",
                type:"E",
                value:"Not service leader,Please create!"
            }, {
                id:"012",
                type:"I",
                value:"Leader exist!"
            }, {
                id:"013",
                type:"I",
                value:"Leader does not exist!"
            }, {
                id:"014",
                type:"E",
                value:"Get and check |+ip+| service health status failed!"
            }, {
                id:"015",
                type:"I",
                value:"Get and check |+ ip + | service health status successfully!"
            }, {
                id:"016",
                type:"I",
                value:"| + servicename + | service does not exist!"
            }, {
                id:"017",
                type:"I",
                value:"| + servicename + | service exist!"
            }, {
                id:"018",
                type:"E",
                value:"| + ip + | not is | +servicename + |!"
            }, {
                id:"019",
                type:"E",
                value:"Clean service leader value in CS failed!"
            }, {
                id:"020",
                type:"I",
                value:"Clean service leader value in CS successfully!"
            }, {
                id:"021",
                type:"E",
                value:"Status is critical!"
            }, {
                id:"022",
                type:"I",
                value:"Status is not critical"
            }, {
                id:"023",
                type:"E",
                value:"Session create failed!"
            }, {
                id:"024",
                type:"I",
                value:"Session create successfully!"
            }, {
                id:"025",
                type:"E",
                value:"format error,json or hap!"
            }, {
                id:"026",
                type:"E",
                value:"Send service leader request to CS failed!"
            }, {
                id:"027",
                type:"I",
                value:"Send service leader request to CS successfully!"
            }, {
                id:"028",
                type:"E",
                value:"Becoming service leader failed! Connection string is | + ip + | | + port + |"
            }, {
                id:"029",
                type:"I",
                value:"Becoming service leader successfully! Connection string is | + ip + | | + port + |"
            }, {
                id:"030",
                type:"E",
                value:"Set peer database repl_err_counter to 1 in CS failed!"
            }, {
                id:"031",
                type:"I",
                value:"Set peer database repl_err_counter to 1 in CS successfully!"
            }, {
                id:"032",
                type:"E",
                value:"Create connection object to local database failed!"
            }, {
                id:"033",
                type:"I",
                value:"Create connection object to local database successfully!"
            }, {
                id:"034",
                type:"E",
                value:"Connected to local database failed!"
            }, {
                id:"035",
                type:"I",
                value:"Connected to local database successfully!"
            }, {
                id:"036",
                type:"E",
                value:"Set local database Read_only mode failed!"
            }, {
                id:"037",
                type:"I",
                value:"Local database downgrade failed!"
            }, {
                id:"038",
                type:"I",
                value:"Set local database Read_only mode successfully!"
            }, {
                id:"039",
                type:"I",
                value:"Local database downgrade successfully!"
            }, {
                id:"040",
                type:"E",
                value:"Stop local database replication I/O thread failed!"
            }, {
                id:"041",
                type:"I",
                value:"Stop local database replication I/O thread successfully!"
            }, {
                id:"042",
                type:"E",
                value:"Checking local database SQL thread status. Failed!"
            }, {
                id:"043",
                type:"I",
                value:"Checking local database SQL thread status. Succeed!"
            }, {
                id:"044",
                type:"E",
                value:"Resolve slave status failed!"
            }, {
                id:"045",
                type:"E",
                value:"The SQL thread status is | + string(Slave_SQL_Running.(uint8)) + |!"
            }, {
                id:"046",
                type:"I",
                value:"The SQL thread status is Yes!"
            }, {
                id:"047",
                type:"E",
                value:"Checking relay log applying status failed!"
            }, {
                id:"048",
                type:"I",
                value:"Checking relay log applying status successfully!"
            }, {
                id:"049",
                type:"E",
                value:"Resolve master_pos_wait failed!"
            }, {
                id:"050",
                type:"E",
                value:"Relay log applying failed!"
            }, {
                id:"051",
                type:"I",
                value:"Relay log applying completed!"
            }, {
                id:"052",
                type:"E",
                value:"Set rpl_semi_sync_master_keepsyncrepl=0 failed!"
            }, {
                id:"053",
                type:"I",
                value:"Set rpl_semi_sync_master_keepsyncrepl=0 successfully!"
            }, {
                id:"054",
                type:"E",
                value:"Set rpl_semi_sync_master_trysyncrepl=0 failed!"
            }, {
                id:"055",
                type:"I",
                value:"Set rpl_semi_sync_master_trysyncrepl=0 successfully!"
            }, {
                id:"056",
                type:"I",
                value:"Switching local database to async replication!"
            }, {
                id:"057",
                type:"E",
                value:"Set local database Read/Write mode failed!"
            }, {
                id:"058",
                type:"I",
                value:"Set local database Read/Write mode successfully!"
            } ];
            var b_really_data_SHV = [];
            var after_decodeData_SHV_monitor = function(obj_valueOfSHV, obj_time) {
                b_really_data_SHV = [];
                for (var a = 0; a < dict_mhalog.length; a++) {
                    var copy_dict_monitor = {};
                    if (dict_mhalog[a].id == obj_valueOfSHV) {
                        copy_dict_monitor = $.extend(true, {}, dict_mhalog[a]);
                        copy_dict_monitor["time"] = obj_time;
                        b_really_data_SHV.push(copy_dict_monitor);
                        return null;
                    }
                }
            };
            var after_decodeData_SHV_monitor_b = function(obj_valueOfSHV, obi_variableArray, obj_time) {
                b_really_data_SHV = [];
                for (var a = 0; a < dict_mhalog.length; a++) {
                    if (dict_mhalog[a].id == obj_valueOfSHV) {
                        var decodeValue = dict_mhalog[a].value;
                        var a_dict_mhalog = {};
                        var array_decodeValue = decodeValue.split("|");
                        for (var b = 1; b < obi_variableArray.length; b++) {
                            for (var c = 0; c < array_decodeValue.length; c++) {
                                if (array_decodeValue[c].indexOf("+") != -1) {
                                    array_decodeValue[c] = [];
                                    array_decodeValue[c] = obi_variableArray[b];
                                    break;
                                }
                            }
                        }
                        a_dict_monitor = $.extend(true, {}, dict_mhalog[a]);
                        a_dict_monitor["value"] = array_decodeValue.join("");
                        a_dict_monitor["time"] = obj_time;
                        b_really_data_SHV.push(a_dict_monitor);
                        return null;
                    }
                }
            };
            var decodeData_SHV_monitor = function(obj_SHV) {
                if (obj_SHV.indexOf("{{") != -1) {
                    var timeOfSHV = getDate(obj_SHV.substring(0, 10));
                    var valueOfSHV = obj_SHV.substring(10, 13);
                    var endOfSHV = obj_SHV.substring(13);
                    var variableArray = endOfSHV.split("{{");
                    after_decodeData_SHV_monitor_b(valueOfSHV, variableArray, timeOfSHV);
                    really_data_SHV_mha.push(b_really_data_SHV[0]);
                } else {
                    var timeOfSHV = getDate(obj_SHV.substring(0, 10));
                    var valueOfSHV = obj_SHV.substring(10, 13);
                    after_decodeData_SHV_monitor(valueOfSHV, timeOfSHV);
                    really_data_SHV_mha.push(b_really_data_SHV[0]);
                }
            };
            var changedata_SHV = function() {
                really_data_SHV = [];
                var length_data_SHV_value = [];
                for (var r = 0; r < data_SHV.length; r++) {
                    var a_data_SHV = data_SHV[r];
                    var array_a_data_SHV = a_data_SHV.split("|");
                    length_data_SHV_value = length_data_SHV_value.concat(array_a_data_SHV);
                }
                for (var t = 0; t < length_data_SHV_value.length; t++) {
                    var a_array_a_data_SHV = length_data_SHV_value[t];
                    decodeData_SHV_monitor(a_array_a_data_SHV);
                }
            };
            changedata_SHV();
        };
        var warnJqGrid = function() {
            if (IP_old == 0) {
                jQuery("#jqgrid_switch_mha").jqGrid({
                    data:really_data_SHV_mha,
                    datatype:"local",
                    height:"auto",
                    colNames:[ "Time", "Type", "Log" ],
                    colModel:[ {
                        name:"time",
                        index:"time",
                        align:"left",
                        editable:true,
                        sortable:false,
                        width:30
                    }, {
                        name:"type",
                        index:"type",
                        align:"center",
                        formatter:formatter_switch,
                        sortable:false,
                        width:20
                    }, {
                        name:"value",
                        index:"value",
                        align:"left",
                        sortable:false
                    } ],
                    rowNum:10,
                    rowList:[ 10 ],
                    pager:"#pjqgrid_switch_mha",
                    toolbarfilter:true,
                    viewrecords:true,
                    sortorder:"asc",
                    gridComplete:function() {
                        var ids = jQuery("#jqgrid_switch_mha").jqGrid("getDataIDs");
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                        }
                    },
                    editurl:"dummy.html",
                    caption:"db failover log",
                    multiselect:true,
                    autowidth:true
                });
            } else {
                jQuery("#jqgrid_switch_mha").setGridParam({
                    data:really_data_SHV_mha,
                    datatype:"local"
                }).trigger("reloadGrid");
            }
        };
        getData_SH();
        changeData_SHV();
        warnJqGrid();
    };
    //系统的
    var run_jqgrid_Statistics_function = function() {
        var data_statistics = [];
        var get_statistics_data = function() {
            data_statistics = [];
            $.ajax({
                method:"get",
                url:"http://" + IP + "/v1/kv/cmha/service/" + serviceName + "/chap/status/" + hostName + "?raw",
                async:false,
                dataType:"json",
                success:function(result, status, xhr) {
                    data_statistics = result;
                    data_statistics.pop();
                },
                error:function(XMLHttpRequest, status, jqXHR, textStatus, e) {
                    console.error("失败状态文本  get_statistics_data " + status);
                }
            });
        };
        var statisticsJqGrid = function() {
            if (IP_old == 0) {
                jQuery("#jqgrid_statistics_report").jqGrid({
                    data:data_statistics,
                    datatype:"local",
                    height:"auto",
                    colNames:[ "Name", "Q_cur", "Q_max", "Se_cur", "Se_max", "Se_limit", "Se_Total", "net_in", "net_out", "De_req", "De_resp", "err_req", "err_con", "err_resp", "Warn_retr", "Warn_redis", "status" ],
                    colModel:[ {
                        name:"name",
                          align:"center",
                        index:"name"
                    }, {
                        name:"Queue_cur",
                       align:"center",
                        index:"Queue_cur"
                    }, {
                        name:"Queue_max",
                           align:"center",
                        index:"Queue_max"
                    }, {
                        name:"Session_cur",
                           align:"center",
                        index:"Session_cur"
                    }, {
                        name:"Session_max",
                           align:"center",
                        index:"Session_max"
                    }, {
                        name:"Session_limit",
                           align:"center",
                        index:"Session_limit"
                    }, {
                        name:"Session_Total",
                           align:"center",
                        index:"Session_Total"
                    }, {
                        name:"net_input_Bytes",
                           align:"center",
                        index:"net_input_Bytes"
                    }, {
                        name:"net_output_Bytes",
                           align:"center",
                        index:"net_output_Bytes"
                    }, {
                        name:"Denied_req",
                           align:"center",
                        index:"Denied_req"
                    }, {
                        name:"Denied_resp",
                           align:"center",
                        index:"Denied_resp"
                    }, {
                        name:"error_req",
                           align:"center",
                        index:"error_req"
                    }, {
                        name:"error_con",
                           align:"center",
                        index:"error_con"
                    }, {
                        name:"error_resp",
                           align:"center",
                        index:"error_resp"
                    }, {
                        name:"Warnings_retr",
                           align:"center",
                        index:"Warnings_retr"
                    }, {
                        name:"Warnings_redis",
                           align:"center",
                        index:"Warnings_redis"
                    }, {
                        name:"status",
                           align:"center",
                        index:"status"
                    } ],
                    rowNum:10,
                    rowList:[ 10 ],
                    pager:"#pjqgrid_statistics_report",
                    toolbarfilter:true,
                    viewrecords:true,
                    sortorder:"asc",
                    gridComplete:function() {
                        var ids = jQuery("#jqgrid_statistics_report").jqGrid("getDataIDs");
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                        }
                    },
                    editurl:"dummy.html",
                    caption:"statistics Report",
                    multiselect:true,
                    autowidth:true
                });
            } else {
                jQuery("#jqgrid_statistics_report").setGridParam({
                    data:data_statistics,
                    datatype:"local"
                }).trigger("reloadGrid");
            }
        };
        get_statistics_data();
        statisticsJqGrid();
    };
    run_jqgrid_db_function();
    var getType = function() {
        if (HostType == "db") {
            run_jqgrid_switch_function();
            run_jqgrid_switch_mha_function();
        } else {
            run_jqgrid_Statistics_function();
            return null;
        }
    };
    getType();
};

var setTimeFunction = function() {
   
    pagefunction();
    IP_old = 1;
 var date = new Date();
    cstimeSetTimeout = setTimeout(setTimeFunction, FreshenTime);
  console.log("host定时器"+date+"=="+cstimeSetTimeout);
    
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