Template.fav_panel.helpers({
	favs: function(){
		var favs = FavCollection.find().fetch();
		var faved_sounds = [];
		$.each(favs, function (key, fav) {
			faved_sounds.push(fav.sound_id);
		});
		return SoundCollection.find({_id: { $in: faved_sounds } });
	}
});
