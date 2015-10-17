getHdmiSettings = function getHdmiSettings() {
	var hdmisettings = SettingsCollection.find({setting_key: 'hdmisettings'}).fetch();
	if(hdmisettings.length > 0){
		return hdmisettings[0].setting_value;
	} else {
		return [
			{ name: "Port1" , hdmiport : 1},
			{ name: "Port2" , hdmiport : 2},
			{ name: "Port3" , hdmiport : 3},
			{ name: "Port4" , hdmiport : 4},
			{ name: "Port5" , hdmiport : 5},
			{ name: "Port6" , hdmiport : 6},
			{ name: "Port7" , hdmiport : 7},
			{ name: "Port8" , hdmiport : 8}
		];
	}
};

Template.hdmiremote.helpers({
	hdmisettings: function(){
		return getHdmiSettings();
	}
});

Template.hdmiremote.events({
	"click .hdmi-switch-button": function () {
		var port_id = $(event.target).data('port');
		console.log("switch hdmi port to " + port_id);
		Meteor.call('switchHdmiPort', port_id);
	}
});