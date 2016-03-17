var React = require('react');
var ReactDOM = require('react-dom');
var classnames = require('classnames');

var AppDispatcher = require('dispatcher/AppDispatcher');
var RequestDocumentConstants = require('constants/RequestDocumentConstants');
var RequestDocumentActions = require('actions/RequestDocumentActions');


var RequestModal = (function () {
  var document = null;

  var mountedInstant = null;

  var component = React.createClass({
    getInitialState: function () {
      return {
        thank: false
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
      RequestDocumentActions.registerEmail(document.id, this.email());
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
      var formClassName = classnames('modal-dialog', {
        'hidden': this.state.thank
      });
      var thankClassName = classnames('modal-dialog', {
        'hidden': !this.state.thank
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
                <input type='email' name='email' className='form-control'
                  placeholder='Please enter email address' onKeyDown={ this.onKeyDown } />
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-default' data-dismiss='modal'>Cancel</button>
                <button type='button' className='btn btn-primary' onClick={ this.onClick }>Submit</button>
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
                <p>
                  Someone from our team will write a Freedom of Information Act Request for this document,
                  and e-mail FOIA@chicagopolice.org. We will wait to hear back.
                </p>
                <p>If we receive a responsive document, we will update this database. Check back in a few weeks!</p>
                <div className='success-icon'><i className='fa fa-check-circle'></i></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  component.show = function (doc) {
    document = doc;
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

  return component;
})();

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case RequestDocumentConstants.REQUEST_DOCUMENT:
      RequestModal.show(action.document);
      break;

    case RequestDocumentConstants.DOCUMENT_REQUESTED:
      RequestModal.requestSuccess();
      break;

    default:
      break;
  }
});

module.exports = RequestModal;
