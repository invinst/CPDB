var React = require('react');
var PropTypes = React.PropTypes;

var AppConstants = require('../../constants/AppConstants');
var InvestigatorPresenter = require('presenters/InvestigatorPresenter');


var InvestigatorInformation = React.createClass({
  propTypes: {
    investigator: PropTypes.object.isRequired
  },

  renderInvestigatorInformation: function () {
    var investigator = this.props.investigator;
    var presenter = InvestigatorPresenter(investigator);

    return ['unitWithName', 'rank'].map(function(x) {
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
          {this.renderInvestigatorInformation()}
        </div>
      </div>
    )
  }
});

module.exports = InvestigatorInformation;
