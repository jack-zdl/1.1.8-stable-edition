var m4 = function(obj_array) {	//断点设置  js 的比较大小，添加null值进去
            var len = obj_array.length;
            var dataLength = obj_array[0].data;  //查看有几条线
            for (var i = 0; i < len-1; i++ ) {

                var quotient = Math.floor((obj_array[i+1].data[0] - obj_array[i].data[0]) / 60000);
                var dataStart = obj_array[i].data[0];
                if (quotient > 1) {
                    for (var j = quotient - 1; j > 0; j--) {

                        var Intdatatimestamp = parseInt(dataStart, 10);
                        var stringData = "" + (Intdatatimestamp + j * 60000);
                        //添加入几条null
                        var data_m_array  = [];
                        data_m_array.push(stringData);
                        for (var k = dataLength.length - 2; k >= 0; k--) {
                        	data_m_array.push(null);
                        }
                        var incObject = {
                            "data": data_m_array
                       		 };
                        obj_array.splice(i+1, 0, incObject);
                    }
                }
            }
            return obj_array;
		}; 
var m4 = function(){
	 var len = obj_array.length;
	   var dataLength = obj_array[0].data; //查看有几条线
	      for (var i = 0; i < len-1; i++ ) {
			var quotient = Math.floor((obj_array[i+1].data[0] - obj_array[i].data[0]) / 60000);
            var dataStart = obj_array[i].data[0];
			if (quotient > 1) {
				for (var j = quotient - 1; j > 0; j--) {
					var Intdatatimestamp = parseInt(dataStart, 10);
                    var stringData = "" + (Intdatatimestamp + j * 60000);  
					var data_m_array  = [];
                        data_m_array.push(stringData);
					for (var k = dataLength.length - 2; k >= 0; k--) {
                        	data_m_array.push(null);
                    }
					var incObject = {
                            "data": data_m_array
                       		 };
                    obj_array.splice(i+1, 0, incObject);
				}  
			}
		}
	return obj_array;
}
	