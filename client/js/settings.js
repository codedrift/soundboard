Template.settings.helpers({
	"hdmisettings": function () {
		return getHdmiSettings();
	},
	"soundDirectory": function (){
		var directory = SettingsCollection.find({setting_key : 'soundDirectory'}).fetch();
		if(directory.length > 0) {
			return directory[0].setting_value;
		}
	}
});

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
		sAlert.info('Updating sound collection');
	},
	"click #settings-rescan-sounds":function (){
		if($('#checkbox_rescan').is(":checked") == false){
			sAlert.error('Pleaso confirm initialization');
			return;
		}
		sAlert.info('Initializing sound collection');
		Meteor.call('rescanSoundCollection');
	},
	"click #settings-remove-deleted": function (){
		sAlert.info('Removing deleted sounds');
		Meteor.call('removeDeletedSounds');
	},
	"click #settings-hdmi-name-save": function () {
		console.log("Save hdmi port settings");
		var inputs = $('#hdmi-port-settings-list').find('.hdmi-port-name-input');
		var hdmiportsetting = [];
		$.each(inputs, function (key, input) {
			hdmiportsetting.push({name: $(input).val(), hdmiport: $(input).data('port')})
		});
		console.log(hdmiportsetting);
		Meteor.call('saveSetting' , 'hdmisettings', hdmiportsetting);
	}
});

