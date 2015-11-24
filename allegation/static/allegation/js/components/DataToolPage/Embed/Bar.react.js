/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');
var Download = require('components/DataToolPage/Download.react');
var EmbedAction = require('actions/EmbedActions');
var EmbedStore = require('stores/EmbedStore');
var classnames = require('classnames')


var Bar = React.createClass({
  getInitialState: function () {
    return {
      embedMode: false
    };
  },

  _enterMode: function () {
    if (!this.isMounted()) {
      return;
    }
    this.setState({
      embedMode: true
    });
  },

  _leaveMode: function () {
    if (!this.isMounted()) {
      return;
    }
    this.setState({
      embedMode: false
    });
  },

  componentDidMount: function() {
    EmbedStore.addEnterListener(this._enterMode);
    EmbedStore.addLeaveListener(this._leaveMode);
  },

  componentDidUnmount: function() {
    EmbedStore.removeEnterListener(this._enterMode);
    EmbedStore.removeLeaveListener(this._leaveMode);
  },

  onClick: function (e) {
    e.preventDefault();

    if (this.state.embedMode) {
      EmbedAction.leaveEmbedMode();
    } else {
      EmbedAction.enterEmbedMode();
    }
  },

  exitMode: function (e) {
    e.preventDefault();
    EmbedAction.leaveEmbedMode();
  },

  render: function () {
    var exitClassName = classnames({
      'hidden': !this.state.embedMode
    });
    var embedClassName = classnames('embed-button', {
      'active': this.state.embedMode
    });

    if (this.state.embedMode) {
      $("body").addClass("embedding");
    } else {
      $("body").removeClass("embedding");
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="embed-button">
            <a href="#" onClick={this.exitMode} className={exitClassName}>
              <i className="fa fa-times"></i> Exit mode
            </a>
          </div>
          <ul id="embed-lists" className="pull-right">
            <li className="embed-button">
              <Download />
            </li>
            <li className={embedClassName}>
              <a href="javascript: void()" onClick={this.onClick}>
                <i className="fa fa-code"></i> Embed Mode
              </a>
            </li>
            <li className="embed-button">
              <div className='smooth-scroll pointer' data-target='body'>
                <i className='fa fa-chevron-up' ></i> Back to top
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Bar;
