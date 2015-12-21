var React = require('react');

var SimpleTab = require('components/Shared/SimpleTab.react');


var TestPage = React.createClass({
  render: function () {
    return (
      <div>
        <SimpleTab>
          <div>
            <span>Tab 1</span>
            <span>Tab 2</span>
            <span>Tab 3</span>
          </div>
          <div>
            <div>
              <div>Content 1</div>
              complex things?
            </div>
            <div>Content 2</div>
            <div>Content 3</div>
          </div>
        </SimpleTab>
      </div>
    )
  }
});

module.exports = TestPage;
