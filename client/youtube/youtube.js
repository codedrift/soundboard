Template.youtube.events({
	"click #button-yt-grab": function (event) {
		var yturl = $('#yt-url').val();
		var ytfrom = $('#yt-from').val();
		var ytto = $('#yt-to').val();

		if(yturl == ""){
			sAlert.warning('No URL set');
			return;
		}

		sAlert.info('Loading youtube sound ...');
		Meteor.call('grabYT', yturl, ytfrom, ytto);
	},
	"click #button-yt-play": function (event) {
		var yturl = $('#yt-url').val();
		var ytfrom = $('#yt-from').val();
		var ytto = $('#yt-to').val();

		if(yturl == ""){
			sAlert.warning('No URL set');
			return;
		}

		Meteor.call('playYT', yturl, ytfrom, ytto);
	},
	"click .sound-button": function (event) {
		var sound_id = $(event.target).data('sound-id');
		Meteor.call('playSound', sound_id);
	},
	"click .btn-delete-ytSound": function(event) {
		Meteor.call("deleteSound", $(event.target).data("sound-id"))
	}
});

Template.youtube.helpers({
	ytSounds: function () {
		return SoundCollection.find({category: "Youtube"}, {sort: { category: 1 }});
	}
});
