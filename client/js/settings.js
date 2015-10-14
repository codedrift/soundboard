Template.settings.events({
	"click #settings-hdmi-reset": function () {
		Meteor.call('resetSerialConnection');
	}
});

Template.settings.helpers({
	"hdmisettings": [
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