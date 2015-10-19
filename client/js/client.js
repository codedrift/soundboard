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
		stack: true,
		// or you can pass an object:
		// stack: {
		//     spacing: 10 // in px
		//     limit: 3 // when fourth alert appears all previous ones are cleared
		// }
		offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
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












