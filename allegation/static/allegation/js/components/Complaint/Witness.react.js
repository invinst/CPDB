var React = require('react');


var Witness = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {

  },
  render: function () {
    var rows = [];
    var witnesses = this.props.witnesses;

    for (var i = 0; i < witnesses.length; i++) {
      var gender = 'fa fa-street-view';
      if (witnesses[i].gender == 'F') {
        gender = 'fa fa-venus';
      } else if (witnesses[i].gender == 'F') {
        gender = 'fa fa-mars';
      }

      rows.push(
        <div className="col-md-3" key={i}>
          <div className="results">
            <div className="legend">
              <i className={gender} /> {witnesses[i].race}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='row margin-top'>
        <div className="col-md-10 col-md-offset-1">
          <div className="row complaint-witness">
            <div className='col-md-12 section-title'>
              Complaining Witness
            </div>
            {rows}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Witness;
