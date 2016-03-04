var React = require('react');
var Editor = require('react-medium-editor');
var classnames = require('classnames');

var FormMixin = {

  generateFormElement: function (fieldName, label, prefix, required) {
    var id;

    if (prefix) {
      id = prefix + fieldName;
    } else {
      id = fieldName;
    }

    return (
      <div className='form-group'>
        <label htmlFor={ id } className='col-lg-2 col-md-2 col-xs-2'>{ label }</label>
        <div className='col-lg-10 col-md-10 col-xs-10'>
          <input type='text' className='form-control' id={ id } name={ fieldName } required={ required }
            onChange={ this.update(fieldName) } value={ this.value(fieldName) } />
        </div>
      </div>
     );
  },

  generateFormMediumEditorElement: function (fieldName, label, prefix, required) {
    var id,
      className;

    if (prefix) {
      id = prefix + fieldName;
    } else {
      id = fieldName;
    }

    className = classnames('medium-editor', id);

    return (
      <div className='form-group'>
        <label htmlFor={ id } className='col-lg-2 col-md-2 col-xs-2'>{ label }</label>
        <div className='col-lg-10 col-md-10 col-xs-10'>
          <Editor text={ this.value(fieldName) } onChange={ this.editorUpdate(fieldName) }
            className={ className } options={ {placeholder: false} } />
          <textarea name={ fieldName } value={ this.value(fieldName) }
            className='hidden' required={ required }></textarea>
        </div>
      </div>
     );
  }
};

module.exports = FormMixin;
