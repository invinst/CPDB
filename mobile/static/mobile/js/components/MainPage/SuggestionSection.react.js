var React = require('react');


var SuggestionSection = React.createClass({
  render: function () {
    return (
      <div id='suggestion-section' className='hidden animation'>
        <ul className="table-view">
          <li className="table-view-cell">
            <a>
              Item 1
            </a>
          </li>
          <li className="table-view-cell">
            <a>
              Item 2
            </a>
          </li>
          <li className="table-view-cell">
            <a>
              Item 3
            </a>
          </li>
        </ul>
      </div>
    )
  }
});

module.exports = SuggestionSection;
