var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');

var AppConstants = require('../../constants/AppConstants');
var Base = require('components/Base.react');
var DocumentRequestAPI = require('utils/DocumentRequestAPI');
var DocumentRequestAnalysisAPI = require('utils/DocumentRequestAnalysisAPI');
var TabsStore = require('stores/DocumentSection/TabsStore');
var TabsActions = require('actions/DocumentSection/TabsActions');


var Tabs = React.createClass(_.assign(Base(TabsStore), {
  componentDidMount: function () {
    TabsStore.addChangeListener(this._onChange);
    DocumentRequestAnalysisAPI.get();
  },

  onClickStatus: function (tab) {
    TabsActions.setActiveStatus(tab);
    DocumentRequestAPI.getDocuments();
  },

  onClickDocumentType: function (type) {
    TabsActions.setActiveDocumentType(type);
    DocumentRequestAnalysisAPI.get(type);
    DocumentRequestAPI.getDocuments();
  },

  renderDocumentTypeTabs: function () {
    var that = this;
    return _.map(AppConstants.DOCUMENT_TYPES, function (type) {
      var className = classnames('tab-document-type-' + type.toLowerCase(), {
        active: type == that.state.documentType
      });

      return (
        <li key={ type } className={ className } onClick={ that.onClickDocumentType.bind(that, type) }>
          { type }
        </li>
      );
    });
  },

  renderTabs: function () {
    var that = this;
    return _.map(AppConstants.DOCUMENT_STATUS, function (status) {
      var text = status['text'];
      var className = classnames('tab-' + text.toLowerCase(), {
        active: text == that.state.active
      });

      return (
        <li key={ text } className={ className } onClick={ that.onClickStatus.bind(that, text) }>
          { text } <span className='analysis'>({ that.state.analysis[text] })</span>
        </li>
      );
    });
  },

  render: function () {
    return (
      <div>
        <ul className='filter'>
          { this.renderDocumentTypeTabs() }
        </ul>
        <ul className='filter'>
          { this.renderTabs() }
        </ul>
      </div>
    );
  }
}));

module.exports = Tabs;
