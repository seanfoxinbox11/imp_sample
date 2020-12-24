import {loadPlaylistId} from '../../controllers/dataLoader'

/** 
* Asyncronously requests the specified playlist from the server.
* @param {string} playlistId - The id of the playlist to load
*/
export const loadPlaylist = (playlistId) => {
	return dispatch => {

		loadPlaylistId(playlistId, 
			data => dispatch({type: 'ADD_PLAYLIST', playlist: data})
		)
	}
}