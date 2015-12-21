var React = require('react');
var cx = require('classnames');

var OfficerPageActions = require('actions/OfficerPage/OfficerPageActions');


var OfficerTabBar = React.createClass({
  onClick: function (tab, e) {
    OfficerPageActions.changeTab(tab)
  },

  render: function () {
    return (
      <div className='officer-tab-bar'>
        <span>
          <a href='#' onClick={this.onClick.bind(this, 'summary')}
            className={cx({'selected': this.props.currerntTab=='summary'})}>Summary</a>
        </span>
        <span>
          <a href='#' onClick={this.onClick.bind(this, 'complaints')}
             className={cx({'selected': this.props.currerntTab=='complaints'})}>Complaints</a>
        </span>
        <span>
          <a href='#' onClick={this.onClick.bind(this, 'related_officers')}
             className={cx({'selected': this.props.currerntTab=='related_officers'})}>Relative Officers</a>
        </span>
      </div>
    )
  }
});

module.exports = OfficerTabBar;
