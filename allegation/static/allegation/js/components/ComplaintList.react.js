
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var ComplaintListRow = require('./ComplaintListRow.react');


var ComplaintList = React.createClass({
  getInitialState: function() {
     return ComplaintListStore.init();
  },
  componentDidMount: function() {
    ComplaintListStore.addChangeListener(this._onChange);
  },
  rowGetter: function (rowIndex) {
    return rows[rowIndex];
  },
  render: function(){
    var rows=[]
    for(var i=0;i<this.state.complaints.length;i++){
      var complaint = this.state.complaints[i];
      rows.push(<ComplaintListRow complaint={complaint} />)
    }

    return <div>
            <div className='row'>
              <div className='col-md-2'>
                <h3 className="margin-top-0">Complaint List</h3>
              </div>
              <div className='col-md-4'>All | Investigating | Investigated | Pending</div>
              <div className='col-md-8'><div className='pull-right'>Latest</div></div>
            </div>

            {rows}


          </div>

  },

  _onChange: function(){
      this.setState(ComplaintListStore.getAll());
  },
});

module.exports = ComplaintList