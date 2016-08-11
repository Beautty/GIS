//初始化数据
	
		var geo=[114.316, 30.581];
	var vehicle={
		"catagory":"emergVehicle",
		"imgUrl":"img/emergVehicle.png",
		"groups":[{"id":0,"title":"","geo":[114.316,30.581],"content":"第0辆应急车在这里"},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		]
	}
	for(var i=1;i<20;i++){
		vehicle["groups"][i]["id"]=i;
		vehicle["groups"][i]["title"]="第"+i+"辆应急车辆";
		vehicle["groups"][i]["geo"][0]=geo[0]+0.05*Math.random();
		vehicle["groups"][i]["geo"][1]=geo[1]+0.05*Math.random();	
		vehicle["groups"][i]["content"]=vehicle["groups"][i]["title"]+"在这里";

	}
	

	var workers={
		"catagory":"emergWorkers",
		"imgUrl":"img/emergWorkers.png",
		"groups":[{"id":0,"title":"","geo":[114.316,30.581],"content":"第0辆应急车在这里"},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		{"id":0,"title":"","geo":[114.316,30.581],"content":""},
		]
	}
	for(var i=1;i<20;i++){
		workers["groups"][i]["id"]=i;
		workers["groups"][i]["title"]="第"+i+"辆应急车辆";
		workers["groups"][i]["geo"][0]=geo[0]+0.05*Math.random();
		workers["groups"][i]["geo"][1]=geo[1]+0.05*Math.random();	
		workers["groups"][i]["content"]=workers["groups"][i]["title"]+"在这里";

	}
	
	//添加应急车辆标注
	addMarkers(vehicle);

	addMarkers(workers);
	
	
	
	//html交互
	$(".controller input[type=checkbox]").on("change",function(){
		if($(this).is(":checked")){
			showMarker(this.id);
		}else{
			hideMarker(this.id);
		}
	})
	
/*DRAW*/
var data=[{"id":1,"type":"circle","radius":2000,"center":[114.316,30.581],"level":0},
 {"id":2,"type":"polygon","path":[[114.316, 30.581],[114.385243, 30.513063],[114.294226, 30.517988]],"level":3}];
		
 
 var draw = new Drawing();
draw.drawAlert(data);