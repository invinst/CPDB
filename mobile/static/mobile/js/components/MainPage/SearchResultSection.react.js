var cx = require('classnames');
var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var OfficerResult = require('components/MainPage/SearchReultSection/OfficerResult.react');
var ComplaintResult = require('components/MainPage/SearchReultSection/ComplaintResult.react');
var SearchResultSectionStore = require('stores/MainPage/SearchResultSectionStore');
var SearchResultSectionActions = require('actions/MainPage/SearchResultSectionActions')


var SearchResultSection = React.createClass(objectAssign(Base(SearchResultSectionStore), {
  onClick: function (tab, e) {
    SearchResultSectionActions.changeTab(tab)
  },

  render: function () {
    var classNames = cx({'hidden': !this.props.visible});

    return (
      <div id='results' className={classNames}>
        <nav className='tabs'>
          <a className='item' href='#' onClick={this.onClick.bind(this, 'officer')}>
            Officer
          </a>
          <a className='item' href='#' onClick={this.onClick.bind(this, 'badge')}>
            Badge
          </a>
          <a className='item' href='#' onClick={this.onClick.bind(this, 'complaint')}>
            Complaints
          </a>
        </nav>
        <OfficerResult visible={this.state.currentTab == 'officer'}/>
        <ComplaintResult visible={this.state.currentTab == 'complaint'}/>
      </div>
    )
  }
}));

module.exports = SearchResultSection;
