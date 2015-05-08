var map;
var latitude;
var longitude;
var toHere = null;
var fromHere = null;
var toHereMarker = null;
var fromHereMarker = null;
var potholeHere = null;
var potholeMarker = null;
function initialize() {
    var latlng = new google.maps.LatLng(40.718,-74.0142);
    var myOptions = {
	zoom: 15,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    google.maps.event.addListener(map, "rightclick",function(event){
	latitude = event.latLng.lat();
	longitude = event.latLng.lng();
	console.log(latitude);
	console.log(longitude);
	showContextMenu(event.latLng);
    });
    var input = /** @type {HTMLInputElement} */(
	document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(
	/** @type {HTMLInputElement} */(input));
    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
	var places = searchBox.getPlaces();
	if (places.length == 0) {
	    return;
	}
	for (var i = 0, marker; marker = markers[i]; i++) {
	    marker.setMap(null);
	}
	console.log(places[0].formatted_address);
	calcRoute(places[0].formatted_address);
	// For each place, get the icon, place name, and location.
	markers = [];
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0, place; place = places[i]; i++) {
	    var image = {
		url: place.icon,
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(25, 25)
	    };
	    // Create a marker for each place.
	    var marker = new google.maps.Marker({
		map: map,
		icon: image,
		title: place.name,
		position: place.geometry.location
	    });
	    markers.push(marker);
	    bounds.extend(place.geometry.location);
	}
	map.fitBounds(bounds);
    });
    // [END region_getplaces]
    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
	var bounds = map.getBounds();
	searchBox.setBounds(bounds);
    });
}
function getCanvasXY(caurrentLatLng){
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
    var caurrentLatLngOffset = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    return caurrentLatLngOffset;
}
function setMenuXY(caurrentLatLng){
    var mapWidth = $('#map_canvas').width();
    var mapHeight = $('#map_canvas').height();
    var menuWidth = $('.contextmenu').width();
    var menuHeight = $('.contextmenu').height();
    var clickedPosition = getCanvasXY(caurrentLatLng);
    var x = clickedPosition.x ;
    var y = clickedPosition.y ;
    
    if((mapWidth - x ) < menuWidth)
        x = x - menuWidth;
    if((mapHeight - y ) < menuHeight)
        y = y - menuHeight;
    
    $('.contextmenu').css('left',x  );
    $('.contextmenu').css('top',y );
};
function showContextMenu(caurrentLatLng  ) {
    var projection;
    var contextmenuDir1;
    var contextmenuDir2;
    var contextmenuDir3;
    var contextmenuDir4;
    var contextmenuDir5;
    projection = map.getProjection() ;
    $('.contextmenu').remove();
    
    contextmenuDir1 = document.createElement("div");
    contextmenuDir1.className  = 'contextmenu';
    contextmenuDir1.innerHTML = "<a id='menu1'><div class=context>Place Pothole Here<\/div><\/a>";
    $(map.getDiv()).append(contextmenuDir1);    
    setMenuXY(caurrentLatLng);
    contextmenuDir1.style.visibility = "visible";
    var e1 = document.getElementById("menu1");
    google.maps.event.addDomListener(e1,"click",function(event){
	console.log("menu1");
	potholeHere = new google.maps.LatLng(latitude,longitude);
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
	contextmenuDir5.style.visibility="hidden";
	potholeHereMarker = new google.maps.Marker({
	    position: potholeHere,
	    map: map,
	    title: 'Pothole'
	});
	//Mark's pothole function
    });
    
    contextmenuDir2 = document.createElement("div");
    contextmenuDir2.className  = 'contextmenu';
    contextmenuDir2.innerHTML = "<a id='menu2'><div class=context>Get Directions To Here<\/div><\/a>";
    $(map.getDiv()).append(contextmenuDir2);
    setMenuXY(caurrentLatLng);
    contextmenuDir2.style.visibility = "visible";
    var e2 = document.getElementById("menu2");
    google.maps.event.addDomListener(e2,"click",function(event){
	console.log("menu2");
	toHere = new google.maps.LatLng(latitude,longitude);
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
	contextmenuDir5.style.visibility="hidden";
	toHereMarker = new google.maps.Marker({
	    position: toHere,
	    map: map,
	    title: 'Destination'
	});
	if(fromHere != null){
	    console.log("getting directions");
	    //calcRoute(fromHere,toHere);
	};
    });
    
    contextmenuDir3 = document.createElement("div");
    contextmenuDir3.className  = 'contextmenu';
    contextmenuDir3.innerHTML = "<a id='menu3'><div class=context>Get Directions From Here<\/div><\/a>";
    $(map.getDiv()).append(contextmenuDir3);
    setMenuXY(caurrentLatLng);
    contextmenuDir3.style.visibility = "visible";
    var e3 = document.getElementById("menu3");
    google.maps.event.addDomListener(e3,"click",function(event){
	console.log("menu3");
	var fromHere = new google.maps.LatLng(latitude,longitude);
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
	contextmenuDir5.style.visibility="hidden";
	fromHereMarker = new google.maps.Marker({
	    position: fromHere,
	    map: map,
	    title: 'Starting Point'
	});
	if(toHere != null){
	    console.log("getting directions");
	    //calcRoute(fromHere,toHere);
	};
    });

    contextmenuDir4 = document.createElement("div");
    contextmenuDir4.className  = 'contextmenu';
    contextmenuDir4.innerHTML = "<a id='menu4'><div class=context>Cancel Directions<\/div><\/a>";
    $(map.getDiv()).append(contextmenuDir4);    
    setMenuXY(caurrentLatLng);
    contextmenuDir4.style.visibility = "visible";
    var e4 = document.getElementById("menu4");
    google.maps.event.addDomListener(e4,"click",function(event){
	console.log("menu4");
	toHere = null;
	fromHere = null;
	fromHereMarker.setMap(null);
	toHereMarker.setMap(null);
	toHereMarker = null;
	fromHereMarker = null;
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
	contextmenuDir5.style.visibility="hidden";
    });

    contextmenuDir5 = document.createElement("div");
    contextmenuDir5.className  = 'contextmenu';
    contextmenuDir5.innerHTML = "<a id='menu5'><div class=context>Close Context Menu<\/div><\/a>";
    $(map.getDiv()).append(contextmenuDir5);
    setMenuXY(caurrentLatLng);
    contextmenuDir5.style.visibility = "visible";
    var e5 = document.getElementById("menu5");
    google.maps.event.addDomListener(e5,"click",function(event){
	console.log("menu5");
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
	contextmenuDir5.style.visibility="hidden";
    });
}
$(document).ready(function(){
    initialize();
    
});
