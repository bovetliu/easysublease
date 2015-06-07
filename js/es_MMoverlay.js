
EasySubOrg.createNS("EasySubOrg.MENU");
EasySubOrg.MENU.reg = new Backbone.Model({
	top:0,
	left:0,
	width:178,
	height:0,
	latLng:null,

	x0:null,
	y0:null,

});

var OverLayMenu = Backbone.View.extend({ 
	//this.model is EasySubOrg.MENU.reg
	el:$("#menu-panel"),
	overlay: null,  // place holder, overlay will be added in constructor of OverLayMenu

	_temp_infowindow : new google.maps.InfoWindow(),
	_marker: new google.maps.Marker({  // this initialization will "factually", graphically add one marker on map 
			//position: location,  // this should be set by user click on map
			//map:EasySubOrg.MAP.cu_01.get('map'),
			animation: google.maps.Animation.DROP
		}),
	compiledMappingFunc:null, // be function placeholder, at initialization, this one will be defined

	html_content : { // The key should be the same with work_mode of map_cu
		"default": [
			"Want to lease here",
			"Want rent here",
			"Seek co-lessee here"
		],
		"travel-mode" :[
			"Start route here",
			"End route here"
		]
	},
	/*this should be utility function of toggleOn*/
	correctRefPoint:function (pixel, new_center){

		console.log( "sent in pixel" + pixel.x + " " + pixel.y +" x0:" + this.model.get("x0") + " y0:" + this.model.get("y0") );  // 
		var new_vecter =  this.overlay.getProjection().fromLatLngToDivPixel(new_center);
		var xd = new_vecter.x - this.model.get("x0");
		var yd = new_vecter.y - this.model.get("y0");
		pixel.y = pixel.y + $("#title-big-div").height() + $("div.search-div").height() - yd;
		pixel.x = pixel.x- xd;
		//console.log([$("#title-big-div").height() , $("div.search-div").height()]);
		return pixel;
	},
	
	fromLatLngToDivPixel:null,  // function placeholder, it well be initiated when onAdd of this.overlay is invoked

	updateRegs:function(latLng, new_center){
		if (!latLng) { alert("updateRegs takes invalid argument");}
		//var projection = this.overlay.getProjection();
		var lefttop_pixel = this.correctRefPoint(  this.overlay.getProjection().fromLatLngToDivPixel(latLng) , new_center ); // convert latLng into screen position,
		
		//console.log(lefttop_pixel.x, lefttop_pixel.y );
		this.model.set({
			"latLng": latLng,
			"top":lefttop_pixel.y,
			"left":lefttop_pixel.x
		});
		this.$el.css({
			"top":lefttop_pixel.y.toString() + 'px',
			"left":lefttop_pixel.x.toString() + 'px'
		});
	},
	fillLogic:function( latLng){
		var ClassRef = this;
		var offset = 1;
		switch( EasySubOrg.MAP.cu_01.get('work_mode') ) {
			case "default":
				offset = 1;
				break;
			case "travel-mode":
				offset = 4;
				break;
			default:
				console.log("should not entere here fillLogic()");
				break;
		}
		_.each($('div.menu-option-div'),function (thisDOM, index, arr){
			thisDOM.onclick = function (){
				ClassRef.updateOthers(latLng, index+offset); 
				ClassRef.$el.hide();
			}; 
		});
	},
	pointInMenuDom:function (lefttop_pixel) {
		var cursorin = true;
		var left = this.model.get("left");
		var top = this.model.get("top");
		var width = this.model.get("width");
		var height = this.model.get("height");
		if ( lefttop_pixel.x < left || lefttop_pixel.x > left+width || lefttop_pixel.y < top || lefttop_pixel.y > top + height ) {
			cursorin = false;
		}
		return cursorin;
	},
	toggleOn: function(latLng, new_center) {
	  if (!latLng) { alert("toggleOn takes invalid argument"); } 
	  this.updateRegs(latLng, new_center);
	  this.fillLogic(latLng);
		this.$el.show();
	},
	toggleOff: function( latLng , new_center) {
		if (!latLng) { alert("toggleOff takes invalid argument"); } 
		var lefttop_pixel =  this.correctRefPoint( this.overlay.getProjection().fromLatLngToDivPixel(latLng), new_center); 
		if (! this.pointInMenuDom(lefttop_pixel)) { this.$el.hide(); }
	},

	setTempMarker:function( latLng, num) {
		var cancel_string ='<a onclick="EasySubOrg.MAP.cu_01.get(\'rclk_menu_overlay\').clearProperties();"> cancel this point</a>'
		var somestring = "";
		switch(num) {
	    case 1:
					this._marker.setIcon(null);
	        somestring = "user indicates renting behavior<br>" + cancel_string;
	        break;
	    case 2:
					var image = 'images/icon2.png';
					this._marker.setIcon(image);
	        somestring = "user indicates leasing behavior<br>" + cancel_string;
	        break;
			case 3:
					var image = 'images/icon3.png';
					this._marker.setIcon(image);
					somestring = "user indicates co-lessee behavior<br>" + cancel_string;
			    break;
	    default:
	        somestring = "switch of setTemMarker()";
		}	
		this._marker.setPosition(latLng);
		this._marker.setMap( EasySubOrg.MAP.cu_01.get('map') );
		var propertyMarker  = this._marker;
		this._temp_infowindow.setContent(somestring);
		var propertyInfowindow = this._temp_infowindow;
		google.maps.event.addListener(propertyMarker , 'click', function() { propertyInfowindow.open( EasySubOrg.MAP.cu_01.get('map'), propertyMarker); } ); 	
	},

	updateOthers:function (latLng, num){
		if (num <= 3) {
			this.setTempMarker ( latLng, num);	
			EasySubOrg.RENTAL.rf_cu_01.set( {"lat": latLng.lat(), "lng":latLng.lng() }  );
			if (num == 1) {EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-lease");}
			else if (num == 2) { EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-rent");}
			else if (num == 3) { EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-activity"); }
			if (EasySubOrg.RENTAL.rf_cu_01.get('cat') != num ) {
				alert (" es_MMoverlay.js: write rf_cu_01 failed!");
			}
			EasySubOrg.INFO.info_div_reg.set("info_div_purpose","rental_form");   
		}
		else {
			EasySubOrg.MAP.render_01.addMarker(latLng, num,null,null,null,true);
			EasySubOrg.INFO.info_div_reg.set("info_div_purpose","ride_form"); 
		}		
		console.log("updateOthers()");
	},

	clearProperties: function (){  
		this._temp_infowindow.close();
		this._marker.setMap(null);
		this._marker.setPosition(null);	
		EasySubOrg.INFO.info_div_reg.set("info_div_purpose","default"); 
	},

	fillMenuDiv:function () {
		var ClassRef = this;
		var work_mode = EasySubOrg.MAP.cu_01.get('work_mode');
		this.model.set("height",ClassRef.html_content[work_mode].length * 25 + 12);
		this.$el.css("height", this.model.get("height").toString()+"px") // 12 is menu top and bottom padding, respective 6px
		ClassRef.$el.html( ClassRef.compiledMappingFunc( { html_content_ar: ClassRef.html_content[work_mode]} ));
	},

	initialize:function(){
		console.log("init() of OverLayMenu");
		var ClassRef = this;
		var map = EasySubOrg.MAP.cu_01.get('map');
		

		this.overlay = new MMoverlay( map); 

		this.compiledMappingFunc = (function() {
			if ( $('#menu-template').html() ) { return _.template( $('#menu-template').html() ); }
			else { alert("#menu-template DOM not ready, compiledMappingFunc will be null"); return null; }
		})();

		this.fillMenuDiv(); // compensate for missing first-time work_mode change 
		this.listenTo(EasySubOrg.MAP.cu_01,'change:work_mode', this.fillMenuDiv); // when this one invoked, the first time work_mode change event has already happened
		_.delay(function(){
			var map = EasySubOrg.MAP.cu_01.get('map');
			ClassRef.fromLatLngToDivPixel = function (latLng) {
				return ClassRef.overlay.getProjection().fromLatLngToDivPixel(latLng);
			};
			ClassRef.model.set({"x0": ClassRef.fromLatLngToDivPixel(map.getBounds().getNorthEast()).x , "y0": ClassRef.fromLatLngToDivPixel(map.getBounds().getNorthEast()).y} );
			console.log("reference vector:" + [ClassRef.model.get("x0"), ClassRef.model.get("y0")].toString());
			//console.log([temp_overlay.model.get("x0"), temp_overlay.model.get("y0")]);
		},200);
	}
}); // instance will be added at es_mapinteraction.js, it is EasySubOrg.MAP.cu_01.get('rclk_menu_overlay');


/*
	This is one class, representing the right-clicked generated white small box, google itself did not inherit OverlayView class
*/
MMoverlay.prototype = new google.maps.OverlayView();  ///MMoverlay:class inherits OverlayView:class
/** @constructor */
function MMoverlay( map) {
	// Now initialize all properties.
	//console.log("contructor of MMoverlay");
	this.map_ = map;
	this.div_ = null;
	// Explicitly call setMap on this overlay
	this.setMap(map);

}
/*member methods*/
MMoverlay.prototype.onAdd = function() {   //overwritten		
	console.log("onAdd()");
	var div = document.createElement('div');

	this.div_ = div;
	// Add the element to the "overlayImage" pane.
	var panes = this.getPanes();
	panes.overlayImage.appendChild(this.div_);
};

MMoverlay.prototype.draw = function() {  //overwritten
	// This draw method will be invoked when map is loaded, so i have to hide it
	console.log("draw()");
	var div = this.div_;
	div.style.left = '50px';
	div.style.top = '50px';
	div.style.width = '10px';
	div.style.height = '10px';
	div.style.borderStyle = 'solid';
	div.style.borderWidth = '2px';
	div.style.borderColor = "#000";
	div.style.visibility = 'visible';

	// fromLatLngToDivPixel finished
};
