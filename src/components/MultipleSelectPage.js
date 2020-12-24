import React, {Component} from 'react'
import Checkbox from 'material-ui/Checkbox';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  FormLabel,
} from 'material-ui/Form';

import {getAnswersForPage, saveAnswersForPage} from '../../controllers/dataLoader'
import './MultipleSelectPage.css'


/**
 * MultipleSelectPage component 
 * The MultipleSelectPage component is a multiple choice question asked to the student taking the exam or lesson where the correct answer is a combination of selected checkboxes. The component automatically saves the current answers for the page when changed. 
*/


class MultipleSelectPage extends Component {

	componentWillMount() {
		this.loadUserAnswersForPage();				
	}

	/** Loads any of the users answers for the page if the user had previously visited the page during the exam.
	*/
	loadUserAnswersForPage() {
		getAnswersForPage({ userId: this.props.userId, pageId: this.props.page._id }, this.setUserAnswers);
	}

	/** 
	* Sets the users ansers fot the page to redux.
	* @param {object} answers - User answers json for the page.
	*/
	setUserAnswers = (answers) => {
		this.props.userAnswersActions.setAnswers(this.props.page._id, answers.selectedAnswers);	
	}

	////////////////////////////////////////////////////////


	componentDidUpdate(prevProps, prevState) {
		this.handleSaveUserAnswersForPage(prevProps, prevState);			
	}

	/** Determines whether to save changes to the database based on whether the user has changed an answer.
	*/
	handleSaveUserAnswersForPage(prevProps, prevState) {
		
		const userSelectionsChanged = prevProps.selectedAnswersForPage !== this.props.selectedAnswersForPage;

		if (userSelectionsChanged) {

			this.saveUserAnswersForPage();
		}		
	}

	/** Saves the users answers to the database. */
	saveUserAnswersForPage() {
		const body = {
			userId: this.props.userId,
			pageId: this.props.page._id,
			selectedAnswers: this.props.selectedAnswersForPage
		}

		saveAnswersForPage(body);
	}


	/** 
	* Updates the redux state when a check box status changes.
	* @param {string} choiceId - The id of the choice which changed.
	*
	* @param {object} event - The event triggered by the check box change. 
	* @param {boolean} checked - Whether the current status of the check box is checked or not. 
	*/
	handleCheckBoxChange = (choiceId) => {
		return (event, checked) => {

			const {page} = this.props;

			this.props.userAnswersActions.setMultipeSelectAnswer(choiceId, checked, page._id);		
		}
	}

	////////////////////////////////////////////////////////

	render() {
		
		const {question_text} = this.props.page.question;

		return (   		
			<div className="MultipleSelectPage">	
				<FormControl component="fieldset">
					<FormLabel>{question_text}</FormLabel>
					<FormGroup>	
						{this.getChoices()}
					</FormGroup>
				</FormControl>
			</div>
		)
	}	

	////////////////////////////////////////////////////////

	/** 
	* Returns the array of labeled check boxes potential answers for the question.
	*/
	getChoices = () => {
		return this.props.page.question.choices.map( (aChoice) => {

			return (
				<div key={aChoice._id}>
					<FormControlLabel 
						control={
							<Checkbox
								checked={this.isChoiceSelected(aChoice._id)}
								onChange={this.handleCheckBoxChange(aChoice._id)}
							/>
					 	}
						label={aChoice.content} 
					/>
				</div>					
			)				 
		})
	}

	isChoiceSelected = (choiceId) => {
		const selected =  !!this.props.selectedAnswersForPage && this.props.selectedAnswersForPage.length > 0 && this.props.selectedAnswersForPage.filter( (aChoiceId) => aChoiceId === choiceId)[0];

		return !!selected;
	}
}
export default MultipleSelectPage