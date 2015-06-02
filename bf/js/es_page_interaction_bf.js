EasySubOrg.createNS("EasySubOrg.RENTAL");	

// RENTAL FORM CONTROL UNIT, this one basically I did not use
EasySubOrg.RENTAL.rf_cu_01 = new Backbone.Model({
	"lat":   0,
	"lng":   0,
	"community"  : "",
	"address"    : "",
	"url"        : "",
	"totalprice" :0,
	"numbeds"    :0,
	"numbaths"   :0,
	"numcat"     :-1,
	//"memo"       :"" // decide not set memo keyvalue pair, save space
});
	
// RENTAL SEARCH CONTROL UNIT
EasySubOrg.RENTAL.rs_cu_01 = new Backbone.Model({
	"price_high":-1,
	"price_low":-1,
	"num_bed_low":-1,
	"num_bed_high":-1,
	"num_bath_low": -1,
	"num_bath_high": -1,
	"category":-1 , // category is the right spelling
});


$(document).ready( function() {
	EasySubOrg.RENTAL.rf_cu_01.on("change:lat", function () {  console.log(" lat changed");}  );
	
	//console.log(EasySubOrg.RENTAL.rf_cu_01.get('lat')); // passed test
	var RentalFormView = Backbone.View.extend({
		//##this View class has EasySubOrg.RENTAL.rf_cu_01  as model, please remember##
		
		associate_array:  {"li-b10b10":[1,1],"li-b20b10":[2,1],"li-b20b15":[2,1.5],"li-b10b10":[1,1], "li-b20b15":[2,1.5], 
		"li-b20b20":[2,2], "li-b30b20":[3,2],
		"li-b30b30":[3,3], "li-b40b30":[4,3], "li-b40b40":[4,4]  },
		associate_array2: {"li-cat-lease":0,"li-cat-rent":1,"li-cat-activity":2},
		
		//DOM ELEMENT of RENTAL FORM VIEW
		el:'div.rental-form-slot',
		
		updatebb : function ( id) {
			//document.getElementById('num-beds').value = associate_array[string1][0];
			//document.getElementById('num-baths').value = associate_array[string1][1];
			//document.getElementById('btn-captioin-bb').innerHTML = "floor plan: " + document.getElementById(string1).firstChild.innerHTML ;
			this.$('#num-beds').val( this.associate_array[id][0]  );
			this.$('#num-baths').val( this.associate_array[id][1]  );
			this.$('#btn-captioin-bb').html( "floor plan: " + this.$('#'+id).html());//(string1).innerHTML   );
			console.log("RentalFormView.updatebb() verify:" + this.$('#num-baths').val()  );
		},
		
		clearInput : function() {
			$.each( this.$('input'), function (index, dom_element) {
				if (dom_element.id != 'rental-form-submit'){
					dom_element.value= "";	
				}
			});
			this.$('#btn-captioin-bb').html("floorplan");
			this.$('#btn-caption-cat').html("category");
			this.$('#textarea-memo').val("");
		},
		
		requestPostToCommUnit : function() {
			var ClassRef = this;
			console.log( "entered RentalFormView.requestPostToCommUnit()" );
			$.post( "es_form_process.php", $( "#rental-form" ).serialize(),function(){ 
				console.log("successfully loaded data");
				EasySubOrg.MAP.cu_01.get('rclk_menu_overlay').clearTempMarker();
				ClassRef.clearInput();
				EasySubOrg.comm_unit.getForRentalSearch();
			});
			
		},
		
		initialize : function() {
			var ClassRef = this;
			console.log("one instance of RentalFormView init entered");
			var temp_lis = this.$('#ul-floorplan > li');
			$.each( temp_lis, function (index , value) {
				//console.log(temp_lis[index] );	
				temp_lis[index].onclick = function() {
					ClassRef.updatebb(temp_lis[index].id  );
				}
			});
			
			var temp_lis_category = this.$( '#ul-catagory > li' );
			$.each( temp_lis_category, function(index, value){
				temp_lis_category[index].onclick = function ()  {
					EasySubOrg.MAP.cu_01.get('rclk_menu_overlay').updatecat( temp_lis_category[index].id  );
				}	
			} );
			
			this.$('#rental-form-submit').click(function() {
				ClassRef.requestPostToCommUnit();	
			});
			console.log("one instance of RentalFormView init exited"); 
		}
	});   //end of RentalFormView class definition
	
	EasySubOrg.RENTAL.rf_view_01 = new RentalFormView  ( {model:  EasySubOrg.RENTAL.rf_cu_01});
	//console.log( EasySubOrg.RENTAL.rf_view_01.el );
	
	//EasySubOrg.RENTAL  indicate the current name space
	var RentalSearchView = Backbone.View.extend({
		//model:EasySubOrg.RENTAL.rs_cu_01 
		el:'#rental-search-slot',
		updatePrice : function( li_id_string ) {  // li_id_string looks id="301-350"
			//this.resetPrice();
			var price_array = li_id_string.split('-');
			//console.log(price_array);
			this.model.set( { "price_low": parseInt(price_array[0]), "price_high": parseInt(price_array[1])} );
			//console.log( "verify updatePrice() " + this.model.get("price_low") + " " + this.model.get("price_high"));  // verified
		},
		
		resetPrice : function () {
			this.model.set( { "price_low":-1, "price_high":-1} );
			this.$('#price-max-ipt,#price-min-ipt').val("");
			//this.$('#price-min-ipt').val("");
		},
		
		updateBB : function ( li_innerHTML_string) {
			//this.resetBB();
			var BBarray = li_innerHTML_string.split("/");
			this.model.set( { 
				"num_bed_low" : 10 * parseInt(BBarray[0]) ,
				"num_bed_high" : 10 * parseInt(BBarray[0]) ,
			 	"num_bath_low": 10 * BBarray[1], 
				"num_bath_high": 10 * BBarray[1]
			});
			//console.log(  "verify updateBB(): " + this.model.get("num_bed_low") + " " + this.model.get("num_bath_high") );
		},
		
		resetBB :function() {
			console.log("starting reset BB");
			this.model.set( {"num_bed_low":-1, "num_bath_low":-1 ,"num_bed_high":-1, "num_bath_high":-1  } );
			this.$( "#beds-min-ipt , #beds-max-ipt ,#baths-min-ipt ,#baths-max-ipt ").val("");	
		},
		updateCat : function ( cat_number) {
			//var tempcat = this.$('#'+li_id_string).data('data-rs-cat');
			this.model.set("category",cat_number);
			//console.log( "verify updateCat(): " + this.model.get("category"));
		},
		resetCat: function() {
			this.model.set( "category", -1);
			console.log( "verify resetCat(): " + this.model.get("category"));	
		},
		
		initialize : function(){
			var ClassRef = this;
			console.log("init() of RentalSearchView");
			
			//add events for Price Per Bed 
			var temp_array  = ClassRef.$('#ul_price_pbed_srch > li');
			var temp_length = temp_array.length;
			$.each(temp_array, function (index , dom_element) {
					if (index < temp_length-2){
						dom_element.onclick = function () {
							ClassRef.updatePrice( dom_element.id);	
						}
					}
					else if (index == temp_length -2){
						ClassRef.$('#price-min-ipt').blur( function() {
							if ( $(this).val() != "" ){
								ClassRef.model.set("price_low",$(this).val() );
								console.log( ClassRef.model.get("price_low") );	
							}
						});  // end of price-min-ipt blur
						ClassRef.$('#price-max-ipt').blur( function() {
							if ( $(this).val() != "" ){
								ClassRef.model.set("price_high",$(this).val() );
								console.log( ClassRef.model.get("price_high") );		
							}
						});  // end of price-min-ipt blur					
					} else {  
						dom_element.onclick = function() { ClassRef.resetPrice();  console.log("reset");}
					}
			});
			
			temp_array  = this.$( '#ul_bb_srch>li'  );
			temp_length = temp_array.length;
			$.each(temp_array,function(index, dom_element) {
				if (index < temp_length -2) {
					dom_element.onclick = function (){
						ClassRef.updateBB(dom_element.innerHTML);
					}
				} else if (index == temp_length-2) {
						ClassRef.$('#beds-min-ipt').blur( function() {
							if ( $(this).val() != "" ){
								ClassRef.model.set("num_bed_low",$(this).val() * 10 );
								console.log( ClassRef.model.get("num_bed_low") );	
							}
						});  // end of price-min-ipt blur
						ClassRef.$('#beds-max-ipt').blur( function() {
							if ( $(this).val() != "" ){
								ClassRef.model.set("num_bed_high",$(this).val() * 10 );
								console.log( ClassRef.model.get("num_bed_high") );		
							}
						});  // end of price-min-ipt blur		
						ClassRef.$('#baths-min-ipt').blur( function() {
							if ( $(this).val() != "" ){
								ClassRef.model.set("num_bath_low",$(this).val() * 10 );
								console.log( ClassRef.model.get("num_bath_low") );		
							}
						});  // end of price-min-ipt blur		
						ClassRef.$('#baths-max-ipt').blur( function() {
							if ( $(this).val() != "" ){
								ClassRef.model.set("num_bath_high",$(this).val() * 10 );
								console.log( ClassRef.model.get("num_bath_high") );		
							}
						});  // end of price-min-ipt blur							
				} else { dom_element.onclick = function () {ClassRef.resetBB();  }  }
			});
 
			temp_array = this.$( '#ul_types_srch>li');
			temp_length = temp_array.length;
			$.each(temp_array, function(index, dom_element) {
				if (index < temp_length -1) {
					dom_element.onclick = function () {
						ClassRef.updateCat(dom_element.getAttribute("data-rs-cat"))	;
					}
				}else{
					dom_element.onclick = function() { ClassRef.resetCat();}		
				}
			});  //end of $.each() regarding #ul_types_srch
		} // end of initialize(){}
		
		// place new method here
	});	 //end of RentalSearchView definition
	EasySubOrg.RENTAL.rs_view_01 = new RentalSearchView( {model:EasySubOrg.RENTAL.rs_cu_01 });
	console.log("end of document ready at es_page_interaction.js");	
});  // ####end of document ready######


var li = document.createElement('li');
if (1 == 2 ) {  li.style.width; }


/**
* Constructors of C_travel_control
*
*
*
*
*
*/






function C_travel_control(){
	C_travel_control_pointer = this;
	this._array1 = null;  // this one will be updated in get("normal")
	this._called_back_from_get_request = false;
	this._next = 0;
	this._myroute = null;
	this._overview_path = null;
	//this._overview_path_latlngs = [];  // [ latLng1::[lat,lng], latLng2::[lat,lng]]  // 
	this._overview_polyline = "";//An encoded polyline representation of the route in overview_path. 
	//this._jsonfied_overview_path_latlngs = "";
	this.marker_array_ = [];
	this._tavel_div = document.getElementById("travel-control-div");
	this._control_panel = document.getElementById("travel-control-panel");
	this.get_array = {"tbeid_tr":-1,"cat_tr": 1, "ori_lat":-1, "ori_lng":-1, "des_lat":-1, "des_lng":-1, "wannaget_tr":0 };
	this._infowindow = new google.maps.InfoWindow({       //init a infowindow
		content: "default string"
	});
	
	//this.directionsDisplay = new google.maps.DirectionsRenderer();   // DirectionsRenderer is not used in this C_travel_control class
	this.directionsService = new google.maps.DirectionsService();		// I might move this initialization after page loaded!
	this._geocoder;   // leave place for ._geocode
}

// when this method is called, should call map_cs.data  do some modification


C_travel_control.prototype.display_overview_path = function() {
	//console.log("C_travel_control.prototype.display_overview_path = function()");
	C_travel_control_pointer = this;
	/*
	for (var i = 0; i < C_travel_control_pointer._overview_path.length; i++) {
			this._overview_path_latlngs[i] = [];
			
			this._overview_path_latlngs[i][0] = C_travel_control_pointer._overview_path[i].lat();
			this._overview_path_latlngs[i][1] = C_travel_control_pointer._overview_path[i].lng();
	}
	*/
	var temp_length = C_travel_control_pointer._overview_path.length;
	console.log("_polyline to be converted into : "+C_travel_control_pointer._overview_polyline);
	
	//newLineString = new google.maps.Data.LineString(  this._overview_path); 
	//google.maps.geometry.encoding.decodePath( C_travel_control_pointer._overview_polyline)
	newLineString = new google.maps.Data.LineString( google.maps.geometry.encoding.decodePath( C_travel_control_pointer._overview_polyline) ); 
	console.log("getType(): "+newLineString.getType() + "   getLength()" + newLineString.getLength());
	map_cs.data.getFeatureById(38).setGeometry( newLineString ); // work-around, mainly by substituting the "geometry" of "Data", the specific id is 38 
	console.log("In display_overview_path(), successfully decoded the encoded polyline");
	this.addMarker(newLineString.getAt(0),0 , "undraggable"  );
	this.addMarker(newLineString.getAt(temp_length-1),1,  "undraggable");
}

C_travel_control.prototype.calcRoute =  function ( ) {
	if ( this.marker_array_[0]== null || this.marker_array_[1] == null) {alert("start or origin cannot be null"); return;}
	//if (this.directionsDisplay.getMap() == null) {this.directionsDisplay.setMap(map_cs);}
	C_travel_control_ref = this;
	marker_array_ref = this.marker_array_;
	start = this.marker_array_[0].getPosition();
	end = this.marker_array_[1].getPosition();
	var waypts = [];
	for (var i =2; i < marker_array_ref.length; i ++)//put waypoints into waypts:array
	{
		waypts.push( { 
			location:marker_array_ref[i].getPosition(),
      stopover:false
		});	
	}
	
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING,
			waypoints: waypts,
      optimizeWaypoints: true,
  };
  this.directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      //C_travel_control_pointer.directionsDisplay.setDirections(response);//alert("route"+response); I will implement here myself
			C_travel_control_ref._overview_path =  response.routes[0].overview_path;  //overview_path :Array<LatLng>
			C_travel_control_ref._overview_polyline =  response.routes[0].overview_polyline; // encoded polyline
			C_travel_control_ref._myroute = response.routes[0];
			for (key in marker_array_ref ) {marker_array_ref[key].setMap(null);}
			marker_array_ref = [];
			C_travel_control_ref.display_overview_path();
			C_travel_control_ref.confirmRoute();
    }
  });
}//calcRoute   ends here

C_travel_control.prototype.hightlight_title = function (ID) {
	document.getElementById('title-housing').className = "title-options1";
	document.getElementById('juju').className = "title-options1";
	document.getElementById('travel-control-div').className = "title-options1";
	document.getElementById('about-div').className = "title-options1";
	document.getElementById(ID).className = "title-selected";	
}
C_travel_control.prototype.setDefault = function() {
	console.log("update setting default mode-----------");
	map_cs.data.forEach(  function(feature)  {   // remove all
		map_cs.data.remove(feature);
	});
	map_cs.data.loadGeoJson(data_layer_url_in_mapinteractionJS);  // addFeature // data_layer_url can be found at 
	/*
	map_cs.data.setStyle(function(feature) {  // reset styles
	return ({// @type {google.maps.Data.StyleOptions} 
		strokeColor: feature.getProperty("strokeColor"),
		strokeWeight: 6,
		strokeOpacity:0.4
		});
	});*/
	search_ajax1.setAllmap(map_cs);
	this._control_panel.style.display = "none";
	this.clearMarkers();
  //  "title-selected";
}

C_travel_control.prototype.setTravel= function() {
	console.log("update setting travel-mode");
	search_ajax1.clearMarkers(); // clear markers of housing information
	this.resetGetArray();
	//this.getAndShow();

	map_cs.data.forEach(  function(feature)  {
			 map_cs.data.remove(feature);})
	this.deleteMarkers();

	//this.get("normal");   // will add server sended features
	map_cs.data.loadGeoJson("js/custom_routes.json");  // get the placeholder data geometry for newly generated route
	mapcc1.adaptiveSetFeature();	
	
	this._control_panel.style.display = "block"; // in renting/leasing mode, display property is set to "none"
	
	//this.hightlight_title( "travel-control-div");
	console.log( " setDefault finished");
}


C_travel_control.prototype.updateSetting = function (){   // updateSetting is function wanting to repeat what step should be done in corresponding workMode
	if (mapOptions.workMode == "default") {
		this.setDefault();
	}
	else if (mapOptions.workMode == "travel-mode") {
		this.setTravel();
		//this.directionsDisplay.setMap(map_cs);
	}
}
C_travel_control.prototype.resetGetArray = function()  {
	this.get_array = {"tbeid_tr":-1,"cat_tr": 1, "wannaget_tr":0 };
}
C_travel_control.prototype.getAndShow = function() {
	console.log( " ksdw getAndShow");
	map_cs.data.forEach(  function(feature)  {
		
		map_cs.data.remove(feature);
	});
	this.deleteMarkers();
  map_cs.data.loadGeoJson("js/custom_routes.json");
	this.get("normal");   // will add server sended features
	//map_cs.data.loadGeoJson("js/custom_routes.json");  // get the placeholder data geometry for newly generated route
	mapcc1.adaptiveSetFeature();	
}

C_travel_control.prototype.clearMarkers = function () {
	for (var i = 0 ; i < this.marker_array_.length; i ++) {
		if(this.marker_array_[i]){this.marker_array_[i].setMap(null);}	
	}	
	//this.marker_array_[i]= [];
}
C_travel_control.prototype.deleteMarkers = function() {
	this.clearMarkers();
	this.marker_array_ = [];	
}
C_travel_control.prototype.addOneWaypoint = function (location) {
	console.log("oneOneWaypoint");
	this.addMarker(location, 3, "draggable");	
}

C_travel_control.prototype.addMarker = function(location, cat, isdraggable) {
	isdraggable = typeof isdraggable !== 'undefined' ? isdraggable : "draggable";
	if (isdraggable == "draggable") {isdraggable = true;}
	else isdraggable = false;
	
  var marker = new google.maps.Marker({
    position: location,
    map: map_cs,
		animation: google.maps.Animation.DROP,
		draggable:isdraggable
  });
	if (cat == 1 ) {
		if (this.marker_array_[1] != null) {this.marker_array_[1].setMap(null);}
		
		this.marker_array_[1] = marker;
		var image = 'images/destination.png';
		marker.setIcon(image);
	} // cat == 1
	else if (cat == 0) {
		if (this.marker_array_[0] != null) {this.marker_array_[0].setMap(null);}
		this.marker_array_[0] = marker;	
		var image = 'images/origin.png';	
		marker.setIcon(image);
	} // cat  == 0
	else if (cat == 3) {
		if ( this.marker_array_.length < 2) {
			alert("please debug line ~ ksdw547, waypoints trying to be added when there are less than 2 objects in marker_array_");  // ksdw547	
			return;
		}
		else {
			this.marker_array_.push(marker);
			var image = 'images/waypoint.png';	
			marker.setIcon(image);
		}
	}  // cat ==3 
	else if (cat == 4) {
		if (this.marker_array_[4] != null) {this.marker_array_[4].setMap(null);}
		this.marker_array_[4] = marker;	
		var image = 'images/origin.png';	
		marker.setIcon(image);
		
	}
	else if (cat == 5) {
		if (this.marker_array_[5] != null) {this.marker_array_[5].setMap(null);}
		this.marker_array_[5] = marker;
		var image = 'images/destination.png';
		marker.setIcon(image);
		
	}
}


C_travel_control.prototype.set_origin = function ( latLng) {
	this.addMarker(latLng, 4,"undraggable");
}
C_travel_control.prototype.set_destination = function ( latLng ) {
	this.addMarker(latLng,5,"undraggable");
}
C_travel_control.prototype.set_next = function (latLng) {
	if (this._next == 0 ) {  // when generating new start
		this.deleteMarkers();
		this.addMarker(latLng, 0);
		this._next = 1;
	}
	else {                   // generating destination
		this.addMarker(latLng, 1)
		this._next = 0;
	}

} // end of set_next()

C_travel_control.prototype.set_status = function ( id, status_num) {  // need to change later
	console.log("C_travel_control.prototype.set_status id: " + id.toString() + ", status_num: " + status_num.toString());
	this.get_array["tbeid_tr"] = id;
	this.get("set_id_expired");

		
} // end of set_status()


C_travel_control.prototype.confirmRoute = function( latLng, infostr){
	if (latLng != null && infostr != null) {  
		this._infowindow.setContent(infostr); 
		this._infowindow.setPosition(latLng);
		this._infowindow.open(map_cs);
		return;
	}
	var start_string = this._myroute.legs[0].start_address;
	var end_string = this._myroute.legs[this._myroute.legs.length-1].end_address;
	var originlat = this._overview_path[0].lat();
	var originlng = this._overview_path[0].lng();
	var destinylat = this._overview_path[this._overview_path.length - 1].lat();
	var destinylng = this._overview_path[this._overview_path.length - 1].lng();
	
	document.getElementById('num-origin-lat-tr').value = originlat;
	document.getElementById('num-origin-lng-tr').value = originlng;
	document.getElementById('num-destiny-lat-tr').value = destinylat;
	document.getElementById('num-destiny-lng-tr').value = destinylng;
	document.getElementById('ipt-origin-tr').value = start_string;
	document.getElementById('ipt-destiny-tr').value = end_string;
	//this.jsonfied_overview_path_latlngs = JSON.stringify(this._overview_path_latlngs) ;  
	
	
	//document.getElementById('string-jsonfied-tr').value = this.jsonfied_overview_path_latlngs;   // display:none input
	document.getElementById('encoded-polyline').value = this._overview_polyline;

}

C_travel_control.prototype.gen_url = function(get_type) {
	get_type = typeof get_type !== 'undefined' ? get_type : "normal";
	//console.log( "ksdw633"+this.get_array["cat_tr"] );
	var url = "form_process_tr.php?";
	if (get_type == "normal") {
		this.get_array["wannaget_tr"] = 0;   // know how many variables is wanted
		for ( key in this.get_array ){
			if (this.get_array[key] != -1) {
				url = url + key + "=" + this.get_array[key] + "&";
				this.get_array["wannaget_tr"] = this.get_array["wannaget_tr"]+1;	
			}
		}
	}
	else if (  get_type == "set_id_expired") {
			url = url + "tbeid_tr=" + this.get_array["tbeid_tr"]+"&";
			//alert("url: " +url);
	}
	return url;
}

C_travel_control.prototype.get = function( get_type ) {
	//window.location.assign("form_process.php?num-beds=" +beds.toString() +"&num-baths="+ baths.toString());
	get_type = typeof get_type !== 'undefined' ? get_type : "normal";	// ksdw-get()
	C_travel_control_pointer = this;
	C_travel_control_pointer._called_back_from_get_request = false;
	if (  get_type == "set_id_expired" ){  // set expired
		//alert( "unusual get"); 
		if (window.XMLHttpRequest) {xmlhttp = new XMLHttpRequest();	}// code for IE7+, Firefox, Chrome, Opera, Safari
		 else {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}// code for IE6, IE5	
		// init XMLHttpRequest finished 
		xmlhttp.onreadystatechange = function () {  //what it will do when reponse is ready
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				console.log("set_id_expired state change");
				//C_travel_control_pointer.updateSetting();
				C_travel_control_pointer.getAndShow();
				C_travel_control_pointer._infowindow.close();
			}	  /* xmlhttp.readyState == 4.... */};// end of onreadystatechange()
		xmlhttp.open("GET",C_travel_control_pointer.gen_url( get_type ), true);
		xmlhttp.send();	
	}
	else {  // "normal get"
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp = new XMLHttpRequest();
		} else {	// code for IE6, IE5
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}// init XMLHttpRequest finished 	
		xmlhttp.onreadystatechange = function () {  //what it will do when reponse is ready
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {//alert("normal get state4"); 
				console.log("normal state 4 status 200");    
				var tmp_array = xmlhttp.responseText.split("#");//alert(tmp_array[0]);  tmp_array[0]#tmp_array[1]#tmp_array[2]
				C_travel_control_pointer._array1 = JSON.parse(tmp_array[0]);// becomes associative array now! { id : {id:ddd  }}
				assoc_array2 = JSON.parse(tmp_array[1]);//alert("normal get state4 166");
				document.getElementById("sql-bash").innerHTML = assoc_array2["sql-bash"]+tmp_array[2] ;  /// what it returned is JSON string
				
				mapcc1.reset() ; // clear mapcc1._featureOptions
				mapcc1._proparray =  C_travel_control_pointer._array1; // add featureOption into property array of mapcc1 instance, this will be processed later
				  // adpative block
				
				beta = document.getElementById("checkbox-adv-routing").checked;
				if ( beta == true) {
				mapcc1.buildGraph();
				routes = mapcc1.formroutes();
				console.log(routes);
				//possibility need to clean previous feature
				routes.forEach(   function (value, index, array){
					mapcc1.createFeature(value);	
				});
				mapcc1.adaptiveSetFeature();
				}
				
				else {
				for ( key in C_travel_control_pointer._array1 ) {  // considering 0 length situation??
					//to be implemented   assoicative array now array1[i] = [id, cat, origin, destiny, source, memo, jsonlatlngs, encoded_polyline]
					mapcc1.createFeature(C_travel_control_pointer._array1[key ]); 
				}	
				}
				//this line cannot be commented
				mapcc1.adaptiveSetFeature();
				C_travel_control_pointer._called_back_from_get_request = true; // this condition judgement used by waitfor function of Infodiv manager class
			} // end of call back status check if 
		};// end of onreadystatechange()
		xmlhttp.open("GET",C_travel_control_pointer.gen_url( get_type ), true);
		xmlhttp.send();	
	} //end outmost else {}
}//end get()


/**
*This function will be used to do ajax post, for travel-form.php ( which is ajaxedly loaded into index.php)
*/
C_travel_control.prototype.post = function () {    //ksdw post
	// i have to implement this in javascript
	console.log("entered C_travel_control.prototype.post()");
	C_travel_control_ref = this;
	var xmlhttp;
	if (window.XMLHttpRequest) {	xmlhttp=new XMLHttpRequest();}// code for IE7+, Firefox, Chrome, Opera, Safari
	else	{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}// code for IE6, IE5
	xmlhttp.onreadystatechange=function(){
		console.log( "post callback"+ xmlhttp.status.toString());
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
				C_travel_control_ref.updateSetting();
				temp_assoc_ary = {"ipt-origin-tr":"",   ///this temp_assoc_ary is used to clear hidden input
												"ipt-destiny-tr":"",
												"ipt-url-tr":"",
												"num-catagory-tr":"",
												"ipt-date-tr":"",
												"memo-tr":"",
												"encoded-polyline":""} // end of temp_assoc_ary
				for (key in temp_assoc_ary) {
					document.getElementById(key).value = 	"";   // clear the remains data of this post
				}
				C_travel_control_ref.deleteMarkers();
				C_travel_control_ref._myroute = null;
				C_travel_control_ref.getAndShow();
			}
	}//end of xmlhttp.onreadystatechange=function()
	xmlhttp.open("POST","form_process_tr.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	
	xmlhttp.send(C_travel_control_ref.post_para_gen());
}
C_travel_control.prototype.post_para_gen = function () {
	para = "";
	temp_assoc_ary = {"ipt-origin-tr":"if see me, debug post_para_gen()",
										"ipt-destiny-tr":"if see me, debug post_para_gen()",
										"ipt-url-tr":"if see me, debug post_para_gen()",
										"num-catagory-tr":9,
										//"string-jsonfied-tr":"if see me, debug post_para_gen()",
										"encoded-polyline":"if see me, debug post_para_gen()",
										"memo-tr":"if see me, debug post_para_gen()",
										"ipt-date-tr":"is see me, debug post_para_gen()",
										"num-origin-lat-tr":999,
										"num-origin-lng-tr":999,
										"num-destiny-lat-tr":999,
										"num-destiny-lng-tr":999} // end of temp_assoc_ary
	for (key in temp_assoc_ary) {  // update temp_assoc_ary, so it reflects contents of the form
 		temp_assoc_ary[key] = document.getElementById(key).value;
		para = para + key + "=" + encodeURIComponent(temp_assoc_ary[key]) + "&";
	}
	para = para.slice(0,-1); // delete the & at the end
	return para;
}
/*
*
* Geocode     humman-readable address string  => google latlng object
*/
C_travel_control.prototype.geocode = function ( address_string , assoc_array_of_get, ori_or_des  ){
	if (!this._geocoder) { alert("geocoder not ready, please debug"); return;}
	if (!(ori_or_des == "ori"  || ori_or_des == "des") ){ console.log( ori_or_des); alert("check ori_or_des argument"); return; }
	//tbr = [];
	var address = address_string;
  this._geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      console.log( "geocoder returned: "+ results[0].geometry.location.toString() );
			//this.get_array = {"tbeid_tr":-1,"cat_tr": -1, "ori_lat":-1, "ori_lng":-1, "des_lat":-1, "des_lng":-1, "wannaget_tr":0 };
			map_cs.panTo( results[0].geometry.location);
			assoc_array_of_get[ori_or_des +'_lat'] = results[0].geometry.location.lat();
			assoc_array_of_get[ori_or_des +'_lng'] = results[0].geometry.location.lng();
			//console.log(tbr );
    } else {
      alert('C_travel_control.prototype.geocode(str) was not successful for the following reason: ' + status);
			
    }
  }); // end of ._geocoder.geocode();
	//return tbr;
} //end of geocode method of C_travel_control
/////////////////////////end of C_travel_contrl implementation ////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////////start of jQuery///////////////////////////


$(document).ready(function(){
	mapcc1 = new MapCommonCalc();
	infodiv_manager1 =  new Infodivmng( document.getElementById("info-div"));
	travel_control_i1 = new C_travel_control();
	travel_control_i1._geocoder = new google.maps.Geocoder(); // detach the initialization of ._geocoder from contructor,
	
	travel_control_i1._control_panel.onclick = function() { travel_control_i1.calcRoute( );}  // will obtain latLng from marker array
	travel_control_i1.hightlight_title( "title-housing");  
	$("#slct-cat-tr-srch").click( function(){     /*travel search selection drop down box*/
		travel_control_i1.get_array["cat_tr"] = $('#slct-cat-tr-srch').val();
		console.log( "get_array[\"cat_tr\"]"+ travel_control_i1.get_array["cat_tr"].toString() );		
	}); 
	
	$("#ipt-origin-tr-srch").blur( function(){
		if ($("#ipt-origin-tr-srch").val()) {
	  	travel_control_i1.geocode( $("#ipt-origin-tr-srch").val(),travel_control_i1.get_array, "ori"  );
		}
		else {travel_control_i1.get_array['ori_lat'] = -1;travel_control_i1.get_array['ori_lng'] = -1 ; }
	});

	$("#ipt-destiny-tr-srch").blur( function() {
		if ($("#ipt-destiny-tr-srch").val()) {
			travel_control_i1.geocode( $("#ipt-destiny-tr-srch").val(),travel_control_i1.get_array, "des"  );
		}
		else {travel_control_i1.get_array['des_lat'] = -1;travel_control_i1.get_array['des_lng'] = -1 ; }
	})
	
	$("#btn-submit-tr-srch").click( function(){   /*the travel search btn*/
		travel_control_i1.getAndShow(); //travel get("normal") and render results
		console.log("780_after getAndShow()");
		//following code should be substituted by infodivmng methods
		infodiv_manager1.waitfor(function(){ return travel_control_i1._called_back_from_get_request},true,100, 0, "check whether array is valid",  function () {infodiv_manager1.render_travel_result();  console.log("travel_control_i1._array1 is valid now");} );
		//infodiv_manager1.render_travel_result();		
	});

	$("#travel-search-slot").hide();
	$("#ipt-url").change(function(){  //$("#ipt-url") is in the dynamic range, this one has bug!!   
			var source1 = this.value;
			$.post("form_process.php",
			{
				sourcechk: "1",
				source: source1
			},
			function(data, status){	
				 $("#txtHint").html(data);
			});
	});
	$("#title-label-div").click( function() {  // click logo, go to this index.php
		location.href='index.php';	
	});
	
	var rental_searching_content = $("#rental-search-slot").html();
	//var travel_searching_content;

		
	$("#about-div").click(   function (){  
		infodiv_manager1.toggle_about();
	});
	
	$("#title-housing").click ( function() {
		if (  mapOptions.workMode != "default") {
			console.log("enter default mode"); 
			mapOptions.workMode= "default"; 
			//$("#info-div").html(content1);  // change form
			infodiv_manager1.render_housing_form();
			$("#travel-search-slot").hide();
			$("#rental-search-slot").show();
			travel_control_i1.hightlight_title( "title-housing");
			travel_control_i1.updateSetting();
			console.log( '$("#title-housing").clicked');
			
		} 		
	});
	
	$("#travel-control-div").click (  function ()  {    // $("#travel-control-div") is among static parts of index.php
		console.log("#travel-control-div clicked");
		if (  mapOptions.workMode != "travel-mode") { 
			mapOptions.workMode= "travel-mode";//console.log("598");
			infodiv_manager1.render_travel_form();
			
			$("#travel-search-slot").show();
			$("#rental-search-slot").hide();
			travel_control_i1.hightlight_title( "travel-control-div");
			travel_control_i1.updateSetting( ); //console.log("600");
			
			$("#ipt-date-tr").datepicker();  // set #ipt-date-tr as date-picker
			rclk_menu_overlay._marker.setMap(null); // clear the marker of right-click overlay
		}
	});	
	
  //$( "#ipt-addr" ).datepicker(); This line is successful, which indicates library of jQuery-UI is working properly

	
});  // jquery ends (document ready) here
///these several global function serve as pass
function changecolor(element) {
	element.style.fontWeight = "bold";
	element.style.color = "#FF0000";
	element.style.cursor = "pointer";
}
function backcolor(element) {
	element.style.fontWeight = "normal";	
	element.style.color = "#000000";
}
function set_status(id, status_num, entry) {
	search_ajax1.set_status(id,status_num, entry);
}
function travel_set_status(id, status_num) {  // travel_control_i
	console.log(id.toString() + " " + status_num.toString() );
	travel_control_i1.set_status(id,status_num);
}
function travel_post (){  //travel_control_i1.post do form post verification
	console.log("travel_post() called");
	var data_pattern = new RegExp("[0-3][0-9]/[0-3][0-9]/[0-3][0-9][0-9][0-9]$");
	if (!data_pattern.test( document.getElementById("ipt-date-tr" ).value)) {
		alert("did not pass the form verification, check Date");
		return;
	}
	if (document.getElementById("encoded-polyline" ).value == "" ) {
		alert("did not pass the form verification, no encoded data in hidden form");
		return;
	}
	if (document.getElementById("num-catagory-tr" ).value == "" || typeof(document.getElementById("num-catagory-tr" ) ) == 'undefined') {
		
		alert("did not pass the form verification, no category selected.    " +  typeof(document.getElementById("num-catagory-tr" )));
		console.log("num-catagory-tr"+ document.getElementById("num-catagory-tr" ).value);
		return;
	}
	travel_control_i1.post();

}
