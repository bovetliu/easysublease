
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
      if ( location.host != "localhost")
      return "http://listingtest-u7yhjm.rhcloud.com";
      else return "http://localhost:3000";
    },
    /*
    * EasySubOrg.comm_unit.generateListUrl(_id, is_edit)
    */
    generateListUrl: function( _id, is_edit){
      if (!is_edit)
        return this.get("listingServerURL") + "/listing/" + _id;
      else
        return this.get("listingServerURL") + "/edit/" + _id;
    },
    postDetailedListing:function(tobeSubmittedModel, callback){
      // tobeSubmittedModel is JSON stringified
      tobeSubmittedModel = JSON.stringify(tobeSubmittedModel);
      targetURL = this.get("listingServerURL") + "/listing";
      console.log(targetURL);
      $.ajax({
        url:  targetURL,
        data: {model:tobeSubmittedModel},
        crossDomain: true,

        dataType:"json",
        type:"POST",
        success: callback  
      });
    },
    /*
    * EasySubOrg.comm_unit.requestData(route_name, query, successCallBack)
    */
    requestData:function(route_name, query, successCallBack){
      /*
        1./listing/conditional?[query]
        2./listing_core/conditional?[query]
        3./listing/:id  
      */

      var targetURL = this.get("listingServerURL");
      switch(route_name){
        case "/data_api/listing/conditional":
          targetURL = targetURL + route_name + '?' + query;
          break;
        case "/data_api/listing_core/conditional":
          targetURL = targetURL + route_name + '?' + query;
          break;
        case "/data_api/listing":
          targetURL = targetURL + route_name+ '/' + query;
          break;
        default:
          console.error("unrecognized route: " + route_name);
          return;
          break;
      }
      targetURL = encodeURI(targetURL);
      console.log("OUT URL: " + targetURL);
      $.get(targetURL, successCallBack);
    },

    initialize: function(){
      var ClassRef = this;
      console.log("init() of EasySubOrg.comm_unit");
      /*initialize*/
      if (location.host!="localhost"){
        this.set("is_local_listing_server", false);
      } else {
      }

      this.set("listingServerURL", ClassRef.apiServerURL() );

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
  
  /*some utility functions put into EasySubOrg.UTILITIES.misc*/
  EasySubOrg.UTILITIES.misc = {

    /*EasySubOrg.UTILITIES.misc.getPeriods(month_array);*/
    getPeriods: function ( month_array){
      console.log(month_array);
      var tbr = [
        {
          "listing_related.availability.begin-hb":null,
          "listing_related.availability.end-lb":null
        }
      ];
      if (month_array.length===0){
        return tbr;
      }
      var begin_date = new Date(month_array[0]);
      var tentative_end_date = new Date(month_array[0]);
      var end_date = new Date(month_array[month_array.length-1]);

      tentative_end_date.setMonth( begin_date.getMonth()+month_array.length-1);

      console.log("tentative_end_date "+ tentative_end_date + " end_date: " + end_date);
      if ( tentative_end_date.getFullYear() == end_date.getFullYear() && tentative_end_date.getMonth() == end_date.getMonth()){
        var begin_hb_date = new Date(month_array[0]);
        begin_hb_date.setDate(1);
        begin_hb_date.setHours(12);
        tbr[0]["listing_related.availability.begin-hb"] = begin_hb_date.getTime();
        
        var end_lb_date = new Date(month_array[month_array.length-1]);
        end_lb_date.setMonth(end_lb_date.getMonth()+1);
        end_lb_date.setDate(end_lb_date.getDate()-1);
        end_lb_date.setHours(12);
        tbr[0]["listing_related.availability.end-lb"] = end_lb_date.getTime();
        return tbr;
      }
      else{
        console.error("所选月份并非一个整的周期");
        return [];  // means something wrong
      }
    }
  }

  EasySubOrg.comm_unit = new COMMUNICATION_UNIT(); 
  EasySubOrg.UTILITIES.router = new ES_Router();
  Backbone.history.start(); 
});