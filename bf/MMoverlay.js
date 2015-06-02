/*
	This is one class, representing the right-clicked generated white small box
*/
MMoverlay.prototype = new google.maps.OverlayView();  ///MMoverlay:class inherits OverlayView:class
/** @constructor */
function MMoverlay( map) {
	// Now initialize all properties.
	this.map_ = map;
	this.div_ = null;
	// Explicitly call setMap on this overlay
	this.setMap(map);
	this._temp_infowindow = new google.maps.InfoWindow();
	this._marker = new google.maps.Marker({  // this initialization will "factually", graphically add one marker on map 
			//position: location,
			map: map,
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
	div.id = "menu-contain-div";
	var ul = document.createElement('ul');
	var li1 = document.createElement('li');
	li1.innerHTML = "<li >want to lease here</li>";
	ul.appendChild(li1);
	var li2 = document.createElement('li');
	li2.innerHTML = "<li >want to rent here</li>";
	ul.appendChild(li2);
	var li3 = document.createElement('li');
	li3.innerHTML = "<li >launch activity here</li>";
	ul.appendChild(li3);
	ul.style.listStyleType = "none";
	ul.className = "MMoptions_ul";
	ul.style.marginLeft = "-20px";
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

MMoverlay.prototype.draw2 = function( latLng ) {
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
	var li2 = div.childNodes[0].childNodes[2]; 
	li0.onclick = function() { 
		tempover.redirect_func(latLng,0); tempover.toggleOff2(); 
		// add one marker, to indicate the position   
		
	};  // tempover is actually reference of this class
	li0.onmouseover = function () { li0.style.backgroundColor = "#f1f1f1"; };
	li0.onmouseout = function() {li0.style.backgroundColor = "#fff"; };
	li1.onclick = function() { tempover.redirect_func(latLng,1); tempover.toggleOff2(); };
	li1.onmouseover = function () { li1.style.backgroundColor = "#f1f1f1"; };
	li1.onmouseout = function() {li1.style.backgroundColor = "#fff"; };
	li2.onclick = function() { tempover.redirect_func(latLng,2); tempover.toggleOff2(); };
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

MMoverlay.prototype.setTempMarker = function ( latLng , num) {
	this._marker.setPosition(latLng);
	propertyMarker  = this._marker;
	somestring = "default";
	switch(num) {
    case 0:
        somestring = "user indicates renting behavior";
        break;
    case 1:
        somestring = "user indicates leasing behavior";
        break;
		case 2:
				somestring = "user indicates \"activity\" behavior";
		    break;
    default:
        somestring = "switch of setTemMarker()";
}	
	this._temp_infowindow.setContent(somestring);
	propertyInfowindow = this._temp_infowindow;
	google.maps.event.addListener(propertyMarker , 'click', function() { propertyInfowindow.open(map_cs, propertyMarker); } ); 
	
}
MMoverlay.prototype.updatecat = function(string2) {
	//console.log("MMoverlay method updatecat is called");
	document.getElementById('num-catagory').value = associate_array2[string2];    // #num-catagory is hidden input of rental form
	document.getElementById('btn-caption-cat').innerHTML = "catagory: "+document.getElementById(string2).firstChild.innerHTML;
	
	}
/* abandoned method	
MMoverlay.prototype.redirect_func = function ( num) {
	document.getElementById('num-catagory').value	= num; 
	if (num == 0) {this.updatecat( "li-cat-lease");}
	else if (num == 1) { this.updatecat( "li-cat-rent");}
	else if (num == 2) { this.updatecat( "li-cat-activity"); }
}
*/
MMoverlay.prototype.redirect_func = function (latLng, num){
	//this._marker.setMap(this.map_);
	this.setTempMarker ( latLng, num);
	document.getElementById("ipt-lat").value = latLng.lat().toString();  // update rental form
	document.getElementById("ipt-lng").value = latLng.lng().toString();  // update rental form
	document.getElementById('num-catagory').value	= num;  // change the hidden input catagory here
	if (num == 0) {this.updatecat( "li-cat-lease");}
	else if (num == 1) { this.updatecat( "li-cat-rent");}
	else if (num == 2) { this.updatecat( "li-cat-activity"); }
}
// [END region_hideshow]