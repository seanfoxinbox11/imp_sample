import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as playlistsActions from '../redux/actions/playlistsActions'
import Page from "./components/Page"
import './Player.css'

/**
 * Player component 
 * The Player component is responible for determining which playlist to load based on the playlistId (from the url) and is the container for the Page component.	
 * @prop editMode - Specifies whether the child components should be display as an exam taken by a student or as a content editable mode for a teacher.
 * @prop playlist - The current playlist data. A playlist describes a series of page objects.
 * @prop playlists - All currently loaded playlists.
 * @prop playlistsActions - 
 			.loadPlaylist(playlistId) - Calls an action which loads the specified playlist.
*/

class Player extends Component {

	componentDidMount() {
		this.loadPlaylist();
	}

	/** Loads the playlist based on the playlistId from the url */
	loadPlaylist() {	

		const {match} = this.props;

		if (match) {		

			const {playlistId} = match.params;
			
			if (this.playlistNotAlreadyLoaded()) {
				this.props.playlistsActions.loadPlaylist(playlistId);
			}
		}
	}

	/** Determines whether the playlist has already been loaded or not */
	playlistNotAlreadyLoaded() {

		const {playlistId} = this.props.match.params;

		const playlist = this.props.playlists[playlistId];

		const playlistNotAlreadyLoaded = !playlist;

		return playlistNotAlreadyLoaded;
    }

	////////////////////////////////////////////////////////

	componentDidUpdate(prevProps) {
	
		if (this.isDifferentPlaylist(prevProps)) {
			this.loadPlaylist();
		}
	}

	/** Determines whether the playlist has changed */
	isDifferentPlaylist(prevProps) {
		const oldPlaylistId = prevProps.match.params.playlistId;
		const newPlaylistId = this.props.match.params.playlistId
		const playlistIdChanged = oldPlaylistId !== newPlaylistId;
		return playlistIdChanged;
	}

	////////////////////////////////////////////////////////

	render() {

		return (
			<div className="Player">
				<Page {...this.props} />
			</div> 
		)
	}
}


////////////////////////////////////////////////////////

const mapStateToProps = (appState, ownProps) => {

	const playlist = getPlaylistFromRoute(appState, ownProps);

	return {
		playlist,
		playlists: appState.playlists
	}
}

const getPlaylistFromRoute = (appState, ownProps) => {
	
	const playlistId = ownProps.match.params.playlistId;

	const playlist = appState.playlists[playlistId]

	return playlist;
}

const mapDispatchToProps = (dispatch) => ({
	playlistsActions: bindActionCreators(playlistsActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player));