var Base = require('../Base.react');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var toastr = require('toastr');

var AddDocumentLinkModalStore = require('../../stores/DocumentSection/AddDocumentLinkModalStore');
var AddDocumentLinkModalActions = require('../../actions/DocumentSection/AddDocumentLinkModalActions');
var DocumentAPI = require('../../utils/DocumentRequestAPI');
var AddDocumentLinkModal;

global.jQuery = require('jquery');
require('bootstrap');
require('jquery-validation');


AddDocumentLinkModal = React.createClass(_.assign(Base(AddDocumentLinkModalStore), {
  updateValue: function (stateName, e) {
    AddDocumentLinkModalActions.formDataChange(stateName, e.target.value);
  },

  addLink: function () {
    this.waitScreen();
    DocumentAPI.addLink(this.state.link ,this.state.suppliedCrid);
  },

  render: function () {
    var disabled = this.state.formValid ? '' : 'disabled';
    return (
      <div className='modal fade' id='request_modal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Add document link</h3>
            </div>
            <div className='modal-body'>
              <form className='form-horizontal'>
                <div className='wait-screen text-center hidden'>
                  <div>
                    <i className='fa fa-spinner fa-spin'></i>
                  </div>
                  <div>
                    Validating...
                  </div>
                </div>
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
              </form>
            </div>
            <div className='modal-footer'>
              <div className='Text-right'>
                <button type='button' className='btn btn-primary' disabled={ disabled } onClick={ this.addLink }>
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
    var errorCount,
      i;

    if (isOpen != this.state.isOpen) {
      this.toggleModal();
    }

    if (this.state.flashMessage != '') {
      this.waitScreen(false);
      toastr.success(this.state.flashMessage);
    }

    errorCount = this.state.errorMessages.length;
    if (errorCount > 0) {
      this.waitScreen(false);
      for (i = 0; i < errorCount; i++) {
        toastr.error(this.state.errorMessages[i]);
      }
    }
  },

  waitScreen: function (open) {
    if (open == undefined) {
      open = true;
    }
    if (open) {
      jQuery('#request_modal .wait-screen').removeClass('hidden');
      jQuery('#request_modal .form-group').addClass('hidden');
    } else {
      jQuery('#request_modal .wait-screen').addClass('hidden');
      jQuery('#request_modal .form-group').removeClass('hidden');
    }
  }
}));

module.exports = AddDocumentLinkModal;
