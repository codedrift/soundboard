Template.fav_panel.helpers({
	favs: function(){
		var favs = FavCollection.find().fetch();
		var faved_sounds = [];
		$.each(favs, function (key, fav) {
			faved_sounds.push(fav.sound_path);
		});
		return SoundCollection.find({path: { $in: faved_sounds } });
	}
});
