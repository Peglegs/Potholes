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
			var name = $("#name").val();
			var height= $("#height").val();
			var weight = $("#weight").val();
			var position=$("#position").val();
			var hometown=$("#hometown").val();
			this.collection.add(new Person({name:name,height:height,weight:weight,position:position,hometown:hometown}));
			$("#name").val("");
			$("#height").val("");
			$("#weight").val("");
			$("#position").val("");
			$("#hometown").val("");
			}

		}

})

var Person = Backbone.Model.extend({});
var Roster = Backbone.Collection.extend({
	model:Person
})
var p1 = new Person({name:"Mark", height:"61", weight:'230', position:"OL", hometown:"nyc"})
var p2 = new Person({name:"Cooper", height:"61", weight:'230', position:"OL", hometown:"nyc"})
var c = new Roster([p1,p2])
App.start();