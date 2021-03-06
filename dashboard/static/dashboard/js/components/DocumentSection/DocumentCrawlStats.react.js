var classnames = require('classnames');
var React = require('react');

var DocumentCrawlLog = require('components/DocumentSection/DocumentCrawlLog.react');
var DocumentCrawlStatActions = require('actions/DocumentSection/DocumentCrawlStatActions');
var DocumentCrawlStatStore = require('stores/DocumentSection/DocumentCrawlStatStore');
var DocumentCrawlStatAPI = require('utils/DocumentCrawlStatAPI');

var DocumentCrawlStats = React.createClass({
  getInitialState: function () {
    return {
      crawlStats: {},
      showCrawlStats: false
    };
  },

  componentDidMount: function () {
    DocumentCrawlStatAPI.get();
    DocumentCrawlStatStore.addChangeListener(this._onChange);
  },

  _toggleCrawlStats: function () {
    DocumentCrawlStatActions.toggleCrawlStats();
  },

  _onChange: function () {
    this.setState(DocumentCrawlStatStore.getState());
  },

  render: function () {
    var lastSuccessfulCrawlDate = <i className='fa fa-spin fa-spinner'></i>;
    var chevronClass = classnames({
      'fa fa-chevron-down': !this.state.showCrawlStats,
      'fa fa-chevron-up': this.state.showCrawlStats
    });
    var mostRecent;

    if (this.state.crawlStats.docs && this.state.crawlStats.docs.length > 0) {
      mostRecent = this.state.crawlStats.docs[0];
      lastSuccessfulCrawlDate = (
        <span>
          had <strong> <i className='fa fa-file-text-o'></i> { mostRecent.num_documents } </strong>
          and ran on <strong>{ mostRecent.timestamp }</strong>.
          <span className='pull-right'>

            <button className='show-crawl-log pull-right' onClick={ this._toggleCrawlStats }>
              <i className={ chevronClass }></i></button>
          </span>
        </span>
      );

    }
    return (
      <div className='container-fluid'>
        <div className='row margin-top'>
          <div className='col-md-6 col-md-offset-3 alert alert-info last-successful-crawl-date'>
            <span className='fa-stack fa-lg'>
              <i className='fa fa-circle fa-stack-2x'></i>
              <i className='fa fa-info fa-stack-1x fa-inverse'></i>
            </span>
            Last successful crawl { lastSuccessfulCrawlDate }
            <DocumentCrawlLog show={ this.state.showCrawlStats } crawlStats={ this.state.crawlStats } />
          </div>
        </div>


      </div>
    );
  }
});

module.exports = DocumentCrawlStats;
