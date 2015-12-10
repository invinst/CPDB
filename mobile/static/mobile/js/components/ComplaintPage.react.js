var React = require('react');

var AllegationResourceUtil = require('utils/AllegationResourceUtil');
var ComplaintDetail = require('components/ComplaintPage/ComplaintDetail.react');
var ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');
var OfficerInvolved = require('components/ComplaintPage/OfficerInvolved.react');
var InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
var InvestigationTimeline = require('components/ComplaintPage/InvestigationTimeline.react');
var Location = require('components/ComplaintPage/Location.react');
var SearchBar = require('components/Shared/SearchBar.react');


var ComplaintPage = React.createClass({
  getInitialState: function () {
    return {
      'complaint': {
        'complaining_witness': [],
        'officers': [],
        'allegation': null
      }
    }
  },

  componentDidMount: function () {
    var crid = this.props.params.crid || '';
    AllegationResourceUtil.get(crid);
  },

  render: function () {
    var complaint = this.state.complaint;
    var info = complaint['allegation'];
    var complainingWitness = complaint['complaining_witness'];
    var involvedOfficers = complaint['officers'];

    return (
      <div className='complaint-page'>
        <div className='container content'>
          <SearchBar />
          <div className='main-content'>
            <ComplaintDetail info={info} />
            <InvestigationTimeline info={info} />
            <ComplainingWitness complainingWitness={complainingWitness} />
            <OfficerInvolved involvedOfficers={involvedOfficers} />
            <InvestigatorSection info={info} />
            <Location info={info} />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ComplaintPage;
