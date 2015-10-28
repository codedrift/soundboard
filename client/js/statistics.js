Template.statistics.helpers({
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
		return SettingsCollection.find({setting_key: 'toplist_since'}).fetch()[0].setting_value;
	}
});

Handlebars.registerHelper("inc", function (value, options) {
	return parseInt(value) + 1;
});
