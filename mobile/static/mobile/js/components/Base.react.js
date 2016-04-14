/*eslint react/no-is-mounted:0 */
var Base = function (Store, name) {
  return {
    displayName: name || 'TightlyStoreCoupledComponent',

    getInitialState: function () {
      return Store.getState();
    },

    componentDidMount: function () {
      Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
      Store.removeChangeListener(this._onChange);
    },

    _onChange: function () {
      if (this.isMounted()) {
        this.setState(Store.getState());
      }
    }
  };
};

module.exports = Base;
