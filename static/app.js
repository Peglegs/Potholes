var App = new Marionette.Application();
App.addRegions({
	firstRegion:"#first-region",
	secondRegion:"#second-region",
	thirdRegion:"#third-region"
})
App.on("start", function(){
	console.log("start")
	var PlaceView = new App.PlaceView({model:p1})
	//App.firstRegion.show(PlaceView)
	
	var PlacesView = new App.PlacesView({collection:c});
	//App.secondRegion.show(PlacesView);

	var CompositeView = new App.CompositeView({collection:c});
	App.thirdRegion.show(CompositeView)


	Backbone.history.start();
})
App.PlaceView = Marionette.ItemView.extend({
	template:"#first-template",
	tagName:"tr"
})
App.PlacesView = Marionette.CollectionView.extend({
	childView: App.PlaceView
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
		    var BM = $("BN").val();
		    this.collection.add(new Person({avenue:avenue, street:street, BN:BN}));
			$("#avenue").val("");
			$("#street").val("");
			$("#BN").val("");
	
			}

		}

})

var Person = Backbone.Model.extend({});
var Roster = Backbone.Collection.extend({
	model:Person
})
var p1 = new Person({avenue:"1st avenue",street:"86th street", BN:444})
var c = new Roster([p1])
App.start();
