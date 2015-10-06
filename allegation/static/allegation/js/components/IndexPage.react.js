var _ = require('lodash');
var React = require('react');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var SessionStore = require('stores/SessionStore');
var Nav = require('components/Shared/Nav.react');
var navigate = require('react-mini-router').navigate;

var IndexPage = React.createClass(_.assign(Base(SessionStore), {

  render: function () {

    return (
      <div>
        <div className='container'>
          <div className='row'>
            <div className='col-xs-8 col-xs-offset-2'>
              <h1>Disclaimer</h1>

              <p>The information contained on this website comes primarily from three datasets provided by the Chicago
                  Police Department (CPD), spanning approximately 2002 to 2008 and 2011 to 2015. The CPD has released
                  these lists in response to litigation and to FOIA Requests.</p>

              <p>The City of Chicago’s release of this information was accompanied by a disclaimer that not all of the
                  information contained in the City’s database may be completely accurate. No independent verification
                  of the City’s records has taken place and this public database does not purport to be an accurate
                  reflection of either the City’s internal database or of its truthfulness.</p>

              <p>Slight changes to the spelling of officer names and to the wording of abuse categories have been made
                  to accommodate a consistent appearance. A glossary of our understanding of common CPD terms has been
                  provided. No other editing of the City’s original datasets has taken place.</p>

              <p>This public database also contains other readily available data that has been linked to the City’s
                  original datasets, including: CPD beat geographies, Chicago ward boundaries, Chicago neighborhood
                  boundaries, et cetera.</p>

              <p>By entering this website, you acknowledge that the Citizens’ Police Database (CPDB) is not
                  responsible for any derivative work performed by or published by users of this public database.</p>

              <div className='tcenter'><button className='btn btn-primary' onClick={this._onClick}>View Database</button></div>
            </div>
          </div>
      </div>
    </div>
    );
  },

  _onClick: function() {
    navigate("/data-tools");
  }
}));

module.exports = IndexPage;
