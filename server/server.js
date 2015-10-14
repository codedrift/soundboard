//=============================================================================
//									Members
//=============================================================================

var soundfilesDir = 'assets/app/soundfiles';
var Shell = Meteor.npmRequire('shelljs');
var Spawn = Meteor.npmRequire('child_process').spawn;

var Api = new Restivus({
	useDefaultAuth: false,
	prettyJson: true
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

	if (SoundCollection.find().count() === 0) {
		console.log("No existing sound collection found. Indexing initially.");
		var categories = getCategoriesFromFileSystem();
		var nocategorysounds = getSoundsWithoutCategoryFromFileSystem();
		createCategoryCollection(categories);
		addNoCategorySoundsToSoundCollection(nocategorysounds);
		addCategoriesToSoundCollection(categories);
		SoundCollection.remove({category: ''});
	} else {
		console.log("Found existing sound collection.");
		updateDatabaseEntries();
	}

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
	}
});

//=============================================================================
//									REST
//=============================================================================

Api.addRoute('play/:id', {authRequired: false}, {
	post: function() {
		console.log(this.urlParams.id);
	},
	get: function() {
		console.log(this.urlParams.id);
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

var playSoundAsync = function playSoundAsync(sound, playQueueId){
	console.log("Play sound async " + sound.path);

	var Future = Meteor.npmRequire('fibers/future');
	var fut = new Future();

	var command = Spawn('sh', ['assets/app/node_sound_script.sh', sound.path, playQueueId]);
	command.stdout.on('data', function (data) {
		var json = JSON.parse(data);
		fut.return(json);
	});

	var pqid = fut.wait().playQueueId;

	if(pqid != undefined){
		console.log("Play finished for playqueueid: " + pqid);
	}

	PlayQueueCollection.remove({_id: pqid}, function(){
		playNext();
		console.log("Remaining playqueue:");
		console.log(PlayQueueCollection.find().fetch());
	});
};

var playNext = function playNext() {
	var playQueue = getPlayQueueSorted();

	if(playQueue.length === 0){
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

	if(pqcount > 1){
		console.log("Playqueue is already running");
		return;
	}

	playNext();
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

var resetSerialConnection = function resetSerialConnection(){
	console.log("reset serial port for hdmi");
	var command = Spawn('sh', ['assets/app/resetserial.sh']);
	wrapSpawnCommand(command, 'resetSerialConnection');
};

var switchHdmiPort = function resetSerial(port_id) {
	console.log("switch hdmi port to " + port_id);
	var command  = Spawn('python', ['assets/app/tty_serial.py', port_id]);
	wrapSpawnCommand(command, 'switchHdmiPort');
};

var wrapSpawnCommand = function wrapSpawnCommand(command, name){
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

//=============================================================================
//									Collections
//=============================================================================

var updateDatabaseEntries = function updateDatabaseEntries(){
	console.log("Updating database entries (not really)");
	var categories = getCategoriesFromFileSystem();
	var nocategorysounds = getSoundsWithoutCategoryFromFileSystem();
	updateCategoryCollection(categories);
	//addNoCategorySoundsToSoundCollection(nocategorysounds);
	//addCategoriesToSoundCollection(categories);
	//SoundCollection.remove({category: ''});
};

var addSoundsToSoundCollection = function addSoundsToSoundCollection(directory) {
	var soundsList = Shell.ls('-R', soundfilesDir + '/' + directory);
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

		CategoryCollection.insert({
			directory: directory_cleaned,
			category_name: categoryname_cleaned
		});

	});

	//Remove empty categories
	CategoryCollection.remove({category_name: ''});
};

var updateCategoryCollection = function createCategoryCollection(directoryList) {
	console.log("Creating categories for: " + directoryList);
	directoryList.forEach(function (directory) {
		var directory_cleaned = getDirectoryNameCleaned(directory);
		var categoryname_cleaned = getCategoryDisplayName(directory);

		if(CategoryCollection.find({category_name: categoryname_cleaned}).count() === 0){
			CategoryCollection.insert({
				directory: directory_cleaned,
				category_name: categoryname_cleaned
			});
		}
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
	// only folders/categories
	var categories = Shell.exec('cd ' + soundfilesDir + '&& ls -d ' + '*/', {silent: true});
	return categories.output.split('\n');
};

var getSoundsWithoutCategoryFromFileSystem = function getSoundsWithoutCategoryFromFileSystem() {
	// only mp3 files in the main directory
	var nocategorysounds = Shell.exec('cd ' + soundfilesDir + ' && ls *.mp3', {silent: true});
	return nocategorysounds.output.split('\n'); // split output to array
};
