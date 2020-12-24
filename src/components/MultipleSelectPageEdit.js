import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import {
	FormControl,
	FormGroup,
	FormLabel
} from 'material-ui/Form';
import TextField from 'material-ui/TextField';

import {saveChoicesForPage} from '../../controllers/dataLoader'

/**
 * MultipleSelectPageEdit component 
 * The MultipleSelectPageEdit component allows the instructor to edit the question, choices, and correct answers for the page while the user interface mirrors exactly how the stufent will see the question in an exam. 
*/

class MultipleSelectPageEdit extends Component {

	componentWillMount() {
		this.setChoicesInitialState();
	}

	componentDidUpdate(prevProps, prevState) {
		const urlChanged = prevProps.match.url !== this.props.match.url;
		if(urlChanged) {
			this.setChoicesInitialState();	
		}
	}

	/** Sets whether the check boxes are checked or not through the state and based of of the teachers selected correct answers from the database. */
	setChoicesInitialState() {
		const {choices} = this.props.page.question;	
		
		choices.forEach( choice => {	
			this.setState({ [choice._id] : choice })
		})

		let setChoices = {};
		choices.forEach( choice => setChoices[choice._id] = choice );

		this.setState(setChoices);
	}

	////////////////////////////////////////////////////////

	/** 
	* Updates the state when a check box selectioin has changed.
	* @param {string} choiceId - The id of the choice to update.
	*/
	handleChoiceCheckBoxChange(choiceId) {
		return (event, checked) => {

	 		this.setState(function(prevState, props) {
				const choiceInfo = {
					content: prevState[choiceId].content,
					correct: checked,
				}
				return {[choiceId]: choiceInfo };
			});			
		}
	}

	/** 
	* Updates the state when the content of a choice text input changes.
	* @param {object} event - The event object.
	* @param {string} choiceId - The id of the choice to update.
	*/
	handleChoiceTextInputChange = (event, choiceId) => {
		
		event.persist();

 		this.setState(function(prevState, props) {
			const choiceInfo = {}
			choiceInfo.content = event.target.value;
			choiceInfo.correct = prevState[choiceId].correct;
			return {[choiceId]: choiceInfo }
		});
	}
	
	/** 
	* Updates the text and correct answers in the database and redux 
	* @param {object} event - The event object.
	*/
	handleSubmit = (event) => {
		event.preventDefault();
		
		let updatedChoices = [];

		this.props.page.question.choices.forEach( choice => {
	
			const body = {
				_id: choice._id,
				content: this.state[choice._id].content,
				correct: this.state[choice._id].correct
			}

			// Updates the choice the in the database
			saveChoicesForPage(body);

			updatedChoices.push(body);
		})

		// Updates the choices in redux
		this.props.pagesActions.updatePageChoices(this.props.page._id, updatedChoices);	
	}

	////////////////////////////////////////////////////////

	render() {

		const { classes } = this.props;
		
		return (			
			<FormControl component="fieldset" className={classes.form}>

				<div className={classes.firstRowContainer}>
					<TextField className={classes.answerTextField}
						id="multiline-flexible"
						multiline
						rowsMax="4"
						value={this.props.page.question.question_text} 
						onChange={null}
						margin="normal"
					/>

					<Button 
						classes={{root: this.props.classes.saveButton}}
						onClick={this.handleSubmit}
						raised color="primary"
						ref={ el => this["saveButton"] = el }
						>Save
					</Button>
				</div>

				<FormGroup>	
					{this.getChoices()}
				</FormGroup>
			</FormControl>
		)
	}	

	////////////////////////////////////////////////////////

	/** Returns all choice components */
	getChoices = () => {
		return this.props.page.question.choices.map( (aChoice) => {
			const { classes } = this.props;
			return (
				<div key={aChoice._id} style={{display:"flex"}}>
					<Checkbox style={{position: 'relative', top: 8 }}
						checked={this.state[aChoice._id].correct}
						onChange={this.handleChoiceCheckBoxChange(aChoice._id)}
					/>
					<TextField className={classes.answerTextField}
						id={aChoice._id}
						ref={ el => this[`textInput_${aChoice._id}`] = el } 
						value={this.state[aChoice._id].content}
						onChange={e => this.handleChoiceTextInputChange(e, aChoice._id)}
						margin="normal"
					/>
				</div>					
			)
		})
	}
}

// Styles used with the withStyles HOC
const styles = theme => ({
	saveButton: {
		marginTop: 3,
		padding: 3,
		minHeight: 5,
		marginLeft: 16,
	},
	firstRowContainer: {
		display: 'flex', 
		width: '100%', 
		alignItems: 'flex-end'
	},
	answerTextField: {
		marginLeft: theme.spacing.unit * 2,
		flexGrow: 1,
		marginBottom: -2,
	},
	form: {
		width: 690,
	},
	answerTextField: {
		flexGrow: 1,
	}
});

MultipleSelectPageEdit.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(MultipleSelectPageEdit));