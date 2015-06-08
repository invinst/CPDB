
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var ComplaintListRow = require('./ComplaintListRow.react');


var ComplaintList = React.createClass({
  getInitialState: function() {
      var ret = {};
      if(this.props.allegations){
          console.log(this.props)
          ret = ComplaintListStore.init({'complaints':this.props.allegations,'officer':this.props.officer})
      }
      else {
          ret = ComplaintListStore.init();
      }
      console.log(ret);
      return ret;
  },
  componentDidMount: function() {
    ComplaintListStore.addChangeListener(this._onChange);
  },
  rowGetter: function (rowIndex) {
    return rows[rowIndex];
  },
  render: function(){
    var rows=[];
    var officer = null;
    if(this.props.officer){
        officer = this.props.officer
    }

    for(var i=0; i<this.state.complaints.length; i++){
      var complaint = this.state.complaints[i];
      if(!officer){
          officer = complaint.officer;
      }
      rows.push(<ComplaintListRow key={i} complaint={complaint} officer={officer} />)
    }

    return <div className="complaint_list">
            <div className='row'>
              <div className='col-md-2'>
                <h3 className="margin-top-0">Complaints</h3>
              </div>

            </div>
            {rows}
          </div>
  },

  _onChange: function(){
      this.setState(ComplaintListStore.getAll());
  },
});

module.exports = ComplaintList
