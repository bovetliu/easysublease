"use strict"
$(document).ready(function es_mainsite_ui_doc_ready(){
  var userCatLookUp = [null, "lease", "rent", "co-lessee"];
  var duration_panel_visibility = false;

  /*build event for duration panel hide*/
  var event_dph = document.createEvent("Event");
  event_dph.initEvent('dph',true,true);


  $('#site-content').mouseleave(function(){
    dispatchSignalThathDurationPanelHidden();
    $('.expanded-panel').hide();
  })    
  $('.top-option').mouseenter(function(){
    $('.expanded-panel').hide();
    if ($(window).width() > 768){
      $($(this).data('expansion-target')).show();
      if ($(this).data('expansion-target') == "#expanded-panel-duration"){
        duration_panel_visibility = true;
      }
    }
  });
  $('.expanded-panel').mouseleave(function(){
    if(this.id == "expanded-panel-duration"){ dispatchSignalThathDurationPanelHidden();}
    $(this).hide();
  });

  function dispatchSignalThathDurationPanelHidden () {
    if (duration_panel_visibility === true){
      //at this moment, duration panel is on, later on it will be hidden,
      // so it is right time to dispatch event
      document.dispatchEvent(event_dph);
      duration_panel_visibility = false;
    }
  }
  // realize drag and select for date selection module
  (function durationDragging ( isDragging){
    /*first control dragging indicator*/
    /*prepare modal*/
    var compiled_day_input_content = _.template($("#filter-day-content-template").html());
    $("#btn-filter-day-cancel").click(function(){
      var target_month_id = "#m"+ $("#current-month-day").data("target-month");
      $(target_month_id).removeClass("filter-month-selected");
      $("#es-mainsite-multipurpose").modal("hide");
    });
    $("#btn-filter-day-save").click(function(){
      var target_month_id = "#m"+ $("#current-month-day").data("target-month");

      $.data( $(target_month_id)[0], "month", $(target_month_id).data("month")+'-'+$('#current-month-day').val() );
      $(target_month_id).html($(target_month_id).data("month-text")+" " + $('#current-month-day').val());
      console.log($(target_month_id).data("month"));
    });


    var mouse_pressed =false;
    var drag_start_time = 0;
    $(".filter-duraton-container").mousedown(function(){
      mouse_pressed = true;
      drag_start_time = Date.now();
    }).mousemove(function(){
      if (mouse_pressed === true && ( Date.now() - drag_start_time > 60) ){
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
        // this is one selected month
        $("#es-mainsite-multipurpose .modal-body").html(compiled_day_input_content({day_type:"start day", target_month:$this.data("month") }));
        $("#es-mainsite-multipurpose").modal("show");

        console.log("show") 
        // $this.removeClass("filter-month-selected");
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
  var current_map = mapcover.model.get("map");

  mapcover.initCustomMarker( "CustomMarker1" , _.template( $('#customMarkerTemplate').html()));

  var marker_click_fn = function(custom_marker){
    var controller = custom_marker._controller;
    console.log(controller.get("mongo_model"));
    controller.set("datacontent",{"displayedText":"Preparing..."})
    EasySubOrg.comm_unit.postDetailedListing( controller.get("mongo_model"), function(dataReturned, status){
      // dataReturned  is instance.toObject()
      var url = EasySubOrg.comm_unit.apiServerURL()+"/listing/" + dataReturned._id;
      if (status == "success"){
        console.log(dataReturned);
        controller.set("datacontent",{"displayedText":'<a href=\"'+url+'\" target="_blank">Good to go! Click me again</a>'}) 
        $(custom_marker.getDOM()).addClass(userCatLookUp[controller.get("mongo_model").user_behavior.cat] );
        controller.set("click",null);
      }
    });
  }// click handler

  var temp_marker_option = {
    anchor: null,
    datacontent:{"displayedText":"Click marker to finish listing"},
    latLng:new google.maps.LatLng(-33.397, 150.644),// mapcover.model.get("mc_map_events")['rightclick'].latLng,
    map: null,
    click: marker_click_fn
  };
  var temp_marker_controller = mapcover.addCustomMarker("CustomMarker1"  ,temp_marker_option);

  var markerPlacerHelper = function( map_attached_css_class){
    temp_marker_controller.set("datacontent",{"displayedText":"Click marker to finish listing"} );

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
    temp_marker_controller.set("click",marker_click_fn);

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


  window.mapcover = mapcover;
  window.temp_marker_controller = temp_marker_controller;
});