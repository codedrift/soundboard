
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

updateSoundCollection = function updateSoundCollection() {
	console.log("Updating sound collection");
	if(getSoundFilesDir() == undefined){
		console.log("No sound dir set");
		return;
	}
	var categories = getCategoriesFromFileSystem();
	var nocategorysounds = getSoundsWithoutCategoryFromFileSystem();
	addNoCategorySoundsToSoundCollection(nocategorysounds);
	createCategoryCollection(categories);
	addCategoriesToSoundCollection(categories);
	//Remove empty category sounds
	SoundCollection.remove({category: ''});
	console.log("Sound collection update finished")
};

rescanSoundCollection = function rescanSoundCollection(){
	console.log("Rescanning sound collection");
	SoundCollection.remove({});
	CategoryCollection.remove({});
	updateSoundCollection();
};


addSoundsToSoundCollection = function addSoundsToSoundCollection(directory) {
	var soundsList = Shell.ls('-R', getSoundFilesDir() + '/' + directory);
	console.log("Category " + directory + ": " + soundsList);
	soundsList.forEach(function (sound) {
		addSoundToSoundCollection(directory.substring(0, directory.length - 1), directory + sound, sound);
	});
};

getDirectoryNameCleaned = function getDirectoryNameCleaned(directory) {
	return directory.substring(0, directory.length - 1);
};

createCategoryCollection = function createCategoryCollection(directoryList) {
	console.log("Creating categories for: " + directoryList);
	directoryList.forEach(function (directory) {

		var directory_cleaned = getDirectoryNameCleaned(directory);
		var categoryname_cleaned = getCategoryDisplayName(directory);

		var category = CategoryCollection.find({categoryname_cleaned: categoryname_cleaned}).fetch();
		if(category.length > 0){
			return;
		}

		CategoryCollection.insert({
			directory: directory_cleaned,
			category_name: categoryname_cleaned
		});

	});

	//Remove empty categories
	CategoryCollection.remove({category_name: ''});
};

getDisplayNameForFilename = function getDisplayNameForFilename(filename) {
	return filename
		.replace(/[_]/g, ' ')
		.substring(0, filename.length - 4)
		.trim();
};

getCategoryDisplayName = function getCategoryDisplayName(directoryname) {
	return directoryname.charAt(0).toUpperCase() +
		directoryname
			.substring(1, directoryname.length - 1)
			.replace(/[_]/g, ' ')
			.trim();
};

addNoCategorySoundsToSoundCollection = function addNoCategorySoundsToSoundCollection(nocategorysounds) {
	nocategorysounds.forEach(function (sound) {
		addSoundToSoundCollection('none', sound, sound);
	});
};

addSoundToSoundCollection = function addSoundToSoundCollection(category, path, filename) {
	var regexp_audio = new RegExp("^(mp3|wav)$");
	var extension = getFileExtension(filename);
	if (regexp_audio.test(extension)) {
		var sound = SoundCollection.find({path : path}).fetch();
		if(sound.length > 0){
			return;
		}
		SoundCollection.insert({
			category: category,
			path: path,
			display_name: getDisplayNameForFilename(filename),
			play_count: 0
		});
	}
};

getFileExtension = function getFileExtension(filename) {
	return filename.split('.').pop();
};

addCategoriesToSoundCollection = function addCategoriesToSoundCollection(categories) {
	categories.forEach(function (category) {
		addSoundsToSoundCollection(category);
	});
};