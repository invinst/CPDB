var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');
var HelperUtil = require('utils/HelperUtil');

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
    OfficerResourceUtil.get(id);
  },

  componentDidMount: function () {
    ga('send', 'event', 'officer', 'view_detail', location.pathname);
    var id = this.props.params.id || '';
    OfficerPageStore.addChangeListener(this._onChange);
    OfficerResourceUtil.get(id);
  },

  render: function () {
    var loading = this.state.loading;
    var found = this.state.found;

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

    var officer = this.state.officer;
    var officerDetail = HelperUtil.fetch(officer, 'detail', {});
    var complaints = HelperUtil.fetch(officer, 'complaints', {});
    var coAccused = HelperUtil.fetch(officer, 'co_accused', {});
    var distribution = HelperUtil.fetch(officer, 'distribution', {});

    return (
      <SearchablePage>
        <div className='officer-page'>
          <div className='content'>
            <OfficerHeader officer={ officerDetail } />
            <div className='tabs'>
              <SimpleTab navigation={ true }>
                <div>
                  <div className='tab-summary'>Summary</div>
                  <div className='tab-complaints'>Complaints</div>
                  <div className='tab-co-accused'>Co-accused</div>
                </div>
                <div className='officer-page-content'>
                  <div>
                    <SummaryTab officer={ officerDetail } distribution={ distribution } />
                  </div>
                  <div>
                    <ComplaintsTab officer={ officerDetail } complaints={ complaints } />
                  </div>
                  <div>
                    <RelatedOfficersTab coAccused={ coAccused }/>
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
