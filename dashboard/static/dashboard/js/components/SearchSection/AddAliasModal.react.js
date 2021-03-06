var _ = require('lodash');
var React = require('react');
var toastr = require('toastr');

var Base = require('../Base.react');
var AddAliasModalStore = require('../../stores/SearchSection/AddAliasModalStore');
var AddAliasModalActions = require('../../actions/SearchSection/AddAliasModalActions');
var AddAliasModal;

global.jQuery = require('jquery');
require('bootstrap');
require('jquery-validation');


AddAliasModal = React.createClass(_.assign(Base(AddAliasModalStore), {
  updateValue: function (stateName, e) {
    AddAliasModalActions.formDataChange(stateName, e.target.value);
  },

  createAlias: function () {
    AddAliasModalActions.createAlias(this.state.alias, this.state.target);
  },

  render: function () {
    var disabled = this.state.formValid ? '' : 'disabled';
    return (
      <div className='modal fade' id='request_modal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Add Alias</h3>
            </div>
            <div className='modal-body'>
              <form>
                <div className='form-group'>
                  <input type='text' className='form-control alias-input' name='alias' placeholder='Enter alias'
                    required='required' onKeyUp={ this.checkForm } value={ this.state.alias }
                    onChange={ this.updateValue.bind(this, 'alias') } />
                </div>
                <div className='form-group'>
                  <input type='text' className='form-control target-input' name='target'
                    placeholder='Enter related filter tag' required='required' onKeyUp={ this.checkForm }
                    value={ this.state.target } onChange={ this.updateValue.bind(this, 'target') } />
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <div className='Text-left'>
                <button type='button' className='btn btn-cancel btn-submit' disabled={ disabled }
                  onClick={ this.createAlias }>
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
    AddAliasModalActions.hide();
  },

  toggleModal: function () {
    var modalCommand = this.state.isOpen ? 'show' : 'hide';
    jQuery(this.getDOMNode()).modal(modalCommand);
  },

  isOpen: function () {
    return jQuery(this.getDOMNode()).hasClass('in');
  },

  componentDidUpdate: function () {
    var isOpen = this.isOpen();
    var errorCount,
      i;

    if (isOpen != this.state.isOpen) {
      this.toggleModal();
    }

    if (this.state.flashMessage != '') {
      toastr.success(this.state.flashMessage);
    }

    errorCount = this.state.errorMessages.length;
    for (i = 0; i < errorCount; i++) {
      toastr.error(this.state.errorMessages[i]);
    }
  }
}));

module.exports = AddAliasModal;
