Template.info.helpers({
	playcount_toplist: function () {
		return SoundCollection.find({play_count: {$gt: 0}}, {sort: {play_count: -1}, limit: 100});
	},
	total_sounds: function (){
		return SoundCollection.find().count();
	},
	total_categories: function (){
		return CategoryCollection.find().count();
	},
	toplist_since:function () {
		return SettingsCollection.find({setting_key: 'toplist_since'}).fetch()[0];
	},
	playQueue: function () {
		return PlayQueueCollection.find();
	}
});

Template.info.events({
	"click .btn-remove-sound-from-playQueue": function (event) {
		var pqid = $(event.target).data("pq_id");
		Meteor.call('removeFromPlayQueue', pqid);
	}
});

UI.registerHelper("inc", function (value, options) {
	return parseInt(value) + 1;
});
