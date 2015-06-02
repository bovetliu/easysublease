	
	/*tb plase*/
		var A1 = new google.maps.LatLng(30.65461,-96.27453000000001);
	var A2 = new google.maps.LatLng(30.653440000000003,-96.27179000000001);
	
	var mA1= new google.maps.Marker({
		map:map_cs,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position:A1,
		title:"mA1"
	});
	var mA2= new google.maps.Marker({
		map:map_cs,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position:A2,
		title:"mA2"
	});
																																			
	var B1  = new google.maps.LatLng(30.65311,-96.27103000000001);
	var B2  = new google.maps.LatLng(30.650840, -96.266012 );
	
	var mB1= new google.maps.Marker({
		map:map_cs,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position:B1,
		title:"mB1"
	});
	var mB2= new google.maps.Marker({
		map:map_cs,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position:B2,
		title:"mB2"
	});

	seg1 = new SegmentNode (A1,A2, 38 );
	console.log("segnemnt 1:   " +seg1.hashcode());
	console.log("########:   " +seg1.dir.toString() + " distance to origin:" + seg1.dist.toString());
	
	seg2 = new SegmentNode (B1,B2, 39 );
	console.log("segment 2:   " +seg2.hashcode());
	console.log("########:   " +seg2.dir.toString() + " distance to origin:" + seg2.dist.toString());


	if (seg1.isAlignWith( seg2)) {
		console.log("pass alignment test");	
		if (seg1.dominatedBy(seg2)) {
			console.log("seg1 is dominatedBy seg2");	
		} else
		{
			console.log("seg1 is not dominatedBy seg2");	
		}
	}
	else {
		console.log("failed alignment test");	
	}
