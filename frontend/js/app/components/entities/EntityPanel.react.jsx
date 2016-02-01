import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import ServerActionCreator from "../../actions/ServerActionCreator";

import EntityStore from "../../stores/EntityStore";
import KontoxStore from "../../stores/KontoxStore";
import DocumentStore from "../../stores/DocumentStore";

import ApiUtils from "../../utils/ApiUtils";
import History from "../../utils/History";

import Documents from "../documents/Documents.react";
import DocumentsUploader from "../documents/DocumentsUploader.react";
import EntityPanelEntity from "./components/EntityPanelEntity.react";
import EntityPanelKontox from "./components/EntityPanelKontox.react";

var EntityPanel = React.createClass({

  mixins: [LinkedStateMixin],

  getStateFromStores() {
    var ce = EntityStore.getByID(this.props.params.id);
    var ca = KontoxStore.getEntityKontoxAccountInfo();
    return {
      currentEntity: ce,
      currentAccount: ca,
      newEntity: jQuery.extend(true, {}, ce),
      edited: false,
      entityName: (ce != null
        ? ce.name
        : ''),
      loading: false
    };
  },
  getInitialState: function() {
    return this.getStateFromStores();
  },
  componentWillMount: function() {
     KontoxStore.addChangeListener(this._onKontoxChange);
  },
  componentDidMount: function() {
    EntityStore.addChangeListener(this._onChange);
   
  },

  componentsWillUnmount: function() {
    EntityStore.removeChangeListener(this._onChange);
    KontoxStore.removeChangeListener(this._onKontoxChange);
  },

  _onChange: function() {
    this.setState(this.getStateFromStores());
  },

  _onKontoxChange: function() {
    // var currentAccount = KontoxStore.getEntityKontoxAccountInfo();
    this.setState(this.getStateFromStores());
  },

  handleDeleteClick: function() {

    var _self = this;

    ServerActionCreator.deleteEntity(_self.state.currentEntity.id);

  },

  handleCancelClick: function() {
    if (!this.state.edited) {
      return false;
    }
    this.setState({
      currentEntity: EntityStore.getByID(this.props.id),
      edited: false
    });
    this._onChange();
  },

  handleSaveClick: function() {
    if (!this.state.edited) {
      return false;
    }

    var _self = this;

    var formData = {
      id: this.state.currentEntity.id,
      name: $('#updateEntityForm-name').val(),
      dba: $('#updateEntityForm-dba').val(),
      individual: $('#updateEntityForm-individual').val(),
      data: {
        phone: $('#updateEntityForm-data-phone').val(),
        email: $('#updateEntityForm-data-email').val(),
        website: $('#updateEntityForm-data-website').val()
      }
    };

    // Otherwise the HTML5 validation will just do the job for us
    if (formData.id && formData.name && formData.dba && formData.individual) {
      //ApiUtils.editEntity(formData);
      ServerActionCreator.editEntity(JSON.stringify(formData));
    }

  },

  handleAddLoanClick: function() {
    History.pushState(null, "/loans/new");
  },

  handleAddListoClick: function() {
    <form method="post" action="https://listo.mx/api/signup/login_with_token" target="_blank">
      <input type="hidden" name="token" value={this.state.currentEntity.data.customer_token} />
      <input type="submit" value={this.state.currentEntity.data.rfc} />
    </form> 
  },

  makeValueLink: function(key) {
    var _self = this;
    return {

      value: (key.indexOf("data") > -1
        ? this.state.newEntity.data[key.split("-")[1]]
        : this.state.newEntity[key]),

      requestChange: function(newValue) {
        var newEntity = _self.state.newEntity;
        if (key.indexOf("data") > -1) {
          newEntity.data[key.split("-")[1]] = newValue;
        } else {
          newEntity[key] = newValue;
        }
        _self.setState({newEntity: newEntity, edited: true});
      }
    }
  },

  handleKontoxClick: function() {
     /* Get Kontox Account Info Direct from API */
     var _self = this;
     ServerActionCreator.receiveKontoxAccountInfo(_self.state.currentEntity.id);
     // ApiUtils.getKontoxAccountInfo();
  },

  render: function() {
    if (this.state.currentEntity.id !== undefined) {
      return (
        <div className="tabs-container">
          <ul className="nav nav-tabs">
            <li className="active">
              <a data-toggle="tab" href="#tab-1">Entity</a>
            </li>
            <li className="">
              <a data-toggle="tab" href="#tab-2">Documents</a>
            </li>
            <li className="">
              <a data-toggle="tab" href="#tab-5" onClick={this.handleKontoxClick}>Kontox</a>
            </li>
          </ul>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <EntityPanelEntity entityInfo={this.state} makeValueLink={this.makeValueLink} handleDeleteClick={this.handleDeleteClick} handleCancelClick={this.handleCancelClick} handleSaveClick={this.handleSaveClick}/>
            </div>
            <div id="tab-2" className="tab-pane">
              <DocumentsUploader type="entity" target={this.state.currentEntity.id}/>
              <Documents type="entity" target={this.state.currentEntity.id}/>
            </div>
            <div id="tab-5" className="tab-pane">
              <EntityPanelKontox currentAccount={this.state.currentAccount} />
            </div>
          </div>

        </div>

      );

    } else {
      return (
        <div></div>
      );
    }

  }

});

export default EntityPanel;
