"use strict"
$(document).ready(function mainsite_ready_logic(){
  //EasySubOrg.MAP created at es_mainsite_ui.js
  //EasySubOrg.MAP.mapcover initialized at es_mainsite_ui.js
  /*get two key object from "es_mainsite_ui.js"*/
  var userCatLookUp = [null, "lease", "rent", "co-lessee"];
  var mapcover = window.mapcover;
  window.mapcover = null;
  delete window.mapcover;
  
  var temp_marker_controller = window.temp_marker_controller ;
  window.temp_marker_controller = null;
  delete window.temp_marker_controller;

  // Create the namespace for filter
  EasySubOrg.createNS("EasySubOrg.Filter");
  EasySubOrg.Filter.listing = new (Backbone.Epoxy.View.extend({
    // this.model is available
    el:"#filter-container",
    generateQueryFromModel:function() {
      var ClassRef = this;
      var valid_obj = _.omit(ClassRef.model.toJSON(), function(value, key, object){
        if (value) return false;  // reture true means this value and its key should be omitted
        else return true;
      })
      var tbr = [];
      _.each(valid_obj, function(value, key, obj){
        tbr.push(key+"="+value);
      });
      return tbr.join("&");
    },

    initialize:function(){
      var ClassRef = this;
      var watchlist= ["change:user_behavior.cat",
        "change:user_behavior.target_whole_unit",
        "change:user_behavior.target_single_room",
        "change:user_behavior.target_shared_place"]

      $("input[type='checkbox'] , input[type='radio']").click(function(){
        var to_be_set_value = null;
        var attr_name = $(this).attr("name");
        if ($(this).attr("type") == 'radio'){
          to_be_set_value = $(this).val();
        } else {
          to_be_set_value = $(this).prop("checked");
        }
        ClassRef.model.set(attr_name, to_be_set_value);
      });

      this.model.on(watchlist.join(" "), function behaviorChangeHandler (){
        var query = ClassRef.generateQueryFromModel();
        EasySubOrg.comm_unit.requestData("/data_api/listing/conditional", query, function success(data){
          // expecting an array
          console.log(data);
          EasySubOrg.mapmng.set("listing_data", data);
        }, "json");
      })
      // this.model.on("change:user_behavior.target_whole_unit", function behaviorChangeHandler (){
      //   console.log(ClassRef.generateQueryFromModel());
      // })
    }

  }))(
    {model:new Backbone.Model({
      "user_behavior.cat":null,
      "user_behavior.target_whole_unit":false,
      "user_behavior.target_single_room":false,
      "user_behavior.target_shared_place":false,
    })}
  );



  EasySubOrg.createNS("EasySubOrg.mapmng");
  EasySubOrg.mapmng = new ( Backbone.Model.extend({
    defaults:{
      listing_data:[],
      marker_controllers:[]
    },
    clearRenderingData:function(){
      console.log("cleared data");
      var ClassRef = this;
      _.each(ClassRef.get("marker_controllers"), function(controller, index, ar){
        controller.delete();
      });
      ClassRef.set("marker_controllers", []);
    },
    renderData:function(){
      var ClassRef = this;
      var marker_controllers_ref = ClassRef.get("marker_controllers");
      var temp_marker_option = {
        anchor: null,
        datacontent:{"displayedText":"someone want to lease here"},
        latLng:new google.maps.LatLng(-33.397, 150.644),// mapcover.model.get("mc_map_events")['rightclick'].latLng,
        map: mapcover.model.get("map")
      }

      _.each( ClassRef.get("listing_data"), function(element, index, arr){
        var tempUrl = EasySubOrg.comm_unit.generateListUrl(element._id, false);
        var tempLatLng = new google.maps.LatLng( element.unit_traits.lat, element.unit_traits.lng);
        var tempcontent = {"displayedText":'<a href=\"'+tempUrl +'\" target="_blank">someone want to lease here</a>'};
        temp_marker_option.latLng = tempLatLng;
        temp_marker_option.datacontent = tempcontent;
        var temp_controller  = mapcover.addCustomMarker("CustomMarker1"  ,temp_marker_option);
        $(temp_controller.get("custom_marker").getDOM()).addClass(userCatLookUp[element.user_behavior.cat] )
        marker_controllers_ref.push( temp_controller );
      });

      console.log("map data changed");

    },

    initialize:function(){
      var ClassRef = this;
      this.on("change:listing_data", function(){
        ClassRef.clearRenderingData();
        ClassRef.renderData();
      });
    }
  }))()  

});