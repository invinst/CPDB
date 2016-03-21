var React = require('react');
var Formsy = require('formsy-react');
var Dropzone = require('react-dropzone');


var DropzoneUpload = React.createClass({
  mixins: [Formsy.Mixin],

  onDrop: function (files) {
    this.setValue(files[0]);
  },

  render: function () {
    var file = this.getValue();

    return (
      <div className='form-group'>
        <div className='col-md-3'>
          <label htmlFor='link'>Upload PDF</label>
        </div>
        <div className='col-md-9 input-group'>
          <Dropzone multiple={ false } className='dropzone'
            onDrop={ this.onDrop } accept='application/pdf'>
            <div className='dropzone-content'>Drop PDF file here.</div>
          </Dropzone>
        </div>
        <div>
          <span>{
            file ? file.name + ' (' + file.size + ' KiB)' : null
          }</span>
        </div>
      </div>
    );
  }
});

module.exports = DropzoneUpload;
