"use strict"
$(document).ready(function es_mainsite_ui_doc_ready(){
  var userCatLookUp = [null, "lease", "rent", "co-lessee"];
  var duration_panel_visibility = false;

  /*build event for duration panel hide*/
  var event_dph = document.createEvent("Event");
  event_dph.initEvent('dph',true,true);


  $('#site-content').mouseleave(function(){
    $('.expanded-panel').hide();
  })    
  $('.top-option').mouseenter(function(){
    $('.expanded-panel').hide();
    if ($(window).width() > 768){
      $($(this).data('expansion-target')).show();
    }
  });
  $('.expanded-panel').mouseleave(function(){
    $(this).hide();
  });

  //navbar
  $("#btn-listyourspace").click(function listYourSpaceClickHander(){
    $("#multi-purpose-modal-body").html("Please right click on map to list ! Specific listing page is not there yet");
    $("#es-mainsite-multipurpose").modal("show");
  });


  // UI method
  window.handle_date_bounds_change = function(){
    // "this" context changed into EasySubOrg.Filter.listing.model
    var begin = new Date(this.get("listing_related.availability.begin-hb"));
    var end = new Date(this.get("listing_related.availability.end-lb"));
    if (begin==null && end==null){   // data has been reset
      _.each($('.filter-month'), function(el, index, ar){
        $(el).removeClass("filter-month-selected");
        $(el).html($(el).data("month-text"));
      })

      return;
    }

    if (begin===null && end != null){
      // begin = Date.now();
    }
    if(end ===null && begin != null){
      // var temp_date = new Date();
      // end = temp_date.setMonth(temp_date.getMonth()+23).getTime();
    }
    console.log("begin: " + begin);
    console.log("end: " + end);
    var begin_id = ["#m", begin.getFullYear().toString(),"-",begin.getMonth()+1].join("");
    var end_id = ["#m", end.getFullYear().toString(),"-",end.getMonth()+1].join("");
    console.log("begin_id end_id: "+begin_id+" " + end_id)

    _.each($('.filter-month'), function(el, index, ar){
      var $el = $(el);
      $el.html($(el).data("month-text"));
      var temp_date = new Date($el.data("month"));
      if (temp_date.getTime()< begin.getTime() || temp_date.getTime()>end.getTime()){
        $el.removeClass("filter-month-selected");
      }
    });
    $(begin_id).addClass("filter-month-selected");
    $(end_id).addClass("filter-month-selected");

    if (begin_id != end_id){ // not in same month
      $(begin_id).html( $(begin_id).data("month-text")+" "+ begin.getDate());
      $(end_id).html( $(end_id).data("month-text")+" "+ end.getDate());
    } else {
      $(begin_id).html( $(begin_id).data("month-text")+" "+ begin.getDate() + " - " + $(end_id).data("month-text")+" "+ end.getDate());
    }
  };

  // realize drag and select for date selection module
  (function durationDragging ( isDragging){
    /*first control dragging indicator*/
    /*prepare modal*/
    var compiled_day_input_content = _.template($("#filter-day-content-template").html());

    $("#btn-duration-set").click(function(){
      document.dispatchEvent(event_dph);
    });
    $("#btn-duration-reset").click(function(){
      EasySubOrg.Filter.listing.model.set(
        {
          "listing_related.availability.begin-hb":null,
          "listing_related.availability.end-lb":null
        }
      );
    });
    $("#btn-filter-day-cancel").click(function(){
      console.log("check");
      var target_month_id = "#m"+ $("#current-month-day").data("target-month").slice(0,-2);
      console.log(target_month_id);

      $(target_month_id).removeClass("filter-month-selected");
      $("#es-mainsite-multipurpose").modal("hide");
      document.dispatchEvent(event_dph); // updating model according panel selected situation
    });
    $("#btn-filter-day-save").click(function(){
      var generated_date = new Date($("#current-month-day").data("target-month"));
      generated_date.setHours(12);
      if($("#current-month-day").val())
        generated_date.setDate($("#current-month-day").val());
      else {
        console.error("Invalid Input");
        return;
      }
      if (generated_date == "Invalid Date"){
        console.error("Invalid Date");
        return;
      } else if ($("#radio-duration-begin").prop("checked") && generated_date.getTime()> EasySubOrg.Filter.listing.model.get("listing_related.availability.end-lb") ){
        console.error("Invalid Date Range");
        return;
      } else if ($("#radio-duration-end").prop("checked") && generated_date.getTime() < EasySubOrg.Filter.listing.model.get("listing_related.availability.begin-hb")  ){
        console.error("Invalid Date Range");
        return;
      }
      console.log(generated_date);
      if ($("#radio-duration-begin").prop("checked")){
        EasySubOrg.Filter.listing.model.set("listing_related.availability.begin-hb", generated_date.getTime());
      }else if ($("#radio-duration-end").prop("checked")) {
        EasySubOrg.Filter.listing.model.set("listing_related.availability.end-lb", generated_date.getTime());
      } else {
        console.error("At least select one radio");
        return;
      }
      $("#es-mainsite-multipurpose").modal("hide");
    });


    var mouse_pressed =false;
    var drag_start_time = 0;  // this is used to distinguish use click and mistakenly become short drag
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
        $("#es-mainsite-multipurpose .modal-body").html(compiled_day_input_content({day_type:"select day", target_month:$this.data("month")}));
        $("#es-mainsite-multipurpose").modal("show");

        // console.log("show") 
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
  })(false);//(function durationDragging ( isDragging){...})() ends


  EasySubOrg.createNS("EasySubOrg.MAP");
  //30.620600000000003, -96.32621

  EasySubOrg.MAP.mapcover = initMapCover( 'mapcover-mapbox', 'mapcover-map-mapbox', 
    {    //google/mapcover
      map_vender:"mapbox",
      latLng:[30.62060,-96.32621],
      initial_zoom:14
    } 
  );
  
  var mapcover = EasySubOrg.MAP.mapcover;
  //I need to export this to window scope to pass this to es_mainsite_logic.js
  var current_map = mapcover.model.get("map");

  mapcover.initCustomMarker( "CustomMarker1" , _.template( $('#customMarkerTemplate').html()));

  var marker_click_fn = function(){
    // now have this context as custom_marker
    var custom_marker = this;
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

  // This is the only marker used to helper users do their list

  var temp_marker_option = {
    anchor: {x:50, y :100},
    datacontent:{"displayedText":"Click marker to finish listing"},
    latLng: L.latLng(-34.397, 150.644),// mapcover.model.get("mc_map_events")['rightclick'].latLng,  //google/mapcover
    map: null,
    click: marker_click_fn
  };
  var temp_marker_controller = mapcover.addCustomMarker("CustomMarker1"  ,temp_marker_option);

  var markerPlacerHelper = function( map_attached_css_class){
    temp_marker_controller.set("datacontent",{"displayedText":"Click marker to finish listing"} );
    if (temp_marker_controller.get("map")==null){
      temp_marker_controller.set("map",mapcover.model.get("map"));
    }
    temp_marker_controller.set("latLng",mapcover.model.get("mc_map_events")['rightclick'].latlng );  //google/mapcover, google edition: .latLng

    if (map_attached_css_class){
      var candidate_class = ["rent", "lease","co-lessee"];
      _.each(candidate_class, function(classname, index, ar){
        $(temp_marker_controller.get("custom_marker").getDOM()).removeClass(classname);
      });
      $(temp_marker_controller.get("custom_marker").getDOM()).addClass(map_attached_css_class); 
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
    temp_model.unit_traits.lat = temp_marker_controller.get("latLng").lat;  //google/mapcover
    temp_model.unit_traits.lng = temp_marker_controller.get("latLng").lng;  //google/mapcover
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