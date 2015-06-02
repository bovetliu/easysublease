
var associate_array = {"li-b10b10":[1,1],"li-b20b10":[2,1],"li-b20b15":[2,1.5],"li-b10b10":[1,1], "li-b20b15":[2,1.5], "li-b20b20":[2,2], "li-b30b20":[3,2],
"li-b30b30":[3,3], "li-b40b30":[4,3], "li-b40b40":[4,4]  };
var associate_array2 = {"li-cat-lease":0,"li-cat-rent":1,"li-cat-activity":2};

var associate_array3 = {"li-cat-p-ride":0,"li-cat-n-ride":1,"li-cat-sdt":2};
//alert(li.id);

function updatebb(string1) {   // for those created by ajax, must use global function
   document.getElementById('num-beds').value = associate_array[string1][0];
	 document.getElementById('num-baths').value = associate_array[string1][1];
	 document.getElementById('btn-captioin-bb').innerHTML = "floor plan: " + document.getElementById(string1).firstChild.innerHTML ;
	 //alert(document.getElementById('num-beds').value);
}
function updatecat(string2) {   // originally, this one is called from inline onclick property of HTML5 element, now it will not be called
	console.log("global updatecat is called");
	document.getElementById('num-catagory').value = associate_array2[string2];
	document.getElementById('btn-caption-cat').innerHTML = "catagory: "+document.getElementById(string2).firstChild.innerHTML;
}
function updatecat_tr(id_string) {
	document.getElementById('num-catagory-tr').value =  associate_array3[id_string];	
	document.getElementById('btn-caption-cat-tr').innerHTML = "catagory: " + document.getElementById(id_string).innerHTML;
}

//above three controls the products of ajax

function C_search_ajax(){    // constructor
	this.ul_price_pbed_srch = document.getElementById('ul_price_pbed_srch');
	this.ul_bb_srch = document.getElementById('ul_bb_srch');
	this.ul_types_srch = document.getElementById('ul_types_srch');
	this.marker_array_ = [];
	/**price in range [0- 5000], all price here refers to money per bed
	*  beds and baths in range [0-10]
	**/
	this.get_array = {"tbeid":-1,"price_min": -1, "price_max": -1, "beds_min":-1, "beds_max": -1,"baths_min":-1,"baths_max":-1,"lease":-1,"rent":-1,"activity":-1, "wannaget":0 };
} // end C_search_ajax constructor

C_search_ajax.prototype.testAlert = function() {
	alert("I can be called");	
}
C_search_ajax.prototype.update_get_array = function (key,value ) { this.get_array[key] = value; 
 //alert(key + " "+ this.get_array[key]);    
 }
C_search_ajax.prototype.addMarker =function(location, cat, url_str, memo, id) { 

		somestring = " <p style = \" font-weight : normal;\"> click to check <a href=\""+url_str+"\" target=\"_blank\">source</a></p><p style=\"color:#000; font-weight:normal;  font-family: \"Times New Roman\", Times, serif; \">"+memo+"</p>";
		var marker = new google.maps.Marker({  // this initialization will "factually", graphically add one marker on map 
			position: location,
			map: map_cs,
			animation: google.maps.Animation.DROP
			//title: somestring
		});
		//alert("addMarker: " + map_cs);
		this.marker_array_.push(marker);
		var the_marker_array = this.marker_array_;
		somestring = somestring + "<p style = \" font-weight : normal;\" > <span  onclick = \"set_status( "+id.toString()+" , 1, "+(the_marker_array.length-1).toString()+");\" onmouseover = \"changecolor(this);\" onmouseout=\"backcolor(this);\">mark it as outdated</span></p>"
		var temp_infowindow = new google.maps.InfoWindow({content: somestring });
		google.maps.event.addListener(marker, 'click', function() { temp_infowindow.open(map_cs, marker); } ); 
	
	

	
	if (cat == 1 ) {
		var image = 'images/icon2.png';
		marker.setIcon(image);
	}
}

C_search_ajax.prototype.setAllmap = function(map) {
	//alert("set entered");
	for (var i = 0; i < this.marker_array_.length; i++) {
			this.marker_array_[i].setMap(map);
	}
}

C_search_ajax.prototype.clearMarkers  = function () {
	//alert("clear entered");
	this.setAllmap(null);
}
C_search_ajax.prototype.deleteMarkers = function() {
	//alert("delete entered");
  this.clearMarkers();
  this.marker_array_ = [];
}


C_search_ajax.prototype.set_status = function (id, status_num, entry) {     //underdev
		this.update_get_array("tbeid", id);
		this.get("set_id_expired");
		this.marker_array_[entry].setMap(null);  // after previous two methods runs, then do this

}

C_search_ajax.prototype.gen_url =function ( get_type) {
	get_type = typeof get_type !== 'undefined' ? get_type : "normal";
	var url = "form_process.php?";
	if (get_type == "normal") {
		this.get_array["wannaget"] = 0;   // know how many variables is wanted
		for ( key in this.get_array ){
			if (this.get_array[key] >=0) {
				url = url + key + "=" + this.get_array[key] + "&";
				this.get_array["wannaget"] = this.get_array["wannaget"]+1;	
			}
		}
	}
	else if (  get_type == "set_id_expired") {
			url = url + "tbeid=" + this.get_array["tbeid"]+"&";
			//alert("url: " +url);
	}
	//window.location.assign(url) // for debug purpose
	console.log("C_search_ajax: "+url);
	return url;
}
C_search_ajax.prototype.get = function( get_type ) {
	//window.location.assign("form_process.php?num-beds=" +beds.toString() +"&num-baths="+ baths.toString());
	// ksdw-get()
	//
	get_type = typeof get_type !== 'undefined' ? get_type : "normal";
	C_search_ajax_pointer = this;
	
	if (  get_type !== "normal" ){
		//alert( "unusual get"); 
		if (window.XMLHttpRequest) {
					// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp = new XMLHttpRequest();
		} else {
					// code for IE6, IE5
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}// init XMLHttpRequest finished 
		xmlhttp.onreadystatechange = function () {  //what it will do when reponse is ready
			//alert("xmlhttp.readyState at unusual "+xmlhttp.readyState + "xmlhttp.status: "+ xmlhttp.status);
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				//alert("update state get state4");
				var returned_id = parseInt(xmlhttp.responseText.split("#")[0]);
				//alert("141: " + "returned_id: " + returned_id);
				if (returned_id >= 0) {
						// do not know what to do here
						C_search_ajax_pointer.update_get_array( "tbeid",-1);  // means updated
				}

			}	  /* xmlhttp.readyState == 4.... */};// end of onreadystatechange()
		xmlhttp.open("GET",C_search_ajax_pointer.gen_url( get_type ), true);
		xmlhttp.send();	
		
	}
	else {  // "normal get"
	  C_search_ajax_pointer.deleteMarkers();
		if (window.XMLHttpRequest) {
					// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp = new XMLHttpRequest();
		} else {
					// code for IE6, IE5
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}// init XMLHttpRequest finished 	
		xmlhttp.onreadystatechange = function () {  //what it will do when reponse is ready
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				//alert("normal get state4");
				if (C_search_ajax_pointer.get_array['tbeid'] != -1){  alert("last update action has bug");}
				
				var tmp_array = xmlhttp.responseText.split("#");//alert(tmp_array[0]);
				console.log(tmp_array);
				array1 = JSON.parse(tmp_array[0]);//alert("normal get state4 165");
				assoc_array2 = JSON.parse(tmp_array[1]);//alert("normal get state4 166");
				document.getElementById("sql-bash").innerHTML = assoc_array2["sql-bash"].split("AND isexpired = 0")[1] +tmp_array[2] ;  /// what it returned is JSON string
				for ( var i = 0 ; i < array1.length ; i ++) {
					
					var tempLatlng = new google.maps.LatLng(array1[i][1], array1[i][2]);
					C_search_ajax_pointer.addMarker(tempLatlng,array1[i][3], array1[i][4], array1[i][5], array1[i][0] );  // lat,lng, cat, source, memo, id
				}
			}	};// end of onreadystatechange()
		xmlhttp.open("GET",C_search_ajax_pointer.gen_url( get_type ), true);
		xmlhttp.send();	
	} //end outmost else {}
}//end get()

search_ajax1 = new C_search_ajax();

/**
* for  beds and baths conditions
*/
search_ajax1.ul_bb_srch.getElementsByTagName('li')[search_ajax1.ul_bb_srch.getElementsByTagName('li').length-1].onclick = function () {
	search_ajax1.update_get_array("beds_min", -1);
	search_ajax1.update_get_array("beds_max", -1);
	search_ajax1.update_get_array("baths_min", -1);
	search_ajax1.update_get_array("baths_max", -1 );
	document.getElementById('beds-min-ipt').value = "";
	document.getElementById('beds-max-ipt').value = "";
	document.getElementById('baths-min-ipt').value ="" ;
	document.getElementById('baths-max-ipt').value ="" ;
	search_ajax1.get( );
}

for (var i = 0; i <search_ajax1.ul_bb_srch.getElementsByTagName('li').length -2; i++) {
	search_ajax1.ul_bb_srch.getElementsByTagName('li')[i].onclick = function() { 
			var beds = this.innerHTML.split("/")[0];
			var baths = this.innerHTML.split("/")[1]; 
			search_ajax1.update_get_array("beds_min", beds *10 );
			search_ajax1.update_get_array("beds_max", beds * 10);
			search_ajax1.update_get_array("baths_min", baths *10);
			search_ajax1.update_get_array("baths_max", baths *10);
			document.getElementById('beds-min-ipt').value = "";
			document.getElementById('beds-max-ipt').value = "";
			document.getElementById('baths-min-ipt').value ="";
			document.getElementById('baths-max-ipt').value ="";
			//alert( search_ajax1.get_array["baths_max"]);  
			search_ajax1.get( );
	}
}

document.getElementById("beds-min-ipt").onkeyup = function () {
	value = parseInt(this.value);
	search_ajax1.update_get_array("beds_min", value  * 10);
}  
document.getElementById("beds-max-ipt").onkeyup = function () {
	value = parseInt(this.value);
	search_ajax1.update_get_array("beds_max", value * 10);
}  
document.getElementById("baths-min-ipt").onkeyup = function () {
	value = parseInt(this.value);
	search_ajax1.update_get_array("baths_min", value * 10);
}  
document.getElementById("baths-max-ipt").onkeyup = function () {
	value = parseInt(this.value);
	search_ajax1.update_get_array("baths_max", value * 10);
}  

/**
* for price  conditions
*/
var li_under_ul_price = search_ajax1.ul_price_pbed_srch.getElementsByTagName('li'); 
li_under_ul_price[li_under_ul_price.length-1].onclick = function() { 
	search_ajax1.update_get_array("price_min", -1 );
	search_ajax1.update_get_array("price_max", -1 );
  document.getElementsByName('price-min-ipt').item(0).value = "";
	document.getElementsByName('price-max-ipt').item(0).value = "";
	search_ajax1.get();
}
resetthem = function() {   //March 30 code check, this can be implemented in C_search_ajax definition
	
	var beds_min = document.getElementById('beds-min-ipt').value;
	var beds_max = document.getElementById('beds-max-ipt').value;
	var baths_min = document.getElementById('baths-min-ipt').value;
	var baths_max = document.getElementById('baths-max-ipt').value;
	if (beds_min == "") {
		search_ajax1.update_get_array("beds_min", -1);
		
	}
	if (beds_max == "") {
		search_ajax1.update_get_array("beds_max", -1);
		//alert( search_ajax1.get_array["beds_max"]);
	}
	if (baths_min == "") {
		search_ajax1.update_get_array("baths_min", -1);
	}
	if (baths_max == "") {
		search_ajax1.update_get_array("baths_max", -1);
	}
}
document.getElementById("map-div").onmouseover = function() {
	var price_min = document.getElementsByName('price-min-ipt').item(0).value;
	var price_max = document.getElementsByName('price-max-ipt').item(0).value;
	var beds_min = document.getElementById('beds-min-ipt').value;
	var beds_max = document.getElementById('beds-max-ipt').value;
	var baths_min = document.getElementById('baths-min-ipt').value;
	var baths_max = document.getElementById('baths-max-ipt').value;
	var gogo_p = false;
	var gogo_b = false;
	if (price_min != "" ){
		gogo_p = true;
		search_ajax1.update_get_array("price_min", price_min );
		if (price_max == "") { search_ajax1.update_get_array("price_max",-1 );}
	}
	if (price_max != "" ){
		gogo_p = true;
		search_ajax1.update_get_array("price_max", price_max );
		if (price_min == "") {  search_ajax1.update_get_array("price_min", -1);}
	}
	
	if (beds_min != "") { 
		gogo_b = true;
		search_ajax1.update_get_array("beds_min ", beds_min * 10  );
	}
	
	if (beds_max != "") { 
		gogo_b = true;
		search_ajax1.update_get_array("beds_min ", beds_max *10 );
	}
	
	if (baths_min != "") { 
		gogo_b = true;
		search_ajax1.update_get_array("beds_min ", baths_min * 10  );
	}
	
	if (baths_max != "") { 
		gogo_b = true;
		search_ajax1.update_get_array("beds_min ", baths_max *10 );
	}
	if (gogo_b) 
	{
		resetthem();
	}
	if (gogo_p || gogo_b) {search_ajax1.get( );}
}
for (var i = 0; i < search_ajax1.ul_price_pbed_srch.getElementsByTagName('li').length-2; i ++) {
	search_ajax1.ul_price_pbed_srch.getElementsByTagName('li')[i].onclick = function () {
		var price_min = this.id.split("-")[0];
		var price_max = this.id.split("-")[1];
		search_ajax1.update_get_array("price_min", price_min );
		search_ajax1.update_get_array("price_max", price_max );
		document.getElementsByName('price-min-ipt').item(0).value = "";
		document.getElementsByName('price-max-ipt').item(0).value = ""
		search_ajax1.get( );
	}
}

/**
* for catagory conditions
*/
search_ajax1.ul_types_srch.getElementsByTagName('li')[ search_ajax1.ul_types_srch.getElementsByTagName('li').length-1].onclick = function () {
	// it means when the last "li" is clicked, make get_array several values -1,
	search_ajax1.update_get_array("lease", -1);
	search_ajax1.update_get_array("rent", -1);
	search_ajax1.update_get_array("activity", -1);
	search_ajax1.get( );
}
for (var i =0 ; i < search_ajax1.ul_types_srch.getElementsByTagName('li').length-1; i++) {
	thisclass = this;
	search_ajax1.ul_types_srch.getElementsByTagName('li')[i].onclick = function() {
		key = this.id.split("-")[2];
		search_ajax1.update_get_array(key,1);
		//alert(this.id.split("-")[2] +" "+ thisclass.get_array[this.id.split("-")[2]]);
		//alert(thisclass.get_array[key]);
		search_ajax1.get( );
	}
}

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
	this.get_array = {"tbeid_tr":-1,"cat_tr": -1, "ori_lat":-1, "ori_lng":-1, "des_lat":-1, "des_lng":-1, "wannaget_tr":0 };
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
	search_ajax1.clearMarkers();
	this.resetGetArray();
	this.getAndShow();
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
	this.get_array = {"tbeid_tr":-1,"cat_tr": -1, "wannaget_tr":0 };
}
C_travel_control.prototype.getAndShow = function() {
	console.log( " ksdw496");
	map_cs.data.forEach(  function(feature)  {
			 map_cs.data.remove(feature);})
	this.deleteMarkers();
	map_cs.data.forEach(  function(feature)  {   // remove all
		map_cs.data.remove(feature);
	});
	this.get("normal");   // will add server sended features
	map_cs.data.loadGeoJson("js/custom_routes.json");  // get the placeholder data geometry for newly generated route

  console.log( " ksdw496");
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
				beta = true;
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
	travel_control_i1.post();

}
