
EasySubOrg.createNS("EasySubOrg.MENU");
EasySubOrg.MENU.reg = new Backbone.Model({
	top:0,
	left:0,
	width:178,
	height:0,
	latLng:null
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
	correctRefPoint:function (pixel){
		pixel.y = pixel.y + $("#title-big-div").height() + $("div.search-div").height();
		//console.log([$("#title-big-div").height() , $("div.search-div").height()]);
		return pixel;
	},

	updateRegs:function(latLng){
		if (!latLng) { alert("updateRegs takes invalid argument");}
		var mapCanvasProjection = this.overlay.getProjection();
		//console.log(mapCanvasProjection);
		var lefttop_pixel = this.correctRefPoint( mapCanvasProjection.fromLatLngToDivPixel(latLng)); // convert latLng into screen position,
		
		console.log(lefttop_pixel.x, lefttop_pixel.y );
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
	toggleOn: function(latLng) {
	  if (!latLng) { alert("toggleOn takes invalid argument"); } 
	  this.updateRegs(latLng);
	  this.fillLogic(latLng);
		this.$el.show();
	},
	toggleOff: function( latLng ) {
		if (!latLng) { alert("toggleOff takes invalid argument"); } 
		var lefttop_pixel =  this.correctRefPoint( this.overlay.getProjection().fromLatLngToDivPixel(latLng)); 
		if (! this.pointInMenuDom(lefttop_pixel)) { this.$el.hide(); }
	},

	setTempMarker:function( latLng, num) {
		var somestring = "";
		switch(num) {
	    case 1:
					this._marker.setIcon(null);
	        somestring = "user indicates renting behavior";
	        break;
	    case 2:
					var image = 'images/icon2.png';
					this._marker.setIcon(image);
	        somestring = "user indicates leasing behavior";
	        break;
			case 3:
					var image = 'images/icon3.png';
					this._marker.setIcon(image);
					somestring = "user indicates co-lessee behavior";
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
		this._marker.setMap(null);
		this._marker.setPosition(null);	
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
		this.overlay = new MMoverlay(EasySubOrg.MAP.cu_01.get('map')); 
		this.compiledMappingFunc = (function() {
			if ( $('#menu-template').html() ) { return _.template( $('#menu-template').html() ); }
			else { alert("#menu-template DOM not ready, compiledMappingFunc will be null"); return null; }
		})();
		this.fillMenuDiv(); // compensate for missing first-time work_mode change 
		this.listenTo(EasySubOrg.MAP.cu_01,'change:work_mode', this.fillMenuDiv); // when this one invoked, the first time work_mode change event has already happened
	}
}); // instance will be added at es_page_interaction.js


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
	//this._temp_infowindow = new google.maps.InfoWindow();
	//this._marker = new google.maps.Marker({  // this initialization will "factually", graphically add one marker on map 
			//position: location,
			//map: map,
	//		animation: google.maps.Animation.DROP
	//});
}
/*member methods*/
MMoverlay.prototype.onAdd = function() {   //overwritten		
	var div = document.createElement('div');
	/*
	div.style.fontSize = "14px";
	div.style.border = 'none';
	div.style.borderWidth = '0px';
	div.style.position = 'absolute';
	div.style.backgroundColor = "#FFF";
	div.style.borderWidth = '1px' ;
	div.style.borderColor = '#c6c6c6';
	div.style.borderStyle = 'solid';
	div.style.boxShadow = "0px 1px 3px #999";
	div.id = "menu-contain-div";
	var ul = document.createElement('ul');
	var li1 = document.createElement('li');
	li1.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;want to lease here";
	ul.appendChild(li1);
	var li2 = document.createElement('li');
	li2.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;want to rent here";
	ul.appendChild(li2);
	var li3 = document.createElement('li');
	li3.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;seek co-lessee here";
	ul.appendChild(li3);
	ul.style.listStyleType = "none";
	ul.className = "MMoptions_ul";
	ul.style.marginLeft = "-40px";
	ul.style.marginTop = "5px";
	div.appendChild(ul);
	*/
	this.div_ = div;
	// Add the element to the "overlayImage" pane.
	var panes = this.getPanes();
	panes.overlayImage.appendChild(this.div_);
};

MMoverlay.prototype.draw = function() {  //overwritten
	// This draw method will be invoked when map is loaded, so i have to hide it
	var div = this.div_;
	div.style.left = '0px';
	div.style.top = '0px';
	div.style.width = '1px';
	div.style.height = '1px';
	div.style.visibility = "hidden";
	//div.style.cursor = "pointer";
};
/*
MMoverlay.prototype.draw2 = function( latLng ) {  // create right-click box
	var tempover = this;
	if (!latLng) {
		alert ("cnm. mei bian liang");
	}
	var overlayProjection = this.getProjection();
	var lefttop_pixel = overlayProjection.fromLatLngToDivPixel(latLng); // convert latLng into screen position,
	var div = this.div_;
	//onmouseover   onmouseout
	div.style.left = lefttop_pixel.x + 'px';                            // move the div to current screen position, where mouse is at
	div.style.top = lefttop_pixel.y + 'px';
	div.style.width = '180px';
	div.style.visibility = "hidden";
	div.style.cursor = "pointer";
	var li0  = div.childNodes[0].childNodes[0];
	var li1 = div.childNodes[0].childNodes[1];
	var li2 = div.childNodes[0].childNodes[2]; 		// add one marker, to indicate the position   
	li0.onclick = function() { tempover.redirect_func(latLng,1); tempover.toggleOff2();};  
	li0.onmouseover = function () { li0.style.backgroundColor = "#f1f1f1"; };   // this part is costive
	li0.onmouseout = function() {li0.style.backgroundColor = "#fff"; };
	li1.onclick = function() { tempover.redirect_func(latLng,2); tempover.toggleOff2(); };
	li1.onmouseover = function () { li1.style.backgroundColor = "#f1f1f1"; };
	li1.onmouseout = function() {li1.style.backgroundColor = "#fff"; };
	li2.onclick = function() { tempover.redirect_func(latLng,3); tempover.toggleOff2(); };
	li2.onmouseover = function () { li2.style.backgroundColor = "#f1f1f1"; };
	li2.onmouseout = function() {li2.style.backgroundColor = "#fff"; };
};

MMoverlay.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
};
*/
// [START region_hideshow]
// Set the visibility to 'hidden' or 'visible'.
/*
MMoverlay.prototype.hide = function() {
	if (this.div_) {
		// The visibility property must be a string enclosed in quotes.
		this.div_.style.visibility = 'hidden';
	}
};

MMoverlay.prototype.show = function() {
	if (this.div_) {
		this.div_.style.visibility = 'visible';
	}
};
/*
MMoverlay.prototype.toggle = function() {
	if (this.div_) {
		if (this.div_.style.visibility == 'hidden') {
			this.show();
		} else {
			this.hide();
		}
	}
};*/
/*
MMoverlay.prototype.toggleOn = function() { // moved
	if (this.div_) {
		if (this.div_.style.visibility == 'hidden') {
			this.show();
		} 
	}
};

MMoverlay.prototype.toggleOff = function( latLng) {
	var overlayProjection = this.getProjection();
	var lefttop_pixel = overlayProjection.fromLatLngToDivPixel(latLng);
	var left = parseInt(this.div_.style.left, 10);
	var top = parseInt(this.div_.style.top,10);
	var height = parseInt(this.div_.style.height, 10);
	//alert(height);
	var width = parseInt(this.div_.style.width,10);
	var cursorin = true;
	if ( lefttop_pixel.x < left || lefttop_pixel.x > left+width || lefttop_pixel.y < top || lefttop_pixel.y > top + height ) {
		cursorin = false;
	}
	if (this.div_) {
		if (  (this.div_.style.visibility == 'visible' ) && (!cursorin) ){
			//alert("toggleoff");
			this.hide();
		} 
	}
};

MMoverlay.prototype.toggleOff2 = function( ) {
	if (this.div_) {
		if (  this.div_.style.visibility == 'visible'  ){
			this.hide();
		} 
	}
};

MMoverlay.prototype.clearTempMarker = function (){  // moved
	this._marker.setMap(null);
	this._marker.setPosition(null);	
}
MMoverlay.prototype.setTempMarker = function ( latLng , num) {  // moved
	var somestring = "";
	switch(num) {
    case 1:
				this._marker.setIcon(null);
        somestring = "user indicates renting behavior";
        break;
    case 2:
				var image = 'images/icon2.png';
				this._marker.setIcon(image);
        somestring = "user indicates leasing behavior";
        break;
		case 3:
				var image = 'images/icon3.png';
				this._marker.setIcon(image);
				somestring = "user indicates co-lessee behavior";
		    break;
    default:
        somestring = "switch of setTemMarker()";
	}	
	this._marker.setPosition(latLng);
	this._marker.setMap(this.map_);
	var propertyMarker  = this._marker;
	this._temp_infowindow.setContent(somestring);
	propertyInfowindow = this._temp_infowindow;
	google.maps.event.addListener(propertyMarker , 'click', function() { propertyInfowindow.open( EasySubOrg.MAP.cu_01.get('map'), propertyMarker); } ); 
	
}

MMoverlay.prototype.redirect_func = function (latLng, num){ // moved
	//this._marker.setMap(this.map_);
	this.setTempMarker ( latLng, num);	
	EasySubOrg.RENTAL.rf_cu_01.set( {"lat": latLng.lat(), "lng":latLng.lng() }  );
	if (num == 1) {EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-lease");}
	else if (num == 2) { EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-rent");}
	else if (num == 3) { EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-activity"); }
	if (EasySubOrg.RENTAL.rf_cu_01.get('cat') != num ) {
		alert (" es_MMoverlay.js: write rf_cu_01 failed!");
	}
	EasySubOrg.INFO.info_div_reg.set("info_div_purpose","rental_form");
	console.log("redirect_func");
}
// [END region_hideshow]
*/