var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Timeline = require('components/DataToolPage/Officer/Timeline.react');
var Map = require('components/DataToolPage/Officer/Map.react');
var DonutChart = require('components/DataToolPage/Officer/DonutChart.react');
var OfficerMixin = require('components/DataToolPage/Officer/OfficerMixin.react');
var OfficerInformation = require('components/DataToolPage/OfficerDetail/OfficerInformation.react');

var OfficerDetail = React.createClass({
  propTypes: {
    officer: PropTypes.object,
    hasMap: PropTypes.bool,
    timelineData: PropTypes.object
  },

  mixins: [OfficerMixin],

  getInitialState: function () {
    return {};
  },

  render: function () {
    var officer = this.props.officer;
    var hasMap = !!this.props.hasMap;
    var complaintRate = this.getAvgClass();

    var mapStyle = {
      height: '240px'
    };

    var columnClass = classnames({
      'col-sm-4' : hasMap,
      'col-sm-6' : !hasMap
    });
    var mapDiv = '';
    var radius = 8;
    if (hasMap) {
      var options = {
        defaultZoom: 10,
        maxZoom: 15,
        minZoom: 8,
        scrollWheelZoom: false
      };
      mapDiv = (
        <div className={ columnClass }>
          <Map officer={ officer } style={ mapStyle } radius={ radius } options={ options } />
        </div>
      );
    }
    return (
      <div id='OfficerDetail' className={ complaintRate }>
        <div className='row'>
          <div className='col-sm-9 h3'>
            <span className='star'>{ officer.star }</span>
            { officer.officer_first } { officer.officer_last }
          </div>
        </div>
        <ReactCSSTransitionGroup
          transitionName='information'
          transitionEnterTimeout={ 500 }
          transitionLeaveTimeout={ 500 }>
          { officer.discipline_count !== undefined
            ? <OfficerInformation officer={ officer } />
            : <div className='information-placeholder'/>
          }
        </ReactCSSTransitionGroup>
        <div className='row visualization-information'>
          { mapDiv }
          <div className={ columnClass }>
            <ReactCSSTransitionGroup
              transitionName='timeline'
              transitionEnterTimeout={ 500 }
              transitionLeaveTimeout={ 500 }>
              { this.props.timelineData.items
                ? <Timeline data={ this.props.timelineData } officer={ officer }/>
                : null
              }
            </ReactCSSTransitionGroup>
          </div>
          <div className={ columnClass }>
            <ReactCSSTransitionGroup
              transitionName='donut-chart'
              transitionEnterTimeout={ 500 }
              transitionLeaveTimeout={ 500 }>
              { officer.discipline_count !== undefined
                ? <DonutChart officer={ officer }/>
                : null
              }
            </ReactCSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = OfficerDetail;
