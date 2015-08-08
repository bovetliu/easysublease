
// Create the namespace for UTILITIES
EasySubOrg.createNS("EasySubOrg.UTILITIES"); 
//console.log("name space EasySubOrg.UTILITIES created");
// Create the namespace for the ajax management
EasySubOrg.createNS("EasySubOrg.comm_unit");
//console.log("name space EasySubOrg.comm_unit");

$(document).ready( function() {
  var COMMUNICATION_UNIT = Backbone.Model.extend({
    default:{
      listingServerURL:"",    // in local environment, three collections in one db, but when it comes online, it is not the case
      is_local_listing_server:true
    },

    /*
    * EasySubOrg.comm_unit.apiServerURL()
    */
    apiServerURL:function(){
      if ( !this.get("is_local_listing_server") )
      return "http://esapi-u7yhjm.rhcloud.com";
      else return "http://localhost:3001";
    },
    postDetailedListing:function(tobeSubmittedModel, callback){
      // tobeSubmittedModel is JSON stringified
      targetURL = this.get("listingServerURL") + "/listing";
      
      console.log("postDetailedListing targetURL: " + targetURL);
      console.log(tobeSubmittedModel);
      $.ajax({
        url:  targetURL,
        data: {model:tobeSubmittedModel},
        crossDomain: true,
        type:"POST",
        success: callback  
      });
    },
    getAfterSettingExpiredRide:function(){
      var ClassRef =this;
      var tbeid = EasySubOrg.MAP.cu_01.get('to_be_set_expired_ride');
      if (tbeid != "") {
        var generated_URL = ClassRef.apiServerURL()+"/db_models/Route/"+tbeid+"/update";
        console.log("getAfterSettingExpiredRide:" + generated_URL);
        $.post(generated_URL,{isexpired:true}, function(data, status){
          console.log("getAfterSettingExpired() AJAX status: " + status );
          console.log("server returned: " + data);
          if (status =='success'){
             EasySubOrg.MAP.cu_01.set('to_be_set_expired_ride',"");
             EasySubOrg.RIDE.cu_01.get('_infowindow').close(); 
             ClassRef.getForRideSearch(false); //EasySubOrg.comm_unit.getForRideSearch( bAnimate)
          }
        });
      }// end of "if (tbeid >0 )" condition     
    },
    
    /*
    * Setting rental marker expired   EasySubOrg.comm_unit.getAfterSettingExpired()
    * 
    */
    getAfterSettingExpired: function(  ) {
      console.log("entered getAfterSettingExpired");
      var tbeid = EasySubOrg.MAP.cu_01.get('to_be_set_expired');
      if (tbeid != "") {
        var generated_URL =  this.apiServerURL()+ "/db_models/RentalPoint/"+tbeid+"/update";/*http://localhost:3000/db_models/RentalPoint/556947e60bcb8c9c20b98c7d/put*/
        console.log("EasySubOrg.comm_unit.getAfterSettingExpired():" + generated_URL);
        /*
        $.put(generated_URL, function(data, status){
          console.log("getAfterSettingExpired() AJAX status: " + status );
          console.log("server returned: " + data);
          if (status =='success'){
             EasySubOrg.MAP.cu_01.set('to_be_set_expired',-1);      
          }
        });*/
        $.ajax({
          url:generated_URL,
          data: {isexpired:true}, // plain object
          type: 'POST',

          crossDomain:true,
          success: function(data, status){ 
            if (data.n == 0){
              console.log("falied to set target expired." );
            } else if (data.n == 1) {
              console.log("successfully set target expired.")
              EasySubOrg.MAP.cu_01.set('to_be_set_expired',"");
            }
            else{
              console.log(data);
            } 
            //EasySubOrg.MAP.cu_01.set('to_be_set_expired',"");    
          },  
        }); // end of $.ajax        
        
      }
    },
    /*
    *EasySubOrg.comm_unit.getForRentalSearch();
    */
    getForRentalSearch:function() {
      var ClassRef = this;
      //var rs_cu_01 = EasySubOrg.RENTAL.rs_cu_01; //  EasySubOrg.RENTAL.rs_cu_01 was created at very beginning
      //console.log(EasySubOrg.RENTAL.rs_cu_01.toJSON())  ;
      var generated_URL = null;
      if (EasySubOrg.MAP.cu_01.isMapReady()){  // if map is ready, take map bounds into consideration
        generated_URL = ClassRef.convertObjectIntoURL(EasySubOrg.RENTAL.rs_view_01.updateMapBounds(1, 0.8).toJSON(), 
          ClassRef.apiServerURL()+"/db_models/RentalPoint/conditional");
      }
      else {
        console.log( "EasySubOrg.comm_unit.getForRentalSearch(): map not ready, will just use default model:" + JSON.stringify(EasySubOrg.RENTAL.rs_cu_01.toJSON()) );
        generated_URL = ClassRef.convertObjectIntoURL(EasySubOrg.RENTAL.rs_cu_01.toJSON(), ClassRef.apiServerURL()+"/db_models/RentalPoint/conditional"); 
      }
      console.log( "generated URL:" +generated_URL );
      $.ajax({
        url:generated_URL,
        type: 'GET',
        crossDomain:true,
        dataType: "json",
        success: function( data, textStatus,jqXHR){ 
          //console.log("EasySubOrg.comm_unit.getForRentalSearch(): successfully GET :"+ JSON.stringify(data));
          if (data == null || typeof (data) == 'undefined') {
            throw "ajax GET invalid data";
          }
          EasySubOrg.MAP.cu_01.set( 'rental_search_result', data  );
          //console.log("MAP data: " + JSON.stringify(  EasySubOrg.MAP.cu_01.get('rental_search_result') ));
        } 
      }); // and of $.ajax    
    },

    /*
    *EasySubOrg.comm_unit.getForRideSearch()
    */
    getForRideSearch:function(   bAnimate){   //EasySubOrg.comm_unit.getForRideSearch( bAnimate)

      var ClassRef = this;
      var temp_get_reg = EasySubOrg.RIDE.reg_of_cu.toJSON();  
      if ( temp_get_reg["cat"] == null && temp_get_reg["_id"] == null) {
        temp_get_reg["cat"] = 2; console.log("user did direct search operation, adjust request cat_tr");
      }
      console.log("get regs of ride control: " +JSON.stringify(temp_get_reg));  //             http://localhost:3000/db_models/Route/conditional/:query
      var generated_URL = ClassRef.convertObjectIntoURL( temp_get_reg, ClassRef.apiServerURL()+"/db_models/Route/conditional");
      console.log("generated_URL for ride search: "+ generated_URL);
      $.get(generated_URL, function(data, status) {
        // update 05/31/2015: after using Mongoose API server, returned data is automatically convereted into JSON
        console.log("getForRideSearch AJAX status: " + status );
        if(status =='success') {
          if (typeof (data) == 'string'){ data = JSON.parse(data); console.log("parse is called")}

          EasySubOrg.MAP.cu_01.set( 'travel_search_result', _.indexBy(data, '_id') );  // use one underscore method
          //console.log(EasySubOrg.MAP.cu_01.get('travel_search_result') );
          //console.log("after AJAX GET, EasySubOrg.MAP.cu_01.get('travel_search_result'): "+JSON.stringify(  Object.keys(EasySubOrg.MAP.cu_01.get('travel_search_result') )) );
          EasySubOrg.INFO.info_view_01.render_travel_result(null,  bAnimate); 
        } // end of if(status =='success')
      });
    },
    
    /*
    *EasySubOrg.comm_unit.convertObjectIntoURL( data, process_server_file, wannaget_str )
    */
    convertObjectIntoURL:function( data, process_server_file) {
      //var data = model.toJSON();
      var tbr = [process_server_file +"?",];
      for (var k in data) {
          if (data.hasOwnProperty(k) && data[k]!= null) {
             tbr.push( k+"="+data[k].toString()+"&" );
          }
      }
      tbr = tbr.join("").slice(0,-1);
      return tbr;
    },
    /*
    *COMMUNICATION_UNIT.initialize() 
    */
    initialize: function() {
      // listen to several models, and retrieve data from server and feedback data to MAP_RENDER, 
      //this.listenTo( EasySubOrg.RENTAL.rs_cu_01, 'change', this.getForRentalSearch);  // router will handle this
      console.log("init() of COMMUNICATION_UNIT");    
      this.listenTo( EasySubOrg.MAP.cu_01, 'change:to_be_set_expired' ,this.getAfterSettingExpired );
      this.listenTo( EasySubOrg.MAP.cu_01, 'change:to_be_set_expired_ride' ,this.getAfterSettingExpiredRide );
      // If this website is running locally, it will use local listing server, if it is running online, it will use online server
      


      this.set("is_local_listing_server", (window.location.host=='localhost'));
      var temp_listing_server_position = this.get("is_local_listing_server")? "http://localhost:3000":"http://listing.easysublease.com"

      this.set('listingServerURL',temp_listing_server_position);
      console.log("running with listingServerURL: " + this.get("listingServerURL"));
    } 
  }); // end of COMMUNICATION_UNIT class definition

  
  
  /*
  * This is the #ROUTER# for EasySublease.org, it is used to inidcate current website status, 
  * And it is able to generate sharable URLs for the website. 
  */
  var ES_Router = Backbone.Router.extend({
    
    //matched routes
    routes :{
      //'rental_focus/:query'  : 'respondToRentalFocus',
      //'ride_focus/:query'    : 'respondToRideFocus',
      'rental_search/:query' : 'respondToRentalSearch',
      'ride_search/:query'   : 'respondToRideSearch', // URL invokes corresponding method
    },
    
    rentalSearchNavi:function() {    //'change' of rental search control unit =>    rentalSearchNavi()  
      this.navigate('rental_search/'+ this.convertObjectIntoURL(EasySubOrg.RENTAL.rs_cu_01.toJSON()), {trigger:true});  
      console.log( "rentalSearchNavi is called!");
    },
    
    rideSearchNavi:function() {
      console.log("rideSearchNavi is called");
      //console.log(  JSON.stringify(EasySubOrg.RIDE.reg_of_cu));
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
    * Update: 05/30/ 2015  compatible for mongoose
    */
    respondToRentalSearch:function(query) {
      //query is part of URL, For example, http://localhost/easysublease/index.html#rental_search/cat=1
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
          //EasySubOrg.RENTAL.rs_cu_01.trigger('change');
          EasySubOrg.comm_unit.getForRentalSearch();
        }
        else {
          console.log("user-input url made no modification to model, or this URL is rejected");
        }
      } 
      else { // URL matches model, mainly because the URL is generated by model changing event
        console.log('ROUTER respond to rental search, MODEL MATCHES: ' + query + "\n");
        EasySubOrg.comm_unit.getForRentalSearch();
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
            
            console.log( JSON.stringify(EasySubOrg.RIDE.reg_of_cu));
            trigger_or_not = true;
          }
        }); 
        get_reg_object_ref = EasySubOrg.RIDE.reg_of_cu.toJSON();  // updated JSON object of reg
        if (trigger_or_not){
          console.log('ROUTER respond to ride search, ATTENTION: query NOT reflecting current target model\n will request new search result to map control unit ');
          if (!EasySubOrg.MAP.cu_01.isMapReady() ){
            console.log("##########Map Not Ready##########");
            setTimeout( function(){
              //get_reg_object_ref = EasySubOrg.RIDE.reg_of_cu.toJSON();

              EasySubOrg.RIDE.search_view_01.topLevelChangeToRideMode() ;
              EasySubOrg.RIDE.reg_of_cu.set(get_reg_object_ref, {silent:true});   
              EasySubOrg.RIDE.search_view_01.requestSearchResult();       
            },500);
          }
          else{
            console.log("map ready situaiton, ride search");
            EasySubOrg.RIDE.search_view_01.topLevelChangeToRideMode() ;     
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
          if (toJSONobject.hasOwnProperty(k) && toJSONobject[k]!= null) {
             tbr.push( k+"="+ encodeURI(toJSONobject[k].toString()) +"&" );
          }
      }
      tbr = tbr.join("").slice(0,-1);
      return   tbr;
    },
    initialize:function(){
      //listening to rental search control unit, once there is a change in rental search control unit,
      //the rentalSearchNavi will be called
      console.log("init() of ES_Router");
      var ClassRef = this;
      this.listenTo(EasySubOrg.RENTAL.rs_cu_01,'change',this.rentalSearchNavi); // URL will change
      this.listenTo(EasySubOrg.RIDE.reg_of_cu,'change',function() {
        ClassRef.rideSearchNavi();  // this is regs control URL
      });
      
    }
  });
  
  EasySubOrg.comm_unit = new COMMUNICATION_UNIT(); 
  EasySubOrg.UTILITIES.router = new ES_Router();
  Backbone.history.start(); 
});