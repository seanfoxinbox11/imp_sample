var mongoose = require('mongoose');

const Playlist = mongoose.model('Playlist', { 
	name: String,
	type: String,
	description: String,
	pageIds: [] 
	
}, "playlists");


module.exports = Playlist