var React = require('react');


var PoliceWitness = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {

  },
  render: function () {
    var witnesses = this.props.witnesses;
    if (witnesses && witnesses.length) {

      var witnesses_rows = [];
      for (var i = 0; i < witnesses.length; i++) {
        var witnesses_obj = witnesses[i];
        var rows = [];
        for (var j = 0; j < witnesses_obj.officers.length; j++) {
          var officer_data = witnesses_obj.officers[j];
          var style = {
            'width': ((officer_data.num_complaints - officer_data.no_action_taken) / officer_data.num_complaints) * 100 + "%"
          };
          var progressStyle = {
            width: 100 + "%"
          };

          rows.push(
            <div key={j}>
              <div>{officer_data.officer.officer_first} {officer_data.officer.officer_last} ({officer_data.num_complaints}
                cases)
              </div>
              <div className="progress complaint" style={progressStyle}>
                <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                     aria-valuemax="100" style={style}>
                  <span className="sr-only"></span>
                </div>
              </div>
            </div>
          )
        }

        var gender = 'fa fa-street-view';
        if (witnesses_obj.witness_officer.gender == 'F') {
          gender = 'fa fa-venus';
        } else if (witnesses_obj.witness_officer.gender == 'F') {
          gender = 'fa fa-mars';
        }

        witnesses_rows.push(
          <div className="col-md-4" key={i}>
            <div className='results witness'>
              <div className='investigator-name'>
                {witnesses_obj.witness_officer.officer_first} {witnesses_obj.witness_officer.officer_last}
              </div>
              <div className="legend">
                <i className={gender} /> {witnesses_obj.witness_officer.race}
              </div>
              <br />
              {rows}
            </div>
          </div>
        );
      }

      var legend = (
        <div>
          <div>
            <span className='red line'></span>No Punishment
          </div>
          <div>
            <span className='blue line'></span>Discipline Applied
          </div>
        </div>
      );

      var col = Math.min(witnesses_rows.length * 3, 9);
      var className = "col-md-" + col + " witness";

      return (
        <div className='row margin-top'>
          <div className="col-md-10 col-md-offset-1">
            <div className="row">
              <div className={className}>
                <div className="row">
                  <div className='col-md-12 section-title'>Police witnesses</div>
                  {witnesses_rows}
                </div>
              </div>
              <div className='col-md-3 investigation'>
                <div className='section-title'>Police witnesses</div>
                {legend}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div></div>;
  }
});

module.exports = PoliceWitness;
