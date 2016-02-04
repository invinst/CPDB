var _ = require('lodash');
var React = require('react');
var cookie = require('react-cookie');
require('utils/jQuery');

var Base = require('components/Base.react');
var DisclaimerStore = require('stores/DisclaimerStore');
var DisclaimerActions = require('actions/DisclaimerActions');

var Disclaimer = React.createClass(_.assign(Base(DisclaimerStore), {
  componentDidUpdate: function () {
    if (this.state.show) {
      jQuery('#disclaimer').modal('show');
    }
  },

  hiddenModal: function () {
    DisclaimerActions.hidden();
  },

  componentDidMount: function () {
    DisclaimerStore.addChangeListener(this._onChange);
    if (!cookie.load('disclaimered') && SHOW_DISCLAIMER) {
      DisclaimerActions.show();
    }
    jQuery('#disclaimer').on('hidden.bs.modal', this.hiddenModal);
  },

  render: function () {
    return (
      <div className='modal fade' role='dialog' id='disclaimer'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Disclaimer</h2>
            </div>
            <div className='modal-body'>
              <p>
                The information contained on this website comes primarily from four
                datasets provided by the Chicago Police Department (CPD),
                spanning approximately 2001 to 2008 and 2011 to 2015.
                The CPD has released these lists in response to litigation and to FOIA Requests.
              </p>
              <p>
                The City of Chicago’s release of this information was accompanied by a disclaimer
                that not all of the information contained in the City’s database may be completely accurate.
                No independent verification of the City’s records has taken place and this public database
                does not purport to be an accurate reflection of either the City’s internal database or of
                its truthfulness.
              </p>
              <p>
                Slight changes to the spelling of officer names and to the wording of abuse categories have been
                made to accommodate a consistent appearance. Where there is no unique identifying employee
                information and it is ambiguous whether officers with the same name are the same individual,
                this database assumes that the officers are different until further information is received.
                A glossary of our understanding of common CPD terms has been provided.
                No other editing of the City’s original datasets has taken place.
              </p>
              <p>
                This public database also contains other readily available data that has been linked to
                the City’s original datasets, including: CPD beat geographies, Chicago ward boundaries,
                Chicago neighborhood boundaries, separate FOIA responses to journalists, et cetera.
              </p>
              <p>
                By entering this website, you acknowledge that the Citizens’ Police Database (CPDB) is not responsible
                for any derivative work performed by or published by users of this public database.
              </p>
            </div>
            <div className='modal-footer' data-dismiss='modal'>
              <button className='btn btn-sm btn-view'>I UNDERSTAND</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = Disclaimer;
