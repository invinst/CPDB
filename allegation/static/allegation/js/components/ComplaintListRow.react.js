
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var MapStore = require('../stores/MapStore');
var Officer = require("./Officer.react");

var ComplaintListRow = React.createClass({
  getInitialState: function() {
    // TODO: save state of show in a store
    return {
      'show': false,
      'detail': {}
    }

  },
  componentDidMount: function() {

  },

  render: function(){
    var icon = 'fa fa-caret-down';
    var show_more = 'hidden';
    var allegation = this.props.complaint.allegation;
    var map_image = '';
    if(this.state.show){
      icon = 'fa fa-caret-up';
      show_more = 'col-md-12 complaint_detail';

      if(allegation.point.lat){
        var token = MapStore.getToken();
        var lat = allegation.point.lat;
        var lng = allegation.point.lng;
        map_image = 'http://api.tiles.mapbox.com/v4/mapbox.streets/pin-l-park+482('+lng+','+lat+')/'+lng+','+lat+',13/489x300.png?access_token=' + token;
      }
    }
    var officer_name = "";
    if(this.props.complaint.officer){
        officer_name = this.props.complaint.officer.officer_first + " " + this.props.complaint.officer.officer_last;
    }
    category = {};
    if(this.props.complaint.category){
      category = this.props.complaint.category;
    }
    return <div className="complain-row">
            <div onClick={this.toggleComplaint} className='row'>
              <div className='col-md-1'>
                <i className='fa fa-check'></i>
              </div>
              <div className='col-md-3'>
                <div className='title'>Misconduct</div>
                {category.category}
              </div>
              <div className='col-md-1'>
                <div className='title'>CRID</div>
                {allegation.crid}
              </div>
              <div className='col-md-2'>
                <div className='title'>Incident Date</div>
                {allegation.incident_date}
              </div>
              <div className='col-md-3'>
                <div className='title'>Officer</div>
                {officer_name}
              </div>
              <div className='col-md-1'>
                <a className='btn btn-sm btn-request'>
                  <i className='fa fa-file-pdf-o'></i>&nbsp;&nbsp;&nbsp;Request
                </a>
              </div>
              <div className='col-md-1 text-center' >
                <a onClick={this.toggleComplaint} href="#" className="show_more"><i className={icon}></i></a>
              </div>
            </div>

            <div className={show_more}>
              <div className="row-fluid">
                <div className="col-md-12">
                  <div className='row'>
                    <div className="col-md-12">
                      <h3>{category}</h3>
                      {category.cat_id} {category.allegation_name}
                    </div>
                    <div className='col-md-12'>
                      <h4>Officers Involved</h4>
                    </div>
                    <div>
                      <div className='col-md-2'>
                        <Officer officer={this.props.complaint.officer} />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='map col-md-6'>
                      <img src={map_image} />
                    </div>
                    <div className='col-md-6'>
                      <div>Location: {allegation.location}</div>
                      <div>Address: {allegation.add1} {allegation.add2}</div>
                      <div>City: {allegation.city}</div>
                    </div>
                  </div>

                  <h4>Investigation</h4>
                  <div className='row'>
                    <div className='col-md-3'>
                      Timeline
                    </div>
                    <div className='col-md-6'>
                      Investigation Start: {allegation.start_date} <br />
                      Incident date: {allegation.incident_date}

                    </div>
                    <div className='col-md-3'>
                    Investigation End:{allegation.end_date}
                    {allegation.final_finding}
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-3'><strong>Disciplinary Action</strong></div>
                    <div className='col-md-9'>{allegation.final_outcome}</div>
                  </div>
                  <div className='row'>
                    <div className='col-md-3'><strong>Investigators</strong></div>
                    <div className='col-md-9'>{allegation.investigator}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  },

  toggleComplaint: function(e){
    e.preventDefault();
    this.setState({'show':!this.state.show});
  },
});

module.exports = ComplaintListRow
