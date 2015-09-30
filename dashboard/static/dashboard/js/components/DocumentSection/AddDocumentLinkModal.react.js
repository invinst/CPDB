var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
global.jQuery = require('jquery');
require('bootstrap');
require('jquery-validation');
var toastr = require('toastr');

var AddDocumentLinkModalStore = require('../../stores/DocumentSection/AddDocumentLinkModalStore');
var AddDocumentLinkModalActions = require('../../actions/DocumentSection/AddDocumentLinkModalActions');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var DocumentAPI = require('../../utils/DocumentRequestAPI');

var AddDocumentLinkModal = React.createClass(_.assign(Base(AddDocumentLinkModalStore), {
  updateValue: function (stateName, e) {
    AddDocumentLinkModalActions.formDataChange(stateName, e.target.value);
  },

  addLink: function () {
    DocumentAPI.addLink(this.state.link ,this.state.supplied_crid);
  },

  render: function() {
    var disabled = this.state.formValid ? '' : 'disabled';
    return (
      <div className="modal fade" id="request_modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add document link</h3>
            </div>
            <div className="modal-body">
              <form>
                <div className='form-group'>
                  <div className="col-md-3">
                    <label htmlFor="link">Enter URL</label>
                  </div>
                  <div className="col-md-9">
                    <input id="link" type='text' className='form-control link-input' name='link'
                           required="required" value={this.state.link}
                           onChange={this.updateValue.bind(this, 'link')} />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="Text-left">
                <button type="button" className="btn btn-cancel btn-submit" disabled={disabled} onClick={this.addLink}>
                  SUBMIT
                </button>
                <button type="button" className="btn btn-cancel" onClick={this.hideModal}>Cancel</button>
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
    return jQuery(this.getDOMNode()).hasClass('in');
  },

  componentDidUpdate: function() {
    var isOpen = this.isOpen();
    if (isOpen != this.state.isOpen) {
      this.toggleModal();
    }

    if (this.state.flashMessage != '') {
      toastr.success(this.state.flashMessage);
    }

    var errorCount = this.state.errorMessages.length;
    for (var i = 0; i < errorCount; i++) {
      toastr.error(this.state.errorMessages[i]);
    }
  }
}));

module.exports = AddDocumentLinkModal;
