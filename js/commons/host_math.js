/**
 * 这是host_main.js的抽象函数
 * @authors zhangdelei (zhangdelei@bsgchina.com)
 * @date    2016-11-30 18:28:26
 * @version $1.1.7$
 */
require.config({
	paths:{
		"jquery":"lib/jquery",
		"logKeyValue":"commons/logKeyValue"
	}
});
define(['jquery','logKeyValue'],function($,logKeyValue){
	function Commons(){
		var tableKeyValue = new logKeyValue.Commons();
		var passwordSwitch = tableKeyValue.passwordSwitch;
		var passwordMHA = tableKeyValue.passwordMHA;
		this.changeStatus = function(obj_status){
			 switch (obj_status) {
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
		};
		this.formatter_switch = function(cellvalue, options, rowObject) {
	        if (rowObject.type == "I") {
	            return '<span style="color:green;" >' + "info" + "</span>";
	        } else if (rowObject.type == "E") {
	            return '<span style="color:red;" >' + "error" + "</span>";
	        } else if (rowObject.type == "W") {
	            return '<span style="color:red;" >' + "warning" + "</span>";
	        }
    	};
    	this.getHostData = function(obj_data){
			for (var j = obj_data.length - 1; j >= 0; j--) {
				if(obj_data[j].Node.Node ==globalObject.hostName ){
					var hostObject = {};
					var afterData = [ [ hostObject ] ];
                    var obj_a = obj_data[0][j];
                    afterData[0][0] = obj_data[j];
				}
			}
			return afterData;
		};
		//私有方法
		function choiceDic(obj_name) {
			switch(obj_name){
				case 'Switch':
					return passwordSwitch;
				case 'SwitchMHA':
					return passwordMHA;
				default:
					return null;
			}
		}

		function changeDecodeData(obj_valueOfSHV, obj_time,obj_name){
			 	var reallyData = [];
			 	var password = choiceDic(obj_name);
                for (var a = 0,length = password.length; a < length; a++) {
                    var dateObject = {};
                    if (password[a].id == obj_valueOfSHV) {
                        dateObject = $.extend(true, {}, password[a]);
                        dateObject["time"] = obj_time;
                        reallyData.push(dateObject);
                       break;
                    }
                }
                 return reallyData;
		} 
		function changeDecodeDataParameter (obj_valueOfSHV, obi_variableArray, obj_time,obj_name) {
                var reallyData = [];
                var password = choiceDic(obj_name);
                for (var a = 0,len =password.length; a < len; a++) {
                    if (password[a].id == obj_valueOfSHV) {
                        var decodeValue = password[a].value;
                        var dateObject = {};
                        var arrayDecodeValue = decodeValue.split("|");
                        for (var b = 1,leng =obi_variableArray.length ; b < leng; b++) {
                            for (var c = 0,le = arrayDecodeValue.length ; c < le; c++) {
                                if (arrayDecodeValue[c].indexOf("+") != -1) {
                                    arrayDecodeValue[c] = [];
                                    arrayDecodeValue[c] = obi_variableArray[b];
                                    break;
                                }
                            }
                        }
                        dateObject = $.extend(true, {}, password[a]);
                        dateObject["value"] = arrayDecodeValue.join("");
                        dateObject["time"] = obj_time;
                        reallyData.push(dateObject);
                        return reallyData;
                    }
                }
        }
        function decodeData(obj_key,obj_name) {
        	var arrayData = [];
                if (obj_key.indexOf("{{") != -1) {
                    var timeOfData = globalObject.getYearData(obj_key.substring(0, 10));
                    var valueOfData = obj_key.substring(10, 13);
                    var endOfData = obj_key.substring(13);
                    var variableArray = endOfData.split("{{");
                    var afterData = changeDecodeDataParameter(valueOfData, variableArray, timeOfData,obj_name);
                    arrayData.push(afterData[0]);
                } else {
                    var timeOfData = globalObject.getYearData(obj_key.substring(0, 10));
                    var valueOfData = obj_key.substring(10, 13);
                    var afterData = changeDecodeData(valueOfData, timeOfData,obj_name);
                    arrayData.push(afterData[0]);
                }
                return arrayData;
        }
        this.decode= function(obj_data_key,obj_name) {
                var decodeArrayData = [];
                var lengthData = [];
                for (var i = 0,len = obj_data_key.length; i < len; i++) {
                    var eveayDataKey = obj_data_key[i];
                    var arrayData = eveayDataKey.split("|");
                    lengthData = lengthData.concat(arrayData);
                }
                for (var j = 0,leng =lengthData.length; j < leng; j++) {
                    var everyData = lengthData[j];
                    decodeArrayData.push(decodeData(everyData,obj_name)[0]);
                }
                return decodeArrayData;
        };



	}
	return {
		Commons : Commons
	};
});

