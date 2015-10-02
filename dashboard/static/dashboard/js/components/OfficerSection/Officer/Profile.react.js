var React = require('react');
var _ = require('lodash');
var Base = require('../../Base.react');
var ProfileStore = require('../../../stores/OfficerSection/Officer/ProfileStore');
var ProfileActions = require('../../../actions/OfficerSection/Officer/ProfileActions');
var OfficerAPI = require('../../../utils/OfficerAPI');
var AppConstants = require('../../../constants/AppConstants.js');

global.jQuery = require('jquery');
require('jquery-validation');


var Profile = React.createClass(_.assign(Base(ProfileStore), {
  onChange: function (field, e) {
    if (field == 'appt_date' || field == 'birth_year') {
      jQuery(e.target).valid();
    }

    ProfileActions.updateField(field, e.target.value);
  },

  value: function (field) {
    if (this.state.officer) {
      return this.state.officer[field];
    }
  },

  update: function (field) {
    return this.onChange.bind(this, field);
  },

  save: function () {
    OfficerAPI.saveOfficerProfile(this.state.officer, this.state.originOfficer);
  },

  getRaceOptions: function () {
    return AppConstants.RACES.map(function (x) {
      return <option value={x} key={x}>{x}</option>
    });
  },

  getRankOptions: function () {
    return AppConstants.RANKS.map(function (x) {
      return <option value={x[0]} key={x[0]}>{x[1]}</option>
    });
  },

  addFormValidate: function () {
    jQuery('#profile-form').validate({
      rules: {
        appt_date: {
          required: true,
          date: true
        },
        birth_year: {
          required: true,
          number: true
        }
      }
    });
  },

  componentDidMount: function () {
    ProfileStore.addChangeListener(this._onChange);

    this.addFormValidate();
  },

  render: function() {
    return (
      <form id="profile-form" className="form-horizontal">
        <div className="form-group">
          <label htmlFor="officer_last" className="col-lg-2 col-md-2 col-xs-2">Last name</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type="text" className="form-control" id="officer_last" name="officer_last"
                   onChange={this.update("officer_last")} value={this.value('officer_last')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="officer_first" className="col-lg-2 col-md-2 col-xs-2">First name</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type="text" className="form-control" id="officer_first" name="officer_first"
                   onChange={this.update("officer_first")} value={this.value('officer_first')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="gender" className="col-lg-2 col-md-2 col-xs-2">Gender</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <select className="form-control" id="gender" name="gender" onChange={this.update("gender")}
                    value={this.value('gender')}>
              <option value="">--</option>
              <option value="F">F</option>
              <option value="M">M</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="race" className="col-lg-2 col-md-2 col-xs-2">Race</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <select type="text" className="form-control" id="race" name="race" onChange={this.update("race")}
                    value={this.value('race')}>
              <option value="">--</option>
              { this.getRaceOptions() }
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="appt_date" className="col-lg-2 col-md-2 col-xs-2">Appt date</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <div className="input-group">
              <input type="text" className="form-control" id="appt_date" name="appt_date"
                     onChange={this.update("appt_date")} value={this.value('appt_date')} />
              <div className="input-group-addon"><i className="fa fa-calendar"></i></div>
            </div>
            <label htmlFor="appt_date" generated="true" className="error"></label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="birth_year" className="col-lg-2 col-md-2 col-xs-2">Birth year</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type="text" className="form-control" id="birth_year" name="birth_year"
                   onChange={this.update("birth_year")} value={this.value('birth_year')} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="col-lg-12 col-md-12 col-xs-2">
                <label htmlFor="unit">Unit</label>
              </div>
              <div  className="col-lg-12 col-md-12 col-xs-10">
                <input type="text" className="form-control" id="unit" name="unit"
                       onChange={this.update("unit")} value={this.value('unit')} />
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="col-lg-12 col-md-12 col-xs-2">
                <label htmlFor="rank">Rank</label>
              </div>
              <div  className="col-lg-12 col-md-12 col-xs-10">
                <select type="text" className="form-control" id="rank" name="rank" onChange={this.update("rank")}
                    value={this.value('rank')}>
                  <option value="">--</option>
                  { this.getRankOptions() }
                </select>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="col-lg-12 col-md-12 col-xs-2">
                <label htmlFor="star">Star</label>
              </div>
              <div  className="col-lg-12 col-md-12 col-xs-10">
                <input type="text" className="form-control" id="star" name="star"
                       onChange={this.update("star")} value={this.value('star')} />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group actions">
          <div className="col-xs-12 text-right">
            <button type="button" className="btn btn-primary" onClick={this.save}>
              <i className="fa fa-floppy-o"></i> Save
            </button>
          </div>
        </div>
      </form>
    );
  }

}));

module.exports = Profile;
