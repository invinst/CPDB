var React = require('react');
var classnames = require('classnames');
var Formsy = require('formsy-react');
var PropTypes = React.PropTypes;
var Select = require('react-select');


var BootstrapSelectInput = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })),
    multiple: PropTypes.bool,
    value: PropTypes.string
  },
  mixins: [Formsy.Mixin],

  changeValue: function (val) {
    this.setValue(val);
  },

  render: function () {
    var classNames = classnames('form-group', this.props.className, {
      'has-error': this.showRequired() || this.showError()
    });

    return (
      <div className={ classNames }>
        <Select className='form-control'
          name={ this.props.name }
          value={ this.getValue() }
          options={ this.props.options }
          multi={ this.props.multiple }
          onChange={ this.changeValue }
          clearable={ false }
        />
      </div>
    );
  }
});

module.exports = BootstrapSelectInput;
