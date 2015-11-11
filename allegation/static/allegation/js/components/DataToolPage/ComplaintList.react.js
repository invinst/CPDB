var HOST = 'http://localhost:8000';
var React = require('react');
var Infinite = require('react-infinite');

var ComplaintListRow = require('components/DataToolPage/ComplaintListRow.react');
var AllegationFetcherQueryBuilder = require('utils/AllegationFetcherQueryBuilder');


var ComplaintList = React.createClass({
  getInitialState: function () {
    return {
      items : [],
      isInfiniteLoading: false,
      page: 1
    }
  },

  elementInfiniteLoad: function() {
    return (
      <div className="infinite-list-item">
        Loading...
      </div>
    );
  },

  renderComplaints: function (complaints, officer) {
    var rows = [];

    for (var i = 0; i < complaints.length; i++) {
      var complaint = complaints[i];
      var allegation = complaint.allegation;
      var key = 'allegation' + allegation.id;
      rows.push(<ComplaintListRow key={key} complaint={complaint} officer={officer} finding={allegation.final_finding}/>)
    }

    return rows;
  },

  handleInfiniteLoad: function() {
    var self = this;
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var pagedQuery = [queryString, 'page=' + this.state.page, 'length=25'].join('&');

    jQuery.getJSON('/api/allegations/?' + pagedQuery, function(data) {
      self.setState({
        isInfiniteLoading: false,
        items: self.state.items.concat(self.renderComplaints(data.allegations, self.props.officer)),
        page: self.state.page + 1
      })
    })
  },

  render: function () {
    var officer = this.props.officer;
    var items = this.renderComplaints(this.props.complaints, officer).concat(this.state.items);

    return (
      <Infinite containerHeight={800} elementHeight={70}
                infiniteLoadBeginEdgeOffset={300}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}
                useWindowAsScrollContainer>
        {items}
      </Infinite>
    )
  }
});

module.exports = ComplaintList;
