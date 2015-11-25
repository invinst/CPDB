var cx = require('classnames');
var React = require('react');


var SuggestionSectionActions = require('actions/MainPage/SuggestionSectionActions');

var SuggestionSection = React.createClass({
  itemOnClick: function (e, suggestion) {
    SuggestionSectionActions.goForSuggestionDetail(suggestion);
  },

  render: function () {
    var classNames = cx('animation', { 'hidden': !this.props.visible });

    return (
      <div id='suggestion-section' className={classNames}>
        <ul className="table-view">
          <li className="table-view-cell" >
            <a onClick={this.itemOnClick.bind(this, 'Item 1')}>
              Item 1
            </a>
          </li>
          <li className="table-view-cell">
            <a onClick={this.itemOnClick.bind(this, 'Item 2')}>
              Item 2
            </a>
          </li>
          <li className="table-view-cell">
            <a onClick={this.itemOnClick.bind(this, 'Item 1')}>
              Item 3
            </a>
          </li>
        </ul>
      </div>
    )
  }
});

module.exports = SuggestionSection;
