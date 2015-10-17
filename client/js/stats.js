Template.playcount_statistic.helpers({
	playcount_toplist: function () {
		return SoundCollection.find({play_count: {$gt: 0}}, {sort: {play_count: -1}, limit: 10});
	}
});
