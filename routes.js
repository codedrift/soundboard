Router.configure({
	notFoundTemplate: '404page'
});

Router.route('/', {
	template: 'home'
});

Router.route('/info', {
	template: 'info'
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

Router.route('/youtube', {
	template: 'youtube'
});

Router.route('/timer', {
	template: 'timer'
});

Router.route( "/api/play/:id", { where: "server" } )
	.get( function() {
		var id = this.params.id;
		console.log("Api call[GET] play " + id);
		addSoundToPlayQueue(id);
		var res = this.response;
		res.end("");
	})
	.post( function() {
		var id = this.params.id;
		console.log("Api call[POST] play " + id);
		addSoundToPlayQueue(id);
		var res = this.response;
		res.end("");
	});
