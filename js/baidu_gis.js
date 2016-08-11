// 百度地图API功能
	var map = new BMap.Map("container"); // 创建Map实例
	var point = new BMap.Point(114.316, 30.581);
	
	map.centerAndZoom(point, 13); // 初始化地图,设置中心点坐标和地图级别
	map.setCurrentCity("武汉"); // 设置地图显示的城市 此项是必须设置的
	
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
	
	map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));//左上角添加比例尺
	map.addControl(new BMap.NavigationControl());//左上角添加默认缩放平移控件




function addMarkers(markerJson) {
	var myIcon1 = new BMap.Icon(markerJson["imgUrl"], new BMap.Size(35, 35));
	var data = markerJson["groups"];

	for(var i=0;i<data.length;i++){
		var item=data[i];
		var point = new BMap.Point(item["geo"][0], item["geo"][1]);
		var marker = new BMap.Marker(point, {
			icon: myIcon1
		});
		marker.id = item["id"];
		marker.catagory = markerJson["catagory"];
		var infoWindow = new BMap.InfoWindow(item["content"]);
		marker.addEventListener("click", function() {
			map.openInfoWindow(infoWindow, this.getPosition());
		});
		marker.hide();
		map.addOverlay(marker);
	}
	

}	
function showMarker(catagory) {
	var allOverlay = map.getOverlays();
	for(var i = 0; i < allOverlay.length - 1; i++) {
		if(allOverlay[i].catagory == catagory) {
			allOverlay[i].show();
		}
	}
}
	
	
function hideMarker(catagory){
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length -1; i++){
		if(allOverlay[i].catagory == catagory){
				allOverlay[i].hide();
		}	
	}	
}

function Drawing() {
 	
 	//存储鼠标绘制的警报草图，最终保存到数据库中，缓存数据
 	var draftOverlays = [];
 	
 	//从数据库中绘制的警报图，主要进行显示和更新操作，缓存数据
 	var writeOverlays = [];
	//四色警报
 	var colorArr = ['green', 'yellow', 'orange', 'red'];
	
	var saveJson=[];//保存鼠标绘制的图形，返回到后台
	var updateJson=[];  //更新绘制图形数据，返回到后台
	
	var wContent="<h4 style='margin:0 0 5px 0;padding:0.2em 0'>改变颜色</h4>"+
				"<div style='text-align:center;height:280px;width: 550px;'><input class='colorChanged' type='text' /> </div>";
	var infoWindow = new BMap.InfoWindow(wContent);  // 创建信息窗口对象

	this.drawAlert=function(data){

		for(var i=0;i<data.length;i++){
			var item=data[i];
			switch (item.type){
				case "circle": 
					drawCircleAlert(item["id"],item["center"],item["radius"],item["level"]);
					break;
				case "polygon":
					drawPolygonAlert(item["id"],item["path"],item["level"]);
					break;
				case "polyline":
					break;
				case "marker":
					break;
				default:
					break;
			}
		}
	}
 	//圆形警报参数，警报id,地理位置，警报半径，警报级别
	var drawCircleAlert = function(id,center, radius, level) {
		var point=new BMap.Point(center[0],center[1]);
 		var circle = new BMap.Circle(point, radius, {
 			fillColor: colorArr[level],
 			strokeColor: 'white',
 			strokeWeight: 1,
 			strokeOpacity: 0.5
 		});

 		map.addOverlay(circle);
 		/*addMenu(circle);*/
 		circle.id=id;
 		writeOverlays.push(circle);
 		circle.addEventListener("mouseover",function(e){
			this.enableEditing();
		});
 		circle.addEventListener("mouseout",function(e){
			this.disableEditing();
		});
 		circle.addEventListener("click", function(){  
	   		/*this.openInfoWindow(infoWindow);*/
	   		map.openInfoWindow(infoWindow,this.getCenter());
	   		colorTriggle(circle.getFillColor(),circle);
		});
		
 	}

	//多边形警报参数，警报id,路径，警报级别
 	var drawPolygonAlert = function(id,path, level) {
 		var pa=[];
 		for(var i=0;i<path.length;i++){
 			pa.push(new BMap.Point(path[i][0],path[i][1]));
 		}
 		var polygon = new BMap.Polygon(pa, {
 			fillColor: colorArr[level],
 			strokeColor: "white",
 			strokeWeight: 1,
 			strokeOpacity: 0.5
 		}); //创建多边形
 		map.addOverlay(polygon);
 		polygon.id=id;
 		/*addMenu(polygon);*/
 		writeOverlays.push(polygon);
 		
 		polygon.addEventListener("click", function(){    
 			//求多边形的中心
 			var centerLng=0;
 			var centerLat=0;
 			var len=this.getPath().length;
 			for(var i=0;i<len;i++){
 				centerLng+=this.getPath()[i].lng;
 				centerLat+=this.getPath()[i].lat;
 			}
 			centerLng=centerLng/len;
 			centerLat=centerLat/len;
	   		map.openInfoWindow(infoWindow,new BMap.Point(centerLng,centerLat));
	   		colorTriggle(polygon.getFillColor(),polygon);
	   		
		});
		polygon.addEventListener("mouseover",function(){
			this.enableEditing();
		});
		polygon.addEventListener("mouseout",function(e){
			this.disableEditing();
		});
 	}
 	//鼠标绘制图形样式参数,默认为红色
 	var level=3;
 	var styleOptions = {
 		strokeColor: colorArr[level], //边线颜色。
 		fillColor: colorArr[level], //填充颜色。当参数为空时，圆形将没有填充效果。
 		strokeWeight: 3, //边线的宽度，以像素为单位。
 		strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
 		fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
 		strokeStyle: 'solid' //边线的样式，solid或dashed。
 	}
	var lineStyleOptions={
		strokeColor: colorArr[level], //边线颜色。
 		strokeWeight: 3, //边线的宽度，以像素为单位。
 		strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
 		fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
 		strokeStyle: 'solid' //边线的样式，solid或dashed。
	}
 	//实例化鼠标绘制工具
 	var drawingManager = new BMapLib.DrawingManager(map, {
 		isOpen: false, //是否开启绘制模式
 		enableDrawingTool: true, //是否显示工具栏
 		drawingToolOptions: {
 			anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
 			offset: new BMap.Size(5, 5), //偏离值
 		},
 		circleOptions: styleOptions, //圆的样式
 		polylineOptions: lineStyleOptions, //线的样式
 		polygonOptions: styleOptions, //多边形的样式
 		rectangleOptions: styleOptions //矩形的样式
 	});
 	
 	//绘制成功回调函数
 	var overlaycomplete = function(e,ee,marker) {
 		var overlay=e.overlay;
		if(overlay instanceof BMap.Circle && overlay.getRadius()==0){
			return;
		}
 		draftOverlays.push(overlay);
 		if(!(overlay instanceof BMap.Marker)){
 			/*addMenu(overlay);*/
 		}

 	};
		
 	//添加鼠标绘制工具监听事件，用于获取绘制结果
 	 drawingManager.addEventListener('overlaycomplete', overlaycomplete);
 	
	
	
 	this.editAll = function() {
 		console.log(draftOverlays.length);
 		for(var i = 0; i < draftOverlays.length; i++) {
 			if(draftOverlays[i] instanceof BMap.Marker) {
 				draftOverlays[i].enableDragging();

 			} else {
 				draftOverlays[i].enableEditing();
 			}
 		}
 		for(var i = 0; i < writeOverlays.length; i++) {
 			if(writeOverlays[i] instanceof BMap.Marker) {
 				writeOverlays[i].enableDragging();

 			} else {
 				writeOverlays[i].enableEditing();
 			}
 		}
 	}
 	this.saveEditAll = function() {
 		console.log(draftOverlays.length);
 		for(var i = 0; i < draftOverlays.length; i++) {
 			if(draftOverlays[i] instanceof BMap.Marker) {
 				draftOverlays[i].disableDragging();

 			} else {
 				draftOverlays[i].disableEditing();
 			}
 		}
 		for(var i = 0; i < writeOverlays.length; i++) {
 			if(writeOverlays[i] instanceof BMap.Marker) {
 				writeOverlays[i].disableDragging();

 			} else {
 				writeOverlays[i].disableEditing();
 			}
 		}
 	}
 	this.deleteAll = function() {
 		var overlays = map.getOverlays();
 		for(var i = 0; i < overlays.length; i++) {
 			map.removeOverlay(overlays[i]);
 		}
 	}

 	
 	this.query =function(id){
 		var overlays = map.getOverlays();
 		for(var i = 0; i < overlays.length; i++) {
			if(overlays[i].id==id){

				return overlays[i];
			}else{
				return false;
			}
 		}
 	}
	
	//右键菜单函数
	function alertLevel(marker,level){
		return function(){
			marker.level=level;
 			if(marker instanceof BMap.Polyline){
 				marker.setStrokeColor(colorArr[marker.level]);
 			}else{
 				marker.setFillColor(colorArr[marker.level]);
 			}
 			
 			

		}
	}

 	var enbleEditing = function(e, ee, marker) {
 		marker.enableEditing();
 	}
 	var disableEditing = function(e, ee, marker) {
 		marker.disableEditing();
 	}
 	
 	this.save=function(){
 		saveDraw();
 		updateDraw();
 		this.output={"save":saveJson,"updata":updateJson};
 		console.log(this.output);
 	}
 	
 	var saveDraw = function() {
 		var overlay;
 		var obj;
 		for(var i = 0; i < draftOverlays.length; i++) {
 			overlay = draftOverlays[i];
 			if(overlay.level){
 				overlay.level=this.level;
 			}
 			if(overlay instanceof BMap.Circle) {
 				
 				obj={"type":"circle","center":overlay.getCenter(),"raduis":overlay.getRadius(),"levle":overlay.level};
 				saveJson.push(obj);

 			} else if(overlay instanceof BMap.Polygon) {
 				obj={"type":"polygon","path":overlay.getPath(),"levle":overlay.level};
 				saveJson.push(obj);
 			} else if(overlay instanceof BMap.Marker) {
 				obj={"type":"marker","position":overlay.getPosition()};
 				saveJson.push(obj);
 			} else if(overlay instanceof BMap.Polyline) {
 				obj={"type":"marker","path":overlay.getPath(),"levle":overlay.level};
 				saveJson.push(obj);
 			} else {
 				return false;
 			}
 		}
 	}
 	var updateDraw=function(){
 		var overlay;
 		var obj;
 		for(var i = 0; i < writeOverlays.length; i++) {
 			overlay = writeOverlays[i];
 			if(overlay instanceof BMap.Circle) {
 				
 				obj={"id":overlay.id,"type":"circle","center":overlay.getCenter(),"raduis":overlay.getRadius(),"levle":overlay.level};
 				updateJson.push(obj);

 			} else if(overlay instanceof BMap.Polygon) {
 				obj={"id":overlay.id,"type":"polygon","path":overlay.getPath(),"levle":overlay.level};
 				updateJson.push(obj);
 			} else if(overlay instanceof BMap.Marker) {
 				obj={"id":overlay.id,"type":"marker","position":overlay.getPosition()};
 				updateJson.push(obj);
 			} else if(overlay instanceof BMap.Polyline) {
 				obj={"id":overlay.id,"type":"marker","path":overlay.getPath(),"levle":overlay.level};
 				updateJson.push(obj);
 			} else {
 				return false;
 			}
 		}
 	}
 	
}
 
 