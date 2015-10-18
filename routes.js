Router.route('/', {
	template: 'home'
});

Router.route('/statistics', {
	template: 'statistics'
});

Router.route('/search', {
	template: 'search'
});

Router.route('/hdmiremote', {
	template: 'hdmiremote'
});

Router.route('/settings', {
	template: 'settings'
});

Router.route( "/api/play/:id", { where: "server" } )
	.get( function() {
		var id = this.params.id;
		console.log("Api call[GET] play " + id);
		addSoundToPlayQueue(id);
	})
	.post( function() {
		var id = this.params.id;
		console.log("Api call[POST] play " + id);
		addSoundToPlayQueue(id);
	});