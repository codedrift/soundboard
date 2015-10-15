//=============================================================================
//									Members
//=============================================================================

var Shell = Meteor.npmRequire('shelljs');
var Spawn = Meteor.npmRequire('child_process').spawn;

var Api = new Restivus({
	useDefaultAuth: false,
	prettyJson: true
});

Api.addRoute('/play/:id', {authRequired: false}, {
	post: function () {
		var sound_id = this.urlParams.id;
		console.log(sound_id);
		playSoundAsync(sound_id);
	},
	get: function () {
		var sound_id = this.urlParams.id;
		console.log(sound_id);
		playSoundAsync(sound_id);
	}
});

SoundCollection = new Mongo.Collection('sounds');
CategoryCollection = new Mongo.Collection('categories');
PlayQueueCollection = new Meteor.Collection("play_queue");
SettingsCollection = new Meteor.Collection("settings");

var childProcesses = [];

//=============================================================================
//									Startup
//=============================================================================

Meteor.startup(function () {

	//if (SoundCollection.find().count() === 0) {
	//	console.log("No existing sound collection found. Indexing initially.");
	//	var categories = getCategoriesFromFileSystem();
	//	var nocategorysounds = getSoundsWithoutCategoryFromFileSystem();
	//	createCategoryCollection(categories);
	//	addNoCategorySoundsToSoundCollection(nocategorysounds);
	//	addCategoriesToSoundCollection(categories);
	//	SoundCollection.remove({category: ''});
	//} else {
	//	console.log("Found existing sound collection.");
	//	updateDatabaseEntries();
	//}

	resetPlay();

	EasySearch.createSearchIndex('sounds', {
		'field': ['display_name'],
		'collection': SoundCollection,
		'limit': 10
	});

	SoundCollection.initEasySearch(['display_name'], {
		'limit': 10,
		'use': 'mongo-db'
	});

	console.log("SoundCollection has " + SoundCollection.find().count() + " entries");
});

//=============================================================================
//									Remote methods
//=============================================================================

Meteor.methods({
	playSound: function (sound_id) {
		console.log("Client called playSound");
		this.unblock();
		//playAsync(sound_id);
		addSoundToPlayQueue(sound_id);
	},
	killSounds: function () {
		console.log("Client called killSounds");
		clearPlayQueue();
		killSounds();
	},
	resetSerialConnection: function () {
		console.log("Client called resetSerialConnection");
		resetSerialConnection();
	},
	switchHdmiPort: function (port_id) {
		console.log("Client called switchHdmiPort");
		switchHdmiPort(port_id);
	},
	saveSetting: function (key, value) {
		saveSetting(key, value);
	},
	getSetting: function (key) {
		return getSetting(key);
	},
	updateSoundCollection: function () {
		updateSoundCollection();
	},
	rescanSoundCollection: function () {
		rescanSoundCollection();
	}
});

//=============================================================================
//									Sound
//=============================================================================

var killSounds = function killSounds() {
	resetPlay();
	playSoundAsync({path: 'scratch.mp3'});
};

var resetPlay = function resetPlay() {
	clearPlayQueue();
	killChildProcesses();
	killPlayScript();
	killPlayInstances();
	removeLockfile();
};

var clearPlayQueue = function clearPlayQueue() {
	console.log("Clearing playQueue");
	PlayQueueCollection.remove({});
};

var getPlayQueueSorted = function getPlayQueueSorted() {
	return PlayQueueCollection.find({}, {sort: {inserted: 1}}).fetch();
};

var playSoundAsync = function playSoundAsync(sound, playQueueId) {
	console.log("Play sound async :");
	console.log(sound);

	var Future = Meteor.npmRequire('fibers/future');
	var fut = new Future();

	var command = Spawn('sh', ['assets/app/node_sound_script.sh', getSoundFilesDir(), sound.path, playQueueId]);
	command.stdout.on('data', function (data) {
		var json = JSON.parse(data);
		fut.return(json);
	});

	var pqid = fut.wait().playQueueId;

	if (pqid != undefined) {
		console.log("Play finished for playqueueid: " + pqid);
	}

	PlayQueueCollection.remove({_id: pqid}, function () {
		playNext();
		console.log("Remaining playqueue:");
		console.log(PlayQueueCollection.find().fetch());
	});
};

var playNext = function playNext() {
	console.log("Paying next song");
	var playQueue = getPlayQueueSorted();

	if (playQueue.length === 0) {
		console.log("Playqueue is empty");
		return;
	}

	var nextSoundId = playQueue[0].sound_id;
	var playQueueId = playQueue[0]._id;
	var sound = SoundCollection.find({_id: nextSoundId}).fetch()[0];

	SoundCollection.update(sound, {$inc: {play_count: 1}});

	playSoundAsync(sound, playQueueId);
};

var addSoundToPlayQueue = function addSoundToPlayQueue(sound_id) {
	var date = new Date();
	PlayQueueCollection.insert({sound_id: sound_id, inserted: date.getTime()});

	console.log("Adding " + sound_id + " to playQueue");

	var pqcount = PlayQueueCollection.find().count();

	console.log("New playqueue:");
	console.log(PlayQueueCollection.find().fetch());

	if (pqcount > 1) {
		console.log("Playqueue is already running");
		return;
	}

	playNext();
};

//=============================================================================
//									Collections
//=============================================================================

var getSoundFilesDir = function getSoundFilesDir(){
	var setting = getSetting('soundDirectory')[0];
	if(setting){
		return setting.setting_value;
	}
};

var saveSetting = function saveSetting(setting_key, setting_value) {
	SettingsCollection.remove({setting_key: setting_key});
	console.log("Saving setting " + setting_key + "[" + setting_value + "]");
	SettingsCollection.insert({
		setting_key: setting_key,
		setting_value: setting_value
	});
};

var getSetting = function getSetting(setting_key) {
	return SettingsCollection.find({setting_key: setting_key}).fetch();
};

var updateSoundCollection = function updateSoundCollection() {
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
	console.log(categories);
};

var rescanSoundCollection = function rescanSoundCollection(){
	console.log("Rescanning sound collection");
	SoundCollection.remove({});
	CategoryCollection.remove({});
	updateSoundCollection();
};


var addSoundsToSoundCollection = function addSoundsToSoundCollection(directory) {
	var soundsList = Shell.ls('-R', getSoundFilesDir() + '/' + directory);
	console.log("Category " + directory + ": " + soundsList);
	soundsList.forEach(function (sound) {
		addSoundToSoundCollection(directory.substring(0, directory.length - 1), directory + sound, sound);
	});
};

var getDirectoryNameCleaned = function getDirectoryNameCleaned(directory) {
	return directory.substring(0, directory.length - 1);
};

var createCategoryCollection = function createCategoryCollection(directoryList) {
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

var getDisplayNameForFilename = function getDisplayNameForFilename(filename) {
	return filename
		.replace(/[_]/g, ' ')
		.substring(0, filename.length - 4)
		.trim();
};

var getCategoryDisplayName = function getCategoryDisplayName(directoryname) {
	return directoryname.charAt(0).toUpperCase() +
		directoryname
			.substring(1, directoryname.length - 1)
			.replace(/[_]/g, ' ')
			.trim();
};

var addNoCategorySoundsToSoundCollection = function addNoCategorySoundsToSoundCollection(nocategorysounds) {
	nocategorysounds.forEach(function (sound) {
		addSoundToSoundCollection('none', sound, sound);
	});
};

var addSoundToSoundCollection = function addSoundToSoundCollection(category, path, filename) {
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

var getFileExtension = function getFileExtension(filename) {
	return filename.split('.').pop();
};

var addCategoriesToSoundCollection = function addCategoriesToSoundCollection(categories) {
	categories.forEach(function (category) {
		addSoundsToSoundCollection(category);
	});
};

//=============================================================================
//									Filesystem
//=============================================================================

var getCategoriesFromFileSystem = function getCategoriesFromFileSystem() {
	console.log("Searching categorys in " + getSoundFilesDir());
	// only folders/categories
	var categories = Shell.exec('cd ' + getSoundFilesDir() + '&& ls -d ' + '*/', {silent: true});
	return categories.output.split('\n');
};

var getSoundsWithoutCategoryFromFileSystem = function getSoundsWithoutCategoryFromFileSystem() {
	console.log("Searching files without category in " + getSoundFilesDir());
	// only mp3 files in the main directory
	var nocategorysounds = Shell.exec('cd ' + getSoundFilesDir() + ' && ls', {silent: true});
	return nocategorysounds.output.split('\n'); // split output to array
};

//=============================================================================
//									System
//=============================================================================

var killChildProcesses = function killChildProcesses() {
	childProcesses.forEach(function (process) {
		process.kill('SIGKILL');
	});
	childProcesses = [];
};

var killPlayScript = function killPlayScript() {
	var command = Spawn('pkill', ['-f', 'node_sound_script']);
	wrapSpawnCommand(command, 'killPlayScript');
};

var killPlayInstances = function killPlayInstances() {
	var command = Spawn('pkill', ['-f', 'play -q --norm']);
	wrapSpawnCommand(command, 'killPlayInstances');
};

var removeLockfile = function removeLockfile() {
	var command = Spawn('rm', ['-rf', 'assets/app/lock']);
	wrapSpawnCommand(command, 'removeLockfile');
};

var resetSerialConnection = function resetSerialConnection() {
	var command = Spawn('sh', ['assets/app/resetserial.sh']);
	wrapSpawnCommand(command, 'resetSerialConnection');
};

var switchHdmiPort = function resetSerial(port_id) {
	var command = Spawn('python', ['assets/app/tty_serial.py', port_id]);
	wrapSpawnCommand(command, 'switchHdmiPort');
};

var wrapSpawnCommand = function wrapSpawnCommand(command, name) {
	console.log("Started " + name);
	command.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	command.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	command.on('close', function (code) {
		console.log(name + ' finished [' + code + ']');
	});
};
