var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');
var u = require('utils/HelperUtil');

var GaUtil = require('utils/GaUtil');

var AllegationPresenter = require('presenters/AllegationPresenter');
var AccompliceOfficerSection = require('components/ComplaintPage/AccompliceOfficerSection.react');
var AgainstSection = require('components/ComplaintPage/AgainstSection.react');
var AllegationResourceUtil = require('utils/AllegationResourceUtil');
var ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');
var ComplaintPagePresenter = require('presenters/Page/ComplaintPagePresenter');
var ComplaintPageStore = require('stores/ComplaintPage/ComplaintPageStore');
var DocumentSection = require('components/ComplaintPage/DocumentSection.react');
var InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
var LoadingPage = require('components/Shared/LoadingPage.react');
var Location = require('components/ComplaintPage/Location.react');
var NotMatchedCategoryPage = require('components/ComplaintPage/NotMatchedCategoryPage.react');
var NotMatchedComplaintPage = require('components/ComplaintPage/NotMatchedComplaintPage.react');
var OfficerAllegationDetail = require('components/ComplaintPage/OfficerAllegationDetail.react');
var SearchablePage = require('components/Shared/SearchablePage.react');
var ToggleComplaintPage = require('components/ComplaintPage/ToggleComplaintPage.react');
var Wrapper = require('components/Shared/Wrapper.react');
var cx = require('classnames');


var ComplaintPage = React.createClass(objectAssign(Base(ComplaintPageStore), {
  getInitialState: function () {
    return {
      'data': {
        'complaining_witnesses': [],
        'allegation': {}
      },
      loading: true,
      toggle: false
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
    var toggle = this.state.toggle;
    var classNames = cx('toggle-page', {'content': toggle}, {'animate': !toggle});
    var allegationPresenter = AllegationPresenter(presenter.allegation);

    // TODO: Think about refactoring this later
    if (loading) {
      return (
        <LoadingPage />
      );
    }

    if (!found) {
      return (
        <NotMatchedComplaintPage crid={ this.state.crid }/>
      );
    }

    if (presenter.isInvalidCategory) {
      return (
        <NotMatchedCategoryPage />
      );
    }

    return (
      <div>
        <div className={ classNames }>
          <ToggleComplaintPage officerAllegations={ presenter.officerAllegations }
            allegation={ presenter.allegation }
            numberOfAllegations={ presenter.numberOfOfficerAllegations }/>
        </div>
        <Wrapper visible={ !toggle }>
          <div >
            <SearchablePage>
              <div className='complaint-page'>
                <div className='container content'>
                  <div className='main-content'>
                    <OfficerAllegationDetail allegation={ presenter.allegation }
                      currentOfficerAllegation={ presenter.currentOfficerAllegation }
                      numberOfAllegations={ presenter.numberOfOfficerAllegations }/>
                    <DocumentSection documents={ allegationPresenter.documents } />
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
          </div>
        </Wrapper>
      </div>
    );
  }
}));

module.exports = ComplaintPage;
