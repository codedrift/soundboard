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
		if($('#checkbox_rescan').is(":checked") == false){
			console.log("Pleaso confirm rescan");
			return;
		}
		Meteor.call('rescanSoundCollection');
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

