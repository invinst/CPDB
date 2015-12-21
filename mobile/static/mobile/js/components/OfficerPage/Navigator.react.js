var React = require('react');

var Collapse = require('components/Shared/Collapse.react');
var ComplaintCard = require('components/Shared/ComplaintCard.react');
var OfficerPageActions = require('actions/OfficerPage/OfficerPageActions');


var Navigator = React.createClass({
  onClick: function (tab, e) {
    OfficerPageActions.changeTab(tab)
  },
  render: function () {
    return (
      <div className='navigator'>
        <a href='#' onClick={this.onClick.bind(this, this.props.leftAction)}>
          <span className='icon icon-left'></span>
          {this.props.leftText}
        </a>
        <a href='#' onClick={this.onClick.bind(this, this.props.rightAction)}
           className='right-link'>{this.props.rightText}
          <span className='icon icon-right'></span>
        </a>
      </div>
  )}
});

module.exports = Navigator;
