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
    setBoundaryFilter:function( googleBounds){
      var ClassRef = this;
      var ne = googleBounds.getNorthEast();
      var sw = googleBounds.getSouthWest();
      var lats = _.sortBy([ne.lat(), sw.lat()], function(num){return num; });
      var lngs = _.sortBy([ne.lng(), sw.lng()], function(num){return num; });
      ClassRef.model.set("unit_traits.lat-lb", lats[0].toFixed(5));
      ClassRef.model.set("unit_traits.lat-hb", lats[1].toFixed(5));
      ClassRef.model.set("unit_traits.lng-lb", lngs[0].toFixed(5));
      ClassRef.model.set("unit_traits.lng-hb", lngs[1].toFixed(5));
    },
    updateBoundaryFilter:function(){
      var ClassRef = this;
      var map = mapcover.model.get("map");
      ClassRef.setBoundaryFilter(map.getBounds());
    },
    generateQueryFromModel:function() {
      var ClassRef = this;

      var valid_obj = _.omit(ClassRef.model.toJSON(), function(value, key, object){
        if (Array.isArray(value)){
          if (value.length == 0){
            return true;
          }else {
            return false;
          }
        } else {
          if (!value){
            return true;
          }else {
            return false;
          }
        }
      });
      var tbr = [];
      _.each(valid_obj, function(value, key, obj){
        tbr.push(key+"="+value);
      });
      return tbr.join("&");
    },

    initialize:function(){
      var ClassRef = this;
      var watchlist= ["change:user_behavior.cat",
        "change:user_behavior.target_range",
        "change:unit_traits.price-lb",
        "change:unit_traits.price-hb",
        "change:listing_related.availability.begin-hb",
        "change:listing_related.availability.end-lb"
      ];
      /*update price*/
      ClassRef.$el.find('#btn-update-price-filter').click(function(){
        if ( ($.isNumeric($('#price-lb').val()) || $('#price-lb').val()=="") && ($.isNumeric($('#price-hb').val()) || $('#price-hb').val()=="") ){
          ClassRef.model.set("unit_traits.price-lb", $('#price-lb').val());
          ClassRef.model.set("unit_traits.price-hb", $('#price-hb').val());
        } else {alert("wtf you put in the input");}
      });

      /*data updating for room type and category*/
      ClassRef.$el.find("input[type='checkbox'] , input[type='radio']").click(function(){
        var to_be_set_value = null;
        var attr_name = $(this).attr("name");
        if ($(this).attr("type") == 'radio'){
          to_be_set_value = $(this).val();
        } else {
          to_be_set_value = [];
          var $checked_checkbox = $("input[type='checkbox']:checked")
          _.each($checked_checkbox, function(element, index, ar){
            to_be_set_value.push( parseInt($(element).val() ));
          });
          // console.log(to_be_set_value);
        }
        ClassRef.model.set(attr_name, to_be_set_value);
      });

      /*most difficult one is updating availability date, I have to wirte custom event and dispatch it at proper time*/
      document.addEventListener("dph", function(e){
        // console.log("dph triggered")
        var selected_month_ar = []
        var target_arr = $(".filter-month-selected");
        _.each(target_arr, function(element, index, ar){   // this is blocking callback
          selected_month_ar.push($(element).data("month"));
        });
        var gotPeriods = EasySubOrg.UTILITIES.misc.getPeriods(selected_month_ar);
        if (gotPeriods.length ===1){
          ClassRef.model.set(gotPeriods[0]);
        }
      });

      // window.handle_date_bounds_change is defined at es_mainsite_ui.js, have no idea
      this.model.on("change:listing_related.availability.begin-hb change:listing_related.availability.end-lb",window.handle_date_bounds_change, ClassRef.model)

      this.model.on(watchlist.join(" "), function behaviorChangeHandler (){
        ClassRef.updateBoundaryFilter();
        var query = ClassRef.generateQueryFromModel();
        EasySubOrg.comm_unit.requestData("/data_api/listing/conditional", query, function success(data){
          // expecting an array
          // console.log(data);
          EasySubOrg.mapmng.set("listing_data", data);
        });
      });

      // add some initial data
      //http://stackoverflow.com/questions/832692/how-can-i-check-whether-google-maps-is-fully-loaded
      google.maps.event.addListenerOnce(mapcover.model.get("map"), 'idle', function(){
        var initial_query="unit_traits.lat-lb=30&unit_traits.lat-hb=31&unit_traits.lng-lb=-96.5&unit_traits.lng-hb=-96"
        EasySubOrg.comm_unit.requestData("/data_api/listing/conditional", initial_query, function success(data){
          EasySubOrg.mapmng.set("listing_data", data);
        });
      });

    }

  }))(  //EasySubOrg.Filter.listing.model
    {model:new Backbone.Model({
      "user_behavior.cat":null,
      "user_behavior.target_range":[],  // shoule be Array

      "unit_traits.lat-lb":null,
      "unit_traits.lat-hb":null,
      "unit_traits.lng-lb":null,
      "unit_traits.lng-hb":null,
      "unit_traits.price_single-lb":null,
      "unit_traits.price_single-hb":null,
      "unit_traits.price_total-lb":null,
      "unit_traits.price_total-hb":null,
      "listing_related.availability.begin-hb":null,  // should contain 
      "listing_related.availability.end-lb":null
    })}
  );





  EasySubOrg.createNS("EasySubOrg.mapmng");
  EasySubOrg.mapmng = new ( Backbone.Model.extend({
    defaults:{
      listing_data:[],
      marker_controllers:[],
      boolean_update_boundary:true,
      data_layer_bus_routes:'js/bus_routes.json',
      map: mapcover.model.get("map")
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
        var temp_title = EasySubOrg.UTILITIES.misc.adaptiveInterceptString(element.listing_related.title, 30);
        switch(element.user_behavior.cat){
          case 1:
            var tempcontent = {"displayedText":'<a href=\"'+tempUrl +'\" target="_blank">'+temp_title+'</a>'};
            break;
          case 2:
            var tempcontent = {"displayedText":'<a href=\"'+tempUrl +'\" target="_blank">'+temp_title+'</a>'};
            break;
          case 3:
            var tempcontent = {"displayedText":'<a href=\"'+tempUrl +'\" target="_blank">'+temp_title+'</a>'};
            break;
          default:
            var tempcontent = {"displayedText":'<a href=\"'+tempUrl +'\" target="_blank">someone [unrecognized behavior] here</a>'};
            break;
        }
        

        temp_marker_option.latLng = tempLatLng;
        temp_marker_option.datacontent = tempcontent;
        var temp_controller  = mapcover.addCustomMarker("CustomMarker1"  ,temp_marker_option);
        $(temp_controller.get("custom_marker").getDOM()).addClass(userCatLookUp[element.user_behavior.cat] )
        marker_controllers_ref.push( temp_controller );
      });

      // console.log("map data changed");

    },

    initialize:function(){
      var ClassRef = this;
      // load bus routes
      ClassRef.get("map").data.loadGeoJson(ClassRef.get("data_layer_bus_routes"));
      ClassRef.get("map").data.setStyle(function(feature) {
        return ({                                   ///@type {google.maps.Data.StyleOptions} 
        strokeColor: feature.getProperty('strokeColor'),
        strokeWeight: 6,
        strokeOpacity:0.5
        });
      }); 
      this.on("change:listing_data", function(){
        ClassRef.clearRenderingData();
        ClassRef.renderData();
      });
    }
  }))()  

});