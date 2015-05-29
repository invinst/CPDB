
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');


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
      rows.push(<tr><td>{complaint[3]}</td></tr>)
    }

    return <div>
            <div className='row'>
              <h3 className='col-md-2'>Complaint List</h3>
              <div className='col-md-4'>All | Investigating | Investigated | Pending</div>
              <div className='col-md-8'><div className='pull-right'>Latest</div></div>
            </div>
            <div className='row'>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>CRID</th>
                    <th>Incident Date</th>
                    <th>Officer</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>

  },

  _onChange: function(){
      this.setState(ComplaintListStore.getAll());
  },
});

module.exports = ComplaintList