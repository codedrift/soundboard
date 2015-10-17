notifyClients = function notifyClients( message, type) {
	serverMessages.notify('notification', message, type);
};