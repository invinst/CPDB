var React = require('react');
var Editor = require('react-medium-editor');
var classnames = require('classnames');

var FormMixin = {

  generateFormElement: function (field_name, label, prefix, required) {
    if (prefix) {
      id = prefix + field_name;
    } else {
      id = field_name;
    }

    return (
      <div className="form-group">
        <label htmlFor={id} className="col-lg-2 col-md-2 col-xs-2">{label}</label>
        <div className="col-lg-10 col-md-10 col-xs-10">
          <input type="text" className="form-control" id={id} name={name} required={required}
                 onChange={this.update(name)} value={this.value(name)} />
        </div>
    </div>
     )
  },

  generateFormMediumEditorElement: function (field_name, label, prefix, required) {
    if (prefix) {
      id = prefix + field_name;
    } else {
      id = field_name;
    }

    var className = classnames('medium-editor', id);

    return (
      <div className="form-group">
        <label htmlFor={id} className="col-lg-2 col-md-2 col-xs-2">{label}</label>
        <div className="col-lg-10 col-md-10 col-xs-10">
          <Editor text={this.value(field_name)} onChange={this.editorUpdate(field_name)}
                  className={className} options={{placeholder: false}} />
          <textarea name={field_name} value={this.value(field_name)}
                    className="hidden" required={required}></textarea>
        </div>
      </div>
     )
  }
}

module.exports = FormMixin