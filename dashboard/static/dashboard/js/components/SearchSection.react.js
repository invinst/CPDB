var React = require('react');
var QueryList = require('./SearchSection/QueryList.react');
var QueryListFilter = require('./SearchSection/QueryListFilter.react');
var Search = require('./SearchSection/Search.react');
var AddAliasModal = require('./SearchSection/AddAliasModal.react');
var SearchResultsAPI = require('../utils/SearchResultsAPI');
var AddAliasModalActions = require('../actions/SearchSection/AddAliasModalActions');

var SearchSection = React.createClass({
  componentDidMount: function() {
    SearchResultsAPI.get();
  },

  showAliasModal: function () {
    AddAliasModalActions.show();
  },

  render: function() {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-9 col-xs-9'>
            <h1>
              Search Results
            </h1>
          </div>
          <div id='add-alias' className='col-md-3 col-xs-3 text-right'>
            <button className='btn btn-primary' onClick={this.showAliasModal}>
              <i className='fa fa-plus' />
              <span>Add Alias</span>
            </button>
          </div>
        </div>
        <div>
          <div className='row'>
            <QueryListFilter />
            <Search />
          </div>
          <div className='row'>
            <div id='queries' className='col-md-12'>
              <QueryList />
            </div>
          </div>
        </div>
        <AddAliasModal />
      </div>
    )
  }
});

module.exports = SearchSection;
