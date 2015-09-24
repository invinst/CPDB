var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
global.jQuery = require('jquery');
var SearchResultsActions = require('../actions/SearchSection/SearchResultsActions');
var SearchStore = require('../stores/SearchSection/SearchStore');
var QueryListFilterStore = require('../stores/SearchSection/QueryListFilterStore');
var QueryListStore = require('../stores/SearchSection/QueryListStore');

var ajax = null;

var SearchResultsAPI = {
  getAPIEndpoint: function(activeItem) {
    if (activeItem != 'alias') {
      return AppConstants.SEARCH_RESULTS_API_ENDPOINT;
    } else {
      return AppConstants.ALIAS_API_ENDPOINT;
    }
  },

  transformSearchResults: function(data) {
    return _.map(data.data, function (obj){
      obj.num_usage = data.usage[obj.query];
      obj.updated_at = data.last_entered[obj.query];
      return obj;
    });
  },

  transformAlias: function(data) {
    return _.map(data.data, function (obj){
      obj.query = obj.alias;
      return obj;
    });
  },

  buildParams: function(query, activeItem) {
    var params = {
      q: query
    };

    if (activeItem == 'fail-attempts') {
      params.fail = 1;
    }

    return params;
  },

  transform: function(data, activeItem) {
    if (activeItem == 'alias') {
      return this.transformAlias(data);
    } else {
      return this.transformSearchResults(data);
    }
  },

  get: function() {
    if (ajax) {
      ajax.abort();
    }
    var query = SearchStore.getState()['query'];
    var activeItem = QueryListFilterStore.getState()['activeItem'];
    var that = this;

    var params = this.buildParams(query, activeItem);
    var endpoint = this.getAPIEndpoint(activeItem);

    ajax = jQuery.getJSON(endpoint, params, function(data) {
      SearchResultsActions.receivedSearchResultsData(that.transform(data, activeItem));
    });
  },

  loadMore: function() {
    if (ajax) {
      ajax.abort();
    }

    var query = SearchStore.getState()['query'];
    var queryListStates = QueryListFilterStore.getState();
    var activeItem = queryListStates['activeItem'];
    var sortBy = queryListStates['sortBy'];
    var page = QueryListStore.getState()['page'];
    var that = this;

    var params = this.buildParams(query, activeItem);
    params.page = page;

    var endpoint = this.getAPIEndpoint(activeItem);

    ajax = jQuery.getJSON(endpoint, params, function(data) {
      SearchResultsActions.receivedMore(that.transform(data, activeItem));
    });
  }
};

module.exports = SearchResultsAPI;
