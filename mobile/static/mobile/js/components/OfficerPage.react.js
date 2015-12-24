var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');
var SimpleTab = require('components/Shared/SimpleTab.react');
var Wrapper = require('components/Shared/Wrapper.react');

var ComplaintsTab = require('components/OfficerPage/ComplaintsTab.react');
var OfficerHeader = require('components/OfficerPage/OfficerHeader.react');
var SearchBar = require('components/Shared/SearchBar.react');
var SummaryTab = require('components/OfficerPage/SummaryTab.react');
var RelatedOfficersTab = require('components/OfficerPage/RelatedOfficersTab.react');
var OfficerResourceUtil = require('utils/OfficerResourceUtil');
var OfficerPageStore = require('stores/OfficerPage/OfficerPageStore');
var NotMatchedPage = require('components/OfficerPage/NotMatchedPage.react');
var LoadingPage = require('components/Shared/LoadingPage.react');


var OfficerPage = React.createClass(objectAssign(Base(OfficerPageStore), {
  getInitialState: function () {
    return {
      'officer': {
        'detail': null,
        'complaints': [],
        'co_accused': [],
        'witness': []
      },
      loading: true
    };
  },

  componentDidMount: function () {
    var id = this.props.params.id || '';
    OfficerResourceUtil.get(id);
    OfficerPageStore.addChangeListener(this._onChange);
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
        <NotMatchedPage id={this.state.pk} />
      )
    }

    var officer = this.state.officer;
    var officerDetail = officer['detail'];
    var complaints = officer['complaints'];
    var coAccused = officer['co_accused'];
    var witness = officer['witness'];

    return (
      <div className='officer-page'>
        <div className='content'>
          <SearchBar />
          <OfficerHeader officer={officerDetail} />
          <div className='tabs'>
            <SimpleTab navigation={true}>
              <div>
                <div>Summary</div>
                <div>Complaints</div>
                <div>Relative Officers</div>
              </div>
              <div className='officer-page-content'>
                <div>
                  <SummaryTab officer={officerDetail} />
                </div>
                <div>
                  <ComplaintsTab officer={officerDetail} complaints={complaints} />
                </div>
                <div>
                  <RelatedOfficersTab coAccused={coAccused} witness={witness} />
                </div>
              </div>
            </SimpleTab>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = OfficerPage;
