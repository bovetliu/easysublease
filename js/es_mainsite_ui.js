$(document).ready(function es_mainsite_ui_doc_ready(){

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
  var current_map = mapcover.model.get("map");

  mapcover.initCustomMarker( "CustomMarker1" , _.template( $('#customMarkerTemplate').html()));

  var markerPlacerHelper = function( map_attached_css_class){
    var temp_marker_option = {
      anchor: null,
      datacontent:{"displayedText":"Click marker to finish listing"},
      latLng: mapcover.model.get("mc_map_events")['rightclick'].latLng,
      map: mapcover.model.get("map"),
      click:function(container_node){
        alert("I am created By you via ContextMenu");
      }
    };
    var temp_marker_controller = mapcover.addCustomMarker("CustomMarker1"  ,temp_marker_option);
    if (map_attached_css_class){
      $(temp_marker_controller.get("custom_marker").dom_).addClass(map_attached_css_class); 
    }
    mapcover.hideContextMenu();
  }
  /*assign logic to context menu*/
  $("#place-rent-marker").click(function placeMarker1(){
    markerPlacerHelper("rent");
  });
  $("#place-lease-marker").click(function placeMarker1(){
    markerPlacerHelper("lease");
  });
  $("#place-colessee-marker").click(function placeMarker1(){
    markerPlacerHelper("co-lessee");
  });

});