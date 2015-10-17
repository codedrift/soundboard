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
		var sound_id = $(event.target).data('sound_id');
		console.log("Play " + sound_id);
		Meteor.call('playSound', sound_id);
	}
});