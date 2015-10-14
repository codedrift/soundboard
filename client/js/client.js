//=============================================================================
//									Members
//=============================================================================

SoundCollection = new Meteor.Collection('sounds');
CategoryCollection = new Mongo.Collection('categories');
PlayQueueCollection = new Meteor.Collection("play_queue");
SettingsCollection = new Meteor.Collection("settings");

Meteor.startup(function () {
	SoundCollection.initEasySearch(['display_name'], {
		'limit' : 10,
		'use' : 'mongo-db'
	});
});

Template.playcount_statistic.helpers({
	playcount_toplist: function () {
		return SoundCollection.find({play_count: {$gt: 0}}, {sort: {play_count: -1}});
	}
});

var playSound = function playSound(sound_id) {
	Meteor.call('playSound', sound_id);
};

var killSounds = function killSounds() {
	Meteor.call('killSounds');
};

Template.navbar.events({
	"click .kill_button": function () {
		killSounds();
	}
});

var loadDropdownForCategory = function loadDropdownForCategory(category) {
	if (undefined === category) {
		return;
	}

	var category_soundList = $('#dd_list_' + category._id);

	if (category_soundList.children().length > 1) {
		return;
	}

	var soundsForCategory = SoundCollection.find({category: category.directory});

	var sounds_html = '';
	soundsForCategory.forEach(function (sound) {
		sounds_html += '<option class="dropdown_sound" value="' + sound._id + '">' + sound.display_name + '</option>';
	});

	category_soundList.append(sounds_html);
};

Template.sound_dropdown_select.rendered = function () {
	var select = $('#dd_list_' + this.data._id);
	select.hover(function () {
		var category_id = $(this).data('category_id');
		loadDropdownForCategory(CategoryCollection.find({_id: category_id}).fetch()[0]);
	});
	select.change(function () {
		playSound($(this).val());
		$(this).val(0);
	});
};

Template.soundboard.events({
	"click .sound-button": function (event) {
		playSound($(event.target).data('sound_id'));
	}
});

Template.soundboard.helpers({
	sounds: function () {
		return SoundCollection.find({category: 'none'});
	},
	categories: function () {
		return CategoryCollection.find();
	}
});
Template.search.events({
	"click .result": function (event) {
		var sound_id = $(event.target).data('sound_id');
		console.log("Play " + sound_id);
		playSound(sound_id);
	}
});

Template.fav_panel.helpers({
	user: function () {
		return Meteor.user().username;
	}
});

Template.search.rendered = function () {
	$('.sound-search-input').focus();
	$(document).keydown(function(e) {
		switch(e.which) {

			case 38: // up
				console.log('up');
				break;

			case 40: // down
				console.log('down');
				break;

			default: return; // exit this handler for other keys
		}
		e.preventDefault();
	});
};
