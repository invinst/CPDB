var React = require('react');
var _ = require('lodash');
var Base = require('../Base.react');
var QueryListStore = require('../../stores/SearchSection/QueryListStore');

var QueryList = React.createClass(_.assign(Base(QueryListStore), {
  renderQueryList: function() {
    var logCounts = this.state.logCounts;
    return this.state.logs.map(function(x) {
      return (
        <tr className='query'>
          <td>{x.query}</td>
          <td>{x.num_suggestions}</td>
          <td>{logCounts[x.query]}</td>
          <td><i className='fa fa-plus'/></td>
        </tr>
      )
    });
  },

  render: function() {
    return (
      <div className='table-responsive'>
        <table className='table table-stripped'>
          <thead>
            <tr>
              <th>Query</th>
              <th>No. of suggestions</th>
              <th>No. of usage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.renderQueryList() }
          </tbody>
        </table>
      </div>
    );
  }
}));

module.exports = QueryList;
