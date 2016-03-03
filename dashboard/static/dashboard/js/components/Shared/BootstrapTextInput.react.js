var React = require('react');
var classnames = require('classnames');
var Formsy = require('formsy-react');
var PropTypes = React.PropTypes;


var BootstrapTextInput = React.createClass({
  propTypes: {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string
  },
  mixins: [Formsy.Mixin],

  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },

  render: function () {
    var classNames = classnames('form-group', this.props.className, {
      'has-error': this.showRequired() || this.showError()
    });

    return (
      <div className={ classNames }>
        <input type='text' className='form-control'
          placeholder={ this.props.placeholder } onChange={ this.changeValue } value={ this.getValue() }/>
      </div>
    );
  }
});

module.exports = BootstrapTextInput;
