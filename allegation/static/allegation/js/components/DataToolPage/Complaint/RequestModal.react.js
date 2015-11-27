var React = require('react');
var classnames = require('classnames');

require('utils/jQuery');
var AppDispatcher = require('dispatcher/AppDispatcher');
var RequestDocumentConstants = require('constants/RequestDocumentConstants');
var RequestDocumentActions = require('actions/RequestDocumentActions');


var RequestModal = (function () {
  var allegation = null;

  var mountedInstant = null;

  var component = React.createClass({
    getInitialState: function () {
      return {
        thank: false
      };
    },
    show: function () {
      jQuery(this.getDOMNode()).modal("show");
      var emailInput = jQuery(this.getDOMNode()).find("input[name='email']");
      setTimeout(function () {
        emailInput.focus();
      }, 500);
    },
    hide: function () {
      jQuery(this.getDOMNode()).modal("hide");
    },
    componentDidMount: function () {
      mountedInstant = this;
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
        <div className="modal fade" id="request_modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className={formClassName} role="document" style={style}>
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h3>We'll notify you when the document is made available.</h3>
                <input type="email" name="email" className="form-control"
                       placeholder="Please enter email address" onKeyDown={this.onKeyDown} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.onClick}>Submit</button>
              </div>
            </div>
          </div>
          <div className={thankClassName} role="document" style={style}>
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h3 className="text-center">Thank you!</h3>
                <p>Someone from our team will write a Freedom of Information Act Request for this document, and e-mail FOIA@chicagopolice.org. We will wait to hear back.</p>
                <p>If we receive a responsive document, we will update this database. Check back in a few weeks!</p>
                <div className="success-icon"><i className="fa fa-check-circle"></i></div>
              </div>
            </div>
          </div>
        </div>
      );
    },
    email: function () {
      return jQuery(this.getDOMNode()).find("input[name='email']").val();
    },
    register: function () {
      RequestDocumentActions.registerEmail(allegation.crid, this.email());
    },
    onClick: function () {
      this.register();
    },
    onKeyDown: function (e) {
      if(e.keyCode == 13) {
        e.preventDefault();
        this.register();
      }
    }
  });

  component.show = function (complaint) {
    allegation = complaint.allegation;
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
      RequestModal.show(action.value);
      break;

    case RequestDocumentConstants.DOCUMENT_REQUESTED:
      RequestModal.requestSuccess();
      break;

    default:
      break;
  }
});

module.exports = RequestModal;
