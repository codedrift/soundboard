


killSounds = function killSounds() {
	resetOnRestart();
	playSoundAsync({path: 'scratch.mp3'});
};

clearPlayQueue = function clearPlayQueue() {
	console.log("Clearing playQueue");
	PlayQueueCollection.remove({});
};

getPlayQueueSorted = function getPlayQueueSorted() {
	return PlayQueueCollection.find({}, {sort: {inserted: 1}}).fetch();
};

playSoundAsync = function playSoundAsync(sound, playQueueId) {
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

playNext = function playNext() {
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

addSoundToPlayQueue = function addSoundToPlayQueue(sound_id) {
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