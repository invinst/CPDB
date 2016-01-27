var Base = function (Store) {
  return {
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
