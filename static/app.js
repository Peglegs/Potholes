var App = new Marionette.Application();
App.addRegions({
	firstRegion:"#first-region",
	secondRegion:"#second-region",
	thirdRegion:"#third-region"
})
App.on("start", function(){
    console.log("start");
    var PlaceView = new App.PlaceView({});
    //App.firstRegion.show(PlaceView)
	
    var PlacesView = new App.PlacesView({collection:c});
    //App.secondRegion.show(PlacesView);
    
    var CompositeView = new App.CompositeView({collection:c});
    //App.thirdRegion.show(CompositeView)


    Backbone.history.start();
});
App.PlaceView = Marionette.ItemView.extend({
    template:"#first-template",
    tagName:"tr",
    
});
App.PlacesView = Marionette.CollectionView.extend({
    childView: App.PlaceView, 
});

App.CompositeView = Marionette.CompositeView.extend({
    template:"#composite-template",
    childView:App.PlaceView,
    childViewContainer:"tbody",
    events : {
	"click #add" : function(e) {
	    e.preventDefault();
	    var myaddress= $("#address").val();
	    var Latitude = $("#Latitude").val();
	    var Longitude = $("#Longitude").val();
	    var that = this;
	    var x = new Place({address:myaddress, Latitude:Latitude,Longitude:Longitude});

	    if (isNaN(parseInt(Latitude)) || isNaN(parseInt(Longtitude))){
		var geocoder = new google.maps.Geocoder();
		var promise = new Promise(function(resolve,reject){
		    geocoder.geocode( { 'address': myaddress}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
			    Latitude = results[0].geometry.location.lat();
			    Longitude = results[0].geometry.location.lng();
			    console.log(Longitude);
			    resolve("Success");
			}
			reject("failed");
		    });
		});
		
		promise.then(function(){
		    x = new Place({address:myaddress, Latitude:Latitude,Longitude:Longitude});
		
		    that.collection.create(x);
		},
			     function(){
				 alert("We couldn't find the address you input. Please try again.");
			     });
	    }
	    else {
		that.collection.create(x);
	    }
			     
	    $("#address").val("");
	    $("#Latitude").val("");
	    $("#Longitude").val("");
	    
	}
	
    }
    
});

var Place = Backbone.Model.extend({
    idAttribute: "_id",
    address:"",
	Latitude:"",
	Longitude:""
});

var Pothole = Backbone.Collection.extend({
    model:Place,
    url:'/update',
    initialize: function(){
	this.fetch();
	}
});
var c = new Pothole();

var myController = Marionette.Controller.extend({
    home:function(){
	
    },
    input:function(){
	var compView=new App.CompositeView({collection:c});
	App.thirdRegion.show(compView);
	var map;
var markers = [];
var latitude;
var longitude;
var potholeHere = null;
var potholeMarker = null;
var marker;
var isUsingSearch = false;
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
	//calcRoute(places[0].formatted_address);
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
	    marker = new google.maps.Marker({
		map: map,
		icon: image,
		title: place.name,
		position: place.geometry.location
	    });
	    isUsingSearch = true;
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
    var contextmenuDir5;
    projection = map.getProjection() ;
    $('.contextmenu').remove();
    
    contextmenuDir1 = document.createElement("div");
    contextmenuDir1.className  = 'contextmenu';
    contextmenuDir1.innerHTML = "<a id='menu1'><div class=context>Select This Location<\/div><\/a>";
    $(map.getDiv()).append(contextmenuDir1);    
    setMenuXY(caurrentLatLng);
    contextmenuDir1.style.visibility = "visible";
    var e1 = document.getElementById("menu1");
    google.maps.event.addDomListener(e1,"click",function(event){
	if(potholeMarker != null){
	    potholeMarker.setMap(null);
	    potholeMarker = null;
	}
	console.log("menu1");
	potholeHere = new google.maps.LatLng(latitude,longitude);
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir5.style.visibility="hidden";
	var image = {
	    url: 'static/index.jpeg',
	    size: new google.maps.Size(50, 30),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(25,15),
	    scaledSize: new google.maps.Size(50, 30)
	}
	potholeMarker = new google.maps.Marker({
	    position: potholeHere,
	    map: map,
	    title: 'Pothole',
	    icon: image
	});
	//Mark's pothole function
	var verytemp = document.getElementById("Latitude");
	verytemp.value = latitude;
	var alsoverytemp = document.getElementById("Longitude");
	alsoverytemp.value = longitude;
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
	contextmenuDir5.style.visibility="hidden";
    });
}


	initialize();
    }
	
});
App.controller = new myController();

App.router = new Marionette.AppRouter({
    controller:App.controller, 
    appRoutes:{
	"/":"home",
	input:"input"
    }
});



App.start();
