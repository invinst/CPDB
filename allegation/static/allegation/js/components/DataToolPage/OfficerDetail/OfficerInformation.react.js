var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var AppConstants = require('constants/AppConstants');
var OfficerPresenter = require('presenters/OfficerPresenter.js');


var OfficerInformation = React.createClass({
  propTypes: {
    officer: PropTypes.object
  },

  renderOfficerInformation: function () {
    var officer = this.props.officer;
    var presenter = OfficerPresenter(officer);

    return ['unitWithName', 'rank', 'star', 'joinedDate', 'race', 'gender'].map(function (x) {
      if (!_.isEmpty(presenter[x])) {
        return (
          <span key={ x } className='information-entry'>
            <span className='desc'>{ AppConstants.OFFICER_INFORMATION_TITLES[x] }</span>
            <span className='val'>{ presenter[x] }</span>
            <span className='splitter'></span>
          </span>
        );
      }
    });
  },

  render: function () {
    return (
      <div className='row information'>
        <div className='col-md-12'>
          { this.renderOfficerInformation() }
        </div>
      </div>
    );
  }
});

module.exports = OfficerInformation;
