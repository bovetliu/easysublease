/*
	This is one class, representing the right-clicked generated white small box
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
	this._temp_infowindow = new google.maps.InfoWindow();
	this._marker = new google.maps.Marker({  // this initialization will "factually", graphically add one marker on map 
			//position: location,
			//map: map,
			animation: google.maps.Animation.DROP
		});
}
/*member methods*/
MMoverlay.prototype.onAdd = function() {   //overwritten		
	var div = document.createElement('div');
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
	this.div_ = div;
	// Add the element to the "overlayImage" pane.
	var panes = this.getPanes();
	panes.overlayImage.appendChild(this.div_);
};

MMoverlay.prototype.draw = function() {  //overwritten
	// We use the south-west and north-east
	// coordinates of the overlay to peg it to the correct position and size.
	// To do this, we need to retrieve the projection from the overlay.
	var div = this.div_;
	div.style.left = '0px';
	div.style.top = '0px';
	div.style.width = '180px';
	div.style.height = '80px';
	div.style.visibility = "hidden";
	div.style.cursor = "pointer";
};

MMoverlay.prototype.draw2 = function( latLng ) {  // create right-click box
	var tempover = this;
	if (latLng == false) {
		alert ("cnm. mei bian liang");
		}
	var overlayProjection = this.getProjection();
	var lefttop_pixel = overlayProjection.fromLatLngToDivPixel(latLng);
	var div = this.div_;
	//onmouseover   onmouseout
	div.style.left = lefttop_pixel.x + 'px';
	div.style.top = lefttop_pixel.y + 'px';
	div.style.width = '180px';
	div.style.visibility = "hidden";
	div.style.cursor = "pointer";
	var li0  = div.childNodes[0].childNodes[0];
	var li1 = div.childNodes[0].childNodes[1];
	var li2 = div.childNodes[0].childNodes[2]; 		// add one marker, to indicate the position   
	li0.onclick = function() { 
		tempover.redirect_func(latLng,1); tempover.toggleOff2();
	};  // tempover is actually reference of this class
	li0.onmouseover = function () { li0.style.backgroundColor = "#f1f1f1"; };
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

// [START region_hideshow]
// Set the visibility to 'hidden' or 'visible'.
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

MMoverlay.prototype.toggle = function() {
	if (this.div_) {
		if (this.div_.style.visibility == 'hidden') {
			this.show();
		} else {
			this.hide();
		}
	}
};

MMoverlay.prototype.toggleOn = function() {
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
			//alert("toggleoff");
			this.hide();
		} 
	}
};
// Detach the map from the DOM via toggleDOM().
// Note that if we later reattach the map, it will be visible again,
// because the containing <div> is recreated in the overlay's onAdd() method.
MMoverlay.prototype.toggleDOM = function() {
	if (this.getMap()) {
		// Note: setMap(null) calls OverlayView.onRemove()
		this.setMap(null);
	} else {
		this.setMap(this.map_);    //draw() will be run automatically
	}
};
MMoverlay.prototype.clearTempMarker = function (){
	this._marker.setMap(null);
	this._marker.setPosition(null);	
}
MMoverlay.prototype.setTempMarker = function ( latLng , num) {
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

MMoverlay.prototype.redirect_func = function (latLng, num){
	//this._marker.setMap(this.map_);
	this.setTempMarker ( latLng, num);
 // rf_cu_01 is the rental form control unit, it is actually one instance of db_model RentalPoint	
	
	EasySubOrg.RENTAL.rf_cu_01.set( {"lat": latLng.lat(), "lng":latLng.lng() }  );
	if (num == 1) {EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-lease");}
	else if (num == 2) { EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-rent");}
	else if (num == 3) { EasySubOrg.RENTAL.rf_view_01.updateCat( "li-cat-activity"); }
	if (EasySubOrg.RENTAL.rf_cu_01.get('cat') != num ) {
		alert (" es_MMoverlay.js: write rf_cu_01 failed!");
	}
	
	/*
	var temp_rf_view = EasySubOrg.RENTAL.rf_view_01;
	temp_rf_view.$('#ipt-lat').val( latLng.lat().toString());
	temp_rf_view.$('#ipt-lng').val( latLng.lng().toString());
	temp_rf_view.$('#num-catagory').val( num);
	*/
	console.log("redirect_func");
}
// [END region_hideshow]