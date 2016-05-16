var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');
var cx = require('classnames');

var u = require('utils/HelperUtil');

var RequestStore = require('stores/ComplaintPage/RequestStore');
var RequestEmailResourceUtil = require('utils/RequestEmailResourceUtil.js');
var RequestDocumentErrorPresenter = require('presenters/RequestDocumentErrorPresenter');
var TickIcon = require('components/Shared/TickIcon');


var RequestModalContent = React.createClass(objectAssign(Base(RequestStore), {
  propTypes: {
    document: React.PropTypes.object
  },

  contextTypes: {
    modalName: React.PropTypes.string,
    action: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      requested: false,
      submitFailed: false,
      errors: {},
      email: ''
    };
  },

  onSubmit: function () {
    var documentId = u.fetch(this.props.document, 'id', null);
    RequestEmailResourceUtil.post(this.refs.email.value, documentId);
  },

  render: function () {
    var requestFormClass = cx('request-form', {'hide': this.state.requested});
    var thankYouClass = cx('thank-you', {'hide': !this.state.requested });
    var errorMsgClass = cx('error', {'hide': !this.state.submitFailed });
    var modalAction = u.fetch(this.context, 'action', function () {});
    var errorPresenter = RequestDocumentErrorPresenter(this.state.errors);

    return (
      <div>
        <div className='request-modal-content'>
          <div className='modal-content content'>
            <div className='modal-header'>
            </div>
            <div className={ requestFormClass }>
              <div className='modal-body'>
                <div className='message-header'>We&apos;ll notify you when the document is made available.</div>
                <input className='email-input' ref='email' type='email' placeholder='Your email address' />
                <div className={ errorMsgClass }>{ errorPresenter.errorMessage }</div>
                <button className='btn-cancel btn btn-outlined'
                  onClick={ modalAction('close') }>Cancel
                </button>
                <button className='btn-submit btn btn-positive btn-outlined' onClick={ this.onSubmit }>
                  Submit
                </button>
              </div>
            </div>
            <div className={ thankYouClass }>
              <div className='message-header'>Thank you!</div>
              <div className='message-content'>
                <p>
                  Someone from our team will write a Freedom of Information Act Request for this document,
                  and e-mail FOIA@chicagopolice.org. We will wait to hear back.
                </p>
                <p>If we receive a responsive document, we will update this database. Check back in a few weeks!</p>
                <div className='success-icon' onClick={ modalAction('close') }>
                  <TickIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = RequestModalContent;
