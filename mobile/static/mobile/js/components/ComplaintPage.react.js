var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');
var u = require('utils/HelperUtil');

var GaUtil = require('utils/GaUtil');

var AccompliceOfficerSection = require('components/ComplaintPage/AccompliceOfficerSection.react');
var AgainstSection = require('components/ComplaintPage/AgainstSection.react');
var AllegationResourceUtil = require('utils/AllegationResourceUtil');
var ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');
var ComplaintPagePresenter = require('presenters/Page/ComplaintPagePresenter');
var ComplaintPageStore = require('stores/ComplaintPage/ComplaintPageStore');
var InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
var LoadingPage = require('components/Shared/LoadingPage.react');
var Location = require('components/ComplaintPage/Location.react');
var NotMatchedCategoryPage = require('components/ComplaintPage/NotMatchedCategoryPage.react');
var NotMatchedPage = require('components/ComplaintPage/NotMatchedPage.react');
var OfficerAllegationDetail = require('components/ComplaintPage/OfficerAllegationDetail.react');
var SearchablePage = require('components/Shared/SearchablePage.react');


var ComplaintPage = React.createClass(objectAssign(Base(ComplaintPageStore), {
  getInitialState: function () {
    return {
      'data': {
        'complaining_witnesses': [],
        'allegation': {},
        'officer_allegations': []
      },
      loading: true
    };
  },

  componentDidMount: function () {
    var crid = u.fetch(this.props, 'params.crid', 0);

    GaUtil.track('event', 'allegation', 'view_detail', location.pathname);
    AllegationResourceUtil.get(crid);
    ComplaintPageStore.addChangeListener(this._onChange);
  },


  render: function () {
    var found = this.state.found;
    var loading = this.state.loading;
    var data = this.state.data;
    var categoryHashId = u.fetch(this.props, 'params.categoryHashId', 0);
    var presenter = ComplaintPagePresenter(data, categoryHashId);

    // TODO: Think about refactoring this later
    if (loading) {
      return (
        <LoadingPage />
      );
    }

    if (!found) {
      return (
        <NotMatchedPage crid={ this.state.crid }/>
      );
    }

    if (presenter.isInvalidCategory) {
      return (
        <NotMatchedCategoryPage category={ categoryHashId }/>
      );
    }

    return (
      <SearchablePage>
        <div className='complaint-page'>
          <div className='container content'>
            <div className='main-content'>
              <OfficerAllegationDetail allegation={ presenter.allegation }
                currentOfficerAllegation={ presenter.currentOfficerAllegation }
                numberOfAllegations={ presenter.numberOfOfficerAllegations }/>
              <AgainstSection allegation={ presenter.allegation }
                officerAllegations={ presenter.againstOfficerAllegations }/>
              <ComplainingWitness complainingWitnesses={ presenter.complainingWitnesses }/>
              <AccompliceOfficerSection officerAllegations={ presenter.accompliceOfficerAllegation }/>
              <InvestigatorSection allegation={ presenter.allegation }/>
              <Location allegation={ presenter.allegation }/>
            </div>
          </div>
        </div>
      </SearchablePage>
    );
  }
}));

module.exports = ComplaintPage;
