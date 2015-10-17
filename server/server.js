Shell = Meteor.npmRequire('shelljs');
Spawn = Meteor.npmRequire('child_process').spawn;
Future = Meteor.npmRequire('fibers/future');

Api = new Restivus({
	useDefaultAuth: false,
	prettyJson: true
});

serverMessages = new ServerMessages();

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

Meteor.startup(function () {

	resetOnRestart();

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
		console.log("Client called saveSetting");
		saveSetting(key, value);
	},
	getSetting: function (key) {
		console.log("Client called getSetting");
		return getSetting(key);
	},
	updateSoundCollection: function () {
		console.log("Client called updateSoundCollection");
		updateSoundCollection();
		notifyClients("Sound collection update finished", "success");
	},
	rescanSoundCollection: function () {
		console.log("Client called rescanSoundCollection");
		rescanSoundCollection();
		notifyClients("Sound collection rescan finished", "success");
	},
	removeDeletedSounds: function () {
		console.log("Client called removeDeletedSounds");
		removeDeletedSounds();
	}
});

Meteor.publish("sounds", function () {
	return SoundCollection.find();
});

Meteor.publish("categories", function () {
	return CategoryCollection.find({},{sort: { category_name: 1 }});
});

Meteor.publish("settings", function () {
	return SettingsCollection.find();
});


resetOnRestart = function resetOnRestart() {
	clearPlayQueue();
	killChildProcesses();
	killPlayScript();
	killPlayInstances();
	removeLockfile();
};