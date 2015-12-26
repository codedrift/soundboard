
runningCronJobs = [];


clearCronJobs = function clearCronJobs() {
	console.log("Clearing running cronjobs");
	runningCronJobs.forEach(function (cronjob) {
		cronjob.stop();
	});
	runningCronJobs = [];
};

addCronJob = function addCronJob(type, cronSetting, sound_id){
	var boundCronMethod;
	console.log("Adding cron sound [" + type + ", " + cronSetting , ", " + sound_id + "]");
	switch(type){
		case "sound":
			boundCronMethod = Meteor.bindEnvironment(function() {
				addSoundToPlayQueue(sound_id);
			});
			break;
		case "sound-alert":
			boundCronMethod = Meteor.bindEnvironment(function() {
				killSounds();
				addSoundToPlayQueue(sound_id);
			});
			break;
		default:
			console.log("No cron type specified");
			return false;
	}

	try {
		var job = new CronJob(cronSetting, boundCronMethod, function () {
				console.log("job stopped")
			},
			true, /* Start the job right now */
			"Europe/Berlin" /* Time zone of this job. */
		);
		runningCronJobs.push(job);
	} catch(ex) {
		console.log("cron pattern not valid", ex);
		return false;
	}
	return true;
};

addCronJobToTimerCollection = function addCronJobToTimerCollection(type, cronSetting, sound_id) {
	console.log("Adding new timer to collection.");
	var sound = SoundCollection.findOne({_id: sound_id});
	var timer = {
		type: type,
		sound: sound,
		cronSetting: cronSetting,
		createdDate: new Date(),
		createdBy: Meteor.userId()
	};
	console.log(timer);
	TimerCollection.insert(timer);
};

buildCronJobs = function buildCronJobs(){
	console.log("Adding timers from collection");
	var timers = TimerCollection.find().fetch();
	timers.forEach(function (timer) {
		addCronJob(timer.type, timer.cronSetting, timer.sound._id);
	});
	console.log(runningCronJobs.length + " running cron jobs");
};

deleteCronJob = function deleteCronJob(timer_id){
	console.log("Removing cron job");
	console.log(TimerCollection.find({_id: timer_id}).fetch());
	TimerCollection.remove({_id: timer_id})
};