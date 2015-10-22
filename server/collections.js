
getSoundFilesDir = function getSoundFilesDir(){
	var setting = getSetting('soundDirectory')[0];
	if(setting){
		return setting.setting_value;
	}
};

saveSetting = function saveSetting(setting_key, setting_value) {
	SettingsCollection.remove({setting_key: setting_key});
	console.log("Saving setting " + setting_key + "[" + setting_value + "]");
	SettingsCollection.insert({
		setting_key: setting_key,
		setting_value: setting_value
	});
};

getSetting = function getSetting(setting_key) {
	return SettingsCollection.find({setting_key: setting_key}).fetch();
};

rescanSoundCollection = function rescanSoundCollection(){
	console.log("Rescanning sound collection");
	var d = new Date();
	saveSetting('toplist_since', d.toUTCString());
	SoundCollection.remove({});
	CategoryCollection.remove({});
	//updateSoundCollection();
	updateFsSoundsCollections();
};



removeDeletedSounds = function removeDeletedSounds() {
	//var sounds = SoundCollection.find().fetch();
	//sounds.forEach(function (sound) {
	//
	//});
};

getFileExtension = function getFileExtension(filename) {
	return filename.split('.').pop();
};

updateFsSoundsCollections = function updateFsSoundsCollections(){
	var start = new Date().getTime();
	var soundsdir = getSoundFilesDir();


	if(soundsdir === undefined){
		console.log("No sound dir set");
		return;
	}

	var futureCategories = new Future();
	var futureSounds = new Future();
	var sounds   = [];
	var categories = [];

	console.log("Updating sound collection from " + soundsdir);

	var walker = Meteor.npmRequire('walk');

	soundfilewalker = walker.walk(soundsdir, { followLinks: false });

	soundfilewalker.on("node", function (root, node, next) {
		if(node.type == 'directory'){

			categories.push(node.name);

		} else if(node.type == 'file'){

			var category = root.substring(soundsdir.length + 1);
			var path;

			if(category.length > 0){
				path = category +  '/' + node.name;
			} else {
				//No category
				path = node.name;
				category = 'none';
			}

			var sound = {
				category: category,
				path: path,
				name: node.name
			};

			sounds.push(sound);
		}

		next();
	});

	soundfilewalker.on('end', function() {
		futureCategories.return(categories);
		futureSounds.return(sounds);
	});


	createSoundCollection(futureSounds.wait());
	createCategoryCollection(futureCategories.wait());

	var end = new Date().getTime();
	var time = (end - start) / 1000;
	console.log("Sound collection update finished [" + time +"s]");
};

getCategoryDisplayName = function getCategoryDisplayName(directoryname) {
	return directoryname.charAt(0).toUpperCase() +
		directoryname
			.substring(1)
			.replace(/[_]/g, ' ')
			.trim();
};


createSoundCollection = function createSoundCollection(sounds) {
	var regexp_audio = new RegExp("^(mp3|wav)$");

	sounds.forEach(function (sound) {
		var extension = getFileExtension(sound.path);

		if (regexp_audio.test(extension)) {

			var dbsound = SoundCollection.find({path : sound.path}).fetch();

			if(dbsound.length > 0){
				return;
			}

			var display_name = getDisplayNameForFilename(sound.name);
			var category_name = getCategoryDisplayName(sound.category);

			SoundCollection.insert({
				category: category_name,
				path: sound.path,
				display_name: display_name,
				play_count: 0
			});

		}

	});
};

createCategoryCollection = function createCategoryCollection(directoryList) {
	directoryList.forEach(function (directory) {

		var category_name = getCategoryDisplayName(directory);
		var category = CategoryCollection.find({category_name: category_name}).fetch();

		if(category.length > 0){
			return;
		}

		CategoryCollection.insert({
			directory: directory,
			category_name: category_name
		});

	});
};

getDisplayNameForFilename = function getDisplayNameForFilename(filename) {
	return filename
		.replace(/[_]/g, ' ')
		.substring(0, filename.length - 4)
		.trim();
};
