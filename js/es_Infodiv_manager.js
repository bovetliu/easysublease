Object.size = function(obj) {   // zhuan men yong lai gaoding associative array
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
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
		$( jq_id_str).show();
	},

	setPurpose : function ( ) {
		var ClassRef = this;
		//modeliteral consider using this.model.get('info_div_mode')
		var modeliteral = this.model.get('info_div_purpose');

		var width = this.$el.css("width"), left = this.$el.css("left") ;
		switch ( modeliteral ) {
			case "rental_form":
				left = '70%';
				//EasySubOrg.RIDE.cu_01.get('_control_panel').hide();
				ClassRef.show('#rental-form-slot');
				ClassRef.$el.addClass("input-group-dimension-control");	
				break
			case "ride_form":
				left = '70%';
				///EasySubOrg.RIDE.cu_01.get('_control_panel').show();
				ClassRef.show('#ride-form-slot');
				ClassRef.$el.addClass("input-group-dimension-control");	
				break
			case "ride_result":
				width = '60%';
				left = '40%';
				//EasySubOrg.RIDE.cu_01.get('_control_panel').hide();
				ClassRef.show('#ride-results-slot');
				ClassRef.$el.removeClass("input-group-dimension-control");
				this.model.set("bAnimate",true);	
				break
			default:
				width = "30%";
				left = "100%"
				//EasySubOrg.RIDE.cu_01.get('_control_panel').hide();
				ClassRef.show('#rental-form-slot');
				ClassRef.$el.addClass("input-group-dimension-control");
				//console.log( "info div default mode");
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
		var splitedOrigin = originStr.split(", ");
		var splitedDestiny = destinyStr.split(", ");
	  splitedOrigin[2] = splitedOrigin[2].split(" ")[0];  // "TX 77840"  => "TX" 
		splitedDestiny[2] = splitedDestiny[2].split(" ")[0];
		var tbr_origin_destiny = ["",""];
		var endOfSlice = 4;
		while( splitedOrigin[endOfSlice-1] == splitedDestiny[endOfSlice-1] ) {
			endOfSlice = endOfSlice -1;
			if (endOfSlice == 0) break;
		}
		if (endOfSlice <= 1) {endOfSlice = 2;}
	  tbr_origin_destiny[0] = splitedOrigin.slice(0,endOfSlice).join(", ");
		tbr_origin_destiny[1] = splitedDestiny.slice(0,endOfSlice).join(", ");
		return tbr_origin_destiny;
	},

	generate_dataentry_div : function( entry_data_ary) {
		//for example ._array1[i] = {id: , cat: , origin: , destiny: , source: , memo: , jsonlatlngs: , encoded_polyline: }
		//                                 origin, and destiny are all characters
		var cat_string = "";
		if ( entry_data_ary['cat'] == 1) {
			cat_string = "provide a ride";	
		}
		else if ( entry_data_ary['cat'] == 2) {
			cat_string = "need a ride";
		}
		else if (entry_data_ary['cat'] ==3) {
			cat_string = "self-drive travel";
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