var React = require('react');
var pluralize = require('pluralize');

var OfficerAllegationPresenter = require('presenters/OfficerAllegationPresenter');
var AllegationPresenter = require('presenters/AllegationPresenter');
var ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');


var OfficerAllegationDetail = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object,
    currentOfficerAllegation: React.PropTypes.object,
    numberOfAllegations: React.PropTypes.number
  },

  _onClick: function () {
    ComplaintPageActions.toggleOpen();
  },

  render: function () {
    var allegationPresenter = AllegationPresenter(this.props.allegation);
    var numberOfAllegations = this.props.numberOfAllegations;
    var currentOfficerAllegationPresenter = OfficerAllegationPresenter(this.props.currentOfficerAllegation);

    return (
      <div className='officer-allegation-detail pad'>
        <div className='headline row'>
          <span className='crid-info one-half column align-left'>
            <span className='crid-title'>CRID</span>
            <span className='crid-number'>{ allegationPresenter.crid }</span>
          </span>
          <span onClick={ this._onClick } className='one-half column align-right number-of-allegations-section'>
            <span className='number-of-allegations'>
              { pluralize('complaint', numberOfAllegations, true) }
            </span>
            <div className='icon icon-list'></div>
          </span>
        </div>
        <div className='category-info'>
          <div className='allegation-category bold'>
            { currentOfficerAllegationPresenter.category }
          </div>
          <div className='allegation-name'>
            { currentOfficerAllegationPresenter.allegationName }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerAllegationDetail;
