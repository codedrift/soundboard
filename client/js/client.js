Meteor.startup(function () {
	SoundCollection.initEasySearch(['display_name'], {
		'limit' : 10,
		'use' : 'mongo-db'
	});

	sAlert.config({
		effect: '',
		position: 'bottom-right',
		timeout: 3000,
		html: false,
		onRouteClose: true,
		stack: {
			limit: 3
		},
		offset: 0,
		beep: false
	});
});

serverMessages = new ServerMessages();

Meteor.subscribe("sounds");
Meteor.subscribe("categories");
Meteor.subscribe("settings");
Meteor.subscribe("favorites");


serverMessages.listen('notification', function (message, type) {
	switch (type){
		case 'success':
			sAlert.success(message);
			break;
		case 'info':
			sAlert.info(message);
			break;
		case 'warning':
			sAlert.warning(message);
			break;
		case 'error':
			sAlert.error(message);
			break;
	}
});












