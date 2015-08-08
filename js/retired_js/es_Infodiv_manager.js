Object.size = function(obj) {   // zhuan men yong lai gaoding associative array
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

EasySubOrg.createNS("EasySubOrg.INFO");

EasySubOrg.INFO.info_div_reg = new Backbone.Model({
  "info_div_purpose":"default",
  "bShowing_results" : false,
  "bShowing_about" : false,
  "cache_content_before_clk_about":"",
  "instant_show_ride_form":true,
  "bAnimate":true
});

//EasySubOrg.INFO.info_view_01
var InfoView = Backbone.View.extend({  //InfoView class defition
  //for inlustration purpose: 
  // this.model is( EasySubOrg.INFO.info_div_reg)  == true
  el: $("#info-div"), 
  jq_about_panel : '',

  toggle_about : function () {
    if (!this.model.get('bShowingAbout')) {
      this.model.set('bShowingAbout', true);
      this.jq_about_panel.show();
    }
    else {
      this.model.set('bShowingAbout',false)
      this.jq_about_panel.hide();
    }
  },
  show :function( jq_id_str) {
    $('#ride-results-slot').hide();
    $('#ride-form-slot').hide();
    $('#rental-form-slot').hide();
    $('#rental-sesults-slot').hide();
    $( jq_id_str).show();
  },

  setPurpose : function ( ) {
    var ClassRef = this;
    //modeliteral consider using this.model.get('info_div_mode')
    var modeliteral = this.model.get('info_div_purpose');

    var width = this.$el.css("width"), left = this.$el.css("left") ;  // in es_custom_css1.css, default width is 30% (it is out of screen at that time)
    switch ( modeliteral ) {
      case "rental_form":
        left = '70%';
        ClassRef.show('#rental-form-slot');
        ClassRef.$el.addClass("input-group-dimension-control"); 
        break
      case "ride_form":
        left = '70%';
        ClassRef.show('#ride-form-slot');
        ClassRef.$el.addClass("input-group-dimension-control"); 
        break
      case "ride_result":
        //left = '800px';
        //width = ($("#map-div").width()-parseInt(left.slice(0,-2))  ).toString() + "px";
        left= "40%",
        width="60%",
        ClassRef.show('#ride-results-slot');
        ClassRef.$el.removeClass("input-group-dimension-control");
        this.model.set("bAnimate",true);  
        break
      default:
        width = "30%";
        left = "100%"
        ClassRef.show('#rental-form-slot');
        ClassRef.$el.addClass("input-group-dimension-control");
    } // end of switch
    // start animation part
    if ($("#info-div")){   //info-div
      $("#info-div").animate( {"width":width, "left":left},300, function () {
        //console.log("animation complete");
      } );
    }
  }, // end of set_purpose function attr 

  render_travel_result : function(data_array,  bAnimate) {  // should take arguments,
    // by default data_array is the server returned data, which is stored as property variable travel_control_i1 (instance of C_travel_control)
    var href = this;
    var data_array = (typeof data_array == 'undefined' || data_array == null )? EasySubOrg.MAP.cu_01.get("travel_search_result"):data_array ; 
    var bAnimate = (typeof (bAnimate)== 'undefined' || bAnimate== null )? true: bAnimate; 
    if ( _.size( data_array)>= 1) { // using underscore method here
      var temp_html = []
      for ( key in data_array ){
        //console.log(data_array[key]);
        temp_html.push(this.generate_dataentry_div( data_array[key] ));
      }
      //console.log("attention here: temp_html:"+temp_html);
      $("#travel_search_results_container").html(temp_html.join(""));
    }
    else { // process ZERO situation
      $("#travel_search_results_container").html("ZERO results returned");  
    }
    if (bAnimate) {
      //console.log("animation#####################");
      this.model.set({'info_div_purpose':'ride_result'});
    }
  },
  OriginDestinyComp : function ( originStr, destinyStr) {  // this need to change
    //if (originStr ==  destinyStr) { alert( originStr + "   " + destinyStr);}
    pattern = /[A-Z]{2}\s\d{5}/i;
    console.log(originStr);
    console.log(destinyStr);
    console.log("test");
    originStr= originStr.replace(pattern, function(matched){return matched.slice(0,2) });
    destinyStr= destinyStr.replace(pattern, function(matched){return matched.slice(0,2) });

    var splitedOrigin = originStr.split(",");
    var splitedDestiny = destinyStr.split(",");
    //var lengths = [splitedOrigin.length, splitedDestiny.length];
    var o_index = splitedOrigin.length, d_index = splitedDestiny.length;
    for (o_index, d_index ; o_index >=0 && d_index>=0 ; o_index--,d_index-- ) {
      if (splitedOrigin[o_index] != splitedDestiny[d_index]) {
        break
      }
    }
    var tbr_origin_destiny = []
    tbr_origin_destiny[0] = splitedOrigin.slice(0, o_index+1).join(",");
    tbr_origin_destiny[1] = splitedDestiny.slice(0,d_index+1).join(",");
    return tbr_origin_destiny;

  },

  generate_dataentry_div : function( entry_data_ary) {
    //for example ._array1[i] = {id: , cat: , origin: , destiny: , source: , memo: , jsonlatlngs: , encoded_polyline: }
    //                                 origin, and destiny are all characters
    var cat_string = "";
    if ( entry_data_ary['cat'] == 1) {
      cat_string = "Provide a ride";  
    }
    else if ( entry_data_ary['cat'] == 2) {
      cat_string = "Need a ride";
    }
    else if (entry_data_ary['cat'] ==3) {
      cat_string = "Self-drive travel";
    } 
    var origin_destiny = this.OriginDestinyComp(entry_data_ary['origin'],entry_data_ary['destiny'] );
    
    tbr = EasySubOrg.MAP.render_01.templateRouteInfo({ 
      id:entry_data_ary['_id'], origin:origin_destiny[0], destiny:origin_destiny[1],
      cat_string:cat_string,   depart_date:entry_data_ary['depart_date'], source: entry_data_ary['source'],
      memo:entry_data_ary['memo']
    });
    return tbr;
  },
  initialize : function () {
    console.log( "init() of InfoView" );
    var ClassRef = this;
    ClassRef.$el = $('#info-div'); 
    ClassRef.jq_about_panel = $('#about-panel');
    ClassRef.setPurpose();
    _.each( ClassRef.$(".form-rtn-btn"),function(dom,index,ar){
      dom.onclick = function(){
        ClassRef.model.set('info_div_purpose','default');
      }   
    });
    this.listenTo ( EasySubOrg.INFO.info_div_reg , 'change:info_div_purpose', this.setPurpose);
  },
}); // InfoView class definition ends