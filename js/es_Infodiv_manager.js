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
//constructor of infodivmng
function Infodivmng( info_div ) {
	//the constructor takes the info_div as argument
	Infodiv_ref = this;
	this._info_div = info_div;
	this.jq_about_panel = $('#about-panel');
	this.bShowingResults = false;
	this.bShowingAbout = false;
	this.cache_content_before_clk_about = null;
	this.travel_search_results_content ="";
	
	if (Infodiv_ref.travel_search_results_content == "") {  // initialize content of travel_search_results_content
		console.log("part of init() Infodivmng: fillin text of Infodiv_ref.travel_search_results_content "); // results rendering page
		jQuery.get('travel-search-results.php', function(data) {Infodiv_ref.travel_search_results_content = data; });  // content3 is travel form
	}
	
	this.about_content = null;
	if (this.about_content == null) { 
		jQuery.get('about_content.php', function(data) { Infodiv_ref.about_content = data ;	
		});  // content3 is travel form
	}
	
}
Infodivmng.prototype.set_form_purpose = function (  instant_show_ride_form ) {
	
	var ClassRef = this;
	if (this.bShowingResults ) {
		EasySubOrg.RIDE.cu_01.get('_control_panel').show();
		/*
		$("#map-div").animate({
				width: '70%'
		});
		*/
		$("#info-div").animate( {
				width:'29%',
				left:'70%'
		},400, 'swing', function () {
			if (!instant_show_ride_form ){
					ClassRef.show('#ride-form-slot');
			}
			$('#info-div').removeClass("info-div-results-style");
			$("#info-div").addClass("input-group-dimension-control");		
		});//width("29%");			
		this.bShowingResults = false;
		$("#ipt-date-tr").datepicker();
		// I also need to keep the category box functioning
	}
	this.bShowingAbout = false;
}

Infodivmng.prototype.set_results_purpose = function () {
	Infodiv_ref = this;
	this.show('#ride-results-slot');	
	if (!this.bShowingResults ) {
		EasySubOrg.RIDE.cu_01.get('_control_panel').hide();
		$("#info-div").removeClass("input-group-dimension-control");
		/*---adjust width portions of #map-div and #info-div----*/
		$('#info-div').addClass("info-div-results-style");
		console.log("Infodivmng Class: #info-div added class: info-div-results-style ");
		//$("#map-div").animate( {width:'40%'});//width("40%");
		$("#info-div").animate({width:'60%',left:'40%'});
	  /*light weighted jQuery code for this search results displaying page*/
		//$("#travel-search-results-rtn-btn").click( function() {
			//Infodiv_ref.render_travel_form();
		//});	
		this.bShowingResults = true;
	}
	this.bShowingAbout = false;	
}

Infodivmng.prototype.show = function( jq_id_str) {
	$('#ride-results-slot').hide();
	$('#ride-form-slot').hide();
	$('#rental-form-slot').hide();
	$( jq_id_str).show();
}

/**
*
*
*/
Infodivmng.prototype.render_housing_form = function () {
	this.show('#rental-form-slot');
	this.set_form_purpose();
}
/**
*
*
*/
Infodivmng.prototype.render_travel_form = function ( instant_show_ride_form) {
	
	if ( instant_show_ride_form ){
		this.show('#ride-form-slot');
	}
	
	this.set_form_purpose(instant_show_ride_form);
}

/**
*
*
*/
Infodivmng.prototype.toggle_about = function () {
	if (!this.bShowingAbout) {
		this.bShowingAbout = true;
		this.jq_about_panel.show();
	}
	else {
		this.bShowingAbout = false;
		this.jq_about_panel.hide();
	}
}
/**
*
*
*/
Infodivmng.prototype.render_travel_result = function(data_array ) {  // should take arguments,
  // by default data_array is the server returned data, which is stored as property variable travel_control_i1 (instance of C_travel_control)
	href = this;
	data_array = typeof data_array !== 'undefined' ? data_array : EasySubOrg.MAP.cu_01.get("travel_search_result");
	//href._info_div.innerHTML = this.travel_search_results_content;  // put static code into innerHTML of info div
	
	/**
	* later this part will be used for mapping results
	*/
	if ( Object.size( data_array)>= 1) { // if data_array is not null
	//if (false) { // if data_array is not null
		//console.log(data_array [0]);
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
	this.set_results_purpose();
}

Infodivmng.prototype.generate_dataentry_div = function( entry_data_ary) {
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
}

/*简化origin destiny string, 辅助函数*/
Infodivmng.prototype.OriginDestinyComp = function ( originStr, destinyStr) {
	//if (originStr ==  destinyStr) { alert( originStr + "   " + destinyStr);}
	splitedOrigin = originStr.split(", ");
	splitedDestiny = destinyStr.split(", ");
	splitedOrigin[2] = splitedOrigin[2].split(" ")[0];  // "TX 77840"  => "TX" 
	splitedDestiny[2] = splitedDestiny[2].split(" ")[0];
	tbr_origin_destiny = ["",""];
	endOfSlice = 4;
	while( splitedOrigin[endOfSlice-1] == splitedDestiny[endOfSlice-1] ) {
		endOfSlice = endOfSlice -1;
		if (endOfSlice == 0) break;
	}
	if (endOfSlice <= 1) {endOfSlice = 2;}
  tbr_origin_destiny[0] = splitedOrigin.slice(0,endOfSlice).join(", ");
	tbr_origin_destiny[1] = splitedDestiny.slice(0,endOfSlice).join(", ");
	return tbr_origin_destiny;

}
//**********************************************************************
// function waitfor - Wait until a condition is met, extracted from stackoverflow:http://stackoverflow.com/questions/7193238/wait-until-a-condition-is-true
//        
// Needed parameters:
//    test: function that returns a value
//    expectedValue: the value of the test function we are waiting for
//    msec: delay between the calls to test
//    callback: function to execute when the condition is met
// Parameters for debugging:
//    count: used to count the loops
//    source: a string to specify an ID, a message, etc
//**********************************************************************
Infodivmng.prototype.waitfor = function(test,expected_value, msec, count, source, callback) {
    // Check if condition met. If not, re-check later (msec).
    infohref = this;
		while (test() != expected_value) {
        count++;
				//alert(count);
				//alert(  test());
        setTimeout(function() {
            infohref.waitfor(test,expected_value, msec, count, source, callback);
        }, msec);
        return;
    }
    // Condition finally met. callback() can be executed.
    console.log(source + ': ' + test() +  ', ' + count + ' loops.');
    callback();
		return;
}