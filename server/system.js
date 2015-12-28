
killWhatIWant = function killWhatIWant(name){
	var command = Spawn('pkill', ['-f', name]);
	wrapSpawnCommand(command, 'killWhatIWant');
};

killPlayScript = function killPlayScript() {
	var command = Spawn('pkill', ['-f', 'node_sound_script']);
	wrapSpawnCommand(command, 'killPlayScript');
};

killPlayInstances = function killPlayInstances() {
	var command = Spawn('pkill', ['-f', 'play -q --norm']);
	wrapSpawnCommand(command, 'killPlayInstances');
};

removeLockfile = function removeLockfile() {
	var command = Spawn('rm', ['-rf', 'assets/app/lock']);
	wrapSpawnCommand(command, 'removeLockfile');
};

resetSerialConnection = function resetSerialConnection() {
	var command = Spawn('sh', ['assets/app/resetserial.sh']);
	var finished = wrapSpawnCommand(command, 'resetSerialConnection');
	if(finished){
		notifyClients("Serial connection reset", "success");
	}else{
		notifyClients("Failed to reset serial connection", "error");
	}
};

switchHdmiPort = function resetSerial(port_id) {
	var command = Spawn('python', ['assets/app/tty_serial.py', port_id]);
	var finished = wrapSpawnCommand(command, 'switchHdmiPort');
	if(finished){
		notifyClients("Switched HDMI to " + port_id, "success");
	}else{
		notifyClients("Failed to switch HDMI port", "error");
	}
};

grabYT = function grabYT (yturl,ytfrom,ytto){
	var fut = new Future();
	var params = ['assets/app/youtubedl.sh', getSoundFilesDir(), yturl, ytfrom, ytto];
	var command = Spawn('sh', params);
	console.log("grabbing youtube sounds with params " + params);
	wrapSpawnCommand(command, 'grabYT');	
	updateFsSoundsCollections();
};

wrapSpawnCommand = function wrapSpawnCommand(command, name) {
	console.log("Started " + name);
	var fut = new Future();
	command.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	command.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	command.stderr.on('error', function (data) {
		console.log('stderr: ' + data);
	});

	command.on('close', function (code) {
		console.log(name + ' finished [' + code + ']');
		switch (code){
			case 0:
				fut.return(true);
				break;
			case 1:
				fut.return(false);
				break;
		}

	});
	return fut.wait();
};
