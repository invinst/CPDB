var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');
var navigate = require('react-mini-router').navigate;

var Base = require('components/Base.react');
var AllegationDocumentPresenter = require('presenters/AllegationDocumentPresenter');
var DocumentListStore = require('stores/DocumentSection/DocumentListStore');
var DocumentListActions = require('actions/DocumentSection/DocumentListActions');
var DocumentMixin = require('components/DocumentSection/DocumentMixin');
var DocumentRequestAPI = require('utils/DocumentRequestAPI');


var DocumentList = React.createClass(_.assign(Base(DocumentListStore), {
  mixins: [DocumentMixin],

  componentDidMount: function () {
    DocumentListStore.addChangeListener(this._onChange);
    DocumentRequestAPI.getDocuments();
    jQuery(window).on('scroll', this._onScroll);
  },

  componentWillUnmount: function () {
    DocumentListStore.removeChangeListener(this._onChange);
    jQuery(window).off('scroll', this._onScroll);
  },

  _onScroll: function () {
    var windowHeight = window.innerHeight;
    var toBottom = jQuery(document).height() - windowHeight - jQuery(window).scrollTop();

    if (toBottom <= 100 && !this.state.locked) {
      DocumentRequestAPI.getMoreDocuments();
      DocumentListActions.lockScroll();
    }
  },

  _onClick: function (document) {
    return this.navigateToDocument.bind(this, document);
  },

  navigateToDocument: function (document) {
    navigate('/document?id=' + document.id);
    DocumentRequestAPI.getSingleDocument(document.id);
    DocumentListActions.setActive(document);
  },

  renderDocumentList: function () {
    var that = this;

    return _.map(this.state.documents, function (document) {
      var documentPresenter = AllegationDocumentPresenter(document);

      var statusClassName = classnames('fa', 'fa-' + documentPresenter.documentStatusIcon);
      var rowClassName = classnames('document pointer', {
        requested: documentPresenter.documentRequested,
        fulfilled: documentPresenter.documentPending
      });

      return (
        <tr key={ 'crid' + documentPresenter.crid } className={ rowClassName } onClick={ that._onClick(document) }>
          <td>{ documentPresenter.crid }</td>
          <td className='status'><i className={ statusClassName }></i> { documentPresenter.documentStatusText }</td>
          <td>{ documentPresenter.numberOfDocumentRequests }</td>
          <td>{ documentPresenter.lastRequested }</td>
          <td className='actions'>
            { that.renderDocumentActions(documentPresenter) }
          </td>
        </tr>
      );
    });
  },

  _onHeaderClick: function (sortBy) {
    DocumentListActions.sortBy(sortBy);
    DocumentRequestAPI.getDocuments();
  },

  renderSortIcon: function (sortName) {
    var sortBy = this.state.sortBy;
    var isSorting = _(sortBy).contains(sortName);
    var isDesc = this.state.order < 0;

    var className = classnames({
      'fa': true,
      'fa-sort': !isSorting,
      'sort-active': isSorting,
      'fa-sort-desc': isSorting && isDesc,
      'fa-sort-asc': isSorting && !isDesc
    });

    return (<i className={ className }></i>);
  },

  render: function () {
    return (
      <div className='table-responsive'>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>CRID</th>
              <th>Status</th>
              <th onClick={ this._onHeaderClick.bind(this, 'number_of_request') }>
                No. of requests { this.renderSortIcon('number_of_request') }
              </th>
              <th onClick={ this._onHeaderClick.bind(this, 'last_requested') }>
                Last requested { this.renderSortIcon('last_requested') }
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
