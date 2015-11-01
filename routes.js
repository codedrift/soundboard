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

Router.route( "/api/playClosest/:term", { where: "server" } )
	.get( function() {
		var term = this.params.term;
		console.log("Play closest for: " + term);
		var tempCursor = SoundCollection.find({});
		var bestWord = mostSimilarString(tempCursor, "path", term, -1, false);
		console.log(bestWord);
		var res = this.response;
		res.end(bestWord);
	});
