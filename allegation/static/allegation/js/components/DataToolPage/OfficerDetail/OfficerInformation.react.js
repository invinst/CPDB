var _ = require('lodash');
var AppConstants = require('constants/AppConstants');
var OfficerPresenter = require('presenters/OfficerPresenter.js');
var React = require('react');


var OfficerInformation = React.createClass({
  renderOfficerInformation: function() {
    var officer = this.props.officer;
    var presenter = OfficerPresenter(officer);

    return ['unitWithName', 'rank', 'star', 'joinedDate', 'race', 'gender'].map(function(x) {
      if (!_.isEmpty(presenter[x])) {
        return (
          <span key={x} className='information-entry'>
            <span className='desc'>{AppConstants.OFFICER_INFORMATION_TITLES[x]}</span>
            <span className='val'>{presenter[x]}</span>
            <span className='splitter'></span>
          </span>
        )
      }
    });
  },

  render: function() {
    return (
      <div className='row'>
        <div className='col-md-12 information'>
          {this.renderOfficerInformation()}
        </div>
      </div>
    )
  }
});

module.exports = OfficerInformation;
