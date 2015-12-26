Template.search.rendered = function () {
	$('.sound-search-input').focus();
	$(document).keydown(function(e) {
		switch(e.which) {

			case 38: // up
				console.log('up');
				break;

			case 40: // down
				console.log('down');
				break;

			default: return; // exit this handler for other keys
		}
		e.preventDefault();
	});
};

Template.search.events({
	"click .result": function (event) {
		var sound_id = $(event.target).data('sound-id');
		Meteor.call('playSound', sound_id);
	},
	"click .fav-star": function(event){
		var sound_path = $(event.target).data('sound-path');
		Meteor.call('toggleFav', sound_path);
	}
});

Handlebars.registerHelper("isFav", function (sound_path, options) {
	return FavCollection.find({sound_path: sound_path}).count() > 0;
});
