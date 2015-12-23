var React = require('react');
var pluralize = require('pluralize');

var OfficerPresenter = require('presenters/OfficerPresenter');


var RelatedOfficerItem = React.createClass({
  render: function () {
    var type = this.props.type;
    var officer = this.props.officer;
    var presenter = OfficerPresenter(officer);
    var numOfAllegations = officer['num_allegations'];

    return (
      <div className='related-officer-item pad'>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <span className='circle'></span>
          </div>
          <div className='eleven columns'>
            <div className='name bold'>{presenter.displayName}</div>
            <div className='gender'>{presenter.description}</div>
            <div className='description'>{type} in {pluralize('case', numOfAllegations, true)}</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficerItem;
