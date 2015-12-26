Session.set("selectedTimerSound", "no sound selected");
Session.set("selectedTimerSoundId", "no sound selected");

Template.timer.helpers({
	crons: function () {
		return TimerCollection.find();
	},
	selectedTimerSound: function () {
		return Session.get("selectedTimerSound")
	}
});



Template.timer.events({
	"click .btn-add-timer-sound": function (event) {
		Session.set("selectedTimerSound", $(event.target).html());
		Session.set("selectedTimerSoundId", $(event.target).data("sound-id"));
	},
	"click .btn-delete-timer": function (event) {
		Meteor.call("deleteTimer", $(event.target).data("timer-id"));
	},
	"click #btn-timer-add": function (event) {
		console.log(Session.get("selectedTimerSound"));
		var cronSetting = $("#cronSetting").val();
		var cronName = $("#cronName").val();
		if(cronSetting == ""){
			sAlert.warning("cron setting cannot be empty");
		}
		var sound_id = Session.get("selectedTimerSoundId");
		Meteor.call("addTimer", sound_id, cronSetting, cronName, function (error, result) {
			if(result){
				sAlert.success("Timer added!");
			} else {
				sAlert.success("Could not add timer");
			}
		});
	}
});