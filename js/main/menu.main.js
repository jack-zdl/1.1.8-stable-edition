/**
 * 制作首页菜单的main函数
 * @authors zhangdelei(zhangdelei@bsgchina.com)
 * @date    2016-12-01 15:20:50
 * @version $1.1.7$
 */
require.config({
	paths:{
		"jquery":"lib/jquery",
		"menuMath":"./commons/menu.math"
	}
});
define(['jquery','menuMath'],function($,menuMath){
	var Commons =(function($,menuMath){
		function commonsFunction(){
			var getMenu = new menuMath.Commons();
			//获得所有服务名 CS BOCOP EZEC
			var urlConsul =["http://" + configObject.IP + "/v1/catalog/services"];
			var arrayServiceName = getMenu.getData(urlConsul);
			//获得CS下的主机名称
			var urlCS = ["http://" + configObject.IP + "/v1/catalog/service/consul"];
			var arrayCSName = getMenu.getData(urlCS);
			var consulName = [];
			//处理cs下主机名称的原始数据
			for (var i = arrayCSName[0].length - 1; i >= 0; i--) {
				consulName.push(arrayCSName[0][i].Node);
			}
			var getServiceName = getMenu.changeServiceName(arrayServiceName[0]);
			var urlArrayServiceName = {};
			for (var j = getServiceName.length - 1; j >= 0; j--) {
				urlArrayServiceName[getServiceName[j]]="http://" + configObject.IP + "/v1/health/service/" + getServiceName[j];
			}
			var getAllDataService = getMenu.getObjectData(urlArrayServiceName);
			var objectService = {};
			for(var k in getAllDataService){
				var afterArrayServiceName = [];
				for (var a = getAllDataService[k].length - 1; a >= 0; a--) {
					afterArrayServiceName.push(getAllDataService[k][a].Node.Node);
				}
				objectService[k] = afterArrayServiceName;
			}
			return {
				objectService : objectService,
				consulName : consulName
			};
		}
		function runIndexHomeMenu(){
			var objectService = commonsFunction().objectService;
			var getMenu = new menuMath.Commons();
			getMenu.setCSElementLi("parentUl",objectService);
		}
		runIndexHomeMenu();
		function runIndexTopMenu(){
			var date = commonsFunction();
			var objectService = date.objectService;
			var objectCS = date.consulName
			var getMenu = new menuMath.Commons();
			getMenu.setTopElementLi("realtime-menu","RS",objectCS,objectService);
			getMenu.setTopElementLi("hostgraph-menu","RGS",objectCS,objectService); 
			// getMenu.setTopElementLi("host_second_memu","RS",objectCS,objectService);
			// getMenu.setTopElementLi("host_graph_memu","RGS",objectCS,objectService); 
		}
		runIndexTopMenu();
	})($,menuMath);
	
	return {
		Commons : Commons
	};
});

