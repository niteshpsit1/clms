/**
 * React components: MessageForm.
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 19/12/2015
 **/
import React from "react";

var MessageForm = React.createClass({

	getInitialState() {
		return {
			text: '',
	     };
	},

	handleSubmit(e) {

		e.preventDefault();
		if(this.state.text === '')
			return false;

		var message = {
			text : this.state.text,
			name : JSON.parse(sessionStorage.getItem('user')).name  
		}

		this.setState({ text: ''});
	
		this.props.onMessageSubmit(message);	
	},

	changeHandler(e) {
		this.setState({ text : e.target.value });
	},

	render() {
		return(
			<form id="cj-chat-form" onSubmit={this.handleSubmit}>
				<input id="m" autoComplete="off" className="form-control" placeholder="Type and press enter"
						onChange={this.changeHandler}
						value={this.state.text}	/>
				<button onClick={this.handleSubmit} className="btn btn-primary" type="button">Send</button>		
			</form>
		);
	}
});
export default MessageForm; 