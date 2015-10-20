watchSoundFiles = function watchSoundFiles() {
	console.log("Starting sounds watcher");
	var wrap = Meteor.wrapAsync(asyncstuff);
	var result = wrap('penis');
	console.log(result);
};

asyncstuff = function(key, callback){
	var soundFilesDir = getSoundFilesDir();

	var watcher = Chokidar.watch(soundFilesDir, {
		ignored: /[\/\\]\./,
		persistent: true
	})
		//Initial scan
		.on('add', function (path) {
			//console.log('File', path, 'has been added');
		})
		.on('addDir', function (path) {
			//console.log('Directory', path, 'has been added');
		})

		.on('change', function (path) {
			console.log('File', path, 'has been changed');
		})

		//link
		.on('unlink', function (path) {
			callback( null, path);
			console.log('File', path, 'has been removed');
		})

		.on('unlinkDir', function (path) {
			var name = path.substring(soundFilesDir.length + 1);
			var cat = getCategoryDisplayName(name);
			//CategoryCollection.remove({category_name: cat});
			console.log(name + ' has been removed');
		})

		.on('error', function (error) {
			console.log('Error happened', error);
		})
		.on('ready', function () {
			console.log('Sounds watcher ready');
		})

		//raw events (everything)
		.on('raw', function (event, path, details) {
			console.log('Raw event info:', event, path, details);
		});
};