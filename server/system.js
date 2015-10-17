childProcesses = [];


killChildProcesses = function killChildProcesses() {
	childProcesses.forEach(function (process) {
		process.kill('SIGKILL');
	});
	childProcesses = [];
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
	wrapSpawnCommand(command, 'resetSerialConnection');
};

switchHdmiPort = function resetSerial(port_id) {
	var command = Spawn('python', ['assets/app/tty_serial.py', port_id]);
	wrapSpawnCommand(command, 'switchHdmiPort');
};

wrapSpawnCommand = function wrapSpawnCommand(command, name) {
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