var React = require('react');

var DocumentCrawlLog = React.createClass({
  propTypes: {
    crawlStats: React.PropTypes.object.isRequired,
    show: React.PropTypes.bool.isRequired
  },

  render: function () {
    var rows = [];
    var numRows = 0;
    var i;

    if (this.props.crawlStats.docs) {
      numRows = this.props.crawlStats.docs.length < 10 ? this.props.crawlStats.docs.length : 10;
    }


    if (!this.props.show) {
      return <div></div>;
    } else {
      for (i = 1; i < numRows; i++) {
        rows.push(
          <div key={ i } className='row'>
            <div className='col-md-12 margin-top'>
              <i className='fa fa-calendar'></i> { this.props.crawlStats.docs[i].timestamp }
              <span className='pull-right'>
                <i className='fa fa-file-text-o'></i> { this.props.crawlStats.docs[i].num_documents }</span>
            </div>
          </div>
        );
      }
      return (<div className='document-crawl-log'>
        { rows }
      </div>);
    }
  }
});

module.exports = DocumentCrawlLog;
