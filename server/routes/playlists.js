const express = require('express')
const router = express.Router();
const Playlist = require('../models/Playlist')
const Page = require('../models/Page')

// Get all playlists
router.get('/', (req, res)=> {

	// authentication
	const isAuthorized = req.user && (req.user.type === "instructor" 
										|| req.user.type === "admin");
	if (isAuthorized) {
	
		Playlist.find().exec((err, playlists_data)=>{
			if(err) return res.send('Error');

			res.json(playlists_data);
		})
	}	
	else {
		res.send({error: "Access Denied"});
	}
	
})

// Get playlist by id
router.get('/playlist/:id', (req,res)=> {

	// authentication
	const isAuthorized = req.user && (req.user.type === "instructor" 
										|| req.user.type === "admin");
	if (isAuthorized) {

		Playlist.findById(req.params.id).exec((err, doc)=>{
			if(err) return res.send({error: 'Error'});

			res.json(doc);
		})
	}	
	else {
		res.send({error: "Access Denied"});
	}
})

module.exports = router;