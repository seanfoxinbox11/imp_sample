export default function playlistsReducer(playlistsState = getInitialState(), action) {
	
	switch(action.type) {

		// Adds the new playlist to the collection of playlists
		case 'ADD_PLAYLIST':
		{
			let newPlayist = {};
			newPlayist[action.playlist._id] = action.playlist;
			let playlistsStateClone = Object.assign({}, playlistsState, newPlayist)
			return playlistsStateClone;
		}	
		
		default:
			return playlistsState;
	}
}

////////////////////////////////////////////////////////

function getInitialState() {	

	return {	
		playlists: {
		}
	}
}