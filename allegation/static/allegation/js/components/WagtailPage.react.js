var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var WagtailPagesStore = require('stores/WagtailPagesStore');
var WagtailPageActions = require('actions/WagtailPagesActions');
var GlossaryPage = require('components/GlossaryPage.react');


var WagtailPage = React.createClass({
  propTypes: {
    params: PropTypes.object
  },

  getInitialState: function () {
    return {
      page: WagtailPagesStore.getCurrentPage()
    };
  },

  componentDidMount: function () {
    WagtailPagesStore.addChangeListener(this._onChange);
    WagtailPageActions.changeWagtailPage(this.props.params.page);
  },

  componentWillReceiveProps: function (nextProps) {
    WagtailPageActions.changeWagtailPage(nextProps.params.page);
  },

  componentWillUnmount: function () {
    WagtailPagesStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState({
      page: WagtailPagesStore.getCurrentPage()
    });
  },

  renderContent: function () {
    var pageType = _.get(this.state.page, 'meta.type');

    if (pageType === GlossaryPage.TYPE) {
      return <GlossaryPage page={ this.state.page }/>;
    }

    return null;
  },

  render: function () {
    return (
      <div>
        { this.renderContent() }
      </div>
    );
  }
});

module.exports = WagtailPage;
