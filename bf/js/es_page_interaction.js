EasySubOrg.createNS("EasySubOrg.RENTAL");	
EasySubOrg.createNS("EasySubOrg.RIDE");	

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
	"category":-1 ,
	"lblng":-1,
	"hblng":-1,
	"lblat":-1,
	"hblat":-1
	 // category is the right spelling
});

EasySubOrg.RIDE.reg_of_cu = new Backbone.Model({ "focus_id":-1,"tbeid_tr":-1,"cat_tr": -1, "ori_lat":-1, "ori_lng":-1, "des_lat":-1, "des_lng":-1 });

//The definition of RIDE_CONTROL_UNIT, which is run before page loads, but the instanciation is after page loading
var RIDE_CONTROL_UNIT = Backbone.Model.extend({
	/*instance properties*/	
	defaults:{	  // EasySubOrg.RIDE.cu_01.get('[following property variables]')
		_array1:null,
		_called_back_from_get_request:false,
		_next:0,
		_myroute:null,
		_overview_path:null,  //EasySubOrg.RIDE.cu_01.get('_overview_path')
		_overview_polyline:"",
		_ride_div:null ,
		_control_panel: null ,//document.getElementById("travel-control-panel") will be added when doc ready
		_infowindow: new google.maps.InfoWindow({content: "default string"}),  // EasySubOrg.RIDE.cu_01.get('_infowindow') 
		directionsService: new google.maps.DirectionsService(),
		_geocoder: new google.maps.Geocoder(), 	
		
		/*parameters that want to GET from server, this one will be listened by EasySubOrg.comm_unit*/
		/*what I need to do is just update and manage this array*/      //EasySubOrg.RIDE.cu_01.get('get_reg');	
		get_reg: EasySubOrg.RIDE.reg_of_cu
		
	},
	
	initialize:function(){
		var ClassRef = this;
		this.set('_ride_div', document.getElementById("travel-control-div") );
		this.set('_control_panel',$('#travel-control-panel') );
		this.get('_control_panel').click(function(){
			ClassRef.calcRoute();
		});
		
	},
	
	/*
	*  EasySubOrg.RIDE.cu_01.geocode( address_string, ori_or_des);
	*  geocode method: address_string is human readable string, like "college station, TX", convert this string into correponding start lat lng, or end lat lng,
	*  The get_reg updating happens in call back function of this.get('_geocoder').geocode (...) method
	*/
	geocode :function ( address_string , ori_or_des  ){   // put the travel control get array here, use the call back function to set
		var ClassRef = this;  // please remember, "this" is model here, the property operation should use get and set
		if (!this.get('_geocoder')) { alert("geocoder not ready, please debug"); return;}
		if (!(ori_or_des == "ori"  || ori_or_des == "des") ){ console.log( ori_or_des); alert("check ori_or_des argument"); return; }
		//tbr = [];
		var address = address_string;
		this.get('_geocoder').geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					console.log( "geocoder returned: "+ results[0].geometry.location.toString() );
					//this.get_reg =  Backbone.Model:{"tbeid_tr":-1,"cat_tr": -1, "ori_lat":-1, "ori_lng":-1, "des_lat":-1, "des_lng":-1, "wannaget_tr":0 };
					EasySubOrg.MAP.cu_01.get('map').panTo( results[0].geometry.location);
					EasySubOrg.RIDE.reg_of_cu.set( ori_or_des +'_lat', results[0].geometry.location.lat().toFixed(4))  ;
					EasySubOrg.RIDE.reg_of_cu.set( ori_or_des +'_lng', results[0].geometry.location.lng().toFixed(4)) ;
					console.log(JSON.stringify(EasySubOrg.RIDE.reg_of_cu));
				} else {
					alert('C_travel_control.prototype.geocode(str) was not successful for the following reason: ' + status);
				}
		}); // end of get('_geocoder').geocode();
	}, // end of this.get('_geocoder').geocode
	
	/*
	*quick reference EasySubOrg.RIDE.cu_01.calcRoute();
	*/
	calcRoute :  function ( ) {
		
		var C_travel_control_ref = this;
		var marker_array_ref = EasySubOrg.MAP.render_01.get('ride_marker_array');
		if ( marker_array_ref[0]== null || marker_array_ref[1] == null) {alert("start or origin cannot be null"); return;}
		//if (this.directionsDisplay.getMap() == null) {this.directionsDisplay.setMap(EasySubOrg.MAP.cu_01.get('map'));}
	
		start = marker_array_ref[0].getPosition();
		end = marker_array_ref[1].getPosition();
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
		
		this.get('directionsService').route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				//C_travel_control_pointer.directionsDisplay.setDirections(response);//alert("route"+response); I will implement here myself
				C_travel_control_ref.set('_overview_path',  response.routes[0].overview_path);  //overview_path :Array<LatLng>
				C_travel_control_ref.set('_overview_polyline',  response.routes[0].overview_polyline); // encoded polyline
				C_travel_control_ref.set('_myroute', response.routes[0]);
				for (key in marker_array_ref ) {marker_array_ref[key].setMap(null);}
				marker_array_ref = [];
				EasySubOrg.MAP.render_01.display_overview_path(); // this one should be listened by mapinteraction, and automatically render
				C_travel_control_ref.confirmRoute();          // this one has not been converted into Backbone.Model
			}
		});
	},//calcRoute   ends here
		
	
	/*
	* move values to hidden inputs, waiting for ajax POST   EasySubOrg.RIDE.cu_01.confirmRoute(  latLng, infostr)
	*/
	confirmRoute : function( latLng, infostr){
		if (latLng != null && infostr != null) {  
			this.get('_infowindow').setContent(infostr); 
			this.get('_infowindow').setPosition(latLng);
			this.get('_infowindow').open(EasySubOrg.MAP.cu_01.get('map'));
			return;
		}
		var temp_overview_path = this.get('_overview_path');
		
		var start_string = this.get('_myroute').legs[0].start_address;
		var end_string = this.get('_myroute').legs[this.get('_myroute').legs.length-1].end_address;
		var originlat = temp_overview_path[0].lat();
		var originlng = temp_overview_path[0].lng();
		var destinylat = temp_overview_path[temp_overview_path.length - 1].lat();
		var destinylng = temp_overview_path[temp_overview_path.length - 1].lng();
		
		document.getElementById('num-origin-lat-tr').value = originlat;  //display:none
		document.getElementById('num-origin-lng-tr').value = originlng;  //display:none
		document.getElementById('num-destiny-lat-tr').value = destinylat;  //display:none
		document.getElementById('num-destiny-lng-tr').value = destinylng;  //display:none
		document.getElementById('ipt-origin-tr').value = start_string;
		document.getElementById('ipt-destiny-tr').value = end_string;
		document.getElementById('encoded-polyline').value = this.get('_overview_polyline');  //display:none
	}, // end of confirmRout method
	
	
	post:function() {  //EasySubOrg.RIDE.cu_01.post()
		var ClassRef = this;
		console.log( "entered RIDE CONTROL UNIT post()" );
		$.post( "form_process_tr.php", $( "#ride-form" ).serialize(),function(){ 
			console.log("successfully loaded data");
			// => one event to clearInputs of RidePost Form
			ClassRef.trigger('clearInputsOfRideForm'); 
			EasySubOrg.MAP.render_01.clearMapAddons();
			EasySubOrg.comm_unit.getForRideSearch( false);  // update new RideSearchResult of MAP CU,  which => MAP RENDER
			//ClassRef.clearInput();  05/18/2015, Bowei: This one has not been implemented
			return;
		});
	},  //  end of post() method
	
	/*no need to say more about this*/
	resetGetArray :function()  {
		//console.log("reset is called");
		this.set('get_reg',new Backbone.Model({"focus_id":-1,"tbeid_tr":-1,"cat_tr": 1, "ori_lat":-1, "ori_lng":-1, "des_lat":-1, "des_lng":-1 })); 
	}, // end of resetGetArray method
});  //RIDE_CONTROL_UNIT class definition ends

$(document).ready( function() {

	
	var RentalFormView = Backbone.View.extend({
		//DOM ELEMENT of RENTAL FORM VIEW
		el:'#rental-form-slot',
		
		//## model ##  EasySubOrg.RENTAL.rf_cu_01
		associate_array:  {"li-b10b10":[1,1],"li-b20b10":[2,1],"li-b20b15":[2,1.5],"li-b10b10":[1,1], "li-b20b15":[2,1.5], 
		"li-b20b20":[2,2], "li-b30b20":[3,2],
		"li-b30b30":[3,3], "li-b40b30":[4,3], "li-b40b40":[4,4]  },
		associate_array2: {"li-cat-lease":0,"li-cat-rent":1,"li-cat-activity":2},
		
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
		
		// actually post itself, I have not changed this yet
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
		
			console.log("init() of RentalFormView"); 
		} // end of RentalFormView constructor { }
	});   //###END of RentalFormView class definition
	


	
	//EasySubOrg.RENTAL  indicate the current name space
	// instance of following RentalSearchView : EasySubOrg.RENTAL.rs_view_01
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
		
		updateMapBounds: function(coeff, maxspan ) {
			
			if (typeof (coeff) == 'undefined')  coeff = 1;
			if (typeof (maxspan) == 'undefined')  maxspan = 0.8;
			var boundsarray = EasySubOrg.MAP.cu_01.reportBounds(coeff, maxspan);
			this.model.set( {
				"lblng": boundsarray[0].toFixed(3),
				"hblng": boundsarray[1].toFixed(3),
				"lblat": boundsarray[2].toFixed(3),
				"hblat": boundsarray[3].toFixed(3),
			});
			return this.model;
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
	
	var RideSearchView = Backbone.View.extend({   // Gives logic to the travel-search-div
		el:$('#travel-search-div'),
		
		/* makeRequestOfSearchResult*/
		requestSearchResult:function( ){ 
			EasySubOrg.comm_unit.getForRideSearch(  );
		},
		
		initialize :function() {
			var class_ref = this;
			//EasySubOrg.RIDE.reg_of_cu.on('change',function(){  console.log("caught change at RideSearchView 413");});
			
			class_ref.$("#slct-cat-tr-srch").click( function(){     /*travel search selection drop down box*/
				EasySubOrg.RIDE.reg_of_cu.set(  'cat_tr', parseInt($('#slct-cat-tr-srch').val()  ));
				console.log("original_reg:" + JSON.stringify( EasySubOrg.RIDE.reg_of_cu ));
			});
			 
			class_ref.$("#ipt-origin-tr-srch").blur( function(){
				if (class_ref.$("#ipt-origin-tr-srch").val() != "") {                               
					class_ref.model.geocode( class_ref.$("#ipt-origin-tr-srch").val(), "ori"  );
				}
				else { 
					EasySubOrg.RIDE.reg_of_cu.set( {'ori_lat':-1, 'ori_lng':-1});    
				}
			});		
			
		
			class_ref.$("#ipt-destiny-tr-srch").blur( function() {
				if (class_ref.$("#ipt-destiny-tr-srch").val() != "") {                              
					class_ref.model.geocode( class_ref.$("#ipt-destiny-tr-srch").val(), "des"  );
				}
				else {
					EasySubOrg.RIDE.reg_of_cu.set( {'des_lat':-1, 'des_lng':-1});
				}
			})	
			
			class_ref.$("#btn-submit-tr-srch").click( function(){   /*the travel search btn*/
				EasySubOrg.RIDE.reg_of_cu.set("focus_id",-1); // cancel focus_id restriction
				class_ref.requestSearchResult(); //travel get("normal") and render results
				console.log("after ClassRef.requestSearchResult()");
			});			
						
			console.log( "init() of RideSearchView()");	
		},
	
	}); // end of RideSearchView class definition

	
	
	var RideFormView = Backbone.View.extend( {
		el:$('#ride-form-slot'),	
		/*
		* EasySubOrg.RIDE.form_view_01.clearInputs()
		*/
		clearInputs :function() {
			console.log("EasySubOrg.RIDE.form_view_01.clearInputs is invoked" );
			$.each(this.$('input'),function(  index, dom_element){
				dom_element.value ="";
			});
			this.$('#btn-caption-cat-tr').html("catagory");
			this.$('#memo-tr').val("");			
		},
		
		initialize:function(){
			var ClassRef = this;
			console.log("init() of RideFormView");
			this.listenTo(this.model,'clearInputsOfRideForm', function(){
				console.log("I heard custom event");
				ClassRef.clearInputs();	
			});
		},
	});  


	EasySubOrg.RENTAL.rs_view_01 = new RentalSearchView( {model:EasySubOrg.RENTAL.rs_cu_01 });
	EasySubOrg.RENTAL.rf_view_01 = new RentalFormView  ( {model:EasySubOrg.RENTAL.rf_cu_01});		
	
	EasySubOrg.RIDE.cu_01 = new RIDE_CONTROL_UNIT();	
	
	EasySubOrg.RIDE.search_view_01 = new RideSearchView({ model:EasySubOrg.RIDE.cu_01} ); 
	EasySubOrg.RIDE.form_view_01 = new RideFormView({ model:EasySubOrg.RIDE.cu_01 });
	
	//////////////////////////start of jQuery  toplevel page logic control///////////////////////////	
	//////////////////////////I should merge thsoe toplevel logic control into repective models ///////////////////////////	
	mapcc1 = new MapCommonCalc();
	infodiv_manager1 =  new Infodivmng( document.getElementById("info-div"));	
	infodiv_manager1.show('#rental-form-slot');  // At beginning of page having been loaded, show the rental form
	
	
	hightlightTitle( "title-housing");  

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
		location.href='index.html';	
	});
	
  jQuery.get('about_content.php', function(data) {
		$('#about-panel').html( data ); 
	});
	
	$("#about-div").click(   function (){  
		infodiv_manager1.toggle_about();
	});
	
	$("#ipt-date-tr").datepicker();  // set #ipt-date-tr as date-picker
	
	$("#title-housing").click ( function() {
		if (  EasySubOrg.MAP.cu_01.get('work_mode') != "default") {
			console.log("enter default mode"); 
			EasySubOrg.MAP.cu_01.set('work_mode', "default");   //MAP RENDER  updatesetting listens to this
			//$("#info-div").html(content1);  // change form
			infodiv_manager1.render_housing_form();
			$("#travel-search-slot").hide();
			$("#rental-search-slot").show();
			hightlightTitle( "title-housing");
			
			console.log( '$("#title-housing").clicked');
			
		} 		
	});
	
	$("#travel-control-div").click (  function ()  {    // $("#travel-control-div") is among static parts of index.php
		console.log("#travel-control-div clicked");
		topLevelChangeToRideMode();
	});		
	console.log("end of document ready at es_page_interaction.js");	
});  // #### END of $(document).ready( ...   );######






//these several global function serve as utilities
function  topLevelChangeToRideMode () {
	if (  EasySubOrg.MAP.cu_01.get('work_mode') != "travel-mode") { 
		EasySubOrg.MAP.cu_01.set('work_mode', "travel-mode");//console.log("598");
		infodiv_manager1.render_travel_form( true);
		$("#travel-search-slot").show();
		$("#rental-search-slot").hide();
		hightlightTitle( "travel-control-div");
		EasySubOrg.MAP.cu_01.get('rclk_menu_overlay')._marker.setMap(null); // clear the marker of right-click overlay
	}
}


function  hightlightTitle (ID){
	document.getElementById('title-housing').className = "title-options1";
	document.getElementById('juju').className = "title-options1";
	document.getElementById('travel-control-div').className = "title-options1";
	document.getElementById('about-div').className = "title-options1";
	document.getElementById(ID).className = "title-selected";	
}
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
	EasySubOrg.MAP.render_01.rideSetStatus(id,status_num);
}

function updatecat_tr(id_string) {
	//console.log("updatecat_tr()" + id_string);
	var associate_array3 = {"li-cat-p-ride":0,"li-cat-n-ride":1,"li-cat-sdt":2};
	document.getElementById('num-catagory-tr').value =  associate_array3[id_string];	
	document.getElementById('btn-caption-cat-tr').innerHTML = "catagory: " + document.getElementById(id_string).innerHTML;
	//console.log("updatecat_tr() finished, " + document.getElementById('num-catagory-tr').value);
}


function travel_post (){  //travel_control_i1.post do form post verification
	console.log("travel_post() called");
	var data_pattern = new RegExp("[0-3][0-9]/[0-3][0-9]/[0-3][0-9][0-9][0-9]$");
	if ( !$('#ipt-date-tr').val() || !$('#encoded-polyline').val() || !$('#num-catagory-tr').val()) {
		alert("did not pass jquery for verification, returned");
		return;	
	}
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
	EasySubOrg.RIDE.cu_01.post();
}
