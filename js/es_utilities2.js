
// Create the namespace for UTILITIES
EasySubOrg.createNS("EasySubOrg.UTILITIES"); 
//console.log("name space EasySubOrg.UTILITIES created");
// Create the namespace for the ajax management
EasySubOrg.createNS("EasySubOrg.comm_unit");
//console.log("name space EasySubOrg.comm_unit");
$(document).ready(function readyAtUtilities2(){
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
      $.ajax({
        url:  targetURL,
        data: {model:tobeSubmittedModel},
        crossDomain: true,
        type:"POST",
        success: callback  
      });
    },
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

    },
    
    /*
    *EasySubOrg.UTILITIES.router.respondToRideSearch( query )
    */
    respondToRideSearch : function( query ){
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

      
    }
  });
  
  EasySubOrg.comm_unit = new COMMUNICATION_UNIT(); 
  EasySubOrg.UTILITIES.router = new ES_Router();
  Backbone.history.start(); 
});