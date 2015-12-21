var React = require('react');

var SimpleTab = require('components/Shared/SimpleTab/SimpleTab.react');
var Tab = SimpleTab.Tab;

var TestPage = React.createClass({
  render: function () {
    return (
      <div>
        <Tab>
          <div>
            <span>Tab 1</span>
            <span>Tab 2</span>
            <span>Tab 3</span>
          </div>
          <div>
            <div>Content 1</div>
            <div>Content 2</div>
            <div>Content 3</div>
          </div>
        </Tab>
      </div>
    )
  }
});

module.exports = TestPage;
