Template.navbar.events({
	"click .kill_button": function () {
		Meteor.call('killSounds');
	}
});