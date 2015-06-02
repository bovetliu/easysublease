// JavaScript Document
//<script src="js/MMoverlay.js" type="text/javascript" ></script>
// The following example creates a marker in Stockholm, Sweden
// using a DROP animation. Clicking on the marker will toggle
// the animation between a BOUNCE animation and no animation.
//var contextMenu = new ContextMenu(); 
var collgestation_LatLng = new google.maps.LatLng(30.624013, -96.316689);  //30.624013, -96.316689
var home_LatLng = new google.maps.LatLng(30.623957,  -96.311529);    //30.623957, -96.311529
var test_LatLng = new google.maps.LatLng(30.618418, -96.327086);
var home_marker;
var map_cs;
var contentString = " <p> click to lease <a href=\"cc77/index.html\">Cripple Creek #77</a></p>";
var infowindow_home = new google.maps.InfoWindow({       //init a infowindow
	content: contentString
});
var rightclkform_str = "  <div><ul> <li> <a class = \"poped-up-a\" id = \"lease-pop-up\"  href = \"#\">Lease/sublease at here </a></li><li><a class = \"poped-up-a\" href = \"http:\\www.baidu.com\">Want to rent here </a></li> " 
											+  "</ul></div>";
var infowindow_rightclk = new google.maps.InfoWindow({ 
	content: rightclkform_str,
	position: test_LatLng
});


var rclk_menu_overlay;


// following code should be changed into PHP
////////////////22//////////////////////////
var route22_Coordinates = [
new google.maps.LatLng(30.613613,-96.338339),
new google.maps.LatLng(30.614610,-96.339240),
new google.maps.LatLng(30.614240,-96.339884),
new google.maps.LatLng(30.611507,-96.337523),
new google.maps.LatLng(30.611323,-96.336751),
new google.maps.LatLng(30.609107,-96.334691),
new google.maps.LatLng(30.609033,-96.334262),
new google.maps.LatLng(30.618709,-96.323233),
new google.maps.LatLng(30.620482,-96.321344),
new google.maps.LatLng(30.620445,-96.320701),
new google.maps.LatLng(30.618968,-96.318512),
new google.maps.LatLng(30.624692,-96.312010),
new google.maps.LatLng(30.623086,-96.310079),
new google.maps.LatLng(30.623123,-96.309736),
new google.maps.LatLng(30.626686,-96.305659),
new google.maps.LatLng(30.628533,-96.307397),
new google.maps.LatLng(30.626132,-96.310079),
new google.maps.LatLng(30.625837,-96.310744),
new google.maps.LatLng(30.619116,-96.318533),
new google.maps.LatLng(30.620611,-96.320615),
new google.maps.LatLng(30.620667,-96.321280),
new google.maps.LatLng(30.620334,-96.321881),
new google.maps.LatLng(30.619965,-96.322160),
new google.maps.LatLng(30.618506,-96.323748),
new google.maps.LatLng(30.609291,-96.334219),
new google.maps.LatLng(30.609310,-96.334498),
new google.maps.LatLng(30.613557,-96.338274)
];
var polyOptions_22 = {
path: route22_Coordinates,
strokeColor: "#BD1A8D",
strokeOpacity: 0.4,
strokeWeight: 4
}
var polyline_route22 = new google.maps.Polyline(polyOptions_22);

////////////////22//////////////////////////
////////////////26//////////////////////////
var route26_Coordinates = [
new google.maps.LatLng(30.614610,-96.339219),
new google.maps.LatLng(30.614240,-96.339884),
new google.maps.LatLng(30.613151,-96.338940),
new google.maps.LatLng(30.611563,-96.337395),
new google.maps.LatLng(30.611397,-96.336794),
new google.maps.LatLng(30.609088,-96.334648),
new google.maps.LatLng(30.609033,-96.334262),
new google.maps.LatLng(30.614665,-96.327932),
new google.maps.LatLng(30.611156,-96.323576),
new google.maps.LatLng(30.609938,-96.321709),
new google.maps.LatLng(30.607851,-96.319199),
new google.maps.LatLng(30.607038,-96.317546),
new google.maps.LatLng(30.606595,-96.316903),
new google.maps.LatLng(30.606262,-96.314456),
new google.maps.LatLng(30.606152,-96.313276),
new google.maps.LatLng(30.605912,-96.312740),
new google.maps.LatLng(30.605081,-96.311560),
new google.maps.LatLng(30.611544,-96.304350),
new google.maps.LatLng(30.617232,-96.298041),
new google.maps.LatLng(30.619116,-96.300230),
new google.maps.LatLng(30.617823,-96.301947),
new google.maps.LatLng(30.616013,-96.303492),
new google.maps.LatLng(30.614942,-96.304994),
new google.maps.LatLng(30.614647,-96.305552),
new google.maps.LatLng(30.612911,-96.304801),
new google.maps.LatLng(30.612117,-96.306732),
new google.maps.LatLng(30.611415,-96.308899),
new google.maps.LatLng(30.610141,-96.310444),
new google.maps.LatLng(30.607149,-96.313620),
new google.maps.LatLng(30.606373,-96.313920),
new google.maps.LatLng(30.606299,-96.314070)
];
var polyOptions_26 = {
path: route26_Coordinates,
strokeColor: "#006F3B",
strokeOpacity: 0.4,
strokeWeight: 4
}
var polyline_route26 = new google.maps.Polyline(polyOptions_26);
////////////////26//////////////////////////
////////////////27//////////////////////////
var route27_Coordinates = [
new google.maps.LatLng(30.613613,-96.338339),
new google.maps.LatLng(30.614647,-96.339240),
new google.maps.LatLng(30.614240,-96.339970),
new google.maps.LatLng(30.613262,-96.339047),
new google.maps.LatLng(30.611692,-96.337652),
new google.maps.LatLng(30.611600,-96.337481),
new google.maps.LatLng(30.611378,-96.336730),
new google.maps.LatLng(30.609144,-96.334670),
new google.maps.LatLng(30.609014,-96.334434),
new google.maps.LatLng(30.609014,-96.334262),
new google.maps.LatLng(30.610695,-96.332309),
new google.maps.LatLng(30.614684,-96.327868),
new google.maps.LatLng(30.613908,-96.326945),
new google.maps.LatLng(30.612301,-96.325035),
new google.maps.LatLng(30.611415,-96.323898),
new google.maps.LatLng(30.610695,-96.322782),
new google.maps.LatLng(30.609919,-96.321709),
new google.maps.LatLng(30.608460,-96.320014),
new google.maps.LatLng(30.608977,-96.319456),
new google.maps.LatLng(30.610676,-96.319520),
new google.maps.LatLng(30.611212,-96.319370),
new google.maps.LatLng(30.611600,-96.319005),
new google.maps.LatLng(30.611951,-96.318147),
new google.maps.LatLng(30.612726,-96.315980),
new google.maps.LatLng(30.612966,-96.315615),
new google.maps.LatLng(30.617768,-96.310272),
new google.maps.LatLng(30.618211,-96.309285),
new google.maps.LatLng(30.618488,-96.307461),
new google.maps.LatLng(30.618672,-96.306260),
new google.maps.LatLng(30.619116,-96.305251),
new google.maps.LatLng(30.619356,-96.304865),
new google.maps.LatLng(30.621230,-96.302837),
new google.maps.LatLng(30.621525,-96.303191),
new google.maps.LatLng(30.621322,-96.303470),
new google.maps.LatLng(30.622541,-96.304822),
new google.maps.LatLng(30.622458,-96.305187),
new google.maps.LatLng(30.621765,-96.305884),
new google.maps.LatLng(30.620704,-96.304704),
new google.maps.LatLng(30.620657,-96.304489),
new google.maps.LatLng(30.620657,-96.304350),
new google.maps.LatLng(30.620731,-96.304157),
new google.maps.LatLng(30.621304,-96.303481),
new google.maps.LatLng(30.621424,-96.303202),
new google.maps.LatLng(30.621239,-96.302955),
new google.maps.LatLng(30.619808,-96.304446),
new google.maps.LatLng(30.619245,-96.305133),
new google.maps.LatLng(30.618709,-96.306270),
new google.maps.LatLng(30.618238,-96.309285),
new google.maps.LatLng(30.617768,-96.310369),
new google.maps.LatLng(30.612911,-96.315808),
new google.maps.LatLng(30.612652,-96.316516),
new google.maps.LatLng(30.611710,-96.318920),
new google.maps.LatLng(30.610953,-96.319563),
new google.maps.LatLng(30.610769,-96.319585),
new google.maps.LatLng(30.610769,-96.320250),
new google.maps.LatLng(30.610787,-96.320636),
new google.maps.LatLng(30.610325,-96.321387),
new google.maps.LatLng(30.610030,-96.321709)
];
var polyOptions_27 = {
path: route27_Coordinates,
strokeColor: "#00AEEF",
strokeOpacity: 0.4,
strokeWeight: 4
}
var polyline_route27 = new google.maps.Polyline(polyOptions_27);
////////////////27//////////////////////////

////////////////34//////////////////////////
var Coordinates_34 = [
new google.maps.LatLng(30.609033,-96.334734),
new google.maps.LatLng(30.604785,-96.339240),
new google.maps.LatLng(30.595642,-96.333790),
new google.maps.LatLng(30.591108,-96.330957),
new google.maps.LatLng(30.586647,-96.328125),
new google.maps.LatLng(30.584800,-96.326408),
new google.maps.LatLng(30.586536,-96.323318),
new google.maps.LatLng(30.589640,-96.316752),
new google.maps.LatLng(30.589566,-96.316323),
new google.maps.LatLng(30.586795,-96.314607),
new google.maps.LatLng(30.585317,-96.316688),
new google.maps.LatLng(30.583507,-96.318040),
new google.maps.LatLng(30.582528,-96.315937),
new google.maps.LatLng(30.583950,-96.314950),
new google.maps.LatLng(30.585059,-96.313362),
new google.maps.LatLng(30.584486,-96.312783),
new google.maps.LatLng(30.583322,-96.311667),
new google.maps.LatLng(30.582620,-96.310980),
new google.maps.LatLng(30.581678,-96.309972),
new google.maps.LatLng(30.582546,-96.308835),
new google.maps.LatLng(30.583765,-96.307333),
new google.maps.LatLng(30.586278,-96.304822),
new google.maps.LatLng(30.586832,-96.304200),
new google.maps.LatLng(30.587146,-96.303620),
new google.maps.LatLng(30.587294,-96.303127),
new google.maps.LatLng(30.588790,-96.299543),
new google.maps.LatLng(30.590692,-96.296711),
new google.maps.LatLng(30.592392,-96.294887),
new google.maps.LatLng(30.592780,-96.294308),
new google.maps.LatLng(30.593482,-96.295166),
new google.maps.LatLng(30.593943,-96.296904),
new google.maps.LatLng(30.594424,-96.297891),
new google.maps.LatLng(30.595162,-96.300037),
new google.maps.LatLng(30.595735,-96.301131),
new google.maps.LatLng(30.596585,-96.302118),
new google.maps.LatLng(30.597564,-96.302869),
new google.maps.LatLng(30.598173,-96.303470),
new google.maps.LatLng(30.598469,-96.303856),
new google.maps.LatLng(30.595587,-96.307182),
new google.maps.LatLng(30.596418,-96.308148),
new google.maps.LatLng(30.596640,-96.308320),
new google.maps.LatLng(30.596806,-96.307998),
new google.maps.LatLng(30.597305,-96.307590),
new google.maps.LatLng(30.597841,-96.307182),
new google.maps.LatLng(30.598542,-96.306410),
new google.maps.LatLng(30.599300,-96.305938),
new google.maps.LatLng(30.599891,-96.305745),
new google.maps.LatLng(30.599632,-96.305144),
new google.maps.LatLng(30.598986,-96.304393),
new google.maps.LatLng(30.598598,-96.304049),
new google.maps.LatLng(30.598413,-96.303878),
new google.maps.LatLng(30.593038,-96.310251),
new google.maps.LatLng(30.591930,-96.312418),
new google.maps.LatLng(30.589861,-96.316710),
new google.maps.LatLng(30.586721,-96.323748),
new google.maps.LatLng(30.586758,-96.324735),
new google.maps.LatLng(30.587755,-96.327095),
new google.maps.LatLng(30.587940,-96.327524),
new google.maps.LatLng(30.587792,-96.328597),
new google.maps.LatLng(30.588384,-96.329069),
new google.maps.LatLng(30.590683,-96.330550),
new google.maps.LatLng(30.592909,-96.331902),
new google.maps.LatLng(30.593424,-96.332266),
new google.maps.LatLng(30.594345,-96.332846),
new google.maps.LatLng(30.596668,-96.334348),
new google.maps.LatLng(30.602172,-96.337609),
new google.maps.LatLng(30.604646,-96.339047),
new google.maps.LatLng(30.606364,-96.337159),
new google.maps.LatLng(30.607444,-96.336204),
new google.maps.LatLng(30.608691,-96.334691),
new google.maps.LatLng(30.608913,-96.334369),
new google.maps.LatLng(30.609171,-96.334380)
];
var polyOptions_34 = {
path: Coordinates_34,
strokeColor: "#EA7424",
strokeOpacity: 0.4,
strokeWeight: 4
}
var polyline_route34 = new google.maps.Polyline(polyOptions_34);
////////////////34//////////////////////////

////////////////31//////////////////////////
var Coordinates_31 = [
new google.maps.LatLng(30.609070,-96.334605),
new google.maps.LatLng(30.604970,-96.338854),
new google.maps.LatLng(30.604748,-96.339197),
new google.maps.LatLng(30.599743,-96.336236),
new google.maps.LatLng(30.595763,-96.333843),
new google.maps.LatLng(30.591062,-96.330936),
new google.maps.LatLng(30.591034,-96.330818),
new google.maps.LatLng(30.592401,-96.328404),
new google.maps.LatLng(30.596806,-96.320744),
new google.maps.LatLng(30.598284,-96.321752),
new google.maps.LatLng(30.598967,-96.322546),
new google.maps.LatLng(30.598395,-96.323297),
new google.maps.LatLng(30.596732,-96.321881),
new google.maps.LatLng(30.596455,-96.321645),
new google.maps.LatLng(30.591080,-96.330839),
new google.maps.LatLng(30.591127,-96.330904),
new google.maps.LatLng(30.604619,-96.339025),
new google.maps.LatLng(30.605099,-96.338489),
new google.maps.LatLng(30.608922,-96.334434)
];
var polyOptions_31 = {
path: Coordinates_31,
strokeColor: "#662D91",
strokeOpacity: 0.4,
strokeWeight: 4
}
var polyline_route_31 = new google.maps.Polyline(polyOptions_31);
////////////////31//////////////////////////

////////////////35//////////////////////////
var Coordinates_35 = [
new google.maps.LatLng(30.612615,-96.343017),
new google.maps.LatLng(30.613576,-96.341472),
new google.maps.LatLng(30.614647,-96.342287),
new google.maps.LatLng(30.613539,-96.344261),
new google.maps.LatLng(30.613502,-96.344776),
new google.maps.LatLng(30.613391,-96.345119),
new google.maps.LatLng(30.613132,-96.345334),
new google.maps.LatLng(30.612837,-96.345463),
new google.maps.LatLng(30.612468,-96.345849),
new google.maps.LatLng(30.612098,-96.346579),
new google.maps.LatLng(30.611766,-96.346793),
new google.maps.LatLng(30.611323,-96.347523),
new google.maps.LatLng(30.610252,-96.346450),
new google.maps.LatLng(30.609624,-96.347265),
new google.maps.LatLng(30.609402,-96.347179),
new google.maps.LatLng(30.608331,-96.346192),
new google.maps.LatLng(30.605875,-96.349776),
new google.maps.LatLng(30.602052,-96.346321),
new google.maps.LatLng(30.601719,-96.346149),
new google.maps.LatLng(30.600907,-96.345956),
new google.maps.LatLng(30.599909,-96.345119),
new google.maps.LatLng(30.598598,-96.343714),
new google.maps.LatLng(30.596917,-96.342298),
new google.maps.LatLng(30.595181,-96.340646),
new google.maps.LatLng(30.590369,-96.335024),
new google.maps.LatLng(30.589750,-96.334380),
new google.maps.LatLng(30.589178,-96.333854),
new google.maps.LatLng(30.588384,-96.333425),
new google.maps.LatLng(30.587719,-96.333092),
new google.maps.LatLng(30.587257,-96.332985),
new google.maps.LatLng(30.587072,-96.334198),
new google.maps.LatLng(30.586795,-96.337867),
new google.maps.LatLng(30.586352,-96.343789),
new google.maps.LatLng(30.586573,-96.345420),
new google.maps.LatLng(30.587054,-96.346836),
new google.maps.LatLng(30.588180,-96.348531),
new google.maps.LatLng(30.595246,-96.340597),
new google.maps.LatLng(30.596779,-96.342223),
new google.maps.LatLng(30.598164,-96.343220),
new google.maps.LatLng(30.599715,-96.344830),
new google.maps.LatLng(30.600823,-96.345828),
new google.maps.LatLng(30.601858,-96.346128),
new google.maps.LatLng(30.602236,-96.346396),
new google.maps.LatLng(30.602735,-96.346836),
new google.maps.LatLng(30.605801,-96.349647),
new google.maps.LatLng(30.608312,-96.345935),
new google.maps.LatLng(30.608811,-96.346321),
new google.maps.LatLng(30.609587,-96.347029),
new google.maps.LatLng(30.610215,-96.346128),
new google.maps.LatLng(30.611397,-96.347072),
new google.maps.LatLng(30.611674,-96.346536),
new google.maps.LatLng(30.612523,-96.345291),
new google.maps.LatLng(30.612652,-96.344733),
new google.maps.LatLng(30.612745,-96.344433),
new google.maps.LatLng(30.612855,-96.344283),
new google.maps.LatLng(30.612689,-96.343896),
new google.maps.LatLng(30.612652,-96.343296),
new google.maps.LatLng(30.612671,-96.343060)
];
var polyOptions_35 = {
path: Coordinates_35,
strokeColor: "#603813",
strokeOpacity: 0.5,
strokeWeight: 4
}
var polyline_route_35 = new google.maps.Polyline(polyOptions_35);
////////////////35//////////////////////////

////////////////36//////////////////////////
var Coordinates_36 = [
new google.maps.LatLng(30.604785,-96.339176),
new google.maps.LatLng(30.603954,-96.340249),
new google.maps.LatLng(30.603806,-96.340098),
new google.maps.LatLng(30.603548,-96.339841),
new google.maps.LatLng(30.597804,-96.337373),
new google.maps.LatLng(30.594701,-96.336064),
new google.maps.LatLng(30.592937,-96.337996),
new google.maps.LatLng(30.592226,-96.338682),
new google.maps.LatLng(30.591856,-96.338811),
new google.maps.LatLng(30.591570,-96.338822),
new google.maps.LatLng(30.591099,-96.338629),
new google.maps.LatLng(30.590212,-96.338199),
new google.maps.LatLng(30.588439,-96.338017),
new google.maps.LatLng(30.586389,-96.338017),
new google.maps.LatLng(30.585483,-96.337738),
new google.maps.LatLng(30.584911,-96.337245),
new google.maps.LatLng(30.584781,-96.337180),
new google.maps.LatLng(30.584320,-96.337609),
new google.maps.LatLng(30.584116,-96.337330),
new google.maps.LatLng(30.584024,-96.336987),
new google.maps.LatLng(30.584153,-96.336665),
new google.maps.LatLng(30.584412,-96.336515),
new google.maps.LatLng(30.584578,-96.336408),
new google.maps.LatLng(30.585299,-96.337395),
new google.maps.LatLng(30.585964,-96.337717),
new google.maps.LatLng(30.586444,-96.337802),
new google.maps.LatLng(30.588975,-96.337953),
new google.maps.LatLng(30.589898,-96.337996),
new google.maps.LatLng(30.590619,-96.338317),
new google.maps.LatLng(30.591496,-96.338736),
new google.maps.LatLng(30.591745,-96.338736),
new google.maps.LatLng(30.591995,-96.338725),
new google.maps.LatLng(30.592244,-96.338596),
new google.maps.LatLng(30.592456,-96.338382),
new google.maps.LatLng(30.594207,-96.336477),
new google.maps.LatLng(30.594645,-96.335946),
new google.maps.LatLng(30.594738,-96.335995),
new google.maps.LatLng(30.598025,-96.337363),
new google.maps.LatLng(30.603548,-96.339755),
new google.maps.LatLng(30.603825,-96.339948),
new google.maps.LatLng(30.603862,-96.340013),
new google.maps.LatLng(30.604628,-96.339025)
];
var polyOptions_36 = {
path: Coordinates_36,
strokeColor: "#967348",
strokeOpacity: 0.5,
strokeWeight: 4
}
var polyline_route_36 = new google.maps.Polyline(polyOptions_36);
////////////////36//////////////////////////


function initialize() {
	var mapOptions = {
		zoom: 14,
		center: collgestation_LatLng
	};

	map_cs = new google.maps.Map(document.getElementById('map-div'), mapOptions);
	 
	home_marker = new google.maps.Marker({
		map:map_cs,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position: home_LatLng
	});
	
	rclk_menu_overlay = new MMoverlay(map_cs); // blocking
	listener_marker1 =  google.maps.event.addListener(home_marker, 'click', function() {
		infowindow_home.open(map_cs, home_marker);
	} );   
	
	listener_map_right_click  = google.maps.event.addListener(map_cs, 'rightclick', function(event) {  //rclk_menu_overlay
		//alert("rclk");
		rclk_menu_overlay.draw2(event.latLng);
		rclk_menu_overlay.toggleOn();
		//infowindow_rightclk.open(map_cs);   // But I do not know what function should I put here
	}  );
	listener_map_click = google.maps.event.addListener(map_cs, 'click', function(event) {
		//alert("lclk");
		rclk_menu_overlay.toggleOff(event.latLng);
		});

	
	polyline_route22.setMap(map_cs);   // place polylines into map_cs
	polyline_route26.setMap(map_cs);
	polyline_route27.setMap(map_cs);
	polyline_route34.setMap(map_cs);
	polyline_route_31.setMap(map_cs);
	polyline_route_36.setMap(map_cs);
	polyline_route_35.setMap(map_cs);
}// end of initialize

function toggleBounce() {   // how to use reference??

	if (home_marker.getAnimation() != null) {
		home_marker.setAnimation(null);
	} else {
		home_marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
function placeInfowindow(location) {
	infowindow_rightclk.setPosition(location);
	infowindow_rightclk.open(map_cs);
	
}

google.maps.event.addDomListener(window, 'load', initialize);

