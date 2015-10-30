var React = require('react');
var cx = require('classnames');
var _ = require('lodash');
var Base = require('../Base.react');

var QueryList = React.createClass({
  renderQueryList: function () {
    if (!this.props.document.queries) {
      return;
    }
    var that = this;
    return this.props.document.queries.map(function (x, index) {
      return (
        <tr>
          <td>{index + 1}</td>
          <td className="session-query">{that.buildQuery(x)}</td>
        </tr>
      );
    });
  },

  buildQuery: function (query) {
    var result = [];
    _.map(query, function (x) {  // through all key
      _.map(x, function (y) {  // through all value
        if (typeof y == 'string') {
          result.push(y);
        } else {
          result.push(y.text); // get the text
        }
      });
    });
    return result;
  },

  render: function () {
    var document = this.props.document;
    if (!document.document_requested && (!document.queries || !document.queries.length)) {
      return (
        <div>
          This allegation has no data as the the moment.
        </div>
      );
    }

    return (
      <div className='table-responsive query-list'>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Search Queries</th>
            </tr>
          </thead>
          <tbody>
            { this.renderQueryList() }
          </tbody>
        </table>
      </div>
    );
  }

});

module.exports = QueryList;
