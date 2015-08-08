"use strict"
$(document).ready(function es_mainsite_ui_doc_ready(){
  var userCatLookUp = [null, "lease", "rent", "co-lessee"];
  $('#site-content').mouseleave(function(){
    $('.expanded-panel').hide();
  })    
  $('.top-option').mouseenter(function(){
    $('.expanded-panel').hide();
    $($(this).data('expansion-target')).show();
  });
  $('.expanded-panel').mouseleave(function(){
    $(this).hide();
  });

  // realize drag and select for date selection module
  (function durationDragging ( isDragging){
    /*first control dragging indicator*/
    var mouse_pressed =false;
    $(".filter-duraton-container").mousedown(function(){
      mouse_pressed = true;
    }).mousemove(function(){
      if (mouse_pressed === true){
        isDragging = true;
      } else{
        isDragging = false;
      }

    }).mouseup(function(){
      mouse_pressed = false;
    });

    $(".filter-month").mousemove(function(){
      var $this = $(this); // move this into a safer reference
      if(isDragging && !$this.hasClass('filter-month-selected')){
        $this.addClass("filter-month-selected");
        if ($this.hasClass("filter-month-hovered")) $this.removeClass("filter-month-hovered");
      }
    }).click(function(){
      var $this = $(this); // move this into a safer reference
      if (!$this.hasClass('filter-month-selected')){
        $this.addClass("filter-month-selected");
        if ($this.hasClass("filter-month-hovered")) $this.removeClass("filter-month-hovered");
      } else{
        $this.removeClass("filter-month-selected");
      }
    }).mouseenter(function filterMonthMouseenterHandler (){
      if (!$(this).hasClass('filter-month-selected')  && !isDragging){
        $(this).addClass("filter-month-hovered");
      }
    }).mouseleave(function filterMonthMouseleaveHandler (){
      if (!$(this).hasClass('filter-month-selected') && !isDragging && $(this).hasClass('filter-month-hovered') ){
        $(this).removeClass("filter-month-hovered");
      }
    });

  })(false);


  EasySubOrg.createNS("EasySubOrg.MAP");
  //30.620600000000003, -96.32621
  EasySubOrg.MAP.mapcover = initMapCover( 'mapcover', 'mapcover-map', 
    { 
      draggingCursor:"move",
      draggableCursor:"auto",
      center: { lat: 30.62060000, lng: -96.32621},
      zoom: 14,
      zoomControl:false,    //left side
      panControl:false,     //left top corner: 
      mapTypeControl:false  //right top corner: "map|satellite"
    } 
  );

  var mapcover = EasySubOrg.MAP.mapcover;
  //I need to export this to window scope to pass this to es_mainsite_logic.js
  window.mapcover = mapcover;
  var current_map = mapcover.model.get("map");

  mapcover.initCustomMarker( "CustomMarker1" , _.template( $('#customMarkerTemplate').html()));

  var temp_marker_option = {
    anchor: null,
    datacontent:{"displayedText":"Click marker to finish listing"},
    latLng:new google.maps.LatLng(-33.397, 150.644),// mapcover.model.get("mc_map_events")['rightclick'].latLng,
    map: null,
    click:function(custom_marker){
      var controller = custom_marker._controller;
      // console.log(controller.get("mongo_model"));
            
    }
  };
  var temp_marker_controller = mapcover.addCustomMarker("CustomMarker1"  ,temp_marker_option);

  var markerPlacerHelper = function( map_attached_css_class){
    temp_marker_controller.set("latLng",mapcover.model.get("mc_map_events")['rightclick'].latLng );
    if (temp_marker_controller.get("map")==null){
      temp_marker_controller.set("map",mapcover.model.get("map"));
    }
    if (map_attached_css_class){
      var candidate_class = ["rent", "lease","co-lessee"];
      _.each(candidate_class, function(classname, index, ar){
        $(temp_marker_controller.get("custom_marker").dom_).removeClass(classname);
      });
      $(temp_marker_controller.get("custom_marker").dom_).addClass(map_attached_css_class); 
    }

    var temp_model = null;
    if (!temp_marker_controller.get("mongo_model")){
      var temp_model = JSON.parse($("#default-detailed-rental-listing").attr("content"));
      temp_marker_controller.set("mongo_model", temp_model);
      temp_model = temp_marker_controller.get("mongo_model");
    } else {
      temp_model = temp_marker_controller.get("mongo_model");
    }
    // update attributes
    temp_model.unit_traits.lat = temp_marker_controller.get("latLng").lat();
    temp_model.unit_traits.lng = temp_marker_controller.get("latLng").lng();
    temp_model.user_behavior.cat = userCatLookUp.indexOf(map_attached_css_class);
    mapcover.hideContextMenu();
  }
  /*assign logic to context menu*/
  $("#place-rent-marker").click(function placeMarker1(){
    markerPlacerHelper("rent");  // use recent right click event latLng to locate this custom marker

  });
  $("#place-lease-marker").click(function placeMarker1(){
    markerPlacerHelper("lease");

  });
  $("#place-colessee-marker").click(function placeMarker1(){
    markerPlacerHelper("co-lessee");

  });

});