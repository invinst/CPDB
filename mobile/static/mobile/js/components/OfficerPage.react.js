var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');

var SimpleTab = require('components/Shared/SimpleTab.react');
var ComplaintsTab = require('components/OfficerPage/ComplaintsTab.react');
var SharedSearchBar = require('components/Shared/SharedSearchBar.react');
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
    OfficerPageServerActions.reload();
    OfficerResourceUtil.get(id);
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
      );
    }

    var officer = this.state.officer;
    var officerDetail = officer['detail'];
    var complaints = officer['complaints'];
    var coAccused = officer['co_accused'];

    return (
      <div className='officer-page'>
        <div className='content'>
          <SharedSearchBar />
          <OfficerHeader officer={officerDetail} />
          <div className='tabs'>
            <SimpleTab navigation={true}>
              <div>
                <div>Summary</div>
                <div>Complaints</div>
                <div>Co-accused officer</div>
              </div>
              <div className='officer-page-content'>
                <div>
                  <SummaryTab officer={officerDetail} />
                </div>
                <div>
                  <ComplaintsTab officer={officerDetail} complaints={complaints} />
                </div>
                <div>
                  <RelatedOfficersTab coAccused={coAccused}/>
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
