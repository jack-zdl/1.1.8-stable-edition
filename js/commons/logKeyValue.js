/**
 * 这是是专门的日志密码表
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-30 19:13:11
 * @version $1.1.7$
 */
require.config({

});
define([],function(){
	function Commons(){
		this.passwordSwitch = [ 
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
		this.passwordMHA = [ 
						{
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
			            } 
			        		];
	}
	return {
		Commons : Commons
	};
});

