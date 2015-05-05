function initialize() {
        var myOptions = {
          center: { lat: 40.718, lng:-74.0142},
            zoom: 15,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            myOptions);
    google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);});
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
	var contextmenuDir;
	projection = map.getProjection() ;
	$('.contextmenu').remove();
	contextmenuDir = document.createElement("div");
	contextmenuDir.className  = 'contextmenu';
	contextmenuDir.innerHTML = "<a id='menu1'><div class=context>menu item 1<\/div><\/a><a id='menu2'><div class=context>menu item 2<\/div><\/a>";
	$(map.getDiv()).append(contextmenuDir);
	
	setMenuXY(caurrentLatLng);
	
	contextmenuDir.style.visibility = "visible";
    }
}
$(document).ready(function(){
    initialize();
    
});
