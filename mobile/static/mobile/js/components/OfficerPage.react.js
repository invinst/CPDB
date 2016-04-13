var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');

var SimpleTab = require('components/Shared/SimpleTab.react');
var ComplaintsTab = require('components/OfficerPage/ComplaintsTab.react');
var SearchablePage = require('components/Shared/SearchablePage.react');
var SummaryTab = require('components/OfficerPage/SummaryTab.react');
var RelatedOfficersTab = require('components/OfficerPage/RelatedOfficersTab.react');
var OfficerHeader = require('components/OfficerPage/OfficerHeader.react');
var NotMatchedPage = require('components/OfficerPage/NotMatchedPage.react');
var LoadingPage = require('components/Shared/LoadingPage.react');

var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');
var OfficerResourceUtil = require('utils/OfficerResourceUtil');
var OfficerPageStore = require('stores/OfficerPage/OfficerPageStore');
var OfficerPagePresenter = require('presenters/Page/OfficerPagePresenter');


var OfficerPage = React.createClass(objectAssign(Base(OfficerPageStore), {
  getInitialState: function () {
    return {
      'officer': {
        'detail': null,
        'complaints': [],
        'co_accused': []
      },
      loading: true,
      found: false
    };
  },

  componentWillReceiveProps: function (nextProps) {
    var id = nextProps.params.id || '';
    ga('send', 'event', 'officer', 'view_detail', location.pathname);
    OfficerResourceUtil.get(id);
    // The way react-router handle the same resource url leads to the issue that this React component is not remount
    // again, so we need to put this action here. It's not a cool solution anyway.
    OfficerPageServerActions.reload();
  },

  componentDidMount: function () {
    var id = this.props.params.id || '';
    ga('send', 'event', 'officer', 'view_detail', location.pathname);
    OfficerPageStore.addChangeListener(this._onChange);
    OfficerResourceUtil.get(id);
  },

  render: function () {
    var loading = this.state.loading;
    var found = this.state.found;
    var officer = this.state.officer;

    var presenter = OfficerPagePresenter(officer);

    if (loading) {
      return (
        <LoadingPage />
      );
    }

    if (!found) {
      return (
        <NotMatchedPage id={ this.state.pk } />
      );
    }

    return (
      <SearchablePage>
        <div className='officer-page'>
          <div className='content'>
            <OfficerHeader officer={ presenter.officerDetail } />
            <div className='tabs'>
              <SimpleTab navigation={ true }>
                <div>
                  <div className='tab-summary' tabIdentifier='summary'>Summary</div>
                  <div className='tab-complaints' tabIdentifier='complaints'>Complaints</div>
                  <div className='tab-co-accused' tabIdentifier='coaccused'>Co-accused</div>
                </div>
                <div className='officer-page-content'>
                  <div>
                    <SummaryTab officer={ presenter.officerDetail } distribution={ presenter.distribution } />
                  </div>
                  <div>
                    <ComplaintsTab officer={ presenter.officerDetail } complaints={ presenter.complaints } />
                  </div>
                  <div>
                    <RelatedOfficersTab coAccused={ presenter.coAccused }/>
                  </div>
                </div>
              </SimpleTab>
            </div>
          </div>
        </div>
      </SearchablePage>
    );
  }
}));

module.exports = OfficerPage;
