import {loadPageId} from '../../controllers/dataLoader'


/** 
* Asyncronously requests the specified page from the server.
* @param {string} pageId - The id of the page to load
*/
export const loadPage = (pageId) => {
	return dispatch => {
		
		loadPageId(pageId, 
			data => dispatch({type: 'ADD_PAGE', page: data})
		)
		
	}
}

export const updatePageChoices = (pageId, choices) => {
	return {type: 'UPDATE_PAGE_CHOICES', pageId, choices}
}