var React = require('react');

var ComplaintPresenter = require('presenters/ComplaintPresenter');
var ComplaintService = require('services/ComplaintService');


var ThreeNodesTimeline = React.createClass({
  render: function () {
    var dashLine = {
      'vectorEffect': 'non-scaling-stroke',
      'strokeDasharray': '2 2'
    };
    var noStyle = {};
    var complaint = this.props.info;
    var presenter = ComplaintPresenter(this.props.info);
    var service = ComplaintService(complaint);

    var firstLineStyle = service.hasNoIncidentDate ? dashLine : noStyle;
    var secondLineStyle = service.isOpenInvestigation ? dashLine : noStyle;

    return (
      <svg x='0px' y='0px' viewBox='0 0 320 150'>
        <g>
          <g className='drawing'>
            <ellipse ry='6' rx='6' cy='8' cx='8' strokeWidth='2'/>
            <ellipse className='fill' ry='2' rx='2' cy='59' cx='8' strokeWidth='1.5'/>
            <ellipse className='fill' ry='4' rx='4' cy='114' cx='8' strokeWidth='1.5'/>
          </g>
          <g className='drawing'>
            <line y1='13' x1='8' y2='54' x2='8' style={firstLineStyle}/>
            <line y1='64' x1='8' y2='107' x2='8' style={secondLineStyle}/>
          </g>
          <g>
            <text className='event-title' x='30' y='12'>Incident Date</text>
            <text className='event-date' x='30' y='27'>{presenter.incidentDate}</text>
          </g>
          <g>
            <text className='event-title' x='30' y='64'>Investigation Begins</text>
            <text className='event-date' x='30' y='79'>{presenter.startInvestigationDate}</text>
          </g>
          <g>
            <text className='event-title' x='30' y='119'>{presenter.finalStatus}</text>
            <text className='event-date' x='30' y='134'>{presenter.endInvestigationDate}</text>
          </g>
        </g>
      </svg>
    );
  }
});

module.exports = ThreeNodesTimeline;
