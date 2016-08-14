(function(window){
	// 百度地图API功能
		var map = new BMap.Map("container");
		var point = new BMap.Point(114.316,30.581);
		map.centerAndZoom(point,12);
	
		//地址解析器
		var geoCoder=new BMap.Geocoder();
		
		
		var drawMode={
			
			count:0,
			
			type:"",
			polylinePoints:[],
			polygonPoints:[],
			polygon:new Object(),
			point:null,
			StyleOpt:{
		        strokeColor:"red",    //边线颜色。
		        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
		        strokeWeight: 3,       //边线的宽度，以像素为单位。
		        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
		        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
		        strokeStyle: 'solid' //边线的样式，solid或dashed。
		    },
			init:function(type){
				var self=this;
				this.type=type;
				map.addEventListener("click",self.clickCallbacks);
				map.addEventListener("rightclick",self.rclickCallbacks);
				map.addEventListener("mousemove",self.moveCallbacks);
			},
			clickCallbacks:function(e){
				drawMode.draw(e);
			},
			rclickCallbacks:function(){
				drawMode.endDraw();
			},
			moveCallbacks:function(e){
				drawMode.move(e);
			},
			draw:function(e){
				switch (this.type) {
					case "Point":
						this.drawPoint(e);
						break;
					case "Polyline":
						this.drawPolyline(e);
						break;
					case "Polygon":
						this.drawPolygon(e);
						break;
					case "Circle":
						this.drawPolygon(e);
						break;
					default: 
						break;
				}
			},
			move:function(e){
				switch (this.type){
					case "Polygon":
						this.formPolygon(e);
						break;
					case "Circle":
						this.formCircle(e);
						break;
					default:
						break;
				}
			},
			drawPoint:function(e){
				var point=e.point;
				var marker=new BMap.Marker(point);
				map.addOverlay(marker);
			},
			drawPolyline:function(e){
				var len=this.polylinePoints.length;
				if(len>0){
					var line=new BMap.Polyline([this.polylinePoints[len-1],e.point],this.StyleOpt);
					map.addOverlay(line);
					this.polylinePoints.push(e.point);
				}else{
					this.polylinePoints.push(e.point);
				}
			},
			drawPolygon:function(e){
				this.count++;
				console.log(this.count);
				console.log(this.polygonPoints);
				this.polygonPoints.push(e.point);
				if(this.polygonPoints.length<=2){
					this.polygon=new BMap.Polygon(this.polygonPoints,this.StyleOpt);
					map.addOverlay(this.polygon);
					console.log("执行了吗？");
				}else{
					this.polygon.setPath(this.polygonPoints);
					this.point=null;
				}
			},
			endDraw:function(){
				switch (this.type) {
					case "Polyline":
						this.polylinePoints.splice(0,this.polylinePoints.length);
						break;
					case "Polygon":
						this.polygonPoints.splice(0,this.polygonPoints.length);
						break;
					default: 
						break;
				}
			},
			formPolygon:function(e){
				
				if(this.polygonPoints.length>=2){
					
					if(this.point==null){
						console.log("move:"+e.point.lat+","+e.point.lng);
						this.point=e.point;
						this.polygonPoints.push(this.point);
						console.log(this.point);
					}else{
						console.log("else move:"+e.point.lat+","+e.point.lng);
						this.polygonPoints[this.polygonPoints.length-1]=e.point;
						console.log(this.polygonPoints);
					}
					this.polygon.setPath(this.polygonPoints);
					/*this.polygon=new BMap.Polygon(this.polygonPoints,this.StyleOpt);
					map.addOverlay(this.polygon);*/
				}
			},
			formCircle:function(e){
			}
			
		}
		
		
		
		var gcoder={
			getPoint:function(address){
				var pt=new Object();
				geoCoder.getPoint(address,function(point){
					var marker=new BMap.Marker(point);
					map.addOverlay(marker);
					pt=point;
				})
				return pt;
			},
			getLocation:function(lng,lat){
				var point=new BMap.Point(lng,lat);
				geoCoder.getLocation(pt, function(rs){
					var addComp = rs.addressComponents;
					/*alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);*/
					return addComp;
				}); 
			}
		}
		
		
		
		
		window.drawMode=drawMode;
		window.gcoder=gcoder;
		
})(window)

