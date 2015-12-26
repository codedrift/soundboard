var selectedtimerSound;

Template.timer.helpers({
	crons: function () {
		return TimerCollection.find();
	}
});



Template.timer.events({
	"click .btn-add-timer-sound": function (event) {
		//console.log($(event.target).data("sound-id"));
		$("#selected-timer-sound").html($(event.target).html());
		$("#selected-timer-sound").data("sound-id", $(event.target).data("sound-id"));
		selectedtimerSound = $(event.target).data('sound-id');
	},
	"click #btn-timer-add": function (event) {
		console.log($("#selected-timer-sound").data("sound-id"));
	}
});