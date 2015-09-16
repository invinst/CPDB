var React = require('react');
var PageTitleStore = require('../stores/PageTitleStore');

var PageTitle = React.createClass({
  getInitialState: function() {
    return PageTitleStore.getState();
  },

  componentDidMount: function() {
    PageTitleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    PageTitleStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <h1>{this.state.activeItemText}</h1>
      </div>
    )
  },

  _onChange: function() {
    this.setState(PageTitleStore.getState());
  }
});

module.exports = PageTitle;
