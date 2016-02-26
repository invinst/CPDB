var _ = require('lodash');
var classnames = require('classnames');
var moment = require('moment');
var React = require('react');

var Base = require('../Base.react');
var AppConstants = require('../../constants/AppConstants');

var DocumentListStore = require('../../stores/DocumentSection/DocumentListStore');
var DocumentListActions = require('../../actions/DocumentSection/DocumentListActions');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var DocumentMixin = require('./DocumentMixin');

global.jQuery = require('jquery');


var DocumentList = React.createClass(_.assign(Base(DocumentListStore), {
  mixins: [DocumentMixin],

  _onScroll: function (e) {
    var windowHeight = window.innerHeight;
    var toBottom = jQuery(document).height() - windowHeight - jQuery(window).scrollTop();

    if (toBottom <= 100 && !this.state.locked) {
      DocumentRequestAPI.loadMore();
      DocumentListActions.lockScroll();
    }
  },

  componentDidMount: function () {
    DocumentListStore.addChangeListener(this._onChange);
    DocumentRequestAPI.get();
    jQuery(window).on('scroll', this._onScroll);
  },

  componentWillUnmount: function () {
    jQuery(window).off('scroll', this._onScroll);
  },

  setActiveAllegation: function (allegation) {
    DocumentRequestAPI.loadDocument(allegation.id);
    DocumentListActions.setActive(allegation);
  },

  onClick: function (allegation) {
    return this.setActiveAllegation.bind(this, allegation);
  },

  _onHeaderClick: function (sortBy) {
    DocumentListActions.sortBy(sortBy);
    DocumentRequestAPI.get();
  },

  renderDocumentList: function () {
    var that = this;
    return this.state.documents.map(function (x) {
      var status = that.getStatus(x);
      var statusObj = that.getStatusObject(status);
      var statusText = statusObj.text;
      var statusIcon = statusObj.icon;

      var className = classnames('fa', 'fa-' + statusIcon);

      return (
        <tr key={ 'crid' + x.crid } className={ that.rowClassName(x) } onClick={ that.onClick(x) }>
          <td>{ x.crid }</td>
          <td className='status'><i className={ className }></i> { statusText }</td>
          <td>{ x.total_document_requests }</td>
          <td>{ moment(x.last_document_requested).format(AppConstants.HUMAN_READABLE_FORMAT) }</td>
          <td className='actions'>
            { that.renderDocumentActions(status, x) }
          </td>
        </tr>
      );
    });
  },

  renderSortIcon: function (sortName) {
    var sortBy = this.state.sortBy;
    var isSorting = _(sortBy).contains(sortName);
    var isDesc = this.state.order < 0;

    var cx = classnames({
      'fa': true,
      'fa-sort': !isSorting,
      'sort-active': isSorting,
      'fa-sort-desc': isSorting && isDesc,
      'fa-sort-asc': isSorting && !isDesc
    });

    return (<i className={ cx }></i>);
  },

  render: function () {
    return (
      <div className='table-responsive'>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>CRID</th>
              <th>Status</th>
              <th onClick={ this._onHeaderClick.bind(this, 'total_document_requests') }>
                No. of requests { this.renderSortIcon('total_document_requests') }
              </th>
              <th onClick={ this._onHeaderClick.bind(this, 'last_document_requested') }>
                Last requested { this.renderSortIcon('total_document_requests') }
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { this.renderDocumentList() }
          </tbody>
        </table>
      </div>
    );
  }
}));

module.exports = DocumentList;
