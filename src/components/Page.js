import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as pagesActions from '../../redux/actions/pagesActions'
import * as userAnswersActions from "../../redux/actions/userAnswersActions"

import MultipleSelectPageEdit from "./MultipleSelectPageEdit"
import MultipleSelectPage from "./MultipleSelectPage"
import SingleSelectPage from "./SingleSelectPage"

/**
 * Page component 
 * The Page component is responible for determining which page to load based on the pageId in the url and is the container for the current type of page component.	
 * A page reffers to a single component amoung several in a playlist and does not reffer to a web page.
 *
 * @prop pageId - The page id from the url.
 * @prop page - The current page data.
 * @prop pages - All currently loaded pages.
 * @prop selectedAnswersForPage - The users selected answers for the question.
 * @prop pagesActions - 
 *           .loadPage(pageId) - Calls an action which loads the specified page.
 * @prop userAnswersActions - Actions for user interaction with the page. 
*/

class Page extends Component {
		
	componentDidMount() {
		this.loadPage();		
	}

	componentDidUpdate(prevProps) {
		this.loadPage();
	}

	/** Loads the page data based on the pageId from the url */
	loadPage() {			

		const {pageId} = this.props;

		if (pageId) {

			if (this.pageNotAlreadyLoaded()) {
				this.props.pagesActions.loadPage(pageId);	
			}	
		}		
	}

	/** Determines whether the page data has already been loaded or not */
	pageNotAlreadyLoaded() {

		const {pages, pageId} = this.props;

		const page = pages[pageId];

		const pageNotAlreadyLoaded = !page;

		return pageNotAlreadyLoaded;
    }

    ////////////////////////////////////////////////////////


	render() {

		const {props} = this;

		const {page, editMode} = props;

		let pageType = page && page.page_type;

		// If the page type is assessment then set the page type to the question type to simplify the page type switch
		const isAssessment = pageType === "assessment";		
		if (isAssessment) {
			pageType = page.question.question_type;
		}

		// Return the appropriate page component
		switch (pageType) {

			case "multipleSelect":
				if (editMode) {
					return <MultipleSelectPageEdit {...props} />
				}
				else {
					return <MultipleSelectPage {...props} />
				}

			case "singleSelect":
				return <SingleSelectPage {...props} />

			case undefined:
				return <p>Loading Page</p>

			default:
				return <p>Page Type Not Found</p>
		}
	}
}

////////////////////////////////////////////////////////

const mapStateToProps = (appState, ownProps) => {
	
	let mapToProps = {};
	
	const pageId = getPageIdFromRoute(appState, ownProps);

	if (pageId) {
		mapToProps["pageId"] = pageId;
		mapToProps["page"] = appState.pages[pageId];
		mapToProps["pages"] = appState.pages;
		
		// If not in edit mode then map the users answers for the page
		if (!ownProps.editMode) {
			mapToProps["selectedAnswersForPage"] = appState.userAnswers[pageId];
		}
	}
	
	return mapToProps;
}


const getPageIdFromRoute = (appState, ownProps) => {
	
	const pageNumber = ownProps.match.params.pageNumber;
	
	const pageOrderIndex = pageNumber - 1;

	const pageId = ownProps.playlist && ownProps.playlist.pageIds && ownProps.playlist.pageIds[pageOrderIndex];

	return pageId;
}

const mapDispatchToProps = (dispatch, ownProps) => {
	
	let mapToProps = {};
	mapToProps["pagesActions"] = bindActionCreators(pagesActions, dispatch);

	// If not in edit mode then map the user answers actions
	if (!ownProps.editMode) {
		mapToProps["userAnswersActions"] = bindActionCreators(userAnswersActions, dispatch);
	}	

	return mapToProps;
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page));