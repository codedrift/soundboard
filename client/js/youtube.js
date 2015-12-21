Template.youtube.events({
	"click #button-yt-play": function (event) {
		var yturl = $('#yt-url').val();
		var ytfrom = $('#yt-from').val();
		var ytto = $('#yt-to').val();
		Meteor.call('playYT', yturl, ytfrom,ytto);
		setTimeout(function(){ Meteor.call('updateSoundCollection'); }, 10000);
	}
});
