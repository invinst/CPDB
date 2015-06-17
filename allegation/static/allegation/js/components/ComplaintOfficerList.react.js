
var HOST = 'http://localhost:8000';
var React = require('react');
var ComplaintOfficer = require('./ComplaintOfficer.react');


var ComplaintOfficerList = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function(){
    var officer_list = this.props.officers;
    var i;
    var officers = [];

    for(i = 0; i < officer_list.length; i++){
      var officer = officer_list[i];
      officers.push(<div className='col-sm-3' key={officer.id}><ComplaintOfficer officer={officer}/></div>)
    }

    // 6 items per row
    var officer_rows = [];
    var current_row = [];
    officer_rows.push(current_row);
    var counter = 0;

    for(i = 0; i < officers.length; i++){
      if(counter++ == 4) {
        counter = 1;
        current_row = [];
        officer_rows.push(current_row);
      }
      current_row.push(officers[i]);
    }

    // prepare output
    var officer_output = [];
    for(i = 0; i < officer_rows.length; i++){
      officer_output.push(<div className="row officers" key={i}>{officer_rows[i]}</div>)
    }

    return <div>
              {officer_output}
          </div>

  }

});

module.exports = ComplaintOfficerList;
