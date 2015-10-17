getCategoriesFromFileSystem = function getCategoriesFromFileSystem() {
	console.log("Searching categorys in " + getSoundFilesDir());
	// only folders/categories
	var categories = Shell.exec('cd ' + getSoundFilesDir() + '&& ls -d ' + '*/', {silent: true});
	return categories.output.split('\n');
};

getSoundsWithoutCategoryFromFileSystem = function getSoundsWithoutCategoryFromFileSystem() {
	console.log("Searching files without category in " + getSoundFilesDir());
	// only mp3 files in the main directory
	var nocategorysounds = Shell.exec('cd ' + getSoundFilesDir() + ' && ls', {silent: true});
	return nocategorysounds.output.split('\n'); // split output to array
};
