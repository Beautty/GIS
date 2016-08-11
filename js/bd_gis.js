(function(window){
	// 百度地图API功能
		var map = new BMap.Map("container");
		var point = new BMap.Point(114.316,30.581);
		map.centerAndZoom(point,12);
	
		//地址解析器
		var geoCoder=new BMap.Geocoder();
		
		
		
		var drawMode=function(type){
			return new drawMode.fn.init(type);
		}
		drawMode.fn=drawMode.prototype={
			type:"",
			init:function(type){
				this.type=type;
				return this;
			},
			addEventLisner:function(){
				map.addEventListener("click",function(e){
				this.draw(e,type);
				});
				map.addEventListener("rightclick",function(){
					this.endDraw();
				});
			}
		}
		
		
	
		var draw=function(type) {
			map.addEventListener("click",function(e){
				drawMode.draw(e,type);
			});
			map.addEventListener("rightclick",function(){
				drawMode.endDraw();
			});
		}
		
		
		var drawMode={
			type:"",
			polylinePoints:[],
			polygonPoints:[],
			lineStyleOpt:{strokeColor:"blue", strokeWeight:2},
			draw:function(e,type){
				switch (type) {
					case "Point":
						this.drawPoint(e);
						break;
					case "Polyline":
						this.drawPolyline(e);
						break;
					case "Polygon":
						//this.drawPolygon(e);
						break;
					default: 
						break;
				}
				this.type=type;
				
				/*//注册右键点击事件结束绘制，是否可以进行优化？每一次绘制都会注册事件
				map.addEventListener("rightclick",this.endDraw);*/
			},
			drawPoint:function(e){
				var point=e.point;
				var marker=new BMap.Marker(point);
				map.addOverlay(marker);
			},
			drawPolyline:function(e){
				var len=this.polylinePoints.length;
				if(len>0){
					var line=new BMap.Polyline([this.polylinePoints[len-1],e.point],this.lineStyleOpt);
					map.addOverlay(line);
					this.polylinePoints.push(e.point);
				}else{
					this.polylinePoints.push(e.point);
				}
			},
			drawPolygon:function(e){
				var len=this.polygonPoints.length;
				if(len>0){
					if(this.polygonPoints[len-1].lat==e.point.lat&&this.polygonPoints[len-1].lng==e.point.lng){
						
					}else{
						var line=new BMap.Polyline([this.polygonPoints[len-1],e.point],this.lineStyleOpt);
						map.addOverlay(line);
						this.polygonPoints.push(e.point);
					}
				}else{
					this.polygonPoints.push(e.point);
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
		
		
		
		window.draw=draw;
		window.gcoder=gcoder;
		
		
	/*var showCoords=function(str){
			var point=new BMap.Point(0,0);
			map.addEventListener("mousemove",function(e){
				point=e.point;
			})
			return point.latitude+","+point.longitude;
		}
		
		var str="";
		console.log(showCoords(str));
		*/
	
})(window)

