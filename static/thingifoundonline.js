var map;
var latitude;
var longitude;
function initialize() {
    var latlng = new google.maps.LatLng(40.718,-74.0142);
    var myOptions = {
	zoom: 15,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);});
    
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
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
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
	latitude = event.latLng.lat();
	longitude = event.latLng.lng();
	console.log(latitude);
	console.log(longitude);
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
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
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
    });

    contextmenuDir4 = document.createElement("div");
    contextmenuDir4.className  = 'contextmenu';
    contextmenuDir4.innerHTML = "<a id='menu4'><div class=context>Cancel<\/div><\/a>";
    $(map.getDiv()).append(contextmenuDir4);    
    setMenuXY(caurrentLatLng);
    contextmenuDir4.style.visibility = "visible";
    var e4 = document.getElementById("menu4");
    google.maps.event.addDomListener(e4,"click",function(event){
	console.log("menu4");
	contextmenuDir1.style.visibility="hidden";
	contextmenuDir2.style.visibility="hidden";
	contextmenuDir3.style.visibility="hidden";
	contextmenuDir4.style.visibility="hidden";
    });
}
$(document).ready(function(){
    initialize();
    
});
