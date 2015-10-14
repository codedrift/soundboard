Template.settings.events({
	"click #settings-hdmi-reset": function () {
		Meteor.call('resetSerialConnection');
	},
	"click #settings-save-directory": function(){
		var directory = $('#settings-input-directory').val();
		Meteor.call('saveSetting', 'soundDirectory', directory);
	},
	"click #settings-update-sounds": function(){
		Meteor.call('updateSoundCollection');
	},
	"click #settings-rescan-sounds":function (){
		Meteor.call('rescanSoundCollection');
	}
});

Template.settings.helpers({
	"hdmisettings": function () {
		var hdmisettings = SettingsCollection.find({settings_key: 'hdmisettings'}).fetch();
		if(hdmisettings.length > 0){
			console.log(hdmisettings);
			return hdmisettings;
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
	},
	"soundDirectory": function (){
		var directory = SettingsCollection.find({setting_key : 'soundDirectory'}).fetch();
		if(directory.length > 0) {
			return directory[0].setting_value;
		}
	}
});

