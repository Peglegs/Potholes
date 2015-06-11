var potholes = [ new google.maps.LatLng(40.778868, -73.784550)];
var directionsService = new google.maps.DirectionsService();
var routepath;
var map;
console.log("hi");

function initialize() {

    var markers = [];
    map = new google.maps.Map(document.getElementById('map-canvas'), {
	mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var defaultBounds = new google.maps.LatLngBounds(
	new google.maps.LatLng(40.70, -74.2),
	new google.maps.LatLng(40.725, -73.9));
    map.fitBounds(defaultBounds);

    // Create the search box and link it to the UI element.
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

function calcRoute(place) {
    for (var i = 0; i < routepaths.length; i++){
	routepaths[i].setMap(null);
    }
    routepaths =[];
    var start = "345 Chambers St, New York, NY 10282, USA";
    var end = place;
    var request = {
	origin:start,
	destination:end,
	travelMode: google.maps.TravelMode.DRIVING,
	provideRouteAlternatives:true
    };
    directionsService.route(request, function(result, status) {
	if (status == google.maps.DirectionsStatus.OK) {
	    var min = potholes.length;
	    var index = 0;
            for (var i = 0, len = result.routes.length; i < len; i++) {

		var count = 0;
		 	    
		for (var j =0; j < potholes.length; j++){
		    var path = google.maps.geometry.encoding.decodePath(result.routes[i].overview_polyline);
		    var line = new google.maps.Polyline({
			path: path});

		    if (google.maps.geometry.poly.isLocationOnEdge(potholes[j],line,10e-4)){
			count++;
		    }
		}
	    }
	    if (count < min) {
		min = count;
		index = i;
	    }
	    routepath =new google.maps.DirectionsRenderer({
                map: map,
                directions: result,
                routeIndex: index
	    });    
	    if (min > 0) {
		alert("This route still contains some potholes. Please alter route manually to avoid them.");
	}
    });
}
var geocoder = new google.maps.Geocoder();
var promise = new Promise(function(resolve,reject){
    if (typeof potholes[i] === 'string'){
	geocoder.geocode( { 'address': potholes[i]}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
		potholes[i] = results[0].geometry.location;
		resolve("Success");
	    }
	});
    }
     else {
	 console.log("oops"); 
	 reject("failed");
	    }


});
promise.then(function() {
    i = i +1;
}, function(){
    i = i +1;
    console.log("this is running");}
);
promise.then(function(){
    console.log(potholes);
    google.maps.event.addDomListener(window, 'load', initialize);

},function(){
    console.log(potholes);
    google.maps.event.addDomListener(window, 'load', initialize);

});
