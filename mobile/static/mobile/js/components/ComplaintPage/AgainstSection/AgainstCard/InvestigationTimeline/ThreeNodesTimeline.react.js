var React = require('react');

var OfficerAllegationPresenter = require('presenters/OfficerAllegationPresenter');
var AllegationPresenter = require('presenters/AllegationPresenter');


var ThreeNodesTimeline = React.createClass({
  propTypes: {
    officerAllegation: React.PropTypes.object,
    allegation: React.PropTypes.object
  },

  render: function () {
    var dashLine = {
      'vectorEffect': 'non-scaling-stroke',
      'strokeDasharray': '2 2'
    };
    var noStyle = {};
    var allegationPresenter = AllegationPresenter(this.props.allegation);
    var presenter = OfficerAllegationPresenter(this.props.officerAllegation);
    var firstLineStyle = allegationPresenter.incidentDate ? dashLine : noStyle;
    var secondLineStyle = presenter.isOpenInvestigation ? dashLine : noStyle;

    return (
      <svg x='0px' y='0px' viewBox='0 0 320 150'>
        <g>
          <g className='drawing'>
            <ellipse ry='6' rx='6' cy='8' cx='8' strokeWidth='2'/>
            <ellipse className='fill' ry='2' rx='2' cy='59' cx='8' strokeWidth='1.5'/>
            <ellipse className='fill' ry='4' rx='4' cy='114' cx='8' strokeWidth='1.5'/>
          </g>
          <g className='drawing'>
            <line className='first-line' y1='13' x1='8' y2='54' x2='8' style={ firstLineStyle }/>
            <line className='second-line' y1='64' x1='8' y2='107' x2='8' style={ secondLineStyle }/>
          </g>
          <g>
            <text className='event-title' x='30' y='12'>Incident Date</text>
            <text className='event-date incident-date' x='30' y='27'>{ allegationPresenter.incidentDateDisplay }</text>
          </g>
          <g>
            <text className='event-title' x='30' y='64'>Investigation Begins</text>
            <text className='event-date start-date' x='30' y='79'>{ presenter.startDateDisplay }</text>
          </g>
          <g>
            <text className='event-title status' x='30' y='119'>{ presenter.finalStatus }</text>
            <text className='event-date end-date' x='30' y='134'>{ presenter.endDateDisplay }</text>
          </g>
        </g>
      </svg>
    );
  }
});

module.exports = ThreeNodesTimeline;
