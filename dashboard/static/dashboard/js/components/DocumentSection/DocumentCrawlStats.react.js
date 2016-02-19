var React = require('react');
var _ = require('lodash');
var Base = require('../Base.react');
var DocumentCrawlStatActions = require('actions/DocumentSection/DocumentCrawlStatActions');
var DocumentCrawlStatStore = require('stores/DocumentSection/DocumentCrawlStatStore');

var DocumentCrawlStats = React.createClass(_.assign(Base(DocumentCrawlStatStore), {
  getInitialState: function () {
    return DocumentCrawlStatStore.getState();
  },

  componentDidMount: function () {
    DocumentCrawlStatActions.getCrawlStats();
    DocumentCrawlStatStore.addChangeListener(this._onChange);
  },

  renderCrawlStats: function () {
    var rows = [];
    var numRows = this.state.crawlStats.docs.length < 10 ? this.state.crawlStats.docs.length : 10;
    for (var i = 1; i < numRows; i++) {
      rows.push(
        <div key={ i } className='row'>
          <div className='col-md-6'>{ this.state.crawlStats.docs[i].timestamp }</div>
          <div className='col-md-6 tright' align='right'>
            <span className='pull-right'>{ this.state.crawlStats.docs[i].num_documents }</span>
          </div>
        </div>
      );
    }
    return rows;
  },

  render: function () {
    var lastSuccessfulCrawlDate = <i className='fa fa-spin fa-spinner'></i>;


    var crawlStats = <div></div>;
    var chevronClass = 'fa fa-chevron-up';
    if (this.state.showCrawlStats) {
      crawlStats = this.renderCrawlStats();
      chevronClass = 'fa fa-chevron-down';
    }

    if (this.state.crawlStats && this.state.crawlStats.docs.length > 0) {
      var mostRecent = this.state.crawlStats.docs[0];
      lastSuccessfulCrawlDate = (
        <div>
          <span>{ mostRecent.timestamp }</span>
          <span className='pull-right'>
            Number of Documents { mostRecent.num_documents }
          </span>
        </div>
      );

    }

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            Last successful crawl <button onClick={ this._toggleCrawlStats }><i className={ chevronClass }></i></button>
            <span className='last-successful-crawl-date'>{ lastSuccessfulCrawlDate }</span>
          </div>
        </div>
        { crawlStats }
      </div>
    );
  },

  _toggleCrawlStats: function () {
    DocumentCrawlStatActions.toggleCrawlStats();
  },

  _onChange: function () {
    this.setState(DocumentCrawlStatStore.getState());
  }
}));

module.exports = DocumentCrawlStats;
