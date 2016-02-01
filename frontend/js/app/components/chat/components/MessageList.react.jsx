/**
 * React components: MessageList.
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 19/12/2015
 **/
 import React from "react";
 import Message from "./Message.react";
 import MessageForm from "./MessageForm.react";
 var MessageList = React.createClass({

 	getInitialState() {
 		return {
 			user: JSON.parse(sessionStorage.getItem('user')).id
 		};
 	},
 	render() {
 		return (
			<div className='message-box'>
				<div className="chatTitle">
					<h2> Conversation </h2>
				</div>
				<ul id="messages" >
					{
						this.props.messages.map((message, i) => {
							return (
								<Message
								key={i}
								user={message.name}
								text={message.text} 
								/>);
						})
					} 
				</ul>
			</div>
		);
	}
});
export default  MessageList;					 