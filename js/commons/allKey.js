/**
 * allkey--graph的所有配置文件
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-12-02 17:01:53
 * @version $1.1.7$
 */
require.config({

});
define([],function(){
	function Commons(){
		this.systemAllKey= {
			"cpu_util":{"status":"status_cpu_util",
						"DygraphLabels":["Date","user","system","idle","iowait","softirq","irq"],
						"OutKey":"Graph_cpu_util",
						
						"id":"cpu_util",
						"title":"CPU utilization (system.cpu)",
						"ylabel":"percentage"
						} ,
			"cpu_load":{"status":"status_cpu_load",
						"OutKey":"Graph_cpu_load",
						"DygraphLabels":["Date","load1","load5","load15"],
						
						 "id":"cpu_load",
						 "title":"System Load Average",
						 "ylabel":"load"
						 } ,
			"swap_util":{"status":"status_swap_used",
						"OutKey":"Graph_swap_used",
						  "DygraphLabels":["Date","in","out"],
						  "id":"swap_used",
						  "title":"Swap I/O (system.swapio)",
						  "ylabel":"swapio"
						  },
			"net_Bytes":{"status":"status_net_Bytes",
						 "DygraphLabels":["Date","received","sent"],
						 "id":"net_Bytes",
						 "title":"Bandwidth ",
						 "ylabel":"load"
						 } ,
			"net_packets":{"status":"status_net_packets",
							 "DygraphLabels":["Date","received","sent"],
							 "id":"net_packets",
							 "title":"Net Packets ",
							 "ylabel":"load"
							 } ,
			"disk_rkB_s":{"status":"status_disk_rkB_s",
							 "DygraphLabels":["Date","reads","writes"],
							 "id":"disk_rkB_s",
							 "title":"Disk Average Throughput for",
							 "ylabel":"kilobytes/s"
							 } ,
			"disk_await":{"status":"status_disk_await",
							 "DygraphLabels":["Date","await"],
							 "id":"disk_await",
							 "title":"Average await  for",
							 "ylabel":"load"
							 } ,
			"disk_r_s":{"status":"status_disk_r_s",
							  "DygraphLabels":["Date","reads","writes"],
							  "id":"disk_r_s",
							  "title":"Disk I/O Operations for ",
							  "ylabel":"operations/s"
							  }, 
			"disk_queue":{"status":"status_disk_queue",
							 "DygraphLabels":["Date","queue"],
							 "id":"disk_queue",
							 "title":"Average await  for ",
							 "ylabel":"load"
							 } ,
			"disk_svctm":{"status":"status_disk_svctm",
							 "DygraphLabels":["Date","svctm"],
							 "id":"disk_svctm",
							 "title":"Average Service Time for ",
							 "ylabel":"load"
							 } ,
			"disk_util":{"status":"status_disk_util",
							 "DygraphLabels":["Date","utilization"],
							 "id":"disk_util",
							 "title":"Disk Utilization Time for",
							 "ylabel":"load"
							 } 
		};
		this.dbAllKey = {
			"cpu_util":{"status":"status_cpu_util",
									"OutKey":"Graph_cpu_util",
									"DygraphLabels":["Date","user","system","idle","iowait","softirq","irq"],
									"id":"cpu_util",
									"title":"CPU utilization (system.cpu)",
									"ylabel":"percentage"
									} ,
			"cpu_load":{"status":"status_cpu_load",
						"OutKey":"Graph_cpu_load",
						"DygraphLabels":["Date","load1","load5","load15"],
						"id":"cpu_load",
						"title":"System Load Average",
						"ylabel":"load"
						} ,
			"swap_util":{"status":"status_swap_util",
						"OutKey":"Graph_swap_used",
						"DygraphLabels":["Date","in","out"],
						"id":"swap_util",
						"title":"swap_util",
						"ylabel":"swapio"
						},
			"db_commit_counter":{"status":"status_db_commit_counter",
						"OutKey":"Graph_db_commit_counter",
						"DygraphLabels":["Date","Com_insert","Com_update","Com_select","Com_delete","Com_replace","Com_update_multi","Com_insert_select","Com_delete_multi","Com_replace_select"],
						"id":"db_commit_counter",
						"title":"db_commit_counter",
						"ylabel":"swapio"
						},
			"db_connections":{"status":"status_db_connections",
						"OutKey":"Graph_db_connections",
						"DygraphLabels":["Date " ," Threads_running" ,"Threads_connected" ,"Threads_created" ,"Threads_cached" ,"max_connections" ,"Max_used_connections"],
						"id":"db_connections",
						"title":"db_connections",
						"ylabel":"swapio"
						},
			"db_net_Bytes":{"status":"status_db_net_Bytes",
						"OutKey":"Graph_db_net_Bytes",
						"DygraphLabels":["Date","Bytes_received","Bytes_sent"],
						"id":"db_net_Bytes",
						"title":"db_net_Bytes",
						"ylabel":"swapio"
						},
			"db_connection_Aborted":{"status":"status_db_connection_Aborted",
						"OutKey":"Graph_db_connection_Aborted",
						"DygraphLabels":["Date","Aborted_clients","Aborted_connects","Max_used_connections"],
						"id":"db_connection_Aborted",
						"title":"db_connection_Aborted",
						"ylabel":"swapio"
						},
		  	"db_tmp_tables":{"status":"status_db_tmp_tables",
		  				"OutKey":"Graph_db_tmp_tables",
						"DygraphLabels":["Date","Created_tmp_tables","Created_tmp_disk_tables"],
						"id":"db_tmp_tables",
						"title":"db_tmp_tables",
						"ylabel":"swapio"
						},
		  	"Open_files":{"status":"status_Open_files",
		  				"OutKey":"Graph_Open_files",
						"DygraphLabels":["Date","Open_files","Opened_files"],
						"id":"Open_files",
						"title":"Open_files",
						"ylabel":"Open_files"
						},
		  	"Open_table_definitions":{"status":"status_Open_table_definitions",
						"OutKey":"Graph_Open_table_definitions",
						"DygraphLabels":["Date","Open_table_definitions","Opened_table_definitions"],
						"id":"Open_table_definitions",
						"title":"Open_table_definitions",
						"ylabel":"swapio"
						},
		  	"Open_tables":{"status":"status_Open_tables",
		  				"OutKey":"Graph_Open_tables",
						"DygraphLabels":["Date","Open_tables","Opened_tables"],
						"id":"Open_tables",
						"title":"Open_tables",
						"ylabel":"swapio"
						},	
		    "db_buffer_pool_hit":{"status":"status_db_buffer_pool_hit",
		    			"OutKey":"Graph_db_buffer_pool_hit",
						"DygraphLabels":["Date","buffer_pool_hit"],
						"id":"db_buffer_pool_hit",
						"title":"db_buffer_pool_hit",
						"ylabel":"swapio"
						},
		  	"db_row_change":{"status":"status_db_row_change",
		  				"OutKey":"Graph_db_row_change",
						"DygraphLabels":["Date","Innodb_rows_inserted","Innodb_rows_updated","Innodb_rows_deleted","Innodb_rows_read"],
						"id":"db_row_change",
						"title":"db_row_change",
						"ylabel":"swapio"
						},
		  	"db_Binlog_cache":{"status":"status_db_Binlog_cache",
		  				"OutKey":"Graph_db_Binlog_cache",
						"DygraphLabels":["Date","Binlog_cache_disk_use","Binlog_cache_use"],
						"id":"db_Binlog_cache",
						"title":"db_Binlog_cache",
						"ylabel":"swapio"
						},
		  	"db_redo_log_fsyncs":{"status":"status_db_redo_log_fsyncs",
		  				"OutKey":"Graph_db_redo_log_fsyncs",
						"DygraphLabels":["Date","Innodb_os_log_fsyncs","Innodb_log_writes","Innodb_os_log_pending_fsyncs","Innodb_os_log_pending_writes"],
						"id":"db_redo_log_fsyncs",
						"title":"db_redo_log_fsyncs",
						"ylabel":"swapio"
						},
		  	"db_data_fsyncs":{"status":"status_db_data_fsyncs",
		  				"OutKey":"Graph_db_data_fsyncs",
						"DygraphLabels":["Date","Innodb_data_fsyncs","Innodb_data_pending_fsyncs","Innodb_data_writes","Innodb_data_pending_writes","Innodb_data_reads","Innodb_data_pending_reads"],
						"id":"db_data_fsyncs",
						"title":"db_data_fsyncs",
						"ylabel":"swapio"
						},
		  	"Table_locks_waited":{"status":"status_Table_locks_waited",
		  				"OutKey":"Graph_Table_locks_waited",
						"DygraphLabels":["Date","Table_locks_waited","Table_locks_immediate"],
						"id":"Table_locks_waited",
						"title":"Table_locks_waited",
						"ylabel":"swapio"
						},
		  	"db_innodb_transaction":{"status":"status_db_innodb_transaction",
						"OutKey":"Graph_db_innodb_transaction",
						"DygraphLabels":["Date","current_transactions","lock_wait_transactions","active_transactions"],
						"id":"db_innodb_transaction",
						"title":"db_innodb_transaction",
						"ylabel":"swapio"
						  },
			"net_Bytes":{"status":"status_net_Bytes",
									 "DygraphLabels":["Date","received","sent"],
									 "id":"net_Bytes",
									 "title":"Bandwidth ",
									 "ylabel":"load"
									 } ,
			"net_packets":{"status":"status_net_packets",
							 "DygraphLabels":["Date","received","sent"],
							 "id":"net_packets",
							 "title":"Net Packets ",
							 "ylabel":"load"
							 } ,
			"disk_rkB_s":{"status":"status_disk_rkB_s",
							 "DygraphLabels":["Date","reads","writes"],
							 "id":"disk_rkB_s",
							 "title":"Disk Average Throughput for",
							 "ylabel":"kilobytes/s"
							 } ,
			"disk_await":{"status":"status_disk_await",
							 "DygraphLabels":["Date","await"],
							 "id":"disk_await",
							 "title":"Average await  for",
							 "ylabel":"load"
							 } ,
			"disk_r_s":{"status":"status_disk_r_s",
							  "DygraphLabels":["Date","reads","writes"],
							  "id":"disk_r_s",
							  "title":"Disk I/O Operations for ",
							  "ylabel":"operations/s"
							  }, 
			"disk_queue":{"status":"status_disk_queue",
							 "DygraphLabels":["Date","queue"],
							 "id":"disk_queue",
							 "title":"Average await  for ",
							 "ylabel":"load"
							 } ,
			"disk_svctm":{"status":"status_disk_svctm",
							 "DygraphLabels":["Date","svctm"],
							 "id":"disk_svctm",
							 "title":"Average Service Time for ",
							 "ylabel":"load"
							 } ,
			"disk_util":{"status":"status_disk_util",
							 "DygraphLabels":["Date","utilization"],
							 "id":"disk_util",
							 "title":"Disk Utilization Time for",
							 "ylabel":"load"
							 } 
		};
	}
	return {
		Commons : Commons
	};
});

