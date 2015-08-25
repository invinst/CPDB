/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');
var Download = require('./Download.react');
var EmbedButton = require('./Embed/Button.react');


var EmbedBar = React.createClass({
  getInitialState: function () {
    return {};
  },

  render: function () {
    return (
      <div className="row">
        <div className="col-md-2 col-md-offset-6">
          <Download />
        </div>
        <div className="col-md-2">
          <EmbedButton />
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
