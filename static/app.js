var App = new Marionette.Application();
App.addRegions({
	firstRegion:"#first-region",
	secondRegion:"#second-region",
	thirdRegion:"#third-region"
})
App.on("start", function(){
	console.log("start")
	var PlaceView = new App.PlaceView({})
	//App.firstRegion.show(PlaceView)
	
	var PlacesView = new App.PlacesView({collection:c});
	//App.secondRegion.show(PlacesView);

	var CompositeView = new App.CompositeView({collection:c});
	//App.thirdRegion.show(CompositeView)


	Backbone.history.start();
})
App.PlaceView = Marionette.ItemView.extend({
	template:"#first-template",
	tagName:"tr",

})
App.PlacesView = Marionette.CollectionView.extend({
	childView: App.PlaceView, 
})

App.CompositeView = Marionette.CompositeView.extend({
	template:"#composite-template",
	childView:App.PlaceView,
	childViewContainer:"tbody",
	events : {
		"click #add" : function(e) {
		    e.preventDefault()
		    var avenue = $("#avenue").val();
		    var street= $("#street").val();
		    var BN = $("#BN").val();
		    var Latitude="";
		    var Longitude="";
		    var x = new Place({avenue:avenue, street:street, BN:BN, Latitude:Latitude,Longitude:Longitude});
		    this.collection.create(x)
			$("#avenue").val("");
			$("#street").val("");
			$("#BN").val("");
		}

	}
		
})

var Place = Backbone.Model.extend({
	idAttribute: "_id",
	defaults:{
		avenue:"",
		street:"",
		BN:"",
		Latitude:"",
		Longitude:""
	}
});
var Pothole = Backbone.Collection.extend({
	model:Place,
	url:'/update',
	initialize: function(){
		this.fetch()
	}
})
var c = new Pothole();

var myController = Marionette.Controller.extend({
	home:function(){

	},
	input:function(){
		var compView=new App.CompositeView({collection:c})
		App.thirdRegion.show(compView)
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
