Template.hdmiremote.helpers({
	names: [
		{ name: "Peter" , hdmiport : 1},
		{ name: "RasPi" , hdmiport : 2},
		{ name: "Jan" , hdmiport : 3},
		{ name: "Henning" , hdmiport : 4},
		{ name: "Chris" , hdmiport : 5},
		{ name: "---" , hdmiport : 6},
		{ name: "---" , hdmiport : 7},
		{ name: "Tristan" , hdmiport : 8}
	]
});

Template.hdmiremote.events({
	"click .hdmi-switch-button": function () {
		var port_id = $(event.target).data('port');
		console.log("switch hdmi port to " + port_id);
		Meteor.call('switchHdmiPort', port_id);
	}
});