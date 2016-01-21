var classnames = require('classnames');
var React = require('react');

var Base = require('components/Base.react');
var AllegationDetails = require('components/DataToolPage/Allegation/AllegationDetails.react');
var AllegationSummary = require('components/DataToolPage/Allegation/AllegationSummary.react');


var Allegation = React.createClass({
  render: function () {
    var allegation = this.props.allegation;
    var toggleAllegation = this.props.toggleAllegation;

    var cssClasses = classnames('row-fluid complaint_detail clearfix slide-down', {
      'closed': this.props.hide
    });

    return (
      <div className={cssClasses}>
        <div>
          <div className='col-xs-3'>
            <AllegationSummary allegation={allegation} toggleComplaint={toggleAllegation} />
          </div>
          <div className='col-xs-9'>
            <AllegationDetails allegation={allegation} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Allegation;