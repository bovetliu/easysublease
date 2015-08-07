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

});