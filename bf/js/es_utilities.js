
// Create the namespace for UTILITIES
EasySubOrg.createNS("EasySubOrg.UTILITIES"); 
console.log("name space EasySubOrg.UTILITIES created");
// Create the namespace for the ajax management
EasySubOrg.createNS("EasySubOrg.comm_unit");
console.log("name space EasySubOrg.comm_unit");


$(document).ready( function() {
	var COMMUNICATION_UNIT = Backbone.Model.extend({
		getAfterSettingExpiredRide:function(){
			ClassRef =this;
			var tbeid = parseInt(EasySubOrg.MAP.cu_01.get('to_be_set_expired_ride'));
			if (tbeid > 0) {
				var generated_URL = "form_process_tr.php?tbeid_tr="+tbeid.toString();
				$.get(generated_URL, function(data, status){
					console.log("getAfterSettingExpired() AJAX status: " + status );
					console.log("server returned: " + data);
					if (status =='success'){
						 EasySubOrg.MAP.cu_01.set('to_be_set_expired_ride',-1);
						 EasySubOrg.RIDE.cu_01.get('_infowindow').close(); 
						 ClassRef.getForRideSearch( false ); // update ride search result, false means not rendering results after data updating
					}
				});
			}// end of "if (tbeid >0 )" condition			
		},
		
		/*
		* Setting rental marker expired   EasySubOrg.comm_unit.getAfterSettingExpired()
		*/
		getAfterSettingExpired: function(  ) {
			console.log("entered getAfterSettingExpired");
			var tbeid = parseInt(EasySubOrg.MAP.cu_01.get('to_be_set_expired'));
			if (tbeid > 0) {
				var generated_URL = "es_form_process.php?tbeid="+tbeid.toString();
				$.get(generated_URL, function(data, status){
					console.log("getAfterSettingExpired() AJAX status: " + status );
					console.log("server returned: " + data);
					if (status =='success'){
						 EasySubOrg.MAP.cu_01.set('to_be_set_expired',-1);		 	
					}
			});
			}
		},
		/*
		*EasySubOrg.comm_unit.getForRentalSearch()
		*/
		getForRentalSearch:function() {
			var ClassRef = this;
			//var rs_cu_01 = EasySubOrg.RENTAL.rs_cu_01; //  EasySubOrg.RENTAL.rs_cu_01 was created at very beginning
			//console.log(EasySubOrg.RENTAL.rs_cu_01.toJSON())  ;
			var generated_URL = null;
			if (EasySubOrg.MAP.cu_01.isMapReady()){  // if map is ready, take map bounds into consideration
				generated_URL = ClassRef.convertObjectIntoURL(EasySubOrg.RENTAL.rs_view_01.updateMapBounds(1, 0.8).toJSON(), "es_form_process.php", "wannaget");
			}
			else {
				console.log( "EasySubOrg.comm_unit.getForRentalSearch(): map not ready, will just use default model:" + JSON.stringify(EasySubOrg.RENTAL.rs_cu_01.toJSON()) );
				generated_URL = ClassRef.convertObjectIntoURL(EasySubOrg.RENTAL.rs_cu_01.toJSON(), "es_form_process.php", "wannaget");	
			}
			console.log( "generated URL:" +generated_URL );
			$.get(generated_URL, function(data, status){
      	console.log("getForRentalSearch AJAX status: " + status );
				var returned_array = data.split('#');//console.log("data sample: " +  JSON.parse(returned_array[0] )[0] );
				//console.log(returned_array[1]);  //returned_array[0] is a json array "[[],[],[],,,]"
				EasySubOrg.MAP.cu_01.set( 'rental_search_result', JSON.parse(returned_array[0] ) );
    	});
		},
		
		/*
		*EasySubOrg.comm_unit.getForRideSearch()
		*/
		getForRideSearch:function(  render_or_not ){   //EasySubOrg.comm_unit.getForRideSearch( render_or_not)
			if(typeof (render_or_not) =='undefined') { render_or_not = true;}
			var ClassRef = this;
			var temp_get_reg = EasySubOrg.RIDE.reg_of_cu.toJSON();  
			if ( temp_get_reg["cat_tr"] == -1 && temp_get_reg["focus_id"] == -1) {
				temp_get_reg["cat_tr"] = 1; console.log("user did direct search operation, adjust request cat_tr");
			}
			console.log(temp_get_reg);
			var generated_URL = ClassRef.convertObjectIntoURL( temp_get_reg, "form_process_tr.php", "wannaget_tr");
			console.log("generated_URL: "+ generated_URL);
			$.get(generated_URL, function(data, status) {
				console.log("getForRideSearch AJAX status: " + status );
				if(status =='success') {
					var returned_array = data.split('#');
					var ride_results = JSON.parse(returned_array[0] ) ;
					EasySubOrg.MAP.cu_01.set( 'travel_search_result', ride_results);
					if (render_or_not  == true){  
						// if no args supplied for render_or_not, it is true, otherwise, has to supply "false" to suppress rendering behaviour
						infodiv_manager1.render_travel_result();
					}
				} // end of if(status =='success')
			});
		},
		
		/*
		*EasySubOrg.comm_unit.convertObjectIntoURL( data, process_server_file, wannaget_str )
		*/
		convertObjectIntoURL:function( data, process_server_file, wannaget_str ) {
			//var data = model.toJSON();
			var tbr = [process_server_file +"?",];
			var wannaget = 0;
			for (var k in data) {
					if (data.hasOwnProperty(k) && data[k]!= -1) {
						 tbr.push( k+"="+data[k].toString()+"&" )
						 wannaget += 1;
					}
			}
			tbr = tbr.join("") + wannaget_str+"=" + wannaget.toString();
			return tbr;
		},
		
		/*
		*COMMUNICATION_UNIT.initialize() 
		*/
		initialize: function() {
			// listen to several models, and retrieve data from server and feedback data to MAP_RENDER,	
			this.listenTo( EasySubOrg.RENTAL.rs_cu_01, 'change', this.getForRentalSearch);
			this.listenTo( EasySubOrg.MAP.cu_01, 'change:to_be_set_expired' ,this.getAfterSettingExpired );
			this.listenTo( EasySubOrg.MAP.cu_01, 'change:to_be_set_expired_ride' ,this.getAfterSettingExpiredRide );
			console.log( "one instance of COMM UNIT has been initialized");		
		}	
	});	// end of COMMUNICATION_UNIT class definition
	EasySubOrg.comm_unit = new COMMUNICATION_UNIT(); 
	
	
	/*
	* This is the #ROUTER# for EasySublease.org, it is used to inidcate current website status, 
	* And it is able to generate sharable URLs for the website. 
	*/
	var ES_Router = Backbone.Router.extend({
		
		//matched routes
		routes :{
			'rental_search/:query' : 'respondToRentalSearch',
			'ride_search/:query'   : 'respondToRideSearch',	// URL invokes corresponding method
		},
		
		rentalSearchNavi:function() {    //'change' of rental search control unit =>    rentalSearchNavi()   
			var tempQuickRef = EasySubOrg.RENTAL.rs_cu_01;
			this.navigate('rental_search/'+ this.convertObjectIntoURL(tempQuickRef.toJSON()), {trigger:true});	
			console.log( "rentalSearchNavi is called!");
		},
		
		rideSearchNavi:function() {
			console.log("rideSearchNavi is called");
			var tempQuickRef = EasySubOrg.RIDE.reg_of_cu; // tempQuickRef is one common JavaScript Object, instead of one backbone one
			this.navigate('ride_search/'+ this.convertObjectIntoURL(tempQuickRef.toJSON()), {trigger:true});	
		},
		/*
		* This function is from Stackoverflow, usage, para1=23&apple=meiyou    => json object: {"para1":23, "apple":"meiyou"}
		*/
		parseQueryIntoObject:function(query) {
			return JSON.parse('{"' + decodeURI(query.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
		},
		
		/*
		* if the query URL reflect some valid differences from model parameters, this method will update the model parameters according to the query
		* Then trigger one change event of target model, this "change" event will trigger some function listening to it.
		*/
		respondToRentalSearch:function(query) {
			//query is part of URL, For example, http://localhost/easysublease/index.html#rental_search/category=0
			//So the query is "category=0"
			var tempQuickRefJSON = EasySubOrg.RENTAL.rs_cu_01.toJSON();
			console.log("model URLized:" + this.convertObjectIntoURL(tempQuickRefJSON) +";  query:" + query);
			if ( this.convertObjectIntoURL(tempQuickRefJSON) != query){
				var sentInJSONobject = this.parseQueryIntoObject(query);
				var trigger_or_not = false;
				(_.keys( tempQuickRefJSON)).forEach(function(key_str,index, ar){
					if( typeof(sentInJSONobject[key_str]) != 'undefined'  && sentInJSONobject[key_str] != tempQuickRefJSON[key_str] ){
						console.log(  "URL updating one attribute of model ");
						EasySubOrg.RENTAL.rs_cu_01.set(key_str, sentInJSONobject[key_str],{silent:true}  );  // Bug suppressed by {silent:true}
						trigger_or_not = true;
					}
				}); 
				if (trigger_or_not){
					console.log('ROUTER respond to rental search, ATTENTION: query NOT reflecting current target model\n ');
					EasySubOrg.RENTAL.rs_cu_01.trigger('change');
				}
				else {
					console.log("user-input url made no modification to model, or this URL is rejected");
				}
			} 
			else { // URL matches model, mainly because the URL is generated by model changing event
				console.log('ROUTER respond to rental search, MODEL MATCHES: ' + query + "\n");
			}
			
		},
		
		/*
		*EasySubOrg.UTILITIES.router.respondToRideSearch( query )
		*/
		respondToRideSearch : function( query ){
			//query is part of URL, For example, http://localhost/easysublease/index.html#ride_search/category=0
			//So the query is "category=0"			
			var get_reg_object_ref = EasySubOrg.RIDE.reg_of_cu.toJSON();
			
			console.log("respondToRideSearch(): model URLized:" + this.convertObjectIntoURL(get_reg_object_ref) +";  query:" + query);
			if ( this.convertObjectIntoURL(get_reg_object_ref) != query){
				var sentInJSONobject = this.parseQueryIntoObject(query);
				var trigger_or_not = false;
				(_.keys( get_reg_object_ref)).forEach(function(key_str,index, ar){
					if( typeof(sentInJSONobject[key_str]) != 'undefined'  && sentInJSONobject[key_str] != get_reg_object_ref[key_str] ){
						console.log(  "URL updating one attribute of RIDE.reg ");
						//get_reg_object_ref[key_str] = sentInJSONobject[key_str];
						EasySubOrg.RIDE.reg_of_cu.set(key_str, sentInJSONobject[key_str],{silent:true}  );  // Bug suppressed by {silent:true}
						trigger_or_not = true;
					}
				}); 
				
				if (trigger_or_not){
					console.log('ROUTER respond to ride search, ATTENTION: query NOT reflecting current target model\n will request new search result to map control unit ');
					if (!EasySubOrg.MAP.cu_01.isMapReady() ){
						console.log("###########################");
						setTimeout( function(){
							topLevelChangeToRideMode();				
							EasySubOrg.RIDE.search_view_01.requestSearchResult();
							
						},500);
					}
					else{
					  console.log("map ready situaiton, ride search");
						topLevelChangeToRideMode();				
						EasySubOrg.RIDE.search_view_01.requestSearchResult();			
					}
				}
				else {
					console.log("user-input url made no modification to model, or this URL is rejected");
				}
			} 
			else { // URL matches model, mainly because the URL is generated by model changing event
				console.log('ROUTER respond to ride search, MODEL MATCHES: ' + query + "\n");
			}
			
		},
		
		/*
		* EasySubOrg.UTILITIES.router.convertObjectIntoURL(toJSONobject)
		*/
		convertObjectIntoURL:function( toJSONobject) {
			//var toJSONobject = model.toJSON(); before passed in
			var tbr = [];
			for (var k in toJSONobject) {
					if (toJSONobject.hasOwnProperty(k) && toJSONobject[k]!= -1) {
						 tbr.push( k+"="+ encodeURI(toJSONobject[k].toString()) +"&" );
					}
			}
			tbr = tbr.join("").slice(0,-1);
			return tbr;
		},
		initialize:function(){
			//listening to rental search control unit, once there is a change in rental search control unit,
			//the rentalSearchNavi will be called
			var ClassRef = this;
			this.listenTo(EasySubOrg.RENTAL.rs_cu_01,'change',this.rentalSearchNavi);
			this.listenTo(EasySubOrg.RIDE.reg_of_cu,'change',function() {
				ClassRef.rideSearchNavi();  // this is regs control URL
			});
			
		}
	});
	EasySubOrg.UTILITIES.router = new ES_Router();
	Backbone.history.start();
});

//


