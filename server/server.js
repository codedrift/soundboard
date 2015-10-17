Shell = Meteor.npmRequire('shelljs');
Spawn = Meteor.npmRequire('child_process').spawn;

Api = new Restivus({
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

Meteor.startup(function () {
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