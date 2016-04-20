var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');
var cx = require('classnames');

var RequestActions = require('actions/ComplaintPage/RequestActions');
var RequestStore = require('stores/ComplaintPage/RequestStore');
var Modal = require('components/Lib/Modal.react');


var RequestModalContent = React.createClass(objectAssign(Base(RequestStore), {
  contextTypes: {
    modalName: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      requested: false,
      email: ''
    };
  },

  render: function () {
    var requestFormClass = cx('request-form', {'hide': this.state.requested});
    var thankYouClass = cx('thank-you', {'hide': !this.state.requested });

    return (
      <div>
        <div className='request-modal-content'>
          <div className='modal-content content'>
            <div className='modal-header'>
              <div className='icon icon-close align-right' onClick={ Modal.dispatch(this.context.modalName, 'close') }>
              </div>
            </div>
            <div className={ requestFormClass }>
              <div className='modal-body'>
                <div className='message-header'>We'll notify you when the document is made available.</div>
                <input ref='email' type='email' placeholder='Your email address'></input>
                <button className='btn-cancel btn btn-outlined'
                  onClick={ Modal.dispatch(this.context.modalName, 'close') }>Cancel
                </button>
                <button className='btn-submit btn btn-positive btn-outlined' onClick={ RequestActions.registerEmail }>
                  Submit
                </button>
              </div>
            </div>
            <div className={ thankYouClass }>
              <div className='message-header'>Thank you</div>
              <div className='message-content'>
                <p>
                  Someone from our team will write a Freedom of Information Act Request for this document,
                  and e-mail FOIA@chicagopolice.org. We will wait to hear back.
                </p>
                <p>If we receive a responsive document, we will update this database. Check back in a few weeks!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = RequestModalContent;
