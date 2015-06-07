// JavaScript DocumentEasySubOrg.UTILITIES.json_data_layer_bus_routes = 'js/bus_routes.json';
EasySubOrg.createNS("EasySubOrg.MAP");
// EasySubOrg.MAP.CONTROL_UNIT should be an extended Backbone model
var MAP_CU = Backbone.Model.extend({  //to refer him: EasySubOrg.MAP.cu_01
	defaults:function(){
		return {
			data_layer_bus_routes:'js/bus_routes.json',
			home_LatLng: new google.maps.LatLng(30.620600000000003, -96.32621),
			test_LatLng: new google.maps.LatLng(30.618418, -96.327086),
			rclk_menu_overlay: null,  // EasySubOrg.MAP.cu_01.get('rclk_menu_overlay')placeholder
			map_options:{ draggingCursor:"move",draggableCursor:"auto" , zoom: 14, center: new google.maps.LatLng(30.624013, -96.316689) },
			map:null, //EasySubOrg.MAP.cu_01.get('map')
			work_mode:"default",   //EasySubOrg.MAP.cu_01.get('work_mode')
			// work_mode is listened by right-click-menu
			
			rental_search_result:[],  // this one will take something like following array of object(s)
			//[{"_id":"556a5ec57ca147a019edc654","lat":30.65526502275242,"lng":-96.27568244934082,"beds":2,"baths":1.5,"price_single":null,
			//"price_total":550,"cat":1,"post_date":"2015-05-31T01:07:17.000Z","isexpired":false,"community":"Campus view","source":"","memo":"test memo 
			//0806","addr":"street","__v":0}]
			travel_search_result:[],  //this one will take one object of objects  {"10047":{...} , "10089":{...},     }  EasySubOrg.MAP.cu_01.get("travel_search_result")
			to_be_set_expired:"",
			to_be_set_expired_ride:"",
		}
	}, // end of defaults
	toggleWorkMode : function () {
		if (this.get('work_mode') == "default") {  this.set('work_mode', 'travel-mode'); }
		else if ( this.get('work_mode') == 'travel-mode') { this.set('work_mode', 'travel-mode');}
		console.log(  this.get('work_mode'));
	},
	
	/*
	*EasySubOrg.MAP.cu_01.isMapReady();
	*/
	isMapReady:function(){
		var classRef = this;
		if ( classRef.get('map')==null ||typeof(classRef.get('map'))=='undefined')  
		{
			return false;
		}
		else if (typeof(classRef.get('map').getBounds()) == 'undefined' || classRef.get('map').getBounds() == null) {
			console.log("EasySubOrg.MAP.cu_01.isMapReady(): map NOT ready due to getBounds() returning abnormal values") ;
			return false;	
		}
		else return true;
	},
	
	/*
	*EasySubOrg.MAP.cu_01.reportBounds(coeff, maxspan);
	*/
	reportBounds: function(  coeff, maxspan) {
		
		if (typeof (coeff) == 'undefined')  {coeff = 1;   alert( "reportBounds() receives no arg for coeff");}
		if (typeof (maxspan) == 'undefined')  {maxspan = 0.8; alert( "reportBounds() receives no arg for maxspan"); }
		var classRef = this;
		if ( this.isMapReady){
			var ne = classRef.get('map').getBounds().getNorthEast();
			var sw = classRef.get('map').getBounds().getSouthWest();
			var templng = [sw.lng() , ne.lng()].sort( function(a,b){ return a-b;} ) ;
			var span = Math.min( ((templng[1]-templng[0]) / 2) , maxspan );
			
			templng = [ templng[0] - coeff * span, templng[1] + coeff * span ];
			var templat = [sw.lat() , ne.lat()].sort( function(a,b){ return a-b;}) ;
			span = Math.min (  (templat[1]-templat[0])/2 ,maxspan   );
			
			templat = [ templat[0] -coeff * span , templat[1] + coeff * span  ];
			templng = templng.concat(templat);
			//console.log([sw.lng(), ne.lng(), sw.lat(), ne.lat() ]);
			return templng ;
		} else {
			alert("map not ready");
			return null;
		}
	},
	
	mapStart :function() {
		console.log("mapStart()");	
		
		this.set('map',  new google.maps.Map(  $('#map-div')[0],this.get('map_options') )); 
		this.trigger("mapStarted"); 
	},
	initialize : function () {
		console.log("init() of MAP_CU");
	}
	
});
EasySubOrg.MAP.cu_01 = new MAP_CU();

/*
  This is the MAP_RENDER class of this map

*/
var MAP_RENDER = Backbone.Model.extend({
	//model: EasySubOrg.MAP.cu_01  // this will be put in at instancialization
	defaults:{
		model :EasySubOrg.MAP.cu_01,
		marker_array : [],
		ride_marker_array:[],
		is_ori_added:false
	},
	
	templateMarkerInfo : function(){}, // function placeholder
	templateRouteInfo  : function(){},    // template function placehoder
	clearMapAddons :function () {  //EasySubOrg.MAP.render_01.clearMapAddons
		this.set("is_ori_added", false);
		var map = this.get('model').get('map');
		console.log( " MAP_RENDER clearMapAddons");
		if (map.data){
			map.data.forEach(  function(feature)  {
				map.data.remove(feature);
			});
		}
		this.deleteMarkers();
		map.data.loadGeoJson("js/custom_routes.json");
	},
	
	setMarkersMap : function( map) {
		this.get('marker_array').forEach( function ( marker, index, ar) {
			marker.setMap(  map);
		});
		this.get('ride_marker_array').forEach( function ( marker, index, ar) {
			marker.setMap(  map);
		});
		
	},
	
	deleteMarkers : function () {
		this.setMarkersMap(null);
		this.set('marker_array' , []);
		this.set('ride_marker_array' , []);
	},
	addNextOriDes :function( latLng) {
		if (!this.get('is_ori_added')){
			this.addMarker(latLng, 4,null,null,null,true);
			this.set('is_ori_added', true);
		}
		else {
			this.addMarker(latLng, 5,null,null,null,true);
			this.set('is_ori_added', false)	
		}
	},
	addMarker : function(location, cat, url_str, memo, id, draggable) {   //EasySubOrg.MAP.render_01.addMarker(location, cat, url_str, memo, id, draggable);  
		ClassRef = this;
		if (typeof(draggable) === 'undefined'){ draggable = false;}
		cat = parseInt(cat);
		var marker = new google.maps.Marker({  // this initialization will "factually", graphically add one marker on map 
			position: location,
			map:EasySubOrg.MAP.cu_01.get('map'),
			draggable:draggable,
			animation: google.maps.Animation.DROP
		});
		//alert("addMarker: " + map_cs);
		//this.get('marker_array').push(marker);
		var the_marker_array = this.get('marker_array');
		
		switch(cat) {
			case 1:  // default icon
					this.get('marker_array').push(marker);
					var temp_infowindow = new google.maps.InfoWindow({content:  
						ClassRef.templateMarkerInfo( {"source":url_str, "memo":memo,"id":id,"index": the_marker_array.length-1  } )
					});
					google.maps.event.addListener(marker, 'click', function() { temp_infowindow.open(EasySubOrg.MAP.cu_01.get("map"), marker); }); 
					break;
			case 2:
					this.get('marker_array').push(marker);
					var temp_infowindow = new google.maps.InfoWindow({content:  
						this.templateMarkerInfo( {"source":url_str, "memo":memo,"id":id,"index": the_marker_array.length-1  } )
					});
					google.maps.event.addListener(marker, 'click', function() { temp_infowindow.open(EasySubOrg.MAP.cu_01.get("map"), marker); } ); 
					var image = 'images/icon2.png';
					marker.setIcon(image);
					break
			case 3:  // need to change here
					this.get('marker_array').push(marker);
					var temp_infowindow = new google.maps.InfoWindow({content:  
						this.templateMarkerInfo( {"source":url_str, "memo":memo,"id":id,"index": the_marker_array.length-1  } )
					});
					google.maps.event.addListener(marker, 'click', function() { temp_infowindow.open(EasySubOrg.MAP.cu_01.get("map"), marker); } ); 
					var image = 'images/icon3.png';
					marker.setIcon(image);
					break
			case 4:
					if ( this.get('ride_marker_array')[0] != null ) { this.get('ride_marker_array')[0].setMap(null); this.get('ride_marker_array')[0] =null;  }
					this.get('ride_marker_array')[0]=marker;
					var image = 'images/origin.png';	
					marker.setIcon(image);
					break;
			case 5:
					if ( this.get('ride_marker_array')[1] != null ) { this.get('ride_marker_array')[1].setMap(null); this.get('ride_marker_array')[1] =null;  }
					this.get('ride_marker_array')[1]=marker;
					var image = 'images/destination.png';	
					marker.setIcon(image);
					break;
			case 6:
					if (this.get('ride_marker_array') <2) {  alert(  "add waypoint when total travel marker number less than 2, needs debug"); }
					this.get('ride_marker_array').push(marker);
					var image = 'images/waypoint.png';	
					marker.setIcon(image);
					break		
					
			default:
					console.log("encountered default,  check cat" + cat);
					break;
		}  // end of switch(cat)
	}, // end of addMarker
	
	/*set ride entry outdated*/
	rideSetStatus:function(  id, status_num){
		this.get('model').set('to_be_set_expired_ride', id);  //this => EasySubOrg.comm_unit.getAfterSettingExpired
	},
	
	/*set rental entry outdated*/    ////EasySubOrg.MAP.render_01.set_status()
	set_status : function (id, status_num, entry) {
    // id is mongoDB 24 char _id now  id is string now
		this.get('model').set('to_be_set_expired', id); // this action => EasySubOrg.comm_unit.getAfterSettingExpired
		this.get('marker_array')[entry].setMap(null);  // This one is For VISION control
	},
	
	updateSetting : function (){
		var map = this.get('model').get('map');
		if (EasySubOrg.MAP.cu_01.get('work_mode') == "default") {
			//this.setDefault();
			console.log("MAP RENDER updateSetting: default-mode");
			map.data.forEach(  function(feature)  {   // remove all
				map.data.remove(feature);
			});
			map.data.loadGeoJson(  this.get('model').get('data_layer_bus_routes')    );  // addFeature // data_layer_url can be found at 
			this.deleteMarkers();

			$('#travel-control-panel').hide();
			//this.setMarkersMap (null); Originally this line is used to clear Markers of traval control			
			
		}
		else if (EasySubOrg.MAP.cu_01.get('work_mode') == "travel-mode") {
			//this.setTravel();
			console.log("MAP RENDER updateSetting: travel-mode");
			//###this.resetGetArray(); ###this is not needed due to relation with regs of RIDE CONTROL UNIT
			EasySubOrg.RIDE.cu_01.resetGetArray();
			map.data.forEach( function(feature)  {
				map.data.remove(feature);
			});
			this.deleteMarkers();
			map.data.loadGeoJson("js/custom_routes.json");  // get the placeholder data geometry for newly generated route
			mapcc1.adaptiveSetFeature();	  // this one will be updated
			$('#travel-control-panel').show();
			//document.getElementById('travel-control-panel').display = "block"; // in renting/leasing mode, display property is set to "none"
			console.log( " set travel finished");
					
		}			
	},
	
	//EasySubOrg.MAP.render_01.display_overview_path
	display_overview_path : function() {  // this should be moved to es_mapinteraction, improve code reusing
		console.log(" entered MAP RENDER path displaying function");
		var RIDE_cu_01 = EasySubOrg.RIDE.cu_01; // EasySubOrg.RIDE.cu_01.get('_overview_path')
		var temp_length =  EasySubOrg.RIDE.cu_01.get('_overview_path').length;
		console.log("_polyline to be converted into : "+ EasySubOrg.RIDE.cu_01.get('_overview_polyline') );
		var newLineString = new google.maps.Data.LineString( google.maps.geometry.encoding.decodePath(  EasySubOrg.RIDE.cu_01.get('_overview_polyline') ) ); 
		console.log("getType(): "+newLineString.getType() + "   getLength()" + newLineString.getLength());
		EasySubOrg.MAP.cu_01.get('map').data.getFeatureById(38).setGeometry( newLineString ); // work-around, mainly by substituting the "geometry" of "Data", the specific id is 38
		console.log("In display_overview_path(), successfully decoded the encoded polyline");
		this.addMarker(newLineString.getAt(0),4 , null,null,null,true );
		this.addMarker(newLineString.getAt(temp_length-1),5, null,null,null,true);
	},
	/* data sample
[{"_id":"556a5ec57ca147a019edc654","lat":30.65526502275242,"lng":-96.27568244934082,"beds":2,"baths":1.5,"price_single":null,"price_total":550,"cat":1,"post_date":"2015-05-31T01:07:17.000Z","isexpired":false,"community":"Campus view","source":"","memo":"test memo 0806","addr":"street","__v":0}]*/

	renderRentalResults : function () {  //once the model has change at rental_search_result, this will be called
		//just a placeholder
		if( !this.get('model').isMapReady()){
			console.log("WARN: entered EasySubOrg.MAP.render_01.renderRentalResults() when map is NOT ready ");
		}
		var ClassRef = this;
		ClassRef.deleteMarkers(); //clear previous marker for next rendering
		
		var temp_result_array = this.get('model').get('rental_search_result');
		//console.log( temp_result_array[0]);
		
		if (temp_result_array.length > 0 ) {
			//console.log("entered renderRentalResults and valid map data ready:" + JSON.stringify(temp_result_array));
			temp_result_array.forEach( function ( one_entry, index, ar){
				//console.log( JSON.stringify(one_entry) );
				var temp_latLng = new google.maps.LatLng(one_entry["lat"], one_entry["lng"]);
				//addMarker : function(location, cat,              url_str,             memo,              id,               draggable)
				ClassRef.addMarker( temp_latLng, one_entry["cat"], one_entry["source"], one_entry["memo"], one_entry["_id"], false  );	
			});		
		}
	},
	
	/*
	* EasySubOrg.MAP.render_01.renderRideResults()
	* This function listens to change:travel_search_result, once there yields valid results, this function will be called
	*/
	renderRideResults: function(){
		this.clearMapAddons();
		mapcc1.reset() ;
		var search_result = mapcc1._proparray = this.get('model').get("travel_search_result");
		var beta = document.getElementById("checkbox-adv-routing").checked;
		//mapcc1._proparray = EasySubOrg.MAP.cu_01.get('travel_search_result'); 
		if (search_result && !beta){
			for ( key in search_result ) {  // considering 0 length situation??
				//to be implemented   assoicative array now array1[i] = [id, cat, origin, destiny, source, memo, jsonlatlngs, encoded_polyline]
				mapcc1.createFeature(search_result[key ]); 
			}	
			
		}	else if (search_result  && beta) {
				console.log("renderRideResults: using beta mode" );
				mapcc1.buildGraph( );
				routes = mapcc1.formroutes();
				console.log(routes);
				//possibility need to clean previous feature
				routes.forEach(   function (value, index, array){
					mapcc1.createFeature(value);	
				});	
		}
		mapcc1.adaptiveSetFeature();
	},
	
	/*
	* EasySubOrg.MAP.render_01.mapAdaptiveRender( workMode)
	*/
	mapAdaptiveRender : function(  work_mode){
		console.log("entered  EasySubOrg.MAP.render_01.mapAdaptiveRender( work_mode)");
		if (work_mode == 'default'){
			this.renderRentalResults();
		}
	},
	
	initialize :function () {
		console.log("init() of MAP_RENDER");
		this.listenTo( this.get('model'), 'change:travel_search_result', this.renderRideResults);	
		this.listenTo( this.get('model'), 'change:rental_search_result', this.renderRentalResults);	
		this.listenTo( this.get('model'), 'change:work_mode', this.updateSetting );
		this.listenTo( this.get('model'), 'mapStarted', function(){   //this part is to realize sharable URL 
			this.mapAdaptiveRender( this.get('model').get('work_mode') );
		});	
	}	
	
});  // end of MAP_RENDER() class definition
EasySubOrg.MAP.render_01 = new MAP_RENDER( ); // model has been put in


function mapInitialize () {
	EasySubOrg.MAP.render_01.templateMarkerInfo = _.template( $('#marker-infowindow-template').html() );//temp_template;
	EasySubOrg.MAP.render_01.templateRouteInfo  = _.template( $('#route-infowindow-template').html() ); // making template function
	var cu_01 = EasySubOrg.MAP.cu_01;
	cu_01.mapStart();// I move mapStart() to es_page_interaction.js
	temp_map = cu_01.get("map"); // this method must be run after page loaded
	cu_01.set('rclk_menu_overlay' , new OverLayMenu ( {model:EasySubOrg.MENU.reg})  );  //require es_MMoverlay.js 
	//EasySubOrg.MENU.overlay_menu_01 = new OverLayMenu ( {model:EasySubOrg.MENU.reg});
	
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
	
	/*use right click on map*/
	var listener_map_right_click  = google.maps.event.addListener(temp_map, 'rightclick', function(event) {  //rclk_menu_overlay

		//if (cu_01.get("work_mode") == "default"){
			//cu_01.get('rclk_menu_overlay').draw2(event.latLng); 
			//cu_01.get('rclk_menu_overlay').toggleOn(event.latLng);
		//}
		//else if (cu_01.get("work_mode") == "travel-mode") {
			cu_01.get('rclk_menu_overlay').toggleOn(event.latLng);
			//EasySubOrg.MAP.render_01.addNextOriDes (event.latLng);
		//}
	});
	var listener_map_click = google.maps.event.addListener(temp_map, 'click', function(event) {
		//alert("lclk"); // for debug
		cu_01.get('rclk_menu_overlay').toggleOff(event.latLng);	
	});
	
  // [START snippet-load]
  // Load GeoJSON.

  temp_map.data.loadGeoJson(cu_01.get("data_layer_bus_routes") );  //'js/bus_routes.json'
  // [END snippet-load]
 
  // [START snippet-style]
  // Set the stroke width, and fill color for each polygon
	
	temp_map.data.setStyle(function(feature) {
		return ({                                   ///@type {google.maps.Data.StyleOptions} 
		strokeColor: feature.getProperty('strokeColor'),
		strokeWeight: 6,
		strokeOpacity:0.5
		});
	}); 
  // [END snippet-style]	
	var listener_data_click = temp_map.data.addListener('click', function(event) {
		console.log("left clicked on data  heared");
		//document.getElementById('txtHint').innerHTML = 
		$('#txtHint').html( event.feature.getProperty('name')  + " is left clicked");
		var tempstr = null;
		
		if (event.feature.getProperty('catagory') != null) {  //use this to determine whether this feature is one already-gen data, or to be gen
			var idarray = event.feature.getProperty('idarray');
			//alert(idarray);
			tempstr = mapcc1.extractInformation(idarray) ;
			if (!tempstr) alert("dashibuhao");
		}
		console.log([event.latLng, tempstr])
		EasySubOrg.RIDE.cu_01.confirmRoute( event.latLng, tempstr);
	});

	var listener_data_right_click = temp_map.data.addListener('rightclick', function(event) {
		console.log("right clicked heared");	
		$('#txtHint').html(event.feature.getProperty('name') + " is right clicked"  );
		if ( event.feature.getProperty('route_class') != "college_shuttle"){
			console.log(event.feature.getProperty("route_class"));
			console.log( " I am clicking non school shuttle data feature");
			EasySubOrg.MAP.render_01.addMarker(event.latLng,6, null,null,null,true);  //function(location, cat, url_str, memo, id, draggable)
		}
	});	


	/*tb plase*/
	debug = false;
	if (debug){    //test code
		var A1 = new google.maps.LatLng(30.03497,-95.84750000000001);
		var A2 = new google.maps.LatLng(30.034390000000002,-95.84621000000001);
	
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
																																				
		var B1  = new google.maps.LatLng(30.036030000000004,-95.85034);
		var B2  = new google.maps.LatLng(30.03421,-95.84587 );
		
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
		console.log("########: Seg1 dir:" + Math.round(seg1.dir).toString() + " distance to origin:" + seg1.dist.toString() + " cat:" + seg1.segCat);
		
		seg2 = new SegmentNode (B1,B2, 39 );
		console.log("segment 2:   " +seg2.hashcode());
		console.log("########: Seg2 dir:" +Math.round(seg2.dir).toString() + " distance to origin:" + seg2.dist.toString() + " cat:"+seg2.segCat);
	
	
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
} // end of mapInitialize()
google.maps.event.addDomListener(window, 'load', mapInitialize);   ///initialize is the last one to be executed




///////////////////////////////////


origin = new google.maps.LatLng(0,0);

//constructor of this MapNode
//constructor of this MapNode
//constructor of this MapNode

function SegmentNode ( latLngA, latLngB, occupier_id) {
	if (typeof (latLngA) === 'undefined'  ||typeof (latLngB) === 'undefined' ) {throw new Error("Something went badly wrong!, ksdw 120"); }
	this.latLngA = latLngA;
	this.latLngB = latLngB;
	this.segCat = 0;  //will be updated
	geoLength = this.getGeoLength(this.latLngA, this.latLngB );
	this.geoLength = geoLength;
	this.segCat =  (this.geoLength >0.004)?3:2;
	this.segCat =  (this.geoLength <0.002)?1:2;
	if (this.geoLength > 0.004) this.segCat = 3;
	else if (this.geoLength >= 0.002 && this.geoLength <= 0.004) this.segCat =2;
	else this.segCat = 1;
	//this.previous_node_key = null;
	var latA = latLngA.lat() ; var lngA = latLngA.lng() ;
	var latB = latLngB.lat(); var lngB = latLngB.lng() ;
	//console.log("construct latlngs: "+[latA, lngA, latB, lngB].toString());
	/* infinity has been considered*/
	this.k =   ( latB- latA )/ ( lngB - lngA) ; 

	this.dir = (Math.atan(this.k))/0.01745329252;
	this.rounded_dir = Math.round( this.dir  );
	this.b=  (latB  - this.k *  lngB) ;
	
	this.dist = null;
	this.centerDist = null;
	this.distanceToOrigin( this.segCat ); // will update this.dist 
	this.occupiers = [occupier_id];
	this.nextNode = null;
	
	
	tempBounds = this.buildBounds(this.dir);
	this.bounds = tempBounds;
	this.id = occupier_id;  // serves as identification number of this seg, the most original occupier
	this.originhashcode = mapcc1.getHashCode (occupier_id, latA, lngA, latB, lngB);
}

SegmentNode.prototype.getGeoLength = function( latLngA, latLngB) {
	var x_1 =  latLngA.lng() - latLngB.lng() ;
	var y_1 = latLngA.lat() - latLngB.lat() ;
	//console.log( "this is " + this.segCat + " segCat");
	return ( Math.sqrt( x_1 * x_1 + y_1 * y_1));	
} 

SegmentNode.prototype.toOrigin = function( latLng){
	var temp = this.getGeoLength(latLng, origin);
	temp = parseInt(temp.toString().split('.')[1].slice(0,5));
	return Math.round(  temp / 30);
}

SegmentNode.prototype.distanceToOrigin = function( segCat ) {
	var sgHREF =this;
	if (typeof(segCat) == 'undefined') alert( " check input of distanceToOrigin");
		if  (this.dir > 89) { this.dist = Math.round(  this.latLngA.lng());}
		else if (this.k == 0) {this.dist = Math.round(  this.b);}  // parallel situation
		else {
			var x_1 = (-this.b ) / (this.k + 1/this.k);
			var y_1 = this.k * x_1 + this.b;
			this.dist = Math.round( Math.sqrt( x_1 * x_1 + y_1 * y_1));
			
		}
		if (segCat == 1 || segCat == 2)  {
		mid_lat = (this.latLngA.lat() + this.latLngB.lat()	) * 0.5;
		mid_lng = (this.latLngA.lng() + this.latLngB.lng()	) * 0.5;
		temp_dist = Math.sqrt(mid_lat * mid_lat + mid_lng * mid_lng );
		this.centerDist = parseInt(temp_dist.toString().split('.')[1].slice(0,5));
		this.centerDist = Math.round(  this.centerDist / 30);
		//console.log(this.centerDist  );
		}
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
/*
* This function actually only checks whther 
*/
SegmentNode.prototype.isAlignWith = function (incomingNode) {
	//console.log(this.dir.toString() + "  " + incomingNode.dir.toString() );
	//console.log([this.dist, incomingNode.dist] );
	//console.log("entered isAlignWith");
	var trace = false;
	var anglebtw = (incomingNode.segCat >=3  && this.segCat >= 3)? 5:15;  // only when long compare to long, use this
	if ( incomingNode.latLngA.lat() == 29.94029|| this.latLngA.lat() == 29.94029) { 
	  console.log( "  isAlignWith() found trace target: "+this.hashcode() +"  " + incomingNode.hashcode())
		trace = true;
	}
	if ( this.id == incomingNode.id) {
		if (trace) {
					console.log("  isAlignWith() false becouse on same route");
					console.log(  this.hashcode() +"   "+ incomingNode.hashcode()  ); 
				}
		return false;	
	}
	//if (Math.abs((this.dir - incomingNode.dir)) < 3  && (this.dist > 0.5 * incomingNode.dist) && (this.dist < 1.5 * incomingNode.dist) ) {
	if (Math.abs(( (this.dir * incomingNode.dir > 0  )? Math.abs(this.dir - incomingNode.dir) : Math.abs(this.dir + incomingNode.dir))) < anglebtw ) {
		if (  incomingNode.inItsBounds(this.latLngA) || incomingNode.inItsBounds(this.latLngB)  
		|| this.inItsBounds(incomingNode.latLngB) ||  this.inItsBounds(incomingNode.latLngA)){
				if (trace) {
					console.log( this.occupiers);
					console.log( incomingNode.occupiers);
					console.log("  isAlignWith() true:  overlapping 1nd  " + this.hashcode() + " " +incomingNode.hashcode() );
				}
			return true;
		}
		else {
			//console.log("");
			if (trace) {
					console.log("  isAlignWith() false:   did not pass 2nd condition (do not have overlapping components)");
					//console.log(  this.hashcode()); console.log(incomingNode.hashcode());	
			}
			return false;
		}
	}
	else { 
		//console.log("didn not pass first condition");
		if (trace) {
			console.log("  isAlignWith() false:  didn not pass first condition due to big angle difference");
			console.log( [this.dir,incomingNode.dir ]);
		}
		return false;
	}
}
// so too small segnment cannot dominate big ones, comparable line segments having enough overlapping length can dom each other
// one line segments completely in another segment, this will be dominated by that big one
SegmentNode.prototype.dominatedBy = function ( incomingNode) {  // shut down this feature
	//based on the condition that these two nodes are alinged
	dominant_threshold = (incomingNode.segCat >= 3  && this.setCat >= 3) ? 0.35:0.01;
	if ( typeof(incomingNode) ==='undefined') alert( "error at line 219");
	var isDominated = false
	if (  this.inItsBounds(incomingNode.latLngA )==false &&   this.inItsBounds(incomingNode.latLngB ) == false ) {  // this seg completely in another one's seg
		return true;
	}
	cankao1 = this.inItsBounds(incomingNode.latLngA) ?  incomingNode.latLngA:incomingNode.latLngB;
	cankao2 = (incomingNode.inItsBounds( this.latLngA) && cankao1.lat() != this.latLngA.lat()) ? this.latLngA : this.latLngB;
	if (this.getGeoLength( cankao1, cankao2) > dominant_threshold * this.geoLength)  // overlapping length larger than 35% of total length of this line segment
	return true;
	else {
		//console.log("overlapping length not enough: domination failure");
		return false;
	}  
} 

SegmentNode.prototype.shareWith = function(  incomingNode) {
	debug = false;
	target = 30.68382;
	if ( this.latLngA.lat() ==target || incomingNode.latLngA.lat() == target ){
		debug = true;
		console.log( "entered shareWith:" + " " + this.hashcode() + " checkshareWith: " + incomingNode.hashcode());	
	}
	if (this.dominatedBy(incomingNode)) {
		this.occupiers = this.occupiers.concat(incomingNode.occupiers);
		//console.log(this.occupiers.toString() + " ksdw188");
		this.occupiers = arrayUnique(this.occupiers.sort( ) );  // sort according to char 
		//console.log(this.occupiers.toString() + " ksdw190");
		if (debug) { console.log(  "after dominating, this dominated by that: this.occupiers: " + this.occupiers);}
	}
	if ( incomingNode.dominatedBy (this)) {
		incomingNode.occupiers = incomingNode.occupiers.concat(this.occupiers);
		//console.log(this.occupiers.toString() + " ksdw188");
		incomingNode.occupiers = arrayUnique(incomingNode.occupiers.sort(  ) );
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

/*
* Sample code provided by MDN
*/
MapCommonCalc.prototype.encodeRFC5987ValueChars  = function(str) {
    return encodeURIComponent(str).
        // Note that although RFC3986 reserves "!", RFC5987 does not,
        // so we do not need to escape it
        replace(/['()]/g, escape). // i.e., %27 %28 %29
        replace(/\*/g, '%2A').
            // The following are not required for percent-encoding per RFC5987, 
            // so we can allow for a little better readability over the wire: |`^
            replace(/%(?:7C|60|5E)/g, unescape);
}
MapCommonCalc.prototype.checkVariableTillValid = function( variable, maxCount,count) {
	//if (variable == null || typeof(variable) === 'undefined') return false
	//else return true;	
	mapccHref = this;
	if (count >= maxCount) { console.log("check variable time out:");return false;}
	else if(variable == null || typeof(variable) === 'undefined') {
		count = count + 1;
		window.setTimeout( function(){mapccHref.checkVariableTillValid(variable, maxCount, count);}, 100); /* this checks the flag every 100 milliseconds*/
	} else {
		return true;
	}
}
MapCommonCalc.prototype.gup = function( name, url ) {
  if (!url) url = location.href
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}
//gup('q', 'hxxp://example.com/?q=abc')

MapCommonCalc.prototype.reset = function() {
	this._proparray = [];
	this.long_Node_Hashmap = [];  // this one actually contains all the information of the directed graph
	this.headNodeArray =[];  //
	this.short_Node_Hashmap = []; 
	this._V = 0;
}

// updated 05/31 compatible to mongoose api   "id" should be 24 char string
MapCommonCalc.prototype.extractInformation = function ( id_array) {
	//id_array: ["556ab2608ca417281ea8c4c"]
	if (typeof (id_array) =='undefined' || id_array.length == 0 || id_array == null) alert(  "problem in extractInformation");
	tempstr = "";
	oneentry = ""
	for (var i = 0 ; i < id_array.length ; i ++) {
		var info_prop = this._proparray[id_array[i]];
		var origin = info_prop['origin'] ;
		var destiny =info_prop['destiny']; 
		var id = id_array[i];
		console.log(id);
		var latLngs = this.decodedPath(info_prop['encoded_polyline']);
		var origin_latLng = latLngs[0];              //getGeometry should return lineString: geoMetry
		var destiny_latLng = latLngs[latLngs.length-1];
		
		if (id_array.length  == 1) {
			console.log(  "duzhan qing kuang" );
			EasySubOrg.MAP.render_01.addMarker(origin_latLng, 4)  ;
			EasySubOrg.MAP.render_01.addMarker(destiny_latLng, 5) ;
		}
		//following all code for info window
		
		fromTo =  ("FROM: "+origin + " TO " + destiny);
		var temp =  (info_prop['cat']==1)?"PROVIDED" : "NEEDED";
		tempstr = "one ride:" + fromTo.concat()+" is "+temp.concat();
		tempstr = "<p style = \"font-weight:normal;\">" + tempstr + "<br>" + "memo: " +info_prop['memo'] + "<br>"+"Departure date: "+  info_prop['depart_date'] +"<br>click to check <a  target=\"_blank\" href = \""+info_prop['source'] +"\">source</a><br><span  onclick = \"travel_set_status( '"+id.toString()+"' , true);\" onmouseover = \"changecolor(this);\" onmouseout=\"backcolor(this);\">mark it as outdated</span>"+"</p>";
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
	var cat = 0;
	var mapccHref = this;
	for (var i=0; i< ids.length; i++) {
		cat = cat + 	parseInt(mapccHref._proparray[ids[i]]['cat']);
	}


	cat = Math.round( cat / ids.length );
	if (cat <1 || cat >3) console.log("ksdw334"+cat);
	var latLngs = [];
	segnodes.forEach( function (node, index, array) {
		if (index ==0) {
			//console.log( segnodes);
			latLngs.push( node.latLngA);	
		}	
		latLngs.push( node.latLngB);	
	});	
	var one_prop_array = [ ];
	one_prop_array['idarray'] = ids;
	one_prop_array['cat'] = cat; // for test
	one_prop_array['encoded_polyline'] = "void";
	one_prop_array['stroke-width'] = ids.length *2;
	one_prop_array['stroke-opacity']  = 0.5;
	
	one_prop_array['latlngs'] = latLngs;
	//console.log("result pf assemble()"+ JSON.stringify(one_prop_array['latlngs']) );
	return one_prop_array;
	
}


/*
*  Search alonge one subroute, and return all the latlngs along this route
*/
MapCommonCalc.prototype.formroutes  = function( ) {
	var MapCCHref = this;
	var rendered_subroute = [];
	var segNodes = [];
	var assembled = [];
	var current_occupiers_string = "";
	console.log("number of heads: "+MapCCHref.headNodeArray.length ); 
  MapCCHref.headNodeArray.sort( function (node1, node2) {  var result = node1.occupiers.length - node2.occupiers.length; return -result ; });
	MapCCHref.headNodeArray.forEach( function ( node, index, array) {  // visit from every head node
		// processing one new node, update rendered_subroute at last
		lastend = null;
		var checked_subroutes = [] // store ids to string(), such  "2,3" ,"12,23,32"   // must be pre-sorted string representation of array
		current_occupiers_string = node.occupiers.join(','); // this step, can be optimized
		console.log("MapCommonCalc.prototype.formroutes : MapCCHref.headNodeArray.forEach()");
		var count = 0
		while(node){ 
			//console.log(node.occupiers.toString());
			
			//if (node.nextNode){
			//	console.log( node.occupiers.toString() + " => " + node.nextNode.occupiers.toString()+ " current processing:  " +node.hashcode());
			//}//Look ahead
			
			if( node.nextNode != null && count && node.nextNode.occupiers.join(',') !== current_occupiers_string   ) {
				console.log( "encountered changing ");
				if (node.nextNode.occupiers.join(',').length > current_occupiers_string.length ){  // meetNew situation, combining!&& (  Math.abs(node.dir - node.nextNode.dir) <= 10)
					console.log("this is one combing situation, so add next node");segNodes.push(node);
					lastend = null; // make next subroute not interfered
				}
				else if (node.nextNode.occupiers.join(',').length < current_occupiers_string.length  ) {  
				//meetNew situation, Bifurcation // might containing bug!!  && (  Math.abs(node.dir - node.nextNode.dir) <= 10) 
				//10078,111987   ->  10078,10023: at this situation, the string length indeed shrinked, but number of occupier did not change
					console.log("this is one bifurcation situation, cache this end, which will be added to next subroute");lastend = node;
				} //else 
				else {segNodes.push(node);3==3; console.log( "check 3==3 ");}
				if ( (rendered_subroute.indexOf(current_occupiers_string ) <0) && (segNodes.length != 0 )){  //have not rendered this overlapping
					console.log( "this subroute not rendered yet, push this sub-route one into assembled, current_occupiers_string  : " +current_occupiers_string );
					assembled.push(MapCCHref.assemble ( segNodes ,current_occupiers_string)); // the assembled cotains { id: " ", latlngs:[ ...], }
				}
					//there if belongs to those rendered, just let it go		
						//if ( node.nextNode){
					checked_subroutes.push(current_occupiers_string  );
					current_occupiers_string = node.nextNode.occupiers.join(',');
					
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
	var threshold_dir_change = 2;
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
	if (typeof (inHashMap[i]) !== 'undefined'  ){  // this layer is open
		if (typeof (inHashMap[i][j]) !== 'undefined'   ) {  // this layer is also open
			return false;	  // means this one already occupied, need to compare now!
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

MapCommonCalc.prototype.disperseShortHashMap = function (segNode, centerDist) {
	targe1= 30.03497;
	target2 = 30.036030000000004;

	var centerToDistanceMax = 8;
	var approx_dir = Math.round(segNode.dir / 10 );
	var checked_nodes = [];	
	if ( segNode.latLngA.lat() == target1  || segNode.latLngA.lat() == target2  ) {
		debug = true;
		console.log( "and the beginning of running disperseShortHashMap for target: " + segNode.hashcode() );	
		console.log(  segNode.occupiers);
		console.log( [approx_dir, centerDist]);
		console.log(  "segCat: " + segNode.segCat);
		debug =false
	}
	
		for ( var i = centerDist  -  centerToDistanceMax/2; i <= centerDist +centerToDistanceMax/2 ; i ++) { // one special representation of center node to origin
			i_corrected = i;

			for (var j = approx_dir -1; j <= approx_dir +1; j ++) {    //-9  9
				//console.log([i,j]);
				corrected_j = j;
				if ( j <-9) {corrected_j = corrected_j + 18 ;}  // xunhuan
				else if ( j >9) { corrected_j = corrected_j - 18 ;  }  // xunhuan
				if (this.checkAndOpen(i_corrected,corrected_j, this.short_Node_Hashmap)) { 
						this.short_Node_Hashmap[i_corrected][corrected_j].push(segNode);	
				}		
				else {  // someone came here first situation 
					//console.log("else");
					for (var k = 0; k <this.short_Node_Hashmap[i_corrected][corrected_j].length; k ++ ){
						if ( checked_nodes.indexOf( this.short_Node_Hashmap[i_corrected][corrected_j][k] ) >= 0 ) {
							continue;						
						}
						else{   // not checked nodes
							if (this.short_Node_Hashmap[i_corrected][corrected_j][k].isAlignWith(segNode) ){
								this.short_Node_Hashmap[i_corrected][corrected_j][k].shareWith (segNode)
							}
							checked_nodes.push( this.short_Node_Hashmap[i_corrected][corrected_j][k] );
						}
					}
					this.short_Node_Hashmap[i_corrected][corrected_j].push(segNode); // eventually, put the segNode into this virtual 2D array
				}// someone came here first situation : else 
			}	// for loop of j
		}//for loop of i
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
	// for short nodes:
	centerToDistanceMax = 8; // this one must be even
	target1 = 30.03497
	target2 = 30.036030000000004;
	debug = false;
	if ( segNode.latLngA.lat() == target1  || segNode.latLngA.lat() == target2  ) {
		debug = true;
		console.log( "and the beginning of running disperseExistenceOf for target: " + segNode.hashcode() );	
		console.log(  segNode.occupiers);
		console.log( [rounded_dir, dist]);
		console.log(  "segCat: " + segNode.segCat);
		console.log(  "centerToOrigin: " + segNode.centerDist);
	}
	
	if ( segNode.segCat >2 ) { // put long in short
	 	this.disperseShortHashMap(  segNode,segNode.toOrigin(segNode.latLngA) );
		this.disperseShortHashMap(  segNode,segNode.toOrigin(segNode.latLngB) );	
	}

	if (segNode.segCat >=2) {
		if (debug) {
		 console.log( "long hash encounteres target"); 
		}
		for ( var i = rounded_dir -2; i <= rounded_dir +2 ; i ++) {
			i_corrected = i;
			if (i < -90) i_corrected = i+180;  // go beyond bounds, let it return
			else if (i >90) i_corrected = i-180;
			for (var j = dist -3; j <= dist +3; j ++) {
				//console.log([i,j]);
				if (this.checkAndOpen(i_corrected,j, this.long_Node_Hashmap)) { 
						this.long_Node_Hashmap[i_corrected][j].push(segNode);	
				}		
				else {  // someone came here first 
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
	}
	if (segNode.segCat <=2){ //zhege qi zuo yong le//
	 if (debug) {
		 console.log( "short hash encounteres target"); 
		 console.log("########: Seg approxi dir:" +Math.round(segNode.dir/10).toString() + " distance to origin:" + segNode.centerDist.toString() + " cat:"+segNode.segCat);
		}
	 var centerDist = segNode.centerDist 
	 var approx_dir = Math.round(segNode.dir / 10 );
		for ( var i = centerDist  -  centerToDistanceMax/2; i <= centerDist +centerToDistanceMax/2 ; i ++) { // one special representation of center node to origin
			i_corrected = i;

			for (var j = approx_dir -1; j <= approx_dir +1; j ++) {    //-9  9
				//console.log([i,j]);
				corrected_j = j;
				if ( j <-9) {corrected_j = corrected_j + 18 ;}  // xunhuan
				else if ( j >9) { corrected_j = corrected_j - 18 ;  }  // xunhuan
				if (this.checkAndOpen(i_corrected,corrected_j, this.short_Node_Hashmap)) { 
						this.short_Node_Hashmap[i_corrected][corrected_j].push(segNode);	
				}		
				else {  // someone came here first situation 
					//console.log("else");
					for (var k = 0; k <this.short_Node_Hashmap[i_corrected][corrected_j].length; k ++ ){
						if ( checked_nodes.indexOf( this.short_Node_Hashmap[i_corrected][corrected_j][k] ) >= 0 ) {
							continue;						
						}
						else{   // not checked nodes
							if (this.short_Node_Hashmap[i_corrected][corrected_j][k].isAlignWith(segNode) ){
								this.short_Node_Hashmap[i_corrected][corrected_j][k].shareWith (segNode)
							}
							checked_nodes.push( this.short_Node_Hashmap[i_corrected][corrected_j][k] );
						}
					}
					this.short_Node_Hashmap[i_corrected][corrected_j].push(segNode); // eventually, put the segNode into this virtual 2D array
				}// someone came here first situation : else 
			}	// for loop of j
		}//for loop of i
	}  // end of segCat condition
	if ( debug ) {
		debug =false;
		console.log( "and the end of running disperseExistenceOf for target: " + segNode.hashcode() );	
		console.log(  segNode.occupiers);
		console.log( [rounded_dir, dist]);
		console.log(  "segCat: " + segNode.segCat);
		console.log("\n");
	}
}

/**
* Build directed graph for DFS
* 
* 
**/
MapCommonCalc.prototype.buildGraph = function (  ) {
	// featureOptions is an array of featureOption	
	//one FeatureOption includes{ properties, id, and geometry} 
	
	console.log ("entered buildGraph()"); 
	var MapCCHref = this;
	//console.log( "how many proparray: " + JSON.stringify(this._proparray) );

	if (Object.keys(this._proparray).length == 0 ) {   // 
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
			MapCCHref.disperseExistenceOf(node);	  // this one has bug
		});
	}//iterating all routes
	console.log( "build graph finished");
}// end of buildGraph ()
MapCommonCalc.prototype.getHashCode  =function ( occupiersID, latA, lngA, latB, lngB) {
	return occupiersID +" "+(latA ).toString() + ","+ lngA .toString() + "->" + latB .toString() + ","+  lngB .toString();
}


MapCommonCalc.prototype.createFeature = function(prop_array) {  
	//prop_array = [id, cat, origin, destiny, source, memo, jsonlatlngs, encoded_polyline]
	// at 05/03/2015, I changed prop_array into associative array
	//console.log(prop_array);
	var MapCCHref = this; var debug =false;
	var ne = new google.maps.LatLng(30.364225, -95.965573);
	var sw  = new google.maps.LatLng(30.276502, -96.125561 );
	var debugBounds = new google.maps.LatLngBounds(  sw,ne); 
	var color;
	if (prop_array['cat'] == 1) {color = "#00b3fd";}
	else if (prop_array['cat'] == 2) { color = "#20b543";}
	else if (prop_array['cat'] == 3) { color = "#EB66FD";}
	if ( typeof (prop_array['idarray']) ==='undefined' ) {  prop_array['idarray'] =  [prop_array['_id']];  }
	properties_1 = {
				"idarray":prop_array['idarray'],
				"id":(typeof(prop_array['_id']) == 'undefined')?null:prop_array['_id'],
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

	// prop_array['encoded_polyline'] == 'void' means prop_array sent from beta advanced routing, otherwise, they come from database
	var latlngs = (prop_array['encoded_polyline'] == 'void')?prop_array['latlngs']: this.decodedPath( prop_array['encoded_polyline'] );  
	var newLineString = new google.maps.Data.LineString( latlngs  );
		// for debug
	if (debug) {	
		for (var i = 0; i < latlngs.length ; i ++ ) {
			if (  debugBounds.contains(latlngs[i]  ) ){
				temp = new google.maps.Marker({
					map:map_cs,
					draggable:true,
					animation: google.maps.Animation.DROP,
					position: latlngs[i],
					title:prop_array['id'].toString() + " " + latlngs[i].toString()
				});	
			}
		}
	}// end of if debug
	tbr = {properties:properties_1, id:prop_array['id'], geometry:newLineString};
	EasySubOrg.MAP.cu_01.get('map').data.add(tbr);
}

MapCommonCalc.prototype.adaptiveSetFeature = function(){
		EasySubOrg.MAP.cu_01.get('map').data.setStyle(function(feature) {  // reset styles
		
		if (    feature.getId() != 38){
			if ( typeof(feature.getProperty("idarray")) !=='undefined' ){
				switch (feature.getProperty("idarray").length) {
					case 1:
							stroke_Weight = 6;
							break;
					case 2:
							stroke_Weight = 8;
							break;
					case 3:
							stroke_Weight = 9;
							break;
					case 4:
							stroke_Weight = 10;
							break;
					case 4:
							stroke_Weight = 11;
							break;
					default: 
        			stroke_Weight = 6;
				}
				
				return ({// @type {google.maps.Data.StyleOptions} 
				strokeColor: feature.getProperty("strokeColor"),
				strokeWeight: stroke_Weight,
				strokeOpacity:0.5
				});
			}
			else {  // zhuanmen chu li the to be gen route
				return ({// @type {google.maps.Data.StyleOptions} 
				strokeColor: feature.getProperty("strokeColor"),
				strokeWeight:feature.getProperty("strokeWeight"),
				strokeOpacity:0.4
				});
			}
			
		}
		else {  // processing to be gen route
			console.log( "settting feature of "+feature.getId().toString() +"  " +  feature.getProperty("stroke-color")); // ye mian huan cun dao zhi yi xie wen ti
			return ({// @type {google.maps.Data.StyleOptions} 
			strokeColor: "#00CCFF",
			strokeWeight: 6,
			strokeOpacity:0.7
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
	old_point = EasySubOrg.MAP.cu_01.get('map').getProjection().fromLatLngToPoint(oldLatLng);
	new_point = new google.maps.Point(old_point.x + x_percent * EasySubOrg.MAP.cu_01.get('map').getDiv().width, old_point.y);
	return  EasySubOrg.MAP.cu_01.get('map').getProjection().fromPointToLatLng( new_point); 
}

// focusID: the ID of route being focused
MapCommonCalc.prototype.focusOn = function ( width_ratio, height_ratio, offset_ratio, focusID) {   
	//latLng is google map variable
	//EasySubOrg.MAP.cu_01.get('map') is an important global variable
	var encodedPath = this._proparray[focusID]['encoded_polyline'] ;
	if (encodedPath == "void") {
		alert("old path, is not encoded, unnable to calculate");
		return;	
	}
	//console.log("encoded path :"+encodedPath);
	var latLngAry = this.decodedPath(encodedPath);
	console.log( this.getMidLatLngOf( latLngAry[0], latLngAry[latLngAry.length -1] ).toString() );
	
	centerLatLng =  this.getMidLatLngOf( latLngAry[0], latLngAry[latLngAry.length -1] );
	//centerLatLng = this.shiftLatLng (centerLatLng, 0.375,0);
	var bounds = this.getBounds(latLngAry[0], latLngAry[latLngAry.length -1]);
	var zoom = this.getZoomByBounds(EasySubOrg.MAP.cu_01.get('map'),bounds, width_ratio,height_ratio );
	
	EasySubOrg.MAP.cu_01.get('map').setZoom(zoom);
	EasySubOrg.MAP.cu_01.get('map').panTo (  centerLatLng );	
	EasySubOrg.MAP.cu_01.get('map').panBy(EasySubOrg.MAP.cu_01.get('map').getDiv().offsetWidth * offset_ratio, 0);
	
	EasySubOrg.MAP.render_01.addMarker(latLngAry[0], 4, null, null, null, false);  
	EasySubOrg.MAP.render_01.addMarker(latLngAry[latLngAry.length -1], 5, null, null, null, false);  
	
}

/**
* Returns the zoom level at which the given rectangular region fits in the map view. 
* The zoom level is computed for the currently selected map type. 
* @param {google.maps.Map} map
* @param {google.maps.LatLngBounds} bounds 
* @return {Number} zoom level
**/
MapCommonCalc.prototype.getZoomByBounds = function( map, bounds, actual_width_ratio, actual_height_ratio ){
	
  var MAX_ZOOM = map.mapTypes.get( map.getMapTypeId() ).maxZoom || 21 ;
  var MIN_ZOOM = map.mapTypes.get( map.getMapTypeId() ).minZoom || 0 ;

  var ne= map.getProjection().fromLatLngToPoint( bounds.getNorthEast() );
  var sw= map.getProjection().fromLatLngToPoint( bounds.getSouthWest() ); 

  var worldCoordWidth = Math.abs(ne.x-sw.x);
  var worldCoordHeight = Math.abs(ne.y-sw.y);

  //Fit padding in pixels 
  var FIT_PAD = 40;

  for( var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom ){ 
      if( worldCoordWidth*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).width() * actual_width_ratio && 
          worldCoordHeight*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).height() * actual_height_ratio)
          return zoom;
  }
  return 0;
}
