var _ = require('lodash');
var toastr = require('toastr');
var React = require('react');

var AddSessionAliasModalStore = require('stores/SessionSection/AddSessionAliasModalStore');
var AddSessionAliasModalActions = require('actions/SessionSection/AddSessionAliasModalActions');
var Base = require('../Base.react');
var AddSessionAliasModal;

global.jQuery = require('jquery');
require('bootstrap');
require('jquery-validation');


AddSessionAliasModal = React.createClass(_.assign(Base(AddSessionAliasModalStore), {
  updateValue: function (stateName, e) {
    AddSessionAliasModalActions.formDataChange(stateName, e.target.value);
  },

  createAlias: function () {
    AddSessionAliasModalActions.createAlias(this.state.alias, this.state.target, this.state.title);
  },

  renderLinkInput: function () {
    if (!this.state.newTarget) {
      return (<div></div>);
    }

    return (
      <div className='form-group'>
        <input type='text' className='form-control target-input' name='target' placeholder='Session URL'
          required='required' onKeyUp={ this.checkForm } value={ this.state.target }
          onChange={ this.updateValue.bind(this, 'target') } />
      </div>
    );
  },

  render: function () {
    var disabled = this.state.formValid ? '' : 'disabled';
    return (
      <div className='modal fade' id='request_modal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Add Session Alias</h3>
            </div>
            <div className='modal-body'>
              <form className='horizontal-form'>
                <div className='form-group'>
                  <input type='text' className='form-control alias-input' name='alias' placeholder='Enter alias'
                    required='required' onKeyUp={ this.checkForm } value={ this.state.alias }
                    onChange={ this.updateValue.bind(this, 'alias') } />
                </div>
                <div className='form-group'>
                  <input type='text' className='form-control title-input' name='title' placeholder='Enter title'
                    required='required' onKeyUp={ this.checkForm } value={ this.state.title }
                    onChange={ this.updateValue.bind(this, 'title') } />
                </div>
                { this.renderLinkInput() }
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
    AddSessionAliasModalActions.hide();
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
    if (isOpen != this.state.isOpen) {
      this.toggleModal();
    }

    if (this.state.flashMessage != '') {
      toastr.success(this.state.flashMessage);
    }
  }
}));

module.exports = AddSessionAliasModal;
