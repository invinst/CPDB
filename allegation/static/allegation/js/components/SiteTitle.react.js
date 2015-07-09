var React = require('react');
var FilterStore = require("../stores/FilterStore");
var init_data = typeof(INIT_DATA) == 'undefined' ? {} : INIT_DATA;

var SiteTitle = React.createClass({
  getInitialState: function () {
    var initial = init_data['title'] || "Citizens’ Police Database";
    return {
      text: initial
    }
  },

  render: function() {
    return (
      <input className='site-title-input' type='text' value={this.state.text} onChange={this.change} />
    )
  },

  change: function (e) {
    newTitle = $(e.target).val()
    this.setState({ 'text': newTitle });
    FilterStore.saveSession({'title': newTitle});
    document.title = newTitle;
  },
});

module.exports = SiteTitle;
