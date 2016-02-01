/**
* React components: Entities list (left menu).
*
* @author: Danyil Karuna / kd@oked.me
* @created: 18/11/2015
**/

import React from "react";
import EntityStore from "../../stores/EntityStore";
import ServerActionCreator from "../../actions/ServerActionCreator";
import ApiUtils from "../../utils/ApiUtils";
import History from "../../utils/History";

/**
* Left menu Entities list : React className
* */
var EntitiesMenuItem = React.createClass({

	componentWillMount: function() {
		this.setState({
			user: JSON.parse(sessionStorage.getItem('user'))
		});
	},

	_onTabChange: function() {
		this.setState({_d: Math.random()});
	},

	handleNewEntity: function(event) {
		History.pushState(null, "/entities/new");
		event.preventDefault();
	},

	loadPeopleList: function(event) {
		History.pushState({show: "people"}, "/entities?show=people");
		event.preventDefault();
	},

	loadOrgList: function(event) {
		History.pushState({show: "orgs"}, "/entities?show=orgs");
		event.preventDefault();
	},

	render: function() {

		var _self = this;

		return (
			<li className="">
			<a href="#" onClick={_self.loadPeopleList}>
			<i className="fa fa-users"></i>
			<span className="nav-label">Entities</span>
			<span className="fa arrow"></span>
			</a>
			<ul className="nav nav-second-level">
			<li className="">
			<a href="#" onClick={_self.loadPeopleList}>People</a>
			</li>
			<li className="">
			<a href="#" onClick={_self.loadOrgList}>Organizations</a>
			</li>
			<li className="">
			<a href="#" onClick={_self.handleNewEntity}>&lt;New Entity&gt;</a>
			</li>
			</ul>
			</li>
			);

	}

});

export default EntitiesMenuItem;
