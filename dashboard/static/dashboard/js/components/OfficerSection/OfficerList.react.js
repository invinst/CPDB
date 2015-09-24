var React = require('react');
var _ = require('lodash');
var Base = require('../Base.react');
var OfficerActions = require('../../actions/OfficerSection/OfficerActions');
var OfficerListStore = require('../../stores/OfficerSection/OfficerListStore');
var OfficerStore = require('../../stores/OfficerSection/OfficerStore');
var SearchStore = require('../../stores/OfficerSection/SearchStore');

global.jQuery = require('jquery');
var QueryList = React.createClass(_.assign(Base(OfficerListStore), {

  clickOfficer: function (officer) {
    OfficerActions.setOfficer(officer);
  },

  renderQueryList: function() {
    var that = this;
    return this.state.officers.map(function(x) {
      return (
        <tr className='officer' onClick={that.clickOfficer.bind(that, x)}>
          <td>{x.id}</td>
          <td>{x.officer_first}</td>
          <td>{x.officer_last}</td>
          <td>{x.gender}</td>
          <td>{x.race}</td>
        </tr>
      )
    });
  },

  summary: function () {
    var query = SearchStore.getState().query;
    var count = this.state.officers.length;
    return (
      <div className="summary">{count} result(s) for "{query}"</div>
    );
  },

  render: function() {
    if (!this.state.officers) {
      return (
        <div>Please search officer to start adding stories</div>
      );
    }
    return (
      <div className='table-responsive'>
        { this.summary() }
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Race</th>
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
