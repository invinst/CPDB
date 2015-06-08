var React = require('react');
var MapStore = require("../stores/MapStore");
var FilterStore = require("../stores/FilterStore");


var OfficerDetail = React.createClass({
  getInitialState: function() {
     return {}
  },
  componentDidMount: function() {
    FilterStore.update('officer_id',{'value':[this.props.officer.id]})
    MapStore.init('officer-complaint-map',{'maxZoom': 14,'minZoom': 8,'defaultZoom': 8});
  },

  render: function(){
    var officer = this.props.officer;
    var complaintRate = 'below';
    var complaintRateLabel = 'Below the average complaints rate';
    if(officer.allegations_count > 20){
      complaintRate = 'above';
    }
    return <div id='OfficerDetail'>
              <div className='row'>
                <div className='col-sm-1'>
                  <div className={complaintRate}>{officer.star}</div>
                </div>
                <h3 className='col-sm-9'>{officer.officer_first} {officer.officer_last}</h3>
                <div className='col-sm-2'>{complaintRateLabel}</div>
              </div>

              <div className='row'>
                <span>{officer.unit}</span>
                <span>{officer.rank_display}</span>
                <span>{officer.star}</span>
                <span>{officer.appt_date}</span>
                <span>{officer.gender_display}</span>
                <span>{officer.race}</span>
              </div>

             <div className='row'>
                <div className='col-sm-3'>
                  <div id='officer-complaint-map'>
                  </div>
                </div>
                <div className='col-sm-offset-1 col-sm-4'>
                  Timeline
                </div>
                <div className='col-sm-offset-1 col-sm-3'>
                  Donut
                </div>
              </div>
          </div>
  },

});

module.exports = OfficerDetail
