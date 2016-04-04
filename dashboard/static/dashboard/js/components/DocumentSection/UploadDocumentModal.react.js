var toastr = require('toastr');
var React = require('react');
var PropTypes = React.PropTypes;
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Formsy = require('formsy-react');
var Modal = require('react-modal');

var BootstrapTextInput = require('components/Shared/BootstrapTextInput.react');
var BootstrapSelectInput = require('components/Shared/BootstrapSelectInput.react');
var DropzoneUpload = require('components/Shared/DropzoneUpload.react');
var DocumentCloudActions = require('actions/DocumentSection/DocumentCloudActions');


// should not use inline styles but React Modal leave us no other choice
var customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    width: '600px',
    margin: '30px auto',
    borderRadius: 0,
    position: 'relative',
    padding: 30,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    border: 0,
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    WebkitBoxShadow: '0 5px 15px rgba(0,0,0,.5)'
  }
};


var UploadDocumentModal = React.createClass({
  propTypes: {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func
  },

  mixins: [PureRenderMixin],

  getInitialState: function () {
    return {
      submitDisabled: true
    };
  },

  submit: function (model) {
    var self = this;
    DocumentCloudActions.uploadDocument({
      file: model.file,
      title: model.title,
      source: model.source || '',
      documentType: model.documentType
    })
    .done(function (res) {
      toastr.success('Upload succeed');
      self.props.onRequestClose();
    })
    .fail(function (jqXHR, statusText, errorThrown) {
      toastr.error('Upload failed');
      throw Error(errorThrown);
    });
  },

  enableSubmit: function () {
    this.setState({ submitDisabled: false });
  },

  disableSubmit: function () {
    this.setState({ submitDisabled: true });
  },

  render: function () {
    var documentTypeOptions = [
      { value: 'CR', label: 'CR' },
      { value: 'CPB', label: 'CPB' }
    ];

    return (
      <Modal isOpen={ this.props.isOpen } style={ customStyles }
        onRequestClose={ this.props.onRequestClose } closeTimeoutMS={ 150 }>
        <Formsy.Form onValidSubmit={ this.submit } onValid={ this.enableSubmit } onInvalid={ this.disableSubmit }>
          <div className='modal-header'>
            <h3>Upload document</h3>
          </div>

          <div className='modal-body'>
            <DropzoneUpload required={ true } name='file'/>
            <BootstrapTextInput className='doc-title-input' name='title'
              placeholder='Document title (required)' required={ true }/>
            <BootstrapTextInput className='doc-source-input' name='source' placeholder='Document source'/>
            <BootstrapSelectInput className='doc-type' name='documentType' options={ documentTypeOptions } value='CR'/>
          </div>

          <div className='modal-footer'>
            <div className='Text-right'>
              <button type='submit' className='btn btn-primary' disabled={ this.state.submitDisabled }>
                SUBMIT
              </button>
              <button type='button' className='btn btn-cancel' onClick={ this.props.onRequestClose }>Cancel</button>
            </div>
          </div>
        </Formsy.Form>
      </Modal>
    );
  }
});

module.exports = UploadDocumentModal;
