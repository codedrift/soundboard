Template.statistics.helpers({
	playcount_toplist: function () {
		return SoundCollection.find({play_count: {$gt: 0}}, {sort: {play_count: -1}, limit: 10});
	},
	total_sounds: function (){
		return SoundCollection.find().count();
	},
	total_categories: function (){
		return CategoryCollection.find().count();
	}
});

Handlebars.registerHelper("inc", function (value, options) {
	return parseInt(value) + 1;
});
