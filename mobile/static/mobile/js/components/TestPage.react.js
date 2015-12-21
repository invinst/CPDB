var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

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
            <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={5000} transitionLeaveTimeout={3000}
          transitionAppear={true} transitionAppearTimeout={500}>
              <div>Content 1</div>
            </ReactCSSTransitionGroup>
            <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={5000} transitionLeaveTimeout={3000}
          transitionAppear={true} transitionAppearTimeout={500}>
              <div>Content 2</div>
            </ReactCSSTransitionGroup>

            <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={5000} transitionLeaveTimeout={3000}
          transitionAppear={true} transitionAppearTimeout={500}>
              <div>Content 3</div>
            </ReactCSSTransitionGroup>

          </div>
        </SimpleTab>
      </div>
    )
  }
});

module.exports = TestPage;
