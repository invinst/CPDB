var React = require('react');


var Summary = React.createClass({
  getInitialState: function () {
    return {};
  },
  getCategory: function () {
    var category = this.props.complaint.category;
    if (category) {
      return (
        <div className="col-md-3">
          <div className="title">{category.category}</div>
          {category.allegation_name}
        </div>
      );
    } else {
      return (
        <div className="col-md-3">
          <div className="title">Category</div>
          Unknown
        </div>
      );
    }
  },
  getFinalFinding: function () {
    var allegation = this.props.complaint.allegation;
    return (
      <div className="col-md-2">
        <div className="title">Final Outcome</div>
        {allegation.final_finding || 'Unknown'}
      </div>
    );
  },
  getAction: function () {
    var allegation = this.props.complaint.allegation;
    return (
      <div className="col-md-2">
        <div className="title">Disciplinary action</div>
        {allegation.final_outcome || 'Unknown'}
      </div>
    );
  },
  getWitness: function () {
    var witness = this.props.complaint.complaining_witness;
    var witnesses = [];
    for (var i = 0; i < witness.length; i++) {
      if (i > 0) {
        witnesses.push(", ");
      }
      var person = "";
      person += witness[i].race || "Unknown race";
      person += " ";
      person += witness[i].gender ? (witness[i].gender == "F" ? "Female" : "Male") : "Person";
      witnesses.push(person)
    }
    return (
      <div className="col-md-2">
        <div className="title">Complaining Witness</div>
        {witnesses.length ? witnesses : "Unknown"}
      </div>
    );
  },
  render: function () {
    return (
      <div className="row summary">
        {this.getCategory()}
        {this.getFinalFinding()}
        {this.getAction()}
        {this.getWitness()}
      </div>
    );
  }
});

module.exports = Summary;
