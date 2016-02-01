/**
 * React components: Message.
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 19/12/2015
 **/
import React from "react";

var Message = React.createClass({
	render() {
		return (
			<li className="message">
				<strong>{this.props.user}: </strong> 
				<span>{this.props.text}</span>		
			</li>
		);
	}
});
export default Message;