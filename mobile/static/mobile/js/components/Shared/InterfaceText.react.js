var cx = require('classnames');
var objectAssign = require('object-assign');
var React = require('react');
var S = require('string');

var Base = require('components/Base.react');
var u = require('utils/HelperUtil');
var InterfaceTextStore = require('stores/Shared/InterfaceTextStore');
var InterfaceTextResourceUtil = require('utils/InterfaceTextResourceUtil');
var InterfaceTextUtil = require('utils/InterfaceTextUtil');


var InterfaceText = React.createClass(objectAssign(Base(InterfaceTextStore), {
  propsTypes: {
    'identifier': React.PropTypes.string,
    'placeholderLength': React.PropTypes.number
  },

  getInitialState: function () {
    return {
      loaded: InterfaceTextUtil.isCached('interfaceTexts'),
      interfaceTexts: InterfaceTextUtil.getLocalStorageItem('interfaceTexts')
    };
  },

  componentDidMount: function () {
    InterfaceTextStore.addChangeListener(this._onChange);
    if (!this.state.loaded) {
      InterfaceTextResourceUtil.get();
    }
  },

  render: function () {
    var placeholderLength = u.fetch(this.props, 'placeholderLength', 1);
    var identifier = u.fetch(this.props, 'identifier', '');
    var haveInterfaceText = !!this.state.interfaceTexts && (identifier in this.state.interfaceTexts);
    var text = u.fetch(this.state.interfaceTexts, identifier, S('x').repeat(+placeholderLength).s);
    var classNames = cx('interface-text', {
      'blurry-text': !this.state.loaded || !haveInterfaceText
    });

    return (
      <div className={ classNames }>
        { text }
      </div>
    );
  }
}));

module.exports = InterfaceText;
