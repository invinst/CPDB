/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');
var Download = require('./Download.react');
var EmbedButton = require('./Embed/Button.react');


var EmbedBar = React.createClass({
  getInitialState: function () {
    return {
      embedMode: false
    };
  },

  onClick: function (e) {
    e.preventDefault();

    this.setState({
      embedMode: !this.state.embedMode
    });
  },

  exitMode: function (e) {
    e.preventDefault();
    this.setState({
      embedMode: false
    });
  },

  render: function () {
    var exitClassName = this.state.embedMode ? '' : 'hidden';
    var embedClassName = this.state.embedMode ? 'col-md-2 active' : 'col-md-2';

    if (this.state.embedMode) {
      $("body").addClass("embedding");
    } else {
      $("body").removeClass("embedding");
    }

    return (
      <div className="row">
        <div className="col-md-2">
          <a href="#" onClick={this.exitMode} className={exitClassName}>
            <i className="fa fa-times"></i> Exit mode
          </a>
        </div>
        <div className="col-md-2 col-md-offset-4">
          <Download />
        </div>
        <div className={embedClassName}>
          <a href="#" onClick={this.onClick}>
            <i className="fa fa-code"></i> Embed Mode
          </a>
        </div>
        <div className="col-md-2">
          <div className='smooth-scroll pointer' data-target='#body'>
            <i className='fa fa-chevron-up' ></i> Back to top
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EmbedBar;
