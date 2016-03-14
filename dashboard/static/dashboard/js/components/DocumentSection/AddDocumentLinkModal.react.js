var Base = require('../Base.react');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
global.jQuery = require('jquery');
require('bootstrap');
require('jquery-validation');
var toastr = require('toastr');

var AddDocumentLinkModalStore = require('stores/DocumentSection/AddDocumentLinkModalStore');
var AddDocumentLinkModalActions = require('actions/DocumentSection/AddDocumentLinkModalActions');
var DocumentRequestAPI = require('utils/DocumentRequestAPI');


var AddDocumentLinkModal = React.createClass(_.assign(Base(AddDocumentLinkModalStore), {
  updateValue: function (stateName, e) {
    AddDocumentLinkModalActions.formDataChange(stateName, e.target.value);
  },

  submit: function () {
    AddDocumentLinkModalActions.preSubmit();
    DocumentRequestAPI.addLink(this.state.link, this.state.document);
  },

  renderFormContent: function () {
    if (this.state.isSubmitting) {
      return (
        <div className='wait-screen text-center'>
          <div>
            <i className='fa fa-spinner fa-spin'></i>
          </div>
          <div>
            Validating...
          </div>
        </div>
      );
    }

    return (
      <div className='form-group'>
        <div className='col-md-3'>
          <label htmlFor='link'>Enter URL</label>
        </div>
        <div className='col-md-9 input-group'>
          <input id='link' type='text' className='form-control link-input' name='link'
            required='required' value={ this.state.link }
            onChange={ this.updateValue.bind(this, 'link') } />
          <div className='input-group-addon'><i className='fa fa-link'></i></div>
        </div>
      </div>
    );
  },

  render: function () {
    var disabled = AddDocumentLinkModalStore.isFormValid() ? '' : 'disabled';
    return (
      <div className='modal fade' id='request_modal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Add document link</h3>
            </div>
            <div className='modal-body'>
              <form className='form-horizontal'>
                { this.renderFormContent() }
              </form>
            </div>
            <div className='modal-footer'>
              <div className='Text-right'>
                <button type='button' className='btn btn-primary' disabled={ disabled } onClick={ this.submit }>
                  SUBMIT
                </button>
                <button type='button' className='btn btn-cancel' onClick={ this.hideModal }>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  hideModal: function () {
    AddDocumentLinkModalActions.hide();
  },

  toggleModal: function () {
    var modalCommand = this.state.isOpen ? 'show' : 'hide';
    jQuery(this.getDOMNode()).modal(modalCommand);
  },

  isOpen: function () {
    return jQuery(ReactDOM.findDOMNode(this)).hasClass('in');
  },

  componentDidUpdate: function () {
    var isOpen = this.isOpen();
    if (isOpen != this.state.isOpen) {
      this.toggleModal();
    }
  },
}));

module.exports = AddDocumentLinkModal;
