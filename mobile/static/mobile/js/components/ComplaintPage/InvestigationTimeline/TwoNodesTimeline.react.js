var React = require('react');

var ComplaintPresenter = require('presenters/ComplaintPresenter');
var ComplaintService = require('services/ComplaintService');


var TwoNodesTimeline = React.createClass({
  render: function () {
    var dashLine = {
      'vectorEffect': 'non-scaling-stroke',
      'strokeDasharray': '2 2'
    };
    var noStyle = {};
    var complaint = this.props.info;
    var presenter = ComplaintPresenter(this.props.info);
    var service = ComplaintService(complaint);

    var endStyle = service.isOpenInvestigation ? dashLine : noStyle;

    return (
      <svg x='0px' y='0px' viewBox='0 0 320 150'>
        <g>
          <g className='drawing'>
            <ellipse ry='6' rx='6' cy='8' cx='8' strokeWidth='2'/>
            <ellipse className='fill' ry='2' rx='2' cy='8' cx='8'/>
            <ellipse className='fill' ry='4' rx='4' cy='114' cx='8'/>
          </g>
          <g className='drawing'>
            <line y1='13' x1='8' y2='107' x2='8' stroke='#000' style={endStyle}/>
          </g>
          <g>
            <text className='event-title' x='30' y='12'>Incident Date</text>
            <text className='event-title' x='30' y='27'>Investigation Begins</text>
            <text className='event-date' x='30' y='42'>{presenter.incidentDate}</text>
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

module.exports = TwoNodesTimeline;
