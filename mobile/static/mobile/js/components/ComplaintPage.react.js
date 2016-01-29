var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');

var AllegationResourceUtil = require('utils/AllegationResourceUtil');
var ComplaintDetail = require('components/ComplaintPage/ComplaintDetail.react');
var ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');
var ComplaintPageStore = require('stores/ComplaintPage/ComplaintPageStore');
var OfficerInvolved = require('components/ComplaintPage/OfficerInvolved.react');
var InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
var InvestigationTimeline = require('components/ComplaintPage/InvestigationTimeline.react');
var LoadingPage = require('components/Shared/LoadingPage.react');
var Location = require('components/ComplaintPage/Location.react');
var NotMatchedPage = require('components/ComplaintPage/NotMatchedPage.react');
var SearchablePage = require('components/Shared/SearchablePage.react');


var ComplaintPage = React.createClass(objectAssign(Base(ComplaintPageStore), {
  getInitialState: function () {
    return {
      'complaint': {
        'complaining_witness': [],
        'officers': [],
        'officer_allegation': null
      },
      loading: true
    };
  },

  componentDidMount: function () {
    ga('send', 'event', 'allegation', 'view_detail', location.pathname);
    var crid = this.props.params.crid || '';
    AllegationResourceUtil.get(crid);
    ComplaintPageStore.addChangeListener(this._onChange);
  },

  render: function () {
    var found = this.state.found;
    var loading = this.state.loading;
    var complaint = this.state.complaint;
    var info = complaint['officer_allegation'];
    var complainingWitness = complaint['complaining_witnesses'];
    var involvedOfficers = complaint['officers'];

    if (loading) {
      return (
        <LoadingPage />
      );
    }

    if (!found) {
      return (
        <NotMatchedPage crid={this.state.crid} />
      )
    }

    return (
      <SearchablePage>
        <div className='complaint-page'>
          <div className='container content'>
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
      </SearchablePage>
    );
  }
}));

module.exports = ComplaintPage;
