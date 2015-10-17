
Template.soundboard.events({
	"click .sound-button": function (event) {
		var sound_id = $(event.target).data('sound_id');
		Meteor.call('playSound', sound_id);
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

Template.sound_dropdown_select.rendered = function () {
	var select = $('#dd_list_' + this.data._id);
	select.hover(function () {
		var category_id = $(this).data('category_id');
		loadDropdownForCategory(CategoryCollection.find({_id: category_id}).fetch()[0]);
	});
	select.change(function () {
		var sound_id = $(this).val();
		Meteor.call('playSound', sound_id);
		$(this).val(0);
	});
};



loadDropdownForCategory = function loadDropdownForCategory(category) {
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
