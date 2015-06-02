// JavaScript Document

var data_layer_url_in_mapinteractionJS = 'js/bus_routes.json';

var collgestation_LatLng = new google.maps.LatLng(30.624013, -96.316689);  //30.624013, -96.316689
var home_LatLng = new google.maps.LatLng(30.620600000000003, -96.32621);    //30.623957, -96.311529
var test_LatLng = new google.maps.LatLng(30.618418, -96.327086);
var home_marker;
//var map_cs; moved this to index.php, map_cs is an important global variable
var contentString = " <p> click to rent <a href=\"cc77/index.html\">Cripple Creek #77</a></p>";
var infowindow_home = new google.maps.InfoWindow({       //init a infowindow
	content: contentString
});
var rightclkform_str = "  <div><ul> <li> <a class = \"poped-up-a\" id = \"lease-pop-up\"  href = \"#\">Lease/sublease at here </a></li><li><a class = \"poped-up-a\" href = \"http:\\www.baidu.com\">Want to rent here </a></li> " 
											+  "</ul></div>";
var infowindow_rightclk = new google.maps.InfoWindow({ 
	content: rightclkform_str,
	position: test_LatLng
});

var rclk_menu_overlay;  // going to be an instance of MMoverlay class

var mapOptions = {
	zoom: 14,
	center: collgestation_LatLng,
	workMode:"default"
};

function initialize() {
	map_cs = new google.maps.Map(document.getElementById('map-div'), mapOptions);
  /*
	home_marker = new google.maps.Marker({
		map:map_cs,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position: home_LatLng
	});
	
	listener_marker1 =  google.maps.event.addListener(home_marker, 'click', function() {
		infowindow_home.open(map_cs, home_marker);
	} );   
*/
	rclk_menu_overlay = new MMoverlay(map_cs); 
	listener_map_right_click  = google.maps.event.addListener(map_cs, 'rightclick', function(event) {  //rclk_menu_overlay
		//alert("rclk");
		if (mapOptions.workMode == "default"){
			
			rclk_menu_overlay.draw2(event.latLng); 
			rclk_menu_overlay.toggleOn();
		}
		else if (mapOptions.workMode == "travel-mode") {
			travel_control_i1.set_next(  event.latLng);
		}
		//infowindow_rightclk.open(map_cs);   // But I do not know what function should I put here
	}  );
	listener_map_click = google.maps.event.addListener(map_cs, 'click', function(event) {
		//alert("lclk");
		rclk_menu_overlay.toggleOff(event.latLng);	
	});
  // [START snippet-load]
  // Load GeoJSON.
  map_cs.data.loadGeoJson(data_layer_url_in_mapinteractionJS);
  // [END snippet-load]

  // [START snippet-style]
  // Set the stroke width, and fill color for each polygon
	
	map_cs.data.setStyle(function(feature) {
		return ({                                   ///@type {google.maps.Data.StyleOptions} 
		strokeColor: feature.getProperty('strokeColor'),
		strokeWeight: 6,
		strokeOpacity:0.4
		});
	});
  //map.data.setStyle(featureStyle);
  // [END snippet-style]
	
	listener_data_click = map_cs.data.addListener('click', function(event) {
		console.log("clicked heared");
		document.getElementById('txtHint').innerHTML = event.feature.getProperty('name')  + " is left clicked";
		tempstr = null;
		if (event.feature.getProperty('catagory') != null) {  //use this to determine whether this feature is one already-gen data, or to be gen
			
			var idarray = event.feature.getProperty('idarray');
			tempstr = mapcc1.extractInformation(idarray) ;

		}
		travel_control_i1.confirmRoute( event.latLng, tempstr);
	});
	
	
	listener_data_right_click = map_cs.data.addListener('rightclick', function(event) {
		console.log("right clicked heared");	
		document.getElementById('txtHint').innerHTML = event.feature.getProperty('name') + " is right clicked";
		if ( event.feature.getProperty('route_class') != "college_shuttle"){
			console.log(event.feature.getProperty("route_class"));
			console.log( " I am clicking non school shuttle data feature");
			travel_control_i1.addOneWaypoint(event.latLng);
		}
	});	
	
		
	/*tb plase*/
	debug = false;
	if (debug){
		var A1 = new google.maps.LatLng(30.316190000000002,-95.97589);
		var A2 = new google.maps.LatLng(30.319180000000003,-95.97589);
	
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
																																			
	var B1  = new google.maps.LatLng(30.316190000000002,-95.97589);
	var B2  = new google.maps.LatLng(30.317520000000002,-95.97590000000001);
	
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
	console.log("########:   " +seg1.dir.toString() + " distance to origin:" + seg1.dist.toString() + " " + seg1.isLongSeg);
	
	seg2 = new SegmentNode (B1,B2, 39 );
	console.log("segment 2:   " +seg2.hashcode());
	console.log("########:   " +seg2.dir.toString() + " distance to origin:" + seg2.dist.toString() + " "+seg2.isLongSeg);


	if (seg1.isAlignWith( seg2)) {
		console.log("pass alignment test");	
		if (seg1.dominatedBy(seg2)) {
			console.log("seg1 is dominatedBy seg2");	
		} else
		{
			console.log("seg1 is not dominatedBy seg2");	
		}
		
		if (seg2.dominatedBy(seg1)) {
			console.log("seg2 is dominatedBy seg1");	
		} else
		{
			console.log("seg2 is not dominatedBy seg1");	
		}
		
	}
	else {
		console.log("failed alignment test");	
		if (seg1.inItsBounds(B1) ) {
			console.log( "B1 is in seg1 bounds");	
		}
		else {  console.log( "B1 is NOT in seg1 bounds");	 }
		if (seg1.inItsBounds(B2) ) {
			console.log( "B2 is in seg1 bounds");	
		}
		else {  console.log( "B2 is NOT in seg1 bounds");	 }
		if (seg2.inItsBounds(A1) ) {
			console.log( "A1 is in seg2 bounds");	
		}
		else {  console.log( "A1 is NOT in seg2 bounds");	 }
		if (seg2.inItsBounds(A2) ) {
			console.log( "A2 is in seg2 bounds");	
		}
		else {  console.log( "A2 is NOT in seg2 bounds");	 }
	}
  
	//console.log( tenTo52.tenInto52(12312));  //successful;
	//console.log(tenTo52.ftInto10(tenTo52.tenInto52(12312))); // test successful
	//console.log( tenTo52.ftInto10(tenTo52.ftOp( "i]E", "+", 5) )  ); // test successful
	}// tb end
}// end of initialize

google.maps.event.addDomListener(window, 'load', initialize);   ///initialize is the last one to be executed
// this is one name space
var tenTo52 = (function() {
    var id= 0;
    return {
			ftInto10:function(oneFt) {
				oneFt = oneFt.split('');
				oneFt.forEach( function(val,index, ar) {
					oneFt[index] = oneFt[index].charCodeAt(0) - 65;
				});	
				tbr = 0;
				oneFt.forEach(function (val, index, ar) {
					tbr = tbr + val * Math.pow(52,index);	
				});
				return tbr;
			},
			tenInto52:function(  oneInt) {
				result = [];
				do {
					result.push(oneInt % 52);
					oneInt = Math.floor(oneInt / 52);
				}while (oneInt > 52)
				result.push(oneInt);
				//console.log("before convertToString: "+result);
				result = this.convertToString( result);
				return result;
			}, 
			convertToString : function (  intArray) {
				intArray.forEach( function (val,index, ar) {  ar[index] = ar[index] + 65;})
				intArray.forEach(  function(val, index, ar) {
					//console.log("val: ",val);
					//console.log( "char: " +String.fromCharCode( val) );
					ar[index] =  String.fromCharCode( val);
				});
				return intArray.join("");
			}, // end of converToString ()
			
			
			ftOp:function (ftStr,operant,oneInt ) {
				//only support "+" ,"-"
				if (operant == "+"){
					return  this.tenInto52 (this.ftInto10(ftStr) + oneInt);
				}
				else if (operant == "-") {
					return  this.tenInto52 (this.ftInto10(ftStr) - oneInt);
				}
				else alert("unknown operant");
			},
			next: function() {
					return id++;    
			},
			reset: function() {
					id = 0;     
			}
    };  
})(); 

///////////////////////




//constructor of this MapNode
//constructor of this MapNode
//constructor of this MapNode

function SegmentNode ( latLngA, latLngB, occupier_id) {
	if (typeof (latLngA) === 'undefined'  ||typeof (latLngB) === 'undefined' ) {throw new Error("Something went badly wrong!, ksdw 120"); }
	this.latLngA = latLngA;
	this.latLngB = latLngB;
	this.isLongSeg = false;  //will be updated
	geoLength = this.getGeoLength(this.latLngA, this.latLngB );
	this.geoLength = geoLength;
	//this.previous_node_key = null;
	var latA = latLngA.lat() ; var lngA = latLngA.lng() ;
	var latB = latLngB.lat(); var lngB = latLngB.lng() ;
	//console.log("construct latlngs: "+[latA, lngA, latB, lngB].toString());
	/* infinity has been considered*/
	this.k =   ( latB- latA )/ ( lngB - lngA) ; 

	this.dir = (Math.atan(this.k))/0.01745329252;
	this.rounded_dir = Math.round( this.dir  );
	this.b=  (latB  - this.k *  lngB) ;
	this.dist = "";
	this.centerDist = null;
	this.distanceToOrigin( this.isLongSeg ); // will update this.dist 
	this.occupiers = [occupier_id];
	this.nextNode = null;
	
	
	tempBounds = this.buildBounds(this.dir);
	this.bounds = tempBounds;
	this.originhashcode = mapcc1.getHashCode (occupier_id, latA, lngA, latB, lngB);
}

SegmentNode.prototype.getGeoLength = function( latLngA, latLngB) {
	var x_1 =  latLngA.lng() - latLngB.lng() ;
	var y_1 = latLngA.lat() - latLngB.lat() ;
	this.isLongSeg = (Math.sqrt( x_1 * x_1 + y_1 * y_1)>0.00200) ? true:false;  // over 200 meteres treate it as long seg
	//console.log( "this is " + this.isLongSeg + " Long");
	return ( Math.sqrt( x_1 * x_1 + y_1 * y_1));	
} 

SegmentNode.prototype.distanceToOrigin = function( isLongSeg ) {
	sgHREF =this;
	if (typeof(isLongSeg) == 'undefined') alert( " check input of distanceToOrigin");
		if  (Math.abs(this.dir) > 89.999999) { this.dist = Math.round(  this.latLngA.lng());}
		else if (this.k == 0) {this.dist = Math.round(  this.b);}
		else {
			var x_1 = (-this.b ) / (this.k + 1/this.k);
			var y_1 = this.k * x_1 + this.b;
			this.dist = Math.round( Math.sqrt( x_1 * x_1 + y_1 * y_1));
			
		}
		if (!isLongSeg)  {
		mid_lat = (this.latLngA.lat() + this.latLngB.lat()	) * 0.5;
		mid_lng = (this.latLngA.lng() + this.latLngB.lng()	) * 0.5;
		temp_dist = Math.sqrt(mid_lat * mid_lat + mid_lng * mid_lng );
		this.centerDist = parseInt(temp_dist.toString().split('.')[1].slice(0,5));
		}
		this.dist = Math.abs(this.dist);
		this.centerDist = Math.abs(this.centerDist);
}

/*
SegmentNode.prototype.addNextNode = function (nextNode) {  // pass by reference
	this.nextNodes.push(nextNode);  // nextNode should be SegnmentNode
	return this.nextNodes;
}
*/
SegmentNode.prototype.hashcode = function(){
	return this.originhashcode;	
}
SegmentNode.prototype.buildBounds  = function(  dir ) {
	SNhref =this;
	if (dir > 67.5) {
		offset_lat = 0; offset_lng = 0.00015; 		
	} else if (dir <= 67.5 && dir > 22.5 )  {
		offset_lat = 0.000106; offset_lng = 0.000106; 
	}
	else if (  dir <= 22.5 && dir > -22.5 )  {
		offset_lat = 0.00015; offset_lng = 0; 
	}
	else if ( dir <= -22.5 && dir > -67.5) {
		offset_lat = 0.000106;	offset_lng = -0.000106;
	}
	else {
		offset_lat = 0;	offset_lng = -0.00015;
	}
	return new google.maps.Polygon({
    paths: [
      new google.maps.LatLng(SNhref.latLngA.lat() + offset_lat, SNhref.latLngA.lng() - offset_lng  ),
      new google.maps.LatLng(SNhref.latLngA.lat() - offset_lat, SNhref.latLngA.lng() + offset_lng  ),
      new google.maps.LatLng(SNhref.latLngB.lat() - offset_lat, SNhref.latLngB.lng() + offset_lng  ),
			new google.maps.LatLng(SNhref.latLngB.lat() + offset_lat, SNhref.latLngB.lng() - offset_lng  )
    ]
  });
}

SegmentNode.prototype.inItsBounds  =function (latLng) {   // should have big change in this one
	SNhref =this;
	return google.maps.geometry.poly.containsLocation(latLng, SNhref.bounds);
}

SegmentNode.prototype.isAlignWith = function (incomingNode) {
	//console.log(this.dir.toString() + "  " + incomingNode.dir.toString() );
	//console.log([this.dist, incomingNode.dist] );
	//console.log("entered isAlignWith");
	var trace = false;
	
	if ( incomingNode.latLngA.lat() == 30.316190000000002) { 
	  console.log( "found trace target: "+this.hashcode() +"  " + incomingNode.hashcode())
		trace = true;
	}
	if ( this.latLngA == incomingNode.latLngB  || this.latLngB == incomingNode.latLngA  ||this.occupiers.toString() == incomingNode.occupiers.toString()) {
		if (trace) {
					console.log("isAlignWith false becouse on same route");
					console.log(  this.hashcode() +"   "+ incomingNode.hashcode()  ); 
				}
		return false;	
	}
	if (incomingNode === this) { alert( "isAlignWith checking the node is itself" ); return false;}
	//if (Math.abs((this.dir - incomingNode.dir)) < 3  && (this.dist > 0.5 * incomingNode.dist) && (this.dist < 1.5 * incomingNode.dist) ) {
	if (Math.abs(( (this.dir * incomingNode.dir > 0  )?this.dir - incomingNode.dir :this.dir + incomingNode.dir)) < 30 ) {
		if (  incomingNode.inItsBounds(this.latLngA) || incomingNode.inItsBounds(this.latLngB)  ){
				if (trace) {
					console.log("isAlignWith true:  inItsbounds 1nd  " + this.hashcode() + " " +incomingNode.hashcode() );
				}
			return true;
		}
		else {
			//console.log("");
			if (trace) {
					console.log("isAlignWith false:   did not pass 2nd condition (inbounds)");
					//console.log(  this.hashcode()); console.log(incomingNode.hashcode());	
			}
			return false;
		}
	}
	else { 
		//console.log("didn not pass first condition");
		if (trace) {
					console.log(  this.hashcode()); console.log(incomingNode.hashcode());	
			    if (Math.abs((this.dir - incomingNode.dir)) >= 30 ){
						console.log("isAlignWith false:  didn not pass first condition due to big angle difference");
						console.log( [this.dir,incomingNode.dir ]);
					}
					else {
						console.log("isAlignWith false:  didn not pass first condition due to distance mismatch");
					}
		}
		return false;
	}
}
// so too small segnment cannot dominate big ones, comparable line segments having enough overlapping length can dom each other
// one line segments completely in another segment, this will be dominated by that big one
SegmentNode.prototype.dominatedBy = function ( incomingNode) {  // shut down this feature
	//based on the condition that these two nodes are alinged
	return true;
	if ( typeof(incomingNode) ==='undefined') alert( "error at line 219");
	var isDominated = false
	if (  this.inItsBounds(incomingNode.latLngA )==true &&  true == this.inItsBounds(incomingNode.latLngB )  ) {  // fixed one bug here
		return true;
	}
	cankao1 = this.inItsBounds(incomingNode.latLngA) ?  incomingNode.latLngA:incomingNode.latLngB;
	cankao2 = incomingNode.inItsBounds( this.latLngA) ? this.latLngA : this.latLngB;
	if (this.getGeoLength( cankao1, cankao2) > 0.05 * this.geoLength)  // overlapping length larger than 35% of total length of this line segment
	return true;
	else {
		//console.log("overlapping length not enough: domination failure");
		return true;
	}  
} 

SegmentNode.prototype.shareWith = function(  incomingNode) {
	debug = false;
	if (incomingNode.latLngA.lat() == 30.09297){
		console.log( "entered shareWith:" + " " + this.hashcode() + " checkshareWith: " + incomingNode.hashcode());	
		debug = true;
	}
	if (this.dominatedBy(incomingNode)) {
		this.occupiers = this.occupiers.concat(incomingNode.occupiers);
		//console.log(this.occupiers.toString() + " ksdw188");
		this.occupiers = arrayUnique(this.occupiers.sort(function(a, b){return a-b}));
		//console.log(this.occupiers.toString() + " ksdw190");
		if (debug) { console.log(  "after dominating, this dominated by that: this.occupiers: " + this.occupiers);}
	}
	if ( incomingNode.dominatedBy (this)) {
		incomingNode.occupiers = incomingNode.occupiers.concat(this.occupiers);
		//console.log(this.occupiers.toString() + " ksdw188");
		incomingNode.occupiers = arrayUnique(incomingNode.occupiers.sort(function(a, b){return a-b}));
		//console.log(this.occupiers.toString() + " ksdw190");
		if (debug) { console.log(  "after dominating, that dominated by this: that.occupiers: " + incomingNode.occupiers );}
	}
}

SegmentNode.prototype.hasSameOccupiersWith = function ( incomingNode) {
	//assuming they are all sorted
	if (incomingNode.occupiers.length != this.occupiers.length) return false;
	else {
		for (var i = 0; i < this.occupiers.length ; i ++) {
			if 	(incomingNode.occupiers[i] != this.occupiers[i]) return false
		}
		return true;
	}
}
//////////////////////////////////////////////////////////////////
////////////// implement on map calculation function library//////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


function MapCommonCalc() {
	this.self_introduction = "I am a function library to do some latLng calculations";
	this._proparray = [];
	this.long_Node_Hashmap = [];  // this one actually contains all the information of the directed graph
	this.short_Node_Hashmap = [];
	this.headNodeArray =[];  // 
	this._V = 0;
}
MapCommonCalc.prototype.reset = function() {
	this._proparray = [];
	this.long_Node_Hashmap = [];  // this one actually contains all the information of the directed graph
	this.headNodeArray =[];  //
	this.short_Node_Hashmap = []; 
	this._V = 0;
}
MapCommonCalc.prototype.extractInformation = function ( id_array) {
	if (typeof (id_array) =='undefined' || id_array.length == 0 || id_array == null) alert(  "problem in extractInformation");
	tempstr = "";
	oneentry = ""
	for (var i = 0 ; i < id_array.length ; i ++) {
		var info_prop = this._proparray[parseInt(id_array[i])];
		var origin = info_prop['origin'] ;
		var destiny =info_prop['destiny']; 
		var id = parseInt(id_array[0]);
		//console.log(origin + " " + destiny);
		var latLngs = this.decodedPath(info_prop['encoded_polyline']);
		var origin_latLng = latLngs[0];              //getGeometry should return lineString: geoMetry
		var destiny_latLng = latLngs[latLngs.length-1];
		
		if (id_array.length  == 1) {
			console.log(  "duzhan qing kuang" );
			travel_control_i1.set_origin(origin_latLng);
			travel_control_i1.set_destination(destiny_latLng);
		}
		//following all code for info window
		
		fromTo =  ("FROM: "+origin + " TO " + destiny);
		var temp =  (info_prop['cat']==0)?"PROVIDED" : "NEEDED";
		tempstr = "one ride:" + fromTo.concat()+" is "+temp.concat();
		tempstr = "<p style = \"font-weight:normal;\">" + tempstr + "<br>" + "memo: " +info_prop['memo'] + "<br>"+"Departure date: "+  info_prop['depart_date'] +"<br>click to check <a  target=\"_blank\" href = \""+info_prop['source'] +"\">source</a><br><span  onclick = \"travel_set_status( "+id.toString()+" , 1);\" onmouseover = \"changecolor(this);\" onmouseout=\"backcolor(this);\">mark it as outdated</span>"+"</p>";
		oneentry = oneentry + tempstr;
	}
	return oneentry;
}
/*
*
*
*/
MapCommonCalc.prototype.assemble  = function ( segnodes,occupiers_string) {
	//console.log("assemble here " + occupiers_string);
	if (segnodes == [] ||occupiers_string == "" ) 
	{alert( "assemble function does not take null parameteres"  );throw new Error("Something went badly wrong!, ksdw 279");}
	var ids = occupiers_string.split(",");
	cat = 0;
	mapccHref = this;
	for (var i=0; i< ids.length; i++) {
		cat = cat + 	parseInt(mapccHref._proparray[ids[i]]['cat']);
	}


	cat = Math.round( cat / ids.length );
	if (cat <0 || cat >2) console.log("ksdw334"+cat);
	latLngs = [];
	segnodes.forEach( function (node, index, array) {
		if (index ==0) {
			console.log( segnodes);
			latLngs.push( node.latLngA);	
		}	
		latLngs.push( node.latLngB);	
	});	
	one_prop_array = [ ];
	one_prop_array['idarray'] = ids;
	one_prop_array['cat'] = cat; // for test
	one_prop_array['encoded_polyline'] = "void";
	one_prop_array['stroke-width'] = ids.length *2;
	one_prop_array['stroke-opacity']  = 0.5;
	
	one_prop_array['latlngs'] = latLngs;
	return one_prop_array;
	
}

/*
*  Search alonge one subroute, and return all the latlngs along this route
*/
MapCommonCalc.prototype.formroutes  = function( ) {
	MapCCHref = this;
	rendered_subroute = [];
	segNodes = [];
	assembled = [];
	current_occupiers_string = "";
	console.log(MapCCHref.headNodeArray ); 
  MapCCHref.headNodeArray.sort( function (node1, node2) {  var result = node1.occupiers.length - node2.occupiers.length;
	  return -result ; })
	MapCCHref.headNodeArray.forEach( function ( node, index, array) {  // visit from every head node
		// processing one new node, update rendered_subroute at last
		lastend = null;
		checked_subroutes = [] // store ids to string(), such  "2,3" ,"12,23,32"   // must be pre-sorted string representation of array
		current_occupiers_string = node.occupiers.toString();
		console.log("forEach");
		var count = 0
		while(node){ 
			//console.log(node.occupiers.toString());
			
			if (node.nextNode){
				console.log( node.occupiers.toString() + " => " + node.nextNode.occupiers.toString()+ " current processing:  " +node.hashcode());
			}//Look ahead
			
			if( node.nextNode != null && count && node.nextNode.occupiers.toString() !== current_occupiers_string   ) {
				console.log( "encountered changing ");
				if (node.nextNode.occupiers.toString().length > current_occupiers_string.length ){  // meetNew situation, combining!&& (  Math.abs(node.dir - node.nextNode.dir) <= 10)
					console.log("this is one combing situation, so add next node");segNodes.push(node);
					lastend = null; // make next subroute not interfered
				}
				else if (node.nextNode.occupiers.toString().length < current_occupiers_string.length  ) {  
				//meetNew situation, Bifurcation // might containing bug!!  && (  Math.abs(node.dir - node.nextNode.dir) <= 10) 
				//10078,111987   ->  10078,10023: at this situation, the string length indeed shrinked, but number of occupier did not change
					console.log("this is one bifurcation situation, cache this end, which will be added to next subroute");lastend = node;
				} //else 
				else {segNodes.push(node);3==3; console.log( "check 3==3 ");}
				if ( (rendered_subroute.indexOf(current_occupiers_string ) <0) && (segNodes.length != 0 )){  //did not renter this overlapping
					console.log( "this subroute not rendered yet, push this sub-route one into assembled");
					assembled.push(MapCCHref.assemble ( segNodes ,current_occupiers_string)); // the assembled cotains { id: " ", latlngs:[ ...], }
				}
					//there if belongs to those rendered, just let it go		
						//if ( node.nextNode){
					checked_subroutes.push(current_occupiers_string  );
					current_occupiers_string = node.nextNode.occupiers.toString();
					
					segNodes = [];  // clear segNodes
					
					if (lastend){
						segNodes = segNodes.concat(lastend);
					}
					lastend = null
				//}
				//segNodes.push(node);
			}//end of bound processing
			else { // not meeting nodes of new situation, ||| meet start of new route or end of route
				segNodes.push(node);
			}  // end of normal node processing
			if ( ! node.nextNode) {
			  console.log("entered final processing");
				for (var i =0; i < checked_subroutes.length; i ++) {
					if ( rendered_subroute.indexOf(checked_subroutes[i]) < 0) {
						rendered_subroute.push( checked_subroutes[i]);
					}	//end of containing check
					
				} // end of for checked_subroutes
				console.log( "push last subroute of Current Route into assembled at final processing ");
				assembled.push(MapCCHref.assemble ( segNodes ,current_occupiers_string)); // the assembled cotains { id: " ", latlngs:[ ...], }
				lastend = null;
				segNodes = [];
			}//end of final processing
			count = count + 1;
			node = node.nextNode;
		}//end of while 
	}); // end of call back function
	
	return assembled
}
MapCommonCalc.prototype.toHashString =function ( bigLat, bigLng) {
	return 	Math.round(bigLat).toString() + "," + Math.round(bigLng).toString();  // another getHashCode 
}

/*
utility function of buildGraph, this function will be called once for one toplevel route, so I can use functional variable 
to keep track of delta dir, and do ||accumulation|| of dir and cut, sign(dir) changes results one cut no matter whether ||accumulation||
goes over the threshhold:2, this function is about to compress route into half of its previous size
*/
MapCommonCalc.prototype.intoSegnmentNodes = function ( latLngs, id) {
	//latLngs is  [map.latlng1, map.latlng2 , map.latlng3,,,,,] of one top-level route
	//top-level route -> segmentNodes	
	//console.log(latLngs);
	var accu_dir = 0;
	var prev_dir = 0;
	var threshold_dir_change = 5;
	var wiggle_threshold = 1;
	var length = latLngs.length;
	beitai_segmentNodes = [];
	segmentNodes = [];
	if (length == 0 || typeof (latLngs) === 'undefined') {  alert ( "parameters of sampleThisRoute have error"); return;}
	if (length == 1) {
		//do something here	
	  alert( "normally, the latLns in intoSegmentNodes should have more than 1 latLng, so do nothing for this route");
		return;
	}    // error checking
	else if (length > 1) {
		for (var i = 1; i < latLngs.length; i ++) {
			  //console.log(temp_array);
				beitai_segmentNodes.push(  new SegmentNode(   latLngs[i-1],latLngs[i],id )); // costive
		}	
	}
	console.log ("beitai_segmentNodes length: " + beitai_segmentNodes.length  );
	var  s = 0;
	//end jiushi i-1
	if (beitai_segmentNodes.length > 1) {
		for (var i = 1; i <beitai_segmentNodes.length; i ++  ){
				// i-1 is index of previous seg
				d_dir = beitai_segmentNodes[i].dir - beitai_segmentNodes[i-1].dir; // compute the delta direction change
				if (accu_dir * d_dir < 0 && Math.abs(d_dir) > wiggle_threshold) {  // find one direction-change cut
					segmentNodes.push(  new SegmentNode( beitai_segmentNodes[s].latLngA, beitai_segmentNodes[i-1].latLngB, id) );	
					s= i;  // update new start index
					accu_dir = 0;
				}
				else if ( accu_dir * d_dir >= 0 && (  Math.abs(accu_dir + d_dir) ) > threshold_dir_change   ) {  // find one accumulation cut
					segmentNodes.push(  new SegmentNode( beitai_segmentNodes[s].latLngA, beitai_segmentNodes[i-1].latLngB, id) );	
					s= i;  // update new start index
					accu_dir = 0;	
				}
				else if (  i == beitai_segmentNodes.length-1 ) {  // at end of checking
					segmentNodes.push(  new SegmentNode( beitai_segmentNodes[s].latLngA, beitai_segmentNodes[i].latLngB, id) );	
				}
				else {  //  in the middle of checking
					accu_dir = accu_dir + d_dir;	
				}
		}
	} else return beitai_segmentNodes;
	console.log ( "compressed " + (1-segmentNodes.length / beitai_segmentNodes.length) * 100 + "%" )
	return segmentNodes;
}


MapCommonCalc.prototype.checkAndOpen = function( i, j, inHashMap) {
	if (typeof (inHashMap[i]) !== 'undefined'  ){
		if (typeof (inHashMap[i][j]) !== 'undefined'   ) {
			return false;	
		}
		else {
			inHashMap[i][j] = []	;
			return true;	
		}
	}
	else if (typeof (inHashMap[i]) === 'undefined') {
		inHashMap[i] = [];
		inHashMap[i][j] = []	;
	}	
	else if ( typeof (this.inHashMap[i][j]) === 'undefined'  ){  //this will noe be run
		inHashMap[i][j] = [];	
	}
	if ( typeof(inHashMap[i][j]) ==='undefined') {alert("cccccc");inHashMap[i][j] = []; }  // if alerts, means this function has bug
	return true;
}

/*
* utility funtion of buildGraph
* Update the this.long_Node_Hashmap[dir][dist].push(segNode)
*/
MapCommonCalc.prototype.disperseExistenceOf  = function( segNode) {
	// pay attention to long segs and short segs
	//long_Node_Hashmap[dir][dist]
	//short_Node_Hashmap[dist][approximatedir]
	var dist = segNode.dist;    var rounded_dir =  segNode.rounded_dir; 
  var checked_nodes = [];
	//console.log("segNode.dist " + segNode.dist + " rounded_dir  " + rounded_dir   );
	debug = false;
	if ( segNode.latLngA.lat() == 30.09297  || segNode.latLngA.lat() == 30.092820000000003  ) {
		debug = true;
		console.log( "disperseExistenceOf found target: " + segNode.hashcode() );	
		console.log( [rounded_dir, dist]);
		console.log(  "isLongSeg: " + segNode.isLongSeg);
	}
	for ( var i = rounded_dir -4; i <= rounded_dir +4 ; i ++) {
		i_corrected = i;
		if (i < -90) i_corrected = i+180;
		else if (i >90) i_corrected = i-180;
		for (var j = dist -4; j <= dist +4; j ++) {
			//console.log([i,j]);
			if (this.checkAndOpen(i_corrected,j, this.long_Node_Hashmap)) { 
					this.long_Node_Hashmap[i_corrected][j].push(segNode);	
			}		
			else {  // someone came here first situation 
				//console.log("else");
				for (var k = 0; k <this.long_Node_Hashmap[i_corrected][j].length; k ++ ){
					if ( checked_nodes.indexOf( this.long_Node_Hashmap[i_corrected][j][k] ) >= 0 ) {
						continue;						
					}
					else{   // not checked nodes
						if (this.long_Node_Hashmap[i_corrected][j][k].isAlignWith(segNode) ){
							this.long_Node_Hashmap[i_corrected][j][k].shareWith (segNode)
						}
						checked_nodes.push( this.long_Node_Hashmap[i_corrected][j][k] );
					}
				}
				this.long_Node_Hashmap[i_corrected][j].push(segNode); // eventually, put the segNode into this virtual 2D array
			}// someone came here first situation : else 
		}	// for loop of j
	}//for loop of i
	
 if (!segNode.isLongSeg){ //zhege qi zuo yong le//
	 var centerDist = segNode.centerDist 
	 var approx_dir = Math.round(segNode.dir / 10 );
		for ( var i = centerDist  -2; i <= centerDist +2 ; i ++) { // one special representation of center node to origin
			if (i < -90) i_corrected = i+180;
			else if (i >90) i_corrected = i-180;
			for (var j = approx_dir -2; j <= approx_dir +2; j ++) {    // dir * 10
				//console.log([i,j]);
				if (this.checkAndOpen(i_corrected,j, this.short_Node_Hashmap)) { 
						this.short_Node_Hashmap[i_corrected][j].push(segNode);	
				}		
				else {  // someone came here first situation 
					//console.log("else");
					for (var k = 0; k <this.short_Node_Hashmap[i_corrected][j].length; k ++ ){
						if ( checked_nodes.indexOf( this.short_Node_Hashmap[i_corrected][j][k] ) >= 0 ) {
							continue;						
						}
						else{   // not checked nodes
							if (this.short_Node_Hashmap[i_corrected][j][k].isAlignWith(segNode) ){
								this.short_Node_Hashmap[i_corrected][j][k].shareWith (segNode)
							}
							checked_nodes.push( this.short_Node_Hashmap[i_corrected][j][k] );
						}
					}
					this.short_Node_Hashmap[i_corrected][j].push(segNode); // eventually, put the segNode into this virtual 2D array
				}// someone came here first situation : else 
			}	// for loop of j
		}//for loop of i
	}  // end of !isLongSeg condition
	
}

/**
* Build directed graph for DFS
* 
* 
**/
MapCommonCalc.prototype.buildGraph = function ( ) {
	// featureOptions is an array of featureOption	
	//one FeatureOption includes{ properties, id, and geometry} 
	
	console.log ("entered buildGraph()"); 
	MapCCHref = this;MapCCHref.headNodeArray = [];
	//var combinedPropArrays= [] ; // this one will contain prop_array s   : [ [prop_array1], [prop_array2],, ]
	if (this._proparray.length == 0 ) {
		alert( "_featureOptions array cannot be 0 length when running combinedFeatureOptions");	
		return ;
	}
	for (id in this._proparray) {  // _proparrray becomes associative array now
	  // id is id of route
		console.log ( "start building route: " + id.toString());
		var temp_latlngs = MapCCHref.decodedPath(this._proparray[id]['encoded_polyline'] );
		segmentNodes = this.intoSegnmentNodes(temp_latlngs, id  );
		if (segmentNodes.length == 0  || typeof(segmentNodes) ==='undefined') { throw "zero or error length segnmentNodes";}
		//the first latlng on route
    segmentNodes.forEach(  function(node, index, ar) {
			if (index == 0) {
				MapCCHref.headNodeArray.push(node);	
			}
			else if (index>0) {
				ar[index-1].nextNode = ar[index]; // build linked list among nodes
			}  
			MapCCHref.disperseExistenceOf(node);	
		});
	}//iterating all routes
	console.log( "build graph finished");
}// end of buildGraph ()
MapCommonCalc.prototype.getHashCode  =function ( occupiersID, latA, lngA, latB, lngB) {
	return occupiersID.toString() +" "+(latA ).toString() + ","+ lngA .toString() + "->" + latB .toString() + ","+  lngB .toString();
}


MapCommonCalc.prototype.createFeature = function(prop_array) {
	//prop_array = [id, cat, origin, destiny, source, memo, jsonlatlngs, encoded_polyline]
	// at 05/03/2015, I changed prop_array into associative array
	//console.log(prop_array);
	MapCCHref = this;
	var color;
	if (prop_array['cat'] == 0) {color = "#00b3fd";}
	else if (prop_array['cat'] == 1) { color = "#20b543";}
	else if (prop_array['cat'] == 2) { color = "#EB66FD";}
	if ( typeof (prop_array['idarray']) ==='undefined' ) {  prop_array['idarray'] =  [prop_array['id']];  }
	properties_1 = {
				"idarray":prop_array['idarray'],
				"id":prop_array['id'],
				"name":"sql-gen-routes",
				"strokeColor": color,
				//strokeWeight,
        "strokeOpacity": 0.5,
				"catagory":prop_array['cat'],
				"depart-date":prop_array['depart_date'],
				"origin":prop_array['origin'],
				"destiny":prop_array['destiny'],
				"source":prop_array['source'],
				"memo":prop_array['memo'],
	};
	if (prop_array['encoded_polyline'] != "void") {  // new feature of database
		//console.log("when rendering feature, encoded information works");
		//console.log(prop_array['encoded_polyline']);
		latlngs= this.decodedPath( prop_array['encoded_polyline'] ); 
		//console.log(latlngs );
		newLineString = new google.maps.Data.LineString( latlngs  );
		  // for debug
		debug =true;
		if (debug) {	
			for (var i = 0; i < latlngs.length ; i ++ ) {
					temp = new google.maps.Marker({
						map:map_cs,
						draggable:true,
						animation: google.maps.Animation.DROP,
						position: latlngs[i],
						title:prop_array['id'].toString() + " " + latlngs[i].toString()
					});	
			}
		}// end of if debug
	}
	else {
		newLineString = new google.maps.Data.LineString(  prop_array['latlngs'] ); 

		debug =true;
		console.log("ksdw870");
		if (debug) {	
			for (var i = 0; i <prop_array['latlngs'].length ; i ++ ) {console.log("ksdw871");
					temp = new google.maps.Marker({
						map:map_cs,
						draggable:true,
						animation: google.maps.Animation.DROP,
						position: prop_array['latlngs'][i],
						title:prop_array['idarray'].toString() + " " + prop_array['latlngs'][i].toString()
					});
				
			}
		}// end of if debug
		
	}
	tbr = {properties:properties_1, id:prop_array['id'], geometry:newLineString};
	map_cs.data.add(tbr);
}

MapCommonCalc.prototype.adaptiveSetFeature = function(){
		map_cs.data.setStyle(function(feature) {  // reset styles
		
		if (    feature.getId() != 38){
			if ( typeof(feature.getProperty("idarray")) !=='undefined' ){
				return ({// @type {google.maps.Data.StyleOptions} 
				strokeColor: feature.getProperty("strokeColor"),
				strokeWeight: feature.getProperty("idarray").length *6,
				strokeOpacity:0.6
				});
			}
			else {  // zhuanmen chu li the to be gen route
				return ({// @type {google.maps.Data.StyleOptions} 
				strokeColor: feature.getProperty("strokeColor"),
				strokeWeight:feature.getProperty("strokeWeight"),
				strokeOpacity:0.6
				});
			}
			
		}
		else {
			console.log( "settting feature of "+feature.getId().toString() +"  " +  feature.getProperty("stroke-color")); // ye mian huan cun dao zhi yi xie wen ti
			return ({// @type {google.maps.Data.StyleOptions} 
			strokeColor: "#000000",
			strokeWeight: 6,
			strokeOpacity:0.6
			});
		}
	});
}

MapCommonCalc.prototype.decodedPath = function( encodedPath) {
  return  google.maps.geometry.encoding.decodePath( encodedPath) ;		
} 

MapCommonCalc.prototype.getBounds = function( originLatLng, destinyLatLng) {
	sw = new google.maps.LatLng( (originLatLng.lat() < destinyLatLng.lat())?originLatLng.lat() : destinyLatLng.lat() ,(originLatLng.lng() < destinyLatLng.lng())?originLatLng.lng() : destinyLatLng.lng()  ) ;
	ne = new google.maps.LatLng( (originLatLng.lat() > destinyLatLng.lat())?originLatLng.lat() : destinyLatLng.lat() ,(originLatLng.lng() > destinyLatLng.lng())?originLatLng.lng() : destinyLatLng.lng()  ) ;
	return new google.maps.LatLngBounds(sw, ne);
}

MapCommonCalc.prototype.getMidLatLngOf = function( latLngA, latLngB) {
	var midLat = (latLngA.lat() + latLngB.lat()) / 2;
	var midLng = (latLngA.lng() + latLngB.lng()) / 2;
	return new google.maps.LatLng(midLat, midLng);
}

MapCommonCalc.prototype.shiftLatLng = function( oldLatLng,x_percent, y_percent) {
	//change the original latlng into one new latlng, (newlatlng.x_pixel_onscreen - oldlatlng.x_pixel_onscreen )/ map_div.width = x_percent
	old_point = map_cs.getProjection().fromLatLngToPoint(oldLatLng);
	new_point = new google.maps.Point(old_point.x + x_percent * map_cs.getDiv().width, old_point.y);
	return  map_cs.getProjection().fromPointToLatLng( new_point); 
}

MapCommonCalc.prototype.panToCenterOf_encodedPath = function (encodedPath) {
	//latLng is google map variable
	//map_cs is an important global variable 
	if (encodedPath == "void") {
		alert("old path, is not encoded, unnable to calculate");
		return;	
	}
	console.log("encoded path :"+encodedPath);
	var latLngAry = this.decodedPath(encodedPath);
	console.log( this.getMidLatLngOf( latLngAry[0], latLngAry[latLngAry.length -1] ).toString() );
	
	centerLatLng =  this.getMidLatLngOf( latLngAry[0], latLngAry[latLngAry.length -1] );
	//centerLatLng = this.shiftLatLng (centerLatLng, 0.375,0);
	var bounds = this.getBounds(latLngAry[0], latLngAry[latLngAry.length -1]);
	var zoom = this.getZoomByBounds(map_cs,bounds );
	
	map_cs.setZoom(zoom);
	map_cs.panTo (  centerLatLng );	
	map_cs.panBy(map_cs.getDiv().offsetWidth * 0.375, 0);
	
	travel_control_i1.set_origin(latLngAry[0]);
	travel_control_i1.set_destination(latLngAry[latLngAry.length -1]);	
}

/**
* Returns the zoom level at which the given rectangular region fits in the map view. 
* The zoom level is computed for the currently selected map type. 
* @param {google.maps.Map} map
* @param {google.maps.LatLngBounds} bounds 
* @return {Number} zoom level
**/
MapCommonCalc.prototype.getZoomByBounds = function( map, bounds ){
  var MAX_ZOOM = map.mapTypes.get( map.getMapTypeId() ).maxZoom || 21 ;
  var MIN_ZOOM = map.mapTypes.get( map.getMapTypeId() ).minZoom || 0 ;

  var ne= map.getProjection().fromLatLngToPoint( bounds.getNorthEast() );
  var sw= map.getProjection().fromLatLngToPoint( bounds.getSouthWest() ); 

  var worldCoordWidth = Math.abs(ne.x-sw.x);
  var worldCoordHeight = Math.abs(ne.y-sw.y);

  //Fit padding in pixels 
  var FIT_PAD = 40;

  for( var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom ){ 
      if( worldCoordWidth*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).width() && 
          worldCoordHeight*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).height() )
          return zoom;
  }
  return 0;
}





