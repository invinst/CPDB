var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var AppStore = require('stores/AppStore');
var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var WagtailPagesStore = require('stores/WagtailPagesStore');
var WagtailPageActions = require('actions/WagtailPagesActions');


var WagtailPage = React.createClass({
  getInitialState: function () {
    return {
      page: WagtailPagesStore.getCurrentPage()
    };
  },

  componentDidMount: function () {
    WagtailPagesStore.addChangeListener(this._onChange);
    WagtailPageActions.changeWagtailPage(this.props.params.page);
  },

  componentWillUnmount: function () {
    WagtailPagesStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function (nextProps) {
    WagtailPageActions.changeWagtailPage(nextProps.params.page);
  },

  _onChange: function () {
    this.setState({
      page: WagtailPagesStore.getCurrentPage()
    });
  },

  isHasPage: function () {
    return !!this.state.page;
  },

  renderRows: function () {
    var body = _.get(this.state.page, 'extended_body', []);

    return body.map(function (row, i) {

      var rowContent = row.value.map(function (col, key) {
        var colClassName = classnames({
          'col-md-6': col.type == 'half_paragraph',
          'col-md-12': col.type == 'full_paragraph'
        });

        return (
          <div key={key} className={colClassName} dangerouslySetInnerHTML={{ __html: col.value }} />
        );
      });

      return (
        <div key={i} className="row section">
          <div className="container">
            {rowContent}
          </div>
        </div>
      );
    });
  },

  render: function () {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  },
});

module.exports = WagtailPage;
