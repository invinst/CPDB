var React = require('react');
var ReactDOM = require('react-dom');
var classnames = require('classnames');

var AppDispatcher = require('dispatcher/AppDispatcher');
var RequestDocumentConstants = require('constants/RequestDocumentConstants');
var RequestDocumentActions = require('actions/RequestDocumentActions');
var InterfaceText = require('components/Shared/InterfaceText.react');
var RequestDocumentErrorPresenter = require('presenters/RequestDocumentErrorPresenter');


var RequestModal = (function () {
  var _doc = null;

  var mountedInstant = null;

  var errorMessage = '';

  var component = React.createClass({
    getInitialState: function () {
      return {
        thank: false,
        requestFailed: false
      };
    },
    componentDidMount: function () {
      mountedInstant = this;
    },
    hide: function () {
      jQuery(ReactDOM.findDOMNode(this)).modal('hide');
    },
    show: function () {
      var emailInput;

      jQuery(ReactDOM.findDOMNode(this)).modal('show');
      emailInput = jQuery(ReactDOM.findDOMNode(this)).find('input[name=\'email\']');
      setTimeout(function () {
        emailInput.focus();
      }, 500);
    },
    email: function () {
      return jQuery(ReactDOM.findDOMNode(this)).find('input[name=\'email\']').val();
    },
    register: function () {
      RequestDocumentActions.registerEmail(_doc.id, this.email());
    },
    onClick: function () {
      this.register();
    },
    onKeyDown: function (e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.register();
      }
    },
    render: function () {
      var style = {
        'marginTop': jQuery(window).height() / 2 - 100 + 'px'
      };
      var formClassName = classnames('modal-dialog request-form', {
        'hidden': this.state.thank
      });
      var thankClassName = classnames('modal-dialog thanks-form', {
        'hidden': !this.state.thank
      });
      var errorClassName = classnames('error', {
        'hidden': !this.state.requestFailed
      });
      return (
        <div className='modal fade' id='request_modal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel'>
          <div className={ formClassName } role='document' style={ style }>
            <div className='modal-content'>
              <div className='modal-header'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <h3>We&apos;ll notify you when the document is made available.</h3>
                <input type='email' name='email' className='form-control email-input'
                  placeholder='Please enter email address' onKeyDown={ this.onKeyDown } />
                <div className={ errorClassName }>{ errorMessage }</div>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-default' data-dismiss='modal'>Cancel</button>
                <button type='button' className='btn btn-primary btn-request-submit' onClick={ this.onClick }>
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className={ thankClassName } role='document' style={ style }>
            <div className='modal-content'>
              <div className='modal-header'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <h3 className='text-center'>Thank you!</h3>
                <InterfaceText identifier='thank-you-message' />
                <div className='success-icon'><i className='fa fa-check-circle'></i></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  component.show = function (doc) {
    _doc = doc;
    mountedInstant.setState({
      thank: false
    });
    mountedInstant.show();
  };

  component.hide = function () {
    mountedInstant.hide();
  };

  component.requestSuccess = function () {
    mountedInstant.setState({
      thank: true
    });
  };

  component.requestFailed = function (errors) {
    var errorPresenter = RequestDocumentErrorPresenter(errors);
    errorMessage = errorPresenter.errorMessage;
    mountedInstant.setState({
      requestFailed: true
    });
  };

  return component;
})();

RequestModal.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case RequestDocumentConstants.REQUEST_DOCUMENT:
      RequestModal.show(action.document);
      break;

    case RequestDocumentConstants.DOCUMENT_REQUESTED:
      RequestModal.requestSuccess();
      break;

    case RequestDocumentConstants.DOCUMENT_REQUEST_FAILED:
      RequestModal.requestFailed(action.errors);
      break;

    default:
      break;
  }
});

module.exports = RequestModal;
