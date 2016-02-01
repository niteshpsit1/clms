/**
 * React components: UserList.
 *
 * @author: Lautaro Gruss / lautarogruss@gmail.com
 * @created: 19/12/2015
 **/
 import React from "react";
 var UsersList = React.createClass({

 	handleSubmit(e) {

 		this.props.onUserClicked(e);	 
 	
 	},

 	render() {
 		return (
 			<div className='users'>
 			<h3> Online Users </h3>
 			<ul>
 			{
 				Object.keys(this.props.users).map((guid, i) => {
 					var hasMessages = this.props.users[guid].hasMessages; 
 					var user = this.props.users[guid].name;
 					var isAgent = this.props.users[guid].isAgent;
 					return (
 						<li onClick={this.handleSubmit} className="cj-online-user"   key={i}>
 						<span className="pull-right label label-primary">Online</span>
 						{isAgent ? <span className="label label-warning pull-right">Agente</span>: '' }
 						{user}
 						{hasMessages ? <span className="pull-left fa fa-check text-navy"></span> : '' }
 						</li>
 						);
 				})
 			}
 			</ul>				
 			</div>
 			);
 	}
 });

 export default UsersList;