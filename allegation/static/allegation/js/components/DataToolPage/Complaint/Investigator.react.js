var React = require('react');
var PropTypes = React.PropTypes;
var pluralize = require('pluralize');
var Link = require('react-router').Link;
var S = require('string');

var OfficerMixin = require('components/DataToolPage/Officer/OfficerMixin.react');


var Investigator = React.createClass({
  propTypes: {
    complaint: PropTypes.object
  },

  mixins: [OfficerMixin],

  investigatorLink: function (investigator) {
    return '/investigator/' + S(investigator.name).slugify().s + '/' + investigator.id;
  },

  render: function () {
    var investigator = this.props.complaint.investigator;
    var more = '';
    var description;

    var progressStyle = {
      width: '100%'
    };
    var percent = (investigator.discipline_count / investigator.complaint_count) * 100;
    var style = {
      width: percent + '%'
    };

    if (investigator.complaint_count > 1) {
      description = (
        <div>{ investigator.complaint_count } { pluralize('case', investigator.complaint_count) }</div>
      );
      if (investigator.discipline_count) {
        description = (
          <div>
            <strong className='red'>
              { investigator.discipline_count } disciplined
            </strong>
            &nbsp;out of { investigator.complaint_count } { pluralize('case', investigator.complaint_count) }
          </div>
        );
      }
      more = (
        <div>
          { description }
          <div className='progress complaint' style={ progressStyle }>
            <div className='progress-bar discipline' role='progressbar' aria-valuenow='60' aria-valuemin='0'
              aria-valuemax='100' style={ style }>
              <span className='sr-only'></span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link to={ this.investigatorLink(investigator) }>
        <div className='investigation'>
          <div className='row-fluid'>
            <div>
              <div className='results'>
                <div className='investigator-name'>
                  { investigator.name }
                </div>
                { more }
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
});

module.exports = Investigator;
