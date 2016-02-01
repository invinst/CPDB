var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');

var Base = require('components/Base.react');

var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var Footer = require('components/DataToolPage/Footer.react');
var HappyFox = require('components/Shared/HappyFox.react');
var Nav = require('components/OfficerPage/Nav.react');
var InvestigationsSection = require('components/InvestigatorPage/InvestigationsSection.react');
var InvestigatorDetail = require('components/InvestigatorPage/InvestigatorDetail.react');
var InvestigatorPageStore = require('stores/InvestigatorPageStore');
var InvestigatorPageAPI = require('utils/InvestigatorPageAPI');


var InvestigatorPage = React.createClass(_.assign(Base(InvestigatorPageStore), {
  initAPIRequest: function (investigatorId) {
    InvestigatorPageAPI.getInvestigatorData(investigatorId);
  },

  componentDidMount: function () {
    InvestigatorPageStore.addChangeListener(this._onChange);
    var investigatorId = this.props.params.id || '';
    this.initAPIRequest(investigatorId);
  },

  componentWillReceiveProps: function (newProps) {
    var investigatorId = newProps.params.id || '';
    this.initAPIRequest(investigatorId);
  },

  componentDidUpdate: function () {
    var investigatorName = _.get(this.state.data, 'investigator.name', '');
    document.title = investigatorName;
  },

  render: function () {
    var investigator = this.state.data['investigator'];

    if (_.isEmpty(investigator)) {
      return (<i className='fa fa-spin fa-spinner' />);
    }

    return (
      <div id='officer-profile'>
        <div className="map-row">
          <div className="container">
            <InvestigatorDetail data={this.state.data} />
          </div>
        </div>
        <div className="white-background">
          <div className="container">
            <InvestigationsSection investigator={investigator} />
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = InvestigatorPage;
